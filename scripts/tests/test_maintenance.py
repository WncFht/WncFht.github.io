"""在隔离 Git 仓库里验证门禁会拦住实际违规。"""

import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

SCRIPTS = Path(__file__).resolve().parents[1]


class MaintenanceTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        (self.root / ".agents/notes/implemented/process").mkdir(parents=True)
        self.git("init", "-q")
        self.git("config", "user.name", "Fixture")
        self.git("config", "user.email", "fixture@example.invalid")

    def git(self, *args):
        return subprocess.run(
            ["git", "-C", str(self.root), *args],
            check=True,
            capture_output=True,
            text=True,
        ).stdout.strip()

    def call(self, script, *args):
        return subprocess.run(
            [sys.executable, str(SCRIPTS / script), *map(str, args)],
            cwd=self.root,
            capture_output=True,
            text=True,
            check=False,
        )

    def note(self, state="implemented"):
        path = self.root / f".agents/notes/{state}/process/2026-10-15-fixture.md"
        path.parent.mkdir(parents=True, exist_ok=True)
        body = (
            "# Agent Note: 资源归属\n\nStatus: implemented\n\n"
            "## 问题\n\n状态重叠。\n\n## 决策\n\n单一所有者。\n\n"
            "## 考虑过的替代方案\n\n保留共享状态，但归属不清。\n\n"
            "## 后果\n\n释放有序。\n"
        )
        if state == "archived":
            body = body.replace(
                "Status: implemented\n", "Status: implemented\nArchived: 2026-10-15\n"
            )
        path.write_text(body)
        return path

    def test_format_and_negative_control(self):
        path = self.note()
        self.assertEqual(self.call("notes_guard.py", "--root", self.root).returncode, 0)
        path.write_text(
            path.read_text().replace("Status: implemented", "Status: proposed")
        )
        self.assertNotEqual(
            self.call("notes_guard.py", "--root", self.root).returncode, 0
        )

    def test_freeform_body_and_empty_negative_control(self):
        for state in ("proposed", "implemented", "rejected"):
            with self.subTest(state=state):
                path = self.note(state)
                status = state + (" — 成本过高" if state == "rejected" else "")
                header = f"# Agent Note: 资源归属\n\nStatus: {status}\n\n"
                for body in (
                    "选择单一所有者，避免释放顺序不明。\n",
                    "## Evidence\n\nVerified locally.\n## 计划\n\n保留相关背景。\n",
                ):
                    path.write_text(header + body)
                    self.assertEqual(
                        self.call("notes_guard.py", "--root", self.root).returncode, 0
                    )
                path.write_text(header + " \n")
                self.assertNotEqual(
                    self.call("notes_guard.py", "--root", self.root).returncode, 0
                )
                path.unlink()

    def test_empty_target_is_not_success(self):
        missing = self.root / "missing"
        self.assertNotEqual(
            self.call("notes_guard.py", "--root", missing).returncode, 0
        )

    def test_seal_and_trusted_history(self):
        path = self.note("archived")
        self.assertNotEqual(
            self.call("notes_guard.py", "--root", self.root).returncode, 0
        )
        self.assertEqual(
            self.call("notes_guard.py", "--root", self.root, "--seal").returncode, 0
        )
        self.git("add", ".")
        self.git("commit", "-qm", "baseline")
        base = self.git("rev-parse", "HEAD")
        self.assertEqual(
            self.call("notes_guard.py", "--root", self.root, "--base", base).returncode,
            0,
        )
        path.write_text(path.read_text() + "\n改写冻结历史。\n")
        self.assertNotEqual(
            self.call("notes_guard.py", "--root", self.root, "--seal").returncode, 0
        )
        # 攻击或误操作同时重写正文与当前哈希，可信基线仍应拒绝。
        manifest = self.root / ".agents/notes/archive-seals.json"
        manifest.unlink()
        self.assertEqual(
            self.call("notes_guard.py", "--root", self.root, "--seal").returncode, 0
        )
        self.assertNotEqual(
            self.call("notes_guard.py", "--root", self.root, "--base", base).returncode,
            0,
        )

    def test_deletion_and_invalid_base(self):
        path = self.note("archived")
        self.assertEqual(
            self.call("notes_guard.py", "--root", self.root, "--seal").returncode, 0
        )
        path.unlink()
        self.assertNotEqual(
            self.call("notes_guard.py", "--root", self.root).returncode, 0
        )
        self.assertNotEqual(
            self.call(
                "notes_guard.py", "--root", self.root, "--base", "not-a-revision"
            ).returncode,
            0,
        )

    def test_status_class_and_symlink(self):
        path = self.note("proposed")
        self.assertNotEqual(
            self.call("notes_guard.py", "--root", self.root).returncode, 0
        )
        path.unlink()
        link = path.parent / "outside"
        link.symlink_to(self.root)
        self.assertNotEqual(
            self.call("notes_guard.py", "--root", self.root).returncode, 0
        )


if __name__ == "__main__":
    unittest.main()
