import {useEffect, useRef, useState, type ReactNode} from 'react';

export default function CopyAction({text, label = '复制'}: {text: string | (() => string); label?: string}): ReactNode {
  const [status, setStatus] = useState('');
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  return <button type="button" className="reading-button" aria-label={status || label} onClick={async () => {
    clearTimeout(timer.current);
    try { await navigator.clipboard.writeText(typeof text === 'function' ? text() : text); setStatus('已复制'); }
    catch { setStatus('复制失败，请重试'); }
    timer.current = setTimeout(() => setStatus(''), 2200);
  }}><span aria-live="polite">{status || label}</span></button>;
}
