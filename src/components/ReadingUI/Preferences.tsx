import {createContext, useContext, useEffect, useState, type ReactNode} from 'react';
import {readerDefaults, readerStorageKey, validatePreferences, type ReaderPreferences} from '../../utils/reading';
import {useReadingProgress} from '../ReadingProgress';
import Modal from './Modal';

const PreferencesContext = createContext<{preferences: ReaderPreferences; update: (value: Partial<ReaderPreferences>) => void}>({preferences: readerDefaults, update: () => {}});

export function PreferencesProvider({children}: {children: ReactNode}): ReactNode {
  const [preferences, setPreferences] = useState<ReaderPreferences>(readerDefaults);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {setPreferences(validatePreferences(JSON.parse(localStorage.getItem(readerStorageKey) ?? '{}')));} catch {}
    setReady(true);
    const sync = (event: StorageEvent) => {if (event.key === readerStorageKey) {try {setPreferences(validatePreferences(JSON.parse(event.newValue ?? '{}')));} catch {}}};
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);
  useEffect(() => {
    if (!ready) return;
    const d = document.documentElement.dataset;
    d.readerSize = preferences.size; d.readerWidth = preferences.width;
    d.readerSpacing = preferences.spacing; d.focusMode = String(preferences.focus);
    try {localStorage.setItem(readerStorageKey, JSON.stringify(preferences));} catch {}
  }, [preferences, ready]);
  return <PreferencesContext.Provider value={{preferences, update: (value) => setPreferences((p) => validatePreferences({...p, ...value}))}}>{children}</PreferencesContext.Provider>;
}

export default function ReaderControls(): ReactNode {
  const {hasArticle} = useReadingProgress();
  const {preferences, update} = useContext(PreferencesContext);
  const [open, setOpen] = useState(false);
  if (!hasArticle) return null;
  return <>
    <div className="reader-controls" aria-label="阅读工具" data-no-share>
      <button className="reading-button" type="button" aria-pressed={preferences.focus} onClick={() => update({focus: !preferences.focus})}>{preferences.focus ? '退出纯净阅读' : '纯净阅读'}</button>
      <button className="reading-button" type="button" onClick={() => setOpen(true)}>阅读设置</button>
    </div>
    <Modal open={open} onClose={() => setOpen(false)} title="阅读设置">
      <div className="reader-settings">
        <p>字体沿用本站 LXGW 与 JetBrains；偏好仅保存在当前浏览器。</p>
        <label>正文字号<select value={preferences.size} onChange={(e) => update({size: e.target.value as ReaderPreferences['size']})}><option value="small">小 · 16px</option><option value="standard">标准 · 18px</option><option value="large">大 · 20px</option></select></label>
        <label>正文宽度<select value={preferences.width} onChange={(e) => update({width: e.target.value as ReaderPreferences['width']})}><option value="standard">标准</option><option value="wide">宽屏</option></select></label>
        <label>行间距<select value={preferences.spacing} onChange={(e) => update({spacing: e.target.value as ReaderPreferences['spacing']})}><option value="relaxed">舒展 · 1.85</option><option value="compact">紧凑 · 1.7</option></select></label>
        <label><input type="checkbox" checked={preferences.focus} onChange={(e) => update({focus: e.target.checked})} /> 纯净阅读</label>
        <button type="button" className="reading-button" onClick={() => update(readerDefaults)}>恢复默认设置</button>
      </div>
    </Modal>
  </>;
}
