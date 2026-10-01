# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## 项目概述

U校园AI自动刷时长工具 — 一个 Tampermonkey 用户脚本，自动遍历新视野大学英语课程目录、切换Tab/Task、分配学习时长。

## 唯一源文件

`unipus_ai_auto_player.user.js` — 单文件用户脚本，无构建步骤，直接安装到 Tampermonkey/Violentmonkey。

## 架构：双端 postMessage 通信

脚本运行在两个端，通过 `postMessage` 通信：

### 1. iframe / ipub 端（IS_IFRAME || IS_IPUB）
- 扫描菜单 DOM（`.pc-slider-menu-*`），序列化后通过 `UAI_MENU_LIST` 消息发给父窗口
- 监听 `UAI_CMD` 消息执行 CLICK / SCAN / PING 命令，并接收视频倍速配置

### 2. 主框架端（ucontent.unipus.cn，其余部分）
- `createFloatingBall()` → 右下角悬浮球入口
- `createControlPanel()` → 控制面板 UI（目录选择、时长输入、开始/暂停按钮、日志区域）
- 核心循环 `loop()` → 遍历目录项、点击 Tab/Task、按分配时长等待

### 自定义消息类型
| 类型 | 方向 | 用途 |
|------|------|------|
| `UAI_MENU_LIST` | iframe → 父窗口 | 发送序列化菜单列表 |
| `UAI_CMD` (CLICK/SCAN/PING/SET_VIDEO_RATE) | 父窗口 → iframe | 发送操作指令或视频倍速配置 |
| `UAI_CLICK_RESULT` | iframe → 父窗口 | 点击结果反馈 |
| `UAI_PONG` | iframe → 父窗口 | 心跳响应 |
| `UAI_VIDEO_RATE_READY` | iframe → 父窗口 | 请求同步当前视频倍速配置 |

## 菜单识别策略

`getMenuList()` 使用多层降级策略，按顺序尝试：
1. 按 `.pc-slider-menu-unit/section/micro` 结构化选择器
2. 按扁平化节点遍历，按 class 推断层级
3. 按 `aria-level` / 缩进距离推断层级（ant-tree 通用方案）
4. 按 `[role="menuitem"]` 递归遍历 `<ul role="menu">`
5. 按 AI 版课本的 u3menu 结构识别 Unit 与 courseware 节点

目录项数据结构：`{ unit, section, micro, element }`

## 视频倍速

- 视频模式提供 1 / 1.25 / 1.5 / 2 / 3 / 4 倍速，默认 1 倍，只调整 `playbackRate` / `defaultPlaybackRate`，不改变任务倒计时分配
- 同源课件直接设置；跨域课件通过父子窗口消息同步，并校验消息来源窗口与 ucontent / ipub 来源域名
- 新视频与 iframe 加载后自动同步；关闭视频模式时恢复已控制视频的 1 倍速，并清理观察器与事件监听
- 倍速同步不扩展原有跨域视频自动播放及播放结束检测能力

## 版本号更新规则

每次修改代码需要同步更新两处版本号：
1. 头部 `// @version` 元数据字段
2. `title.innerHTML` 中 `<span>` 内的 `vX.X.X`（`createControlPanel` 函数中）

## Git 标签

发版时打 tag：`v5.0.5` 格式，与 `@version` 保持一致。
