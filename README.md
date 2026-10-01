# UnipusAIAutoPlayer

### 🌐 选择语言 | 選擇語言 | Choose Language

- [🇨🇳 简体中文](#-简体中文)
- [🇹🇼 繁體中文](#-繁體中文)
- [🇺🇸 English](#-english)

---

## 🇨🇳 简体中文

U校园AI自动刷时长工具

### 主要功能

- ✅ **自动遍历目录** - 智能识别Unit、Section、Micro各级目录并自动切换
- ✅ **自动点击Tab/Task** - 支持多层级Tab与Task全自动点击
- ✅ **时长智能分配** - 总课时自动均分到每个学习子项，精确到每步每页
- ⏱️ **倒计时显示** - 每个页面显示本步倒计时，进度一目了然
- ⏸️ **随时暂停继续** - 随时暂停/继续，中途可修改配置并立即生效
- 🔄 **自动弹窗处理** - 自动识别并关闭「我知道了」、「确定」等弹窗
- 📝 **操作日志显示** - 全过程实时日志，出错可查
- 📱 **悬浮球启动** - 美观浮动球入口，UI简洁现代
- 🎞️ **视频倍速设置** - 启用视频播放后可选择1～4倍速，缩短视频播放等待

### 安装使用

#### 1. 安装浏览器扩展
首先需要安装用户脚本管理器（任选其一）：
- [Tampermonkey](https://www.tampermonkey.net/) (推荐)
- [Violentmonkey](https://violentmonkey.github.io/)
- [Greasemonkey](https://www.greasespot.net/)

使用Chrome等Chromium内核浏览器时，请在扩展管理页面打开Tampermonkey的「详情」，启用「允许用户脚本」；旧版浏览器若没有此选项，请按Tampermonkey提示启用「开发者模式」。设置完成后刷新课程页面，详见[Tampermonkey官方说明](https://www.tampermonkey.net/faq.php#Q209)。

#### 2. 安装脚本
点击下方链接安装脚本：
- [从 GitHub 安装](https://github.com/uxudjs/UnipusAIAutoPlayer/raw/main/unipus_ai_auto_player.user.js)
- [从蓝奏云下载](https://uxudjs.lanzouw.com/b007u7hrej) 密码:6z3k

#### 3. 使用步骤
1. 打开U校园课程学习平台，进入具体课程学习页面 (https://ucontent.unipus.cn/*)
2. 点击页面右下角的绿色悬浮球 🎓
3. 在控制面板中选择起始目录及设置总刷课时长(分钟)
4. 点击「🚀 开始刷课」按钮
5. 脚本会自动完成所有操作，可随时点击「⏸️ 暂停」调整配置
6. 日志区域会实时显示所有步骤和进度

需要播放视频时，勾选「🎬 启用视频播放」，再选择「🎞️ 视频倍速」。倍速仅调整视频播放速度，不减少设置的倒计时时长；平台实际记录的学习时长以平台规则为准。

### 常见问题

- **没有悬浮球或配置面板** - 先检查Tampermonkey是否提示「请启用允许用户脚本」，确认脚本已启用并允许访问课程页面，然后刷新页面；控制面板需要点击右下角的悬浮球打开。
- **目录未识别** - 进入具体课程学习页面，展开课程目录后点击控制面板中的「🔄」重试；目录可能位于左侧或右侧。仍失败时，点击「🛠️ 反馈」下载页面源代码，并附上课程名称、页面地址及脚本版本提交Issue。
- **在首页看不到入口** - 脚本入口位于`ucontent.unipus.cn`课程学习页面，`ipub.unipus.cn`用于课件内的目录与视频倍速同步；`uai.unipus.cn`首页不显示悬浮球。
- **部分课件视频无法自动播放** - 已运行脚本的跨域课件可同步视频倍速，但自动播放与等待结束仍取决于脚本能否访问播放器；可先手动播放视频确认倍速是否生效。

### 适用范围

- ✅ U校园平台 (ucontent.unipus.cn)
- ✅ 新视野大学英语系列课程
- ✅ 使用已适配目录结构的课程，其他课程可提交页面源代码请求适配

---

## 🇹🇼 繁體中文

U校園AI自動刷時長工具

### 主要功能

- ✅ **自動遍歷目錄** - 智慧識別Unit、Section、Micro各級目錄並自動切換
- ✅ **自動點選Tab/Task** - 支援多層級Tab與Task全自動點選
- ✅ **時長智慧分配** - 總課時自動均分到每個學習子項，精確到每步每頁
- ⏱️ **倒數計時顯示** - 每個頁面顯示本步倒數計時，進度一目了然
- ⏸️ **隨時暫停繼續** - 隨時暫停/繼續，中途可修改設定並立即生效
- 🔄 **自動彈窗處理** - 自動識別並關閉「我知道了」、「確定」等彈窗
- 📝 **操作日誌顯示** - 全過程即時日誌，出錯可查
- 📱 **懸浮球啟動** - 美觀浮動球入口，UI簡潔現代
- 🎞️ **影片倍速設定** - 啟用影片播放後可選擇1～4倍速，縮短影片播放等待

### 安裝使用

#### 1. 安裝瀏覽器擴充功能
首先需要安裝使用者腳本管理器（任選其一）：
- [Tampermonkey](https://www.tampermonkey.net/) (推薦)
- [Violentmonkey](https://violentmonkey.github.io/)
- [Greasemonkey](https://www.greasespot.net/)

使用Chrome等Chromium核心瀏覽器時，請在擴充功能管理頁面開啟Tampermonkey的「詳細資料」，啟用「允許使用者指令碼」；舊版瀏覽器若沒有此選項，請依Tampermonkey提示啟用「開發人員模式」。設定完成後重新整理課程頁面，詳見[Tampermonkey官方說明](https://www.tampermonkey.net/faq.php#Q209)。

#### 2. 安裝腳本
點選下方連結安裝腳本：
- [從 GitHub 安裝](https://github.com/uxudjs/UnipusAIAutoPlayer/raw/main/unipus_ai_auto_player.user.js)
- [從藍奏雲下載](https://uxudjs.lanzouw.com/b007u7hrej) 密碼:6z3k

#### 3. 使用步驟
1. 開啟U校園課程學習平台，進入具體課程學習頁面 (https://ucontent.unipus.cn/*)
2. 點選頁面右下角的綠色懸浮球 🎓
3. 在控制面板中選擇起始目錄及設定總刷課時長(分鐘)
4. 點選「🚀 開始刷課」按鈕
5. 腳本會自動完成所有操作，可隨時點選「⏸️ 暫停」調整設定
6. 日誌區域會即時顯示所有步驟和進度

需要播放影片時，勾選「🎬 启用视频播放」，再選擇「🎞️ 视频倍速」。倍速僅調整影片播放速度，不減少設定的倒數計時時長；平台實際記錄的學習時長以平台規則為準。

### 常見問題

- **沒有懸浮球或設定面板** - 先檢查Tampermonkey是否提示「請啟用允許使用者指令碼」，確認指令碼已啟用並允許存取課程頁面，再重新整理頁面；控制面板需要點選右下角的懸浮球開啟。
- **目錄未識別** - 進入具體課程學習頁面，展開課程目錄後點選控制面板中的「🔄」重試；目錄可能位於左側或右側。仍失敗時，點選「🛠️ 反馈」下載頁面原始碼，並附上課程名稱、頁面網址及指令碼版本提交Issue。
- **在首頁看不到入口** - 指令碼入口位於`ucontent.unipus.cn`課程學習頁面，`ipub.unipus.cn`用於課件內的目錄與影片倍速同步；`uai.unipus.cn`首頁不顯示懸浮球。
- **部分課件影片無法自動播放** - 已執行指令碼的跨來源課件可同步影片倍速，但自動播放與等待結束仍取決於指令碼能否存取播放器；可先手動播放影片確認倍速是否生效。

### 適用範圍

- ✅ U校園平台 (ucontent.unipus.cn)
- ✅ 新視野大學英語系列課程
- ✅ 使用已適配目錄結構的課程，其他課程可提交頁面原始碼請求適配

---

## 🇺🇸 English

UCampus AI Auto Duration Assistant Tool

### Features

- ✅ **Auto Directory Traversal** - Automatically recognizes and switches between Unit, Section, Micro directories
- ✅ **Auto Tab/Task Click** - Supports multi-level Tab and Task automatic clicking
- ✅ **Smart Duration Allocation** - Automatically distributes total course time to each learning item, accurate to every step
- ⏱️ **Countdown Display** - Shows countdown for each page, progress at a glance
- ⏸️ **Pause/Resume Anytime** - Pause/resume anytime, modify configuration mid-run and take effect immediately
- 🔄 **Auto Popup Handling** - Automatically recognizes and closes popups like "I Know" and "Confirm"
- 📝 **Operation Log Display** - Real-time logs throughout the process, easy to troubleshoot
- 📱 **Floating Ball Launcher** - Beautiful floating ball entrance with clean and modern UI
- 🎞️ **Video Playback Speed** - Choose 1×–4× speed in video mode to reduce video playback waits

### Installation

#### 1. Install Browser Extension
First, install a userscript manager (choose one):
- [Tampermonkey](https://www.tampermonkey.net/) (Recommended)
- [Violentmonkey](https://violentmonkey.github.io/)
- [Greasemonkey](https://www.greasespot.net/)

For Chrome and other Chromium-based browsers, open Tampermonkey's extension details and enable "Allow User Scripts". If this option is unavailable in an older browser, enable "Developer Mode" as prompted by Tampermonkey. Reload the course page afterward; see the [official Tampermonkey instructions](https://www.tampermonkey.net/faq.php#Q209).

#### 2. Install Script
Click the link below to install:
- [Install from GitHub](https://github.com/uxudjs/UnipusAIAutoPlayer/raw/main/unipus_ai_auto_player.user.js)
- [Download from Lanzou Cloud](https://uxudjs.lanzouw.com/b007u7hrej) Password:6z3k

#### 3. Usage
1. Open UCampus and enter a course learning page (https://ucontent.unipus.cn/*)
2. Click the green floating ball 🎓 in the bottom right corner
3. Select start directory and set total duration (minutes) in the control panel
4. Click "🚀 Start Learning" button
5. Script will complete all operations automatically, click "⏸️ Pause" to adjust configuration anytime
6. Log area will display all steps and progress in real-time

To play videos, enable "🎬 启用视频播放" and choose "🎞️ 视频倍速". Playback speed only changes video playback; it does not reduce the configured countdown duration. Learning time recorded by the platform depends on its own rules.

### Troubleshooting

- **No floating ball or control panel** - Check whether Tampermonkey asks you to enable "Allow User Scripts", confirm the script is enabled and has access to the course page, then reload. Click the floating ball in the bottom right corner to open the control panel.
- **Directory not detected** - Open a course learning page, expand its directory, then click "🔄" in the control panel to retry. The directory may be on either side. If detection still fails, click "🛠️ 反馈" to download the page source and submit an Issue with the course name, page URL, and script version.
- **No launcher on the homepage** - The launcher appears on `ucontent.unipus.cn` course learning pages. `ipub.unipus.cn` supports directory and video speed synchronization inside courseware; the `uai.unipus.cn` homepage has no floating ball.
- **Some courseware videos do not play automatically** - Cross-origin courseware running the script can synchronize video speed, but automatic playback and end detection still depend on whether the script can access the player. Start the video manually to check whether the selected speed applies.

### Compatibility

- ✅ UCampus Platform (ucontent.unipus.cn)
- ✅ New Horizon College English Series
- ✅ Courses with supported directory structures; submit page source to request support for other courses

---

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=uxudjs/UnipusAIAutoPlayer&type=Date)](https://star-history.com/#uxudjs/UnipusAIAutoPlayer&Date)
