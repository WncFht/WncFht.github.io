---
title : {{date:YYYY}}-{{date:WW}}-{{date:DD}}-{{date:HH}}-{{date:d}}
date : {{date:YYYY}}-{{date:WW}}-{{date:DD}}-{{date:HH}}-{{date:d}}
categories : ["日记"]
tags : ["日记"]
---

# {{date:YYYY}}-{{date:WW}}-{{date:DD}}-{{date:HH}}-{{date:d}}

## 1. 计划

### 🌅 早晨

#### 计划 

#### 复盘 

---

### ☀️ 下午

#### 计划 

#### 复盘 

---

### 🌇 晚上

#### 计划

#### 复盘 

---

## 2. 笔记索引

```dataview
LIST FROM ""
WHERE file.cday = date("{{date:YYYY}}-{{date:MM}}-{{date:DD}}")
```

---

## 3. 资源与链接

---

## 4. 未完成的任务

```dataview
TASK FROM "dairy"
WHERE !completed
  AND file.cday >= (this.file.cday - dur(7 days))
  AND file.cday <= this.file.cday
SORT file.cday DESC
```

---

## 5. 反思
