"""Exercise the installed two-phase hook against real partially staged files."""

import os
import shutil
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts"))
import install_hooks  # noqa: E402


class StagedHookTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.env = {
            **os.environ,
            "PATH": str(Path(sys.executable).parent) + os.pathsep + os.environ["PATH"],
        }
        self.run_command("git", "init", "-q")
        self.run_command("git", "config", "user.name", "Fixture")
        self.run_command("git", "config", "user.email", "fixture@example.invalid")
        (self.root / "scripts").mkdir()
        for name in (
            "staged_checks.py",
            "check_docs.py",
            "doc_checks.py",
            "notes_guard.py",
            "check_archive.py",
        ):
            shutil.copy2(ROOT / "scripts" / name, self.root / "scripts" / name)
        (self.root / ".agents/notes").mkdir(parents=True)
        (self.root / ".agents/notes/README.md").write_text("# Notes\n")
        for name in ("maintain-docs", "maintain-prose", "maintain-decision-notes"):
            folder = self.root / ".agents/skills" / name
            (folder / "agents").mkdir(parents=True)
            (folder / "SKILL.md").write_text(
                f"---\nname: {name}\ndescription: fixture\n---\n"
            )
            (folder / "agents/openai.yaml").write_text(
                "interface:\n  display_name: fixture\n  short_description: fixture\n"
            )
        (self.root / "node_modules").symlink_to(
            ROOT / "node_modules", target_is_directory=True
        )
        (self.root / ".gitignore").write_text("node_modules\nprivate/\n")
        (self.root / "README.md").write_text("# Fixture\n")
        self.config = yaml.safe_load((ROOT / ".pre-commit-config.yaml").read_text())
        self.config["repos"][0]["hooks"] = [
            hook
            for hook in self.config["repos"][0]["hooks"]
            if hook["id"] in ("staged-format", "staged-contracts")
        ]
        self.write_config()
        self.run_command("git", "add", ".")
        self.run_command("git", "commit", "-qm", "fixture")
        install_hooks.install(self.root)

    def write_config(self):
        (self.root / ".pre-commit-config.yaml").write_text(yaml.safe_dump(self.config))

    def run_command(self, *args, check=True):
        return subprocess.run(
            args,
            cwd=self.root,
            env=self.env,
            capture_output=True,
            text=True,
            check=check,
        )

    def hook(self):
        return self.run_command(str(self.root / ".git/hooks/pre-commit"), check=False)

    def test_partial_staging_formats_index_and_preserves_worktree(self):
        page = self.root / "README.md"
        page.write_text("# Fixture\n\n[link](#fixture)\n")
        code = self.root / "sample.json"
        code.write_text('{"staged":true}\n')
        self.run_command("git", "add", "README.md", "sample.json")
        page.write_text(page.read_text() + "\n[unstaged](missing.md)\n")
        code.write_text('{"staged":true,"unstaged":true}\n')
        result = self.hook()
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        staged_page = self.run_command("git", "show", ":README.md").stdout
        staged_code = self.run_command("git", "show", ":sample.json").stdout
        self.assertNotIn("unstaged", staged_page)
        self.assertNotIn("unstaged", staged_code)
        self.assertIn('"staged": true', staged_code)
        self.assertIn("missing.md", page.read_text())
        self.assertIn("unstaged", code.read_text())

    def test_invalid_index_is_rejected_even_when_worktree_is_fixed(self):
        page = self.root / "README.md"
        page.write_text("# Fixture\n\n[broken](missing.md)\n")
        self.run_command("git", "add", "README.md")
        page.write_text("# Fixture\n\n[fixed](#fixture)\n")
        result = self.hook()
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("missing.md", result.stdout + result.stderr)
        self.assertIn("fixed", page.read_text())
        self.assertIn(
            "missing.md", self.run_command("git", "show", ":README.md").stdout
        )

    def test_formatter_failure_stops_contract_phase(self):
        for hook in self.config["repos"][0]["hooks"]:
            if hook["id"] == "staged-format":
                hook["entry"] = (
                    'node_modules/.bin/git-format-staged --formatter "false"'
                )
        self.write_config()
        (self.root / "sample.json").write_text("{}\n")
        self.run_command("git", "add", ".pre-commit-config.yaml", "sample.json")
        result = self.hook()
        self.assertNotEqual(result.returncode, 0)
        self.assertNotIn("Check staged documents and Notes", result.stdout)

    def test_git_document_scan_ignores_private_and_rejects_public_broken_link(self):
        private = self.root / "private"
        private.mkdir()
        (private / "draft.md").write_text("# Private\n\n[broken](absent.md)\n")
        command = (
            sys.executable,
            str(ROOT / "scripts/check_docs.py"),
            "--root",
            str(self.root),
        )
        result = self.run_command(*command)
        self.assertEqual(result.returncode, 0)
        (self.root / "public.md").write_text("# Public\n\n[broken](absent.md)\n")
        result = self.run_command(*command, check=False)
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("public.md", result.stdout)
        self.assertNotIn("draft.md", result.stdout)

    def test_foreign_hook_and_custom_path_are_preserved(self):
        hook = self.root / ".git/hooks/pre-commit"
        hook.write_text("#!/bin/sh\nexit 17\n")
        with self.assertRaisesRegex(SystemExit, "foreign hook"):
            install_hooks.install(self.root)
        self.assertIn("exit 17", hook.read_text())
        self.run_command("git", "config", "core.hooksPath", "custom-hooks")
        with self.assertRaisesRegex(SystemExit, "core.hooksPath"):
            install_hooks.install(self.root)
