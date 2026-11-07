import type {ReactNode} from 'react';
import {useRef} from 'react';
import * as Dialog from '@radix-ui/react-dialog';

// Radix owns focus trapping, Escape, outside dismissal and background inertness.
export default function Modal({open, onClose, title, children, wide = false}: {
  open: boolean; onClose: () => void; title: string; children: ReactNode; wide?: boolean;
}): ReactNode {
  const opener = useRef<HTMLElement | null>(null);
  return <Dialog.Root open={open} onOpenChange={(value) => {if (!value) onClose();}}>
    <Dialog.Portal>
      <Dialog.Overlay className="reading-overlay" />
      <Dialog.Content className="reading-dialog" data-wide={wide || undefined}
        onOpenAutoFocus={() => {opener.current = document.activeElement as HTMLElement;}}
        onCloseAutoFocus={(event) => {if (opener.current?.isConnected) {event.preventDefault(); opener.current.focus();}}}>
        <header className="reading-dialog-header">
          <Dialog.Title>{title}</Dialog.Title>
          <Dialog.Close className="reading-button" aria-label="关闭查看器">关闭 ×</Dialog.Close>
        </header>
        <Dialog.Description className="reading-sr-only">按 Escape 或关闭按钮退出，焦点将返回打开按钮。</Dialog.Description>
        <div className="reading-dialog-body">{children}</div>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>;
}
