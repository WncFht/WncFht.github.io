/**
 * Adapted from Docusaurus CodeBlock/Layout (MIT).
 * Copyright (c) Facebook, Inc. and its affiliates.
 * Native metadata, syntax highlighting and word-wrap are retained.
 * Toolbar/fullscreen behavior references Expressive Code and Koharu; no upstream theme code copied.
 */
import {useEffect, useState, type ReactNode} from 'react';
import clsx from 'clsx';
import {useCodeBlockContext} from '@docusaurus/theme-common/internal';
import Container from '@theme/CodeBlock/Container';
import Title from '@theme/CodeBlock/Title';
import Content from '@theme/CodeBlock/Content';
import type {Props} from '@theme/CodeBlock/Layout';
import Modal from '../../../components/ReadingUI/Modal';
import CopyAction from '../../../components/ReadingUI/CopyAction';

export default function CodeBlockLayout({className}: Props): ReactNode {
  const {metadata, wordWrap} = useCodeBlockContext();
  const [open, setOpen] = useState(false);
  const long = metadata.code.split('\n').length > 24;
  const [collapsed, setCollapsed] = useState(long);
  useEffect(() => {
    if (['text', 'txt', 'markdown'].includes(metadata.language) && !wordWrap.isEnabled) wordWrap.toggle();
  }, [metadata.language]);
  const actions = <><button className="reading-button" type="button" aria-pressed={wordWrap.isEnabled} onClick={() => wordWrap.toggle()}>换行</button><CopyAction text={metadata.code} label="复制代码" /></>;
  return <Container as="div" className={clsx(className, metadata.className, 'reading-code')} data-collapsed={collapsed}>
    <div className="reading-toolbar" data-no-share><div><b>{metadata.language || 'code'}</b>{metadata.title && <Title>{metadata.title}</Title>}</div><div>{actions}{long && <button className="reading-button" type="button" aria-expanded={!collapsed} onClick={() => setCollapsed(!collapsed)}>{collapsed ? '展开' : '收起'}</button>}<button className="reading-button" type="button" onClick={() => setOpen(true)}>全屏</button></div></div>
    {open ? <p className="reading-placeholder">代码正在全屏查看</p> : <div className="reading-code-body"><Content /></div>}
    {collapsed && long && !open && <button className="reading-code-expand" type="button" onClick={() => setCollapsed(false)}>展开完整代码 · {metadata.code.split('\n').length} 行</button>}
    <Modal open={open} onClose={() => setOpen(false)} title={typeof metadata.title === 'string' ? metadata.title : `${metadata.language} 代码`} wide>
      <div className="reading-toolbar"><span>{metadata.language}</span><div>{actions}</div></div>
      <Container as="div" className="reading-code reading-code-fullscreen"><Content /></Container>
    </Modal>
  </Container>;
}
