---
sidebar_position: 1
title: 笔记
description: 按专题浏览研究笔记、技术文章和论文资料。
catalog: false
---

import CollectionGrid from '@site/src/components/CollectionPreview/CollectionGrid';
import RecentPosts from '@site/src/components/PostPreview/RecentPosts';
import PublicationCard from '@site/src/components/PublicationCard';
import {publications} from '@site/src/data/publications';

这里整理学习与研究笔记。可以从研究方向进入专题，也可以先浏览最近发布的文章。

## 专题阅读

专题将围绕同一个问题的论文阅读、方法思考与实践记录放在一起。标记为“待更新”的专题还没有发布文章。

<CollectionGrid />

## 最近发布

文章卡片列出摘要、发布日期和预计阅读时间。点击标题阅读完整内容，也可以通过专题入口查找同系列文章。

<RecentPosts />

## 论文与代码

论文资料卡片提供作者、会议信息和资源入口。更多研究论文见[首页的 Publications](/#publications)。

<PublicationCard publication={publications[0]} />

## 阅读与导航

- 目录可以跳转到指定章节。目录左侧的细条显示各节的阅读进度，当前章节会高亮。
- 长文右下角显示阅读百分比，点击按钮返回顶部。百分比以文章正文为范围，不包含页脚。
- 从不同的专题入口可以访问同一篇文章，文章地址保持不变。
- 手机端可以展开页面目录；返回顶部按钮也支持触摸操作。
