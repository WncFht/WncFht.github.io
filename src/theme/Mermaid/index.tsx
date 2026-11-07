// Docusaurus' official render hook retains its loader/configuration and error handling.
import {useEffect, useMemo, useRef, useState, type ReactNode} from 'react';
import ErrorBoundary from '@docusaurus/ErrorBoundary';
import {useColorMode} from '@docusaurus/theme-common';
import {useMermaidRenderResult} from '@docusaurus/theme-mermaid/client';
import type {Props} from '@theme/Mermaid';
import type {MermaidConfig} from 'mermaid';
import Modal from '../../components/ReadingUI/Modal';
import CopyAction from '../../components/ReadingUI/CopyAction';
import DiagramViewer from '../../components/ReadingUI/DiagramViewer';
import {mermaidColors} from '../../utils/reading';

function RenderedDiagram({value, config}: Props & {config: MermaidConfig}): ReactNode {
  const result = useMermaidRenderResult({text: value, config});
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  useEffect(() => {if (ref.current && result) result.bindFunctions?.(ref.current);}, [result, open]);
  if (!result) return <p role="status">正在绘制图表…</p>;
  const download = () => {
    const url = URL.createObjectURL(new Blob([result.svg], {type: 'image/svg+xml;charset=utf-8'}));
    const a = document.createElement('a'); a.href = url; a.download = 'diagram.svg'; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return <>
    <div className="reading-toolbar"><span>图表预览</span><div><button type="button" className="reading-button" onClick={download}>下载 SVG</button><button type="button" className="reading-button" onClick={() => setOpen(true)}>全屏查看</button></div></div>
    {open ? <p className="reading-placeholder">图表正在全屏查看</p> : <div ref={ref} className="reading-diagram-inline docusaurus-mermaid-container" dangerouslySetInnerHTML={{__html: result.svg}} />}
    <Modal open={open} onClose={() => setOpen(false)} title="Mermaid 图表" wide><DiagramViewer svg={result.svg} /></Modal>
  </>;
}

export default function Mermaid({value}: Props): ReactNode {
  const {colorMode} = useColorMode();
  const [source, setSource] = useState(false);
  const [retry, setRetry] = useState(0);
  const [tokens, setTokens] = useState({background: '#282c34', surface: '#303641', text: '#e6e9ef', accent: '#61afef', border: '#677180'});
  useEffect(() => {
    const css = getComputedStyle(document.documentElement);
    const read = (name: string) => css.getPropertyValue(name).trim();
    setTokens({background: read('--site-background'), surface: read('--site-elevated'), text: read('--site-heading'), accent: read('--site-accent'), border: read('--site-border-strong')});
  }, [colorMode]);
  const config = useMemo<MermaidConfig>(() => ({startOnLoad: false, securityLevel: 'strict', theme: 'base', themeVariables: mermaidColors(colorMode === 'dark', tokens), flowchart: {htmlLabels: false}}), [colorMode, tokens]);
  return <div className="reading-diagram">
    <div className="reading-toolbar" data-no-share><span>MERMAID</span><div><CopyAction text={value} label="复制源码" /><button type="button" className="reading-button" aria-pressed={source} onClick={() => setSource(!source)}>{source ? '查看图表' : '查看源码'}</button></div></div>
    {source ? <pre className="reading-source"><code>{value}</code></pre> : <ErrorBoundary key={`${colorMode}-${retry}`} fallback={() => <div role="alert" className="reading-placeholder"><p>图表未能渲染。可以查看源码修正语法，或重试。</p><button type="button" className="reading-button" onClick={() => setSource(true)}>查看源码</button> <button type="button" className="reading-button" onClick={() => setRetry(retry + 1)}>重试</button></div>}><RenderedDiagram value={value} config={config} /></ErrorBoundary>}
  </div>;
}
