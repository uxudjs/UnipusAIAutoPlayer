// ==UserScript==
// @name         U校园AI自动刷时长工具
// @version      5.2.13
// @description  新视野大学英语自动识别目录、自动翻页、分配课时,高效刷课工具
// @author       uxudjs
// @match        https://ucontent.unipus.cn/*
// @match        https://ipub.unipus.cn/*
// @icon         https://ucontent.unipus.cn/favicon.ico
// @grant        none
// @run-at       document-end
// @homepage     https://github.com/uxudjs/UnipusAIAutoPlayer
// @homepageURL  https://github.com/uxudjs/UnipusAIAutoPlayer
// @supportURL   https://github.com/uxudjs/UnipusAIAutoPlayer/issues
// @license      https://github.com/uxudjs/UnipusAIAutoPlayer/blob/main/LICENSE
// @updateURL    https://github.com/uxudjs/UnipusAIAutoPlayer/raw/main/unipus_ai_auto_player.user.js
// @downloadURL  https://github.com/uxudjs/UnipusAIAutoPlayer/raw/main/unipus_ai_auto_player.user.js
// ==/UserScript==

(function () {
  "use strict";

  const IS_IFRAME = window.self !== window.top;
  const IS_IPUB = location.hostname.includes("ipub.unipus.cn");
  const IS_UCONTENT = location.hostname.includes("ucontent.unipus.cn");

  const safeText = (v) =>
    typeof v === "string" ? v.replace(/\s+/g, " ").trim() : "";

  const pickName = (el) => {
    if (!el) return "";
    return safeText(el.title || el.innerText || el.textContent);
  };

  const pickClickable = (root) => {
    if (!root) return null;
    if (root.classList && root.classList.contains("pc-slider-menu-node")) {
      const s = root.querySelector("span");
      if (s) return s;
    }
    const checks = [
      ".pc-menu-node-name",
      ".ant-tree-node-content-wrapper",
      ".ant-menu-title-content",
    ];
    for (const sel of checks) {
      const el = root.querySelector ? root.querySelector(sel) : null;
      if (el) return el;
    }
    if (root.querySelector) {
      const allBtns = root.querySelectorAll('a[role="button"]');
      for (const btn of allBtns) {
        if (btn.querySelector("span")) return btn;
      }
      const fb = root.querySelector('a[role="button"]');
      if (fb) return fb;
    }
    const d = root.querySelector ? root.querySelector("a") : null;
    if (d) return d;
    const s2 = root.querySelector ? root.querySelector("span") : null;
    if (s2) return s2;
    return root;
  };

  function clickIKnow() {
    const sels = [
      ".know-box .iKnow",
      ".ant-modal-confirm-btns .ant-btn-primary.system-info-cloud-ok-button",
      ".ant-modal-confirm-btns .ant-btn.ant-btn-primary",
      ".ipublish-modal-footer-ok",
      "button.ant-btn.ant-btn-default.ipublish-modal-footer-ok",
    ];
    sels.forEach((sel) => {
      try {
        const btns = document.querySelectorAll(sel);
        btns.forEach((btn) => {
          if (btn && typeof btn.click === "function") btn.click();
        });
      } catch (e) {}
    });
    // 通用文本匹配：查找包含"确认"/"确定"文字的可见按钮
    try {
      const allBtns = document.querySelectorAll(
        'button, .btn, a[role="button"], span[role="button"]',
      );
      allBtns.forEach((btn) => {
        const text = (btn.textContent || btn.innerText || "").trim();
        if (
          (text.includes("确认") || text.includes("确定")) &&
          btn.offsetParent !== null
        ) {
          try {
            if (typeof btn.click === "function") btn.click();
          } catch (e) {}
        }
      });
    } catch (e) {}
  }

  function getMenuList(doc) {
    doc = doc || document;
    let nodes = [];

    const containerSelectors = [
      ".pc-slider-menu-container.show .pc-slider-content-menu",
      ".pc-slier-menu-container.show .pc-slider-content-menu",
      ".pc-slider-menu-container .pc-slider-content-menu",
      ".pc-slier-menu-container .pc-slider-content-menu",
      "#part-menu-view .pc-slider-content-menu",
      "#part-menu-view .ant-tree",
      "#part-menu-view",
      ".pc-slider-content-menu",
      ".ant-tree",
      '[role="tree"]',
      ".ant-menu",
      ".menuRightTabContent",
    ];

    let menuContainer = null;
    for (const sel of containerSelectors) {
      try {
        menuContainer = doc.querySelector(sel);
        if (menuContainer) break;
      } catch (e) {}
    }
    if (!menuContainer) return [];

    const pushNode = (unitName, sectionName, microName, element) => {
      const micro = safeText(microName);
      if (!micro || !element) return;
      nodes.push({
        unit: safeText(unitName),
        section: safeText(sectionName),
        micro,
        element,
      });
    };

    try {
      menuContainer.querySelectorAll(".pc-slider-menu-unit").forEach((unit) => {
        const unitName =
          unit.querySelector(".unit-label-item")?.title ||
          unit.querySelector(".unit-label-item")?.innerText ||
          "";
        const unitRoot = unit.parentElement || menuContainer;
        unitRoot.querySelectorAll(".pc-slider-menu-node").forEach((node) => {
          if (node.closest(".pc-slider-menu-section")) return;
          const clickable = pickClickable(node);
          const microName = pickName(clickable) || pickName(node);
          pushNode(unitName, "", microName, clickable);
        });
        unitRoot
          .querySelectorAll(".pc-slider-menu-section")
          .forEach((section) => {
            const sectionName =
              section.querySelector("span")?.title ||
              section.querySelector("span")?.innerText ||
              "";
            const sectionRoot = section.parentElement || unitRoot;
            sectionRoot
              .querySelectorAll(".pc-slider-menu-micro")
              .forEach((micro) => {
                const clickable = pickClickable(micro);
                const microName =
                  micro.querySelector(".pc-menu-node-name")?.title ||
                  micro.querySelector(".pc-menu-node-name")?.innerText ||
                  pickName(clickable);
                pushNode(unitName, sectionName, microName, clickable);
              });
          });
      });
    } catch (e) {}
    if (nodes.length > 0) return nodes;

    try {
      let curUnit = "",
        curSection = "";
      const seen = new Set();
      const items = menuContainer.querySelectorAll(
        ".pc-slider-menu-unit, .pc-slider-menu-section, .pc-slider-menu-micro, .pc-slider-menu-node",
      );
      items.forEach((el) => {
        if (!el || !el.classList) return;
        if (el.classList.contains("pc-slider-menu-unit")) {
          curUnit =
            el.querySelector(".unit-label-item")?.title ||
            el.querySelector(".unit-label-item")?.innerText ||
            "";
          return;
        }
        if (el.classList.contains("pc-slider-menu-section")) {
          curSection =
            el.querySelector("span")?.title ||
            el.querySelector("span")?.innerText ||
            "";
          return;
        }
        if (
          el.classList.contains("pc-slider-menu-micro") ||
          el.classList.contains("pc-slider-menu-node")
        ) {
          const clickable = pickClickable(el);
          const microName = pickName(clickable) || pickName(el);
          const key = `${safeText(curUnit)}|${safeText(curSection)}|${safeText(microName)}`;
          if (!microName || seen.has(key)) return;
          seen.add(key);
          pushNode(curUnit, curSection, microName, clickable);
        }
      });
    } catch (e) {}
    if (nodes.length > 0) return nodes;

    try {
      const treeRoot =
        menuContainer.querySelector(".ant-tree") ||
        menuContainer.querySelector('[role="tree"]') ||
        menuContainer;
      let candidates = Array.from(
        treeRoot.querySelectorAll('[role="treeitem"]'),
      );
      if (!candidates.length)
        candidates = Array.from(
          treeRoot.querySelectorAll(".ant-tree-treenode"),
        );
      if (!candidates.length)
        candidates = Array.from(
          treeRoot.querySelectorAll(".ant-menu-item, .ant-menu-submenu-title"),
        );

      const baseLeft = treeRoot.getBoundingClientRect
        ? treeRoot.getBoundingClientRect().left
        : 0;

      const rows = [];
      candidates.forEach((node) => {
        const clickable = pickClickable(node);
        if (!clickable || !clickable.getBoundingClientRect) return;
        const name = pickName(clickable);
        if (!name) return;
        const rect = clickable.getBoundingClientRect();
        if (!rect || rect.width === 0 || rect.height === 0) return;
        const indent = Math.max(0, Math.round(rect.left - baseLeft));
        const ariaLevel = node.getAttribute
          ? parseInt(node.getAttribute("aria-level") || "", 10)
          : NaN;
        const expanded = node.getAttribute
          ? node.getAttribute("aria-expanded")
          : null;
        rows.push({ node, clickable, name, indent, ariaLevel, expanded });
      });

      if (rows.length > 0) {
        const indents = Array.from(new Set(rows.map((r) => r.indent))).sort(
          (a, b) => a - b,
        );
        const levelByIndent = (indent) => {
          if (!indents.length) return 3;
          let bestIdx = 0,
            bestDiff = Math.abs(indent - indents[0]);
          for (let i = 1; i < indents.length; i++) {
            const d = Math.abs(indent - indents[i]);
            if (d < bestDiff) {
              bestDiff = d;
              bestIdx = i;
            }
          }
          return Math.min(6, bestIdx + 1);
        };

        const stack = [];
        const seen = new Set();
        const leafs = [],
          all = [];
        rows.forEach((r) => {
          let level = Number.isFinite(r.ariaLevel)
            ? r.ariaLevel
            : levelByIndent(r.indent);
          if (!Number.isFinite(level) || level < 1) level = 1;
          stack[level - 1] = r.name;
          stack.length = level;
          const unitName = stack[0] || "";
          const sectionName = stack[1] || "";
          const microName = stack.slice(2).join(" / ") || r.name;
          const key = `${safeText(unitName)}|${safeText(sectionName)}|${safeText(microName)}`;
          if (!seen.has(key)) {
            seen.add(key);
            const item = {
              unit: safeText(unitName),
              section: safeText(sectionName),
              micro: safeText(microName),
              element: r.clickable,
            };
            all.push(item);
            const isParent = r.expanded === "true" || r.expanded === "false";
            const isLeafByClass =
              r.node.classList &&
              (r.node.classList.contains("ant-tree-treenode-leaf-last") ||
                r.node.classList.contains("ant-tree-treenode-leaf"));
            if (!isParent || isLeafByClass) leafs.push(item);
          }
        });
        nodes = leafs.length > 0 ? leafs : all;
      }
    } catch (e) {}
    if (nodes.length > 0) return nodes;

    try {
      const firstItem = doc.querySelector('li[role="menuitem"]');
      const menuRoot = firstItem ? firstItem.closest('ul[role="menu"]') : null;
      if (menuRoot) {
        const seen = new Set();
        function traverseTree(ul, ancestors) {
          if (!ul || ul.nodeType !== 1) return;
          const items = [];
          for (let c = ul.firstElementChild; c; c = c.nextElementSibling) {
            if (c.tagName === "LI" && c.getAttribute("role") === "menuitem")
              items.push(c);
          }
          items.forEach((li) => {
            let titleBtn = null;
            const allAnchors = li.querySelectorAll('a[role="button"]');
            for (const a of allAnchors) {
              if (a.querySelector("span")) {
                titleBtn = a;
                break;
              }
            }
            if (!titleBtn) titleBtn = li.querySelector('a[role="button"]');
            if (!titleBtn) return;
            const titleSpan = titleBtn.querySelector("span");
            const name = safeText(
              titleSpan ? titleSpan.textContent : titleBtn.textContent,
            );
            if (!name) return;
            let nestedUl = null;
            for (let c = li.firstElementChild; c; c = c.nextElementSibling) {
              if (c.tagName === "UL" && c.getAttribute("role") === "menu") {
                nestedUl = c;
                break;
              }
            }
            const newAncestors = ancestors.concat([name]);
            if (nestedUl) {
              traverseTree(nestedUl, newAncestors);
            } else {
              const unitName = newAncestors[0] || "";
              const sectionName =
                newAncestors.length > 2 ? newAncestors[1] : "";
              const microName =
                newAncestors.length > 2
                  ? newAncestors.slice(2).join(" / ")
                  : newAncestors[1] || name;
              const key = `${safeText(unitName)}|${safeText(sectionName)}|${safeText(microName)}`;
              if (!seen.has(key)) {
                seen.add(key);
                pushNode(unitName, sectionName, microName, titleBtn);
              }
            }
          });
        }
        traverseTree(menuRoot, []);
      }
    } catch (e) {}

    // Strategy 5: u3menu CSS-module 结构 (AI 版课本)
    try {
      const menuLists = menuContainer.querySelectorAll("ul.menu--u3menu-3Xu4h");
      if (menuLists.length > 0) {
        const seen = new Set();
        menuLists.forEach((ul) => {
          let curUnit = "";
          const unitLi = ul.querySelector("li.unit");
          if (unitLi) {
            const titleEl = unitLi.querySelector(".menu--nolinkText-1gzNf");
            if (titleEl) curUnit = pickName(titleEl);
          }
          ul.querySelectorAll("li.group.courseware").forEach((li) => {
            const link = li.querySelector("span.name a");
            if (!link) return;
            const name = pickName(link);
            if (!name) return;
            const key = curUnit + "|" + name;
            if (seen.has(key)) return;
            seen.add(key);
            pushNode(curUnit, "", name, link);
          });
        });
      }
    } catch (e) {}
    if (nodes.length > 0) return nodes;

    return Array.isArray(nodes) ? nodes : [];
  }

  if (IS_IFRAME || IS_IPUB) {
    function serializeMenuList(nodes) {
      return nodes.map((n, i) => {
        let isId = false;
        let path = "";
        if (n.element) {
          if (n.element.id) {
            path = n.element.id;
            isId = true;
          } else {
            const uid = "uai-node-" + Date.now() + "-" + i;
            n.element.id = uid;
            path = uid;
            isId = true;
          }
        }
        return {
          unit: n.unit,
          section: n.section,
          micro: n.micro,
          path: path,
          isId: isId,
        };
      });
    }

    function clickByPath(path, isId) {
      if (!path) return false;
      try {
        if (isId || path.startsWith("uai-node-")) {
          const el = document.getElementById(path);
          if (el) return safeClickEl(el);
        }
        const el = document.querySelector(path);
        if (el) return safeClickEl(el);
        return false;
      } catch (e) {
        return false;
      }
    }

    function safeClickEl(el) {
      if (!el) return false;
      try {
        clickIKnow();
        if (el.scrollIntoView) {
          try {
            el.scrollIntoView({ block: "center", inline: "center" });
          } catch (e) {}
        }
        const opts = { bubbles: true, cancelable: true, view: window };
        ["mouseover", "mousedown", "mouseup", "click"].forEach((t) => {
          try {
            el.dispatchEvent(new MouseEvent(t, opts));
          } catch (e) {}
        });
        if (typeof el.click === "function") el.click();

        const node = el.closest ? el.closest(".pc-slider-menu-node") : null;
        if (node && node !== el) {
          try {
            if (typeof node.click === "function") node.click();
          } catch (e) {}
        }
        const span = el.querySelector ? el.querySelector("span") : null;
        if (span && span !== el) {
          try {
            if (typeof span.click === "function") span.click();
          } catch (e) {}
        }
        setTimeout(clickIKnow, 500);
        return true;
      } catch (e) {
        return false;
      }
    }

    function sendMenuToParent(nodes) {
      if (!nodes.length) return;
      const serialized = serializeMenuList(nodes);
      try {
        window.parent.postMessage(
          { type: "UAI_MENU_LIST", payload: serialized },
          "*",
        );
      } catch (e) {}
    }

    function scanAndSend() {
      const list = getMenuList(document);
      if (list.length > 0) {
        sendMenuToParent(list);
        return true;
      }
      return false;
    }

    window.addEventListener("message", (e) => {
      if (!e.data || e.data.type !== "UAI_CMD") return;
      const { cmd, path } = e.data;
      if (cmd === "CLICK") {
        const ok = clickByPath(path, e.data.isId);
        try {
          window.parent.postMessage({ type: "UAI_CLICK_RESULT", ok }, "*");
        } catch (_) {}
      } else if (cmd === "SCAN") {
        scanAndSend();
      } else if (cmd === "PING") {
        try {
          window.parent.postMessage({ type: "UAI_PONG" }, "*");
        } catch (_) {}
      }
    });

    setInterval(clickIKnow, 1000);
    function startIframeScan() {
      if (scanAndSend()) return;
      let fired = false;
      const menuSelectors =
        ".pc-slider-menu-unit, .pc-slider-menu-node, .pc-slider-menu-micro, " +
        '.ant-tree-treenode, [role="treeitem"], [class*="tree-menu"], [role="menuitem"], ' +
        ".menu--u3menu-3Xu4h";
      const ob = new MutationObserver(() => {
        if (fired) return;
        if (scanAndSend()) {
          fired = true;
          ob.disconnect();
        }
      });
      ob.observe(document.body || document.documentElement, {
        childList: true,
        subtree: true,
      });
      setTimeout(() => ob.disconnect(), 30000);
      let retries = 0;
      const retry = setInterval(() => {
        retries++;
        if (retries > 20 || fired) {
          clearInterval(retry);
          return;
        }
        if (scanAndSend()) {
          fired = true;
          clearInterval(retry);
          ob.disconnect();
        }
      }, 1500);
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () =>
        setTimeout(startIframeScan, 600),
      );
    } else {
      setTimeout(startIframeScan, 600);
    }

    return;
  }

  let isPaused = false;
  let isRunning = false;
  let lastTimeValue = 60;
  let lastStartIdx = 0;
  let perStepTime = 0;
  let shouldRestart = false;
  let videoPlaybackEnabled = false;

  let _menuListCache = [];
  let _clickResolve = null;

  function findVideoElement() {
    const vjsVideo = document.querySelector("video.vjs-tech");
    if (vjsVideo) return vjsVideo;
    const video = document.querySelector("video");
    if (video) return video;
    try {
      const iw = getIframeWin();
      if (iw && iw.document) {
        const iframeVideo =
          iw.document.querySelector("video.vjs-tech") ||
          iw.document.querySelector("video");
        if (iframeVideo) return iframeVideo;
      }
    } catch (e) {}
    return null;
  }

  function playVideo() {
    const video = findVideoElement();
    if (!video) return;
    if (!video.paused) return;
    if (video.ended) return;

    // 移除平台禁用的控件类，恢复播放能力
    const vjsContainer = video.closest(".video-js");
    if (vjsContainer) {
      vjsContainer.classList.remove("vjs-controls-disabled");
      vjsContainer
        .querySelectorAll(".vjs-controls-disabled")
        .forEach(function (el) {
          el.classList.remove("vjs-controls-disabled");
        });
    }

    // 先尝试静音播放（绕开浏览器自动播放限制）
    video.muted = true;
    try {
      var promise = video.play();
      if (promise) {
        promise
          .then(function () {
            video.muted = false;
          })
          .catch(function () {});
      } else {
        video.muted = false;
      }
    } catch (e) {}

    // 降级：点击 Video.js 大播放按钮
    var bigBtn = document.querySelector(".vjs-big-play-button");
    if (bigBtn) {
      try {
        bigBtn.click();
      } catch (e) {}
    }

    // 再降级：点击控制栏播放按钮
    var playBtn = document.querySelector(".vjs-play-control");
    if (playBtn) {
      try {
        playBtn.click();
      } catch (e) {}
    }

    // 启动保活：对抗平台自动暂停
    if (window._uaiPlayKeepAlive) clearInterval(window._uaiPlayKeepAlive);
    window._uaiPlayKeepAlive = setInterval(function () {
      var v = findVideoElement();
      if (!v || v.ended || shouldRestart || !isRunning) {
        clearInterval(window._uaiPlayKeepAlive);
        window._uaiPlayKeepAlive = null;
        return;
      }
      if (v.paused) {
        v.muted = true;
        try {
          v.play();
        } catch (e) {}
      }
    }, 1000);
  }

  function isVideoPlaying(video) {
    if (!video) return false;
    return !video.paused && !video.ended && video.readyState > 2;
  }

  function waitForVideoEnd() {
    return new Promise((resolve) => {
      const video = findVideoElement();
      if (!video) {
        resolve(false);
        return;
      }
      if (video.ended) {
        resolve(false);
        return;
      }
      let done = false;
      let videoPlayed = false;
      const finish = () => {
        if (done) return;
        done = true;
        clearInterval(stateCheck);
        if (window._uaiPlayKeepAlive) {
          clearInterval(window._uaiPlayKeepAlive);
          window._uaiPlayKeepAlive = null;
        }
        video.removeEventListener("ended", onEnded);
        resolve(videoPlayed);
      };
      const onEnded = () => {
        videoPlayed = true;
        finish();
      };
      video.addEventListener("ended", onEnded);
      // 定期检查脚本暂停/重启状态，以及视频是否被移除
      const stateCheck = setInterval(() => {
        if (shouldRestart || !isRunning) {
          finish();
          return;
        }
        if (!findVideoElement()) {
          finish();
          return;
        }
      }, 1000);
      // 延迟播放：等页面渲染稳定后再启动视频
      setTimeout(function () {
        if (!done) playVideo();
      }, 800);
      setTimeout(
        function () {
          videoPlayed = true;
          finish();
        },
        30 * 60 * 1000,
      );
    });
  }

  function getIframeWin() {
    try {
      const iframe =
        document.getElementById("ipublish-pc-book-easy-iframe") ||
        document.querySelector("iframe.ipublish-pc-iframe-container") ||
        document.querySelector('iframe[id*="iframe"]') ||
        document.querySelector("iframe");
      return iframe ? iframe.contentWindow : null;
    } catch (e) {
      return null;
    }
  }

  function sendToIframe(data) {
    const iw = getIframeWin();
    if (iw) {
      try {
        iw.postMessage(data, "*");
        return true;
      } catch (e) {}
    }
    return false;
  }

  window.addEventListener("message", (e) => {
    if (!e.data) return;
    const { type, payload, ok } = e.data;

    if (
      type === "UAI_MENU_LIST" &&
      Array.isArray(payload) &&
      payload.length > 0
    ) {
      _menuListCache = payload.map((n) => ({
        unit: n.unit,
        section: n.section,
        micro: n.micro,
        element: { _iframePath: n.path, _isId: n.isId },
      }));
      const ev = new CustomEvent("UAI_MENU_READY", { detail: _menuListCache });
      window.dispatchEvent(ev);
    }

    if (type === "UAI_CLICK_RESULT") {
      if (_clickResolve) {
        _clickResolve(!!ok);
        _clickResolve = null;
      }
    }

    if (type === "UAI_PONG") {
    }
  });

  function safeClick(target) {
    try {
      if (!target) return false;
      clickIKnow();
      if (target._iframePath && !(target instanceof Element)) {
        return false;
      }

      const el = target instanceof Element ? target : null;
      if (!el) return false;

      if (el.scrollIntoView) {
        try {
          el.scrollIntoView({ block: "center", inline: "center" });
        } catch (e) {}
      }
      const dispatch = (node) => {
        if (!node || !(node instanceof Element)) return;
        const opts = { bubbles: true, cancelable: true, view: window };
        ["mouseover", "mousedown", "mouseup", "click"].forEach((t) => {
          try {
            node.dispatchEvent(new MouseEvent(t, opts));
          } catch (e) {}
        });
      };

      try {
        if (typeof el.click === "function") el.click();
        dispatch(el);
      } catch (e) {}

      const node = el.closest ? el.closest(".pc-slider-menu-node") : null;
      if (node && node !== el) {
        try {
          if (typeof node.click === "function") node.click();
          dispatch(node);
        } catch (e) {}
        const span = node.querySelector ? node.querySelector("span") : null;
        if (span && span !== el) {
          try {
            if (typeof span.click === "function") span.click();
            dispatch(span);
          } catch (e) {}
        }
      }
      setTimeout(clickIKnow, 500);
      return true;
    } catch (e) {
      return false;
    }
  }

  function safeClickAsync(target) {
    return new Promise((resolve) => {
      if (!target) {
        resolve(false);
        return;
      }

      if (target._iframePath && !(target instanceof Element)) {
        const ok = sendToIframe({
          type: "UAI_CMD",
          cmd: "CLICK",
          path: target._iframePath,
          isId: target._isId,
        });
        if (!ok) {
          resolve(false);
          return;
        }

        _clickResolve = resolve;
        setTimeout(() => {
          if (_clickResolve === resolve) {
            _clickResolve = null;
            resolve(false);
          }
        }, 3000);
      } else {
        resolve(safeClick(target));
      }
    });
  }

  function getMenuList_main() {
    const localList = getMenuList(document);
    if (localList.length > 0) return localList;
    if (_menuListCache.length > 0) return _menuListCache;
    try {
      const iw = getIframeWin();
      if (iw && iw.document) {
        const iframeList = getMenuList(iw.document);
        if (iframeList.length > 0) return iframeList;
      }
    } catch (e) {}
    return [];
  }

  function requestIframeScan() {
    sendToIframe({ type: "UAI_CMD", cmd: "SCAN" });
  }

  function waitForElement(selector, timeout = 3000) {
    return new Promise((resolve) => {
      const startTime = Date.now();
      let tick = 0;
      const check = setInterval(() => {
        if (++tick % 5 === 0) clickIKnow();
        if (shouldRestart) {
          clearInterval(check);
          resolve(null);
          return;
        }
        const el = document.querySelector(selector);
        if (el || Date.now() - startTime > timeout) {
          clearInterval(check);
          resolve(el);
        }
      }, 100);
    });
  }

  function getMenuListWithRetry(maxRetries, intervalMs, onSuccess, onFail) {
    let retries = 0;
    function attempt() {
      clickIKnow();
      const list = getMenuList_main();
      if (list && list.length > 0) {
        if (onSuccess) onSuccess(list);
        return;
      }
      requestIframeScan();
      retries++;
      if (retries < maxRetries) {
        setTimeout(attempt, intervalMs);
      } else {
        if (onFail) onFail();
      }
    }
    attempt();
  }

  function watchForMenu(callback, timeout) {
    timeout = timeout || 20000;
    let timer,
      fired = false;
    const menuSelectors =
      ".pc-slider-menu-unit, .pc-slider-menu-node, .pc-slider-menu-micro, " +
      '.ant-tree-treenode, [role="treeitem"], [class*="tree-menu"], [role="menuitem"], ' +
      ".menu--u3menu-3Xu4h";

    const observer = new MutationObserver((mutations) => {
      if (fired) return;
      for (const m of mutations) {
        for (const node of m.addedNodes) {
          if (node.nodeType !== 1) continue;
          if (
            (node.matches && node.matches(menuSelectors)) ||
            (node.querySelectorAll &&
              node.querySelectorAll(menuSelectors).length > 0)
          ) {
            fired = true;
            clearTimeout(timer);
            observer.disconnect();
            callback();
            return;
          }
        }
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    timer = setTimeout(() => {
      if (!fired) observer.disconnect();
    }, timeout);

    window.addEventListener(
      "UAI_MENU_READY",
      function onReady() {
        if (fired) return;
        fired = true;
        clearTimeout(timer);
        observer.disconnect();
        window.removeEventListener("UAI_MENU_READY", onReady);
        callback();
      },
      { once: false },
    );
  }

  function getTabs() {
    const tabs = [];
    document
      .querySelectorAll(".pc-header-tabs-container .ant-col")
      .forEach((tab) => {
        const nameElem = tab.querySelector(".pc-tab-view-container");
        if (nameElem && tab.classList.contains("tab")) {
          tabs.push({
            name: nameElem.title || nameElem.innerText,
            element: nameElem,
          });
        }
      });
    // Fallback: AI 版课本 TabsBox (Video/Exercise)
    document.querySelectorAll("#header ul.TabsBox a.topTab").forEach((link) => {
      const name = pickName(link);
      if (name) tabs.push({ name, element: link });
    });
    return tabs;
  }

  function getTasks() {
    const tasks = [];
    document
      .querySelectorAll(".pc-header-tasks-row .pc-task")
      .forEach((task) => {
        tasks.push({ name: task.title || task.innerText, element: task });
      });
    return tasks;
  }

  function isTabActive(tab) {
    const el = tab.element;
    if (!el) return false;
    const ariaSelected = el.getAttribute
      ? el.getAttribute("aria-selected")
      : null;
    if (ariaSelected === "true") return true;
    const parentCol = el.closest(".ant-col");
    if (parentCol && parentCol.classList.contains("ant-tabs-tab-active"))
      return true;
    if (el.classList.contains("active")) return true;
    return false;
  }

  function isTaskActive(task) {
    const el = task.element;
    if (!el) return false;
    if (el.classList.contains("active")) return true;
    if (el.classList.contains("pc-task-active")) return true;
    if (el.classList.contains("current")) return true;
    return false;
  }

  function addLog(message, isCountdown = false) {
    const log = document.getElementById("unipus-log");
    if (!log) return;
    if (isCountdown) {
      const last = log.lastElementChild;
      if (last && last.classList.contains("countdown-line")) {
        last.textContent = message;
      } else {
        const div = document.createElement("div");
        div.className = "countdown-line";
        div.textContent = message;
        log.appendChild(div);
      }
    } else {
      const div = document.createElement("div");
      div.textContent = message;
      log.appendChild(div);
    }
    log.scrollTop = log.scrollHeight;
  }

  // 反馈弹窗：下载页面源代码 + 提交 Issue
  function showFeedbackPopup(title) {
    // 防重复：移除已有弹窗
    var existing = document.getElementById("unipus-feedback-overlay");
    if (existing) existing.remove();

    var overlay = document.createElement("div");
    overlay.id = "unipus-feedback-overlay";
    overlay.style.cssText =
      "position:fixed;top:0;left:0;width:100%;height:100%;" +
      "background:rgba(0,0,0,0.5);z-index:100001;" +
      "display:flex;align-items:center;justify-content:center;";

    var card = document.createElement("div");
    card.style.cssText =
      "background:#fff;border-radius:16px;width:360px;max-width:90vw;" +
      "box-shadow:0 8px 32px rgba(0,0,0,0.3);padding:24px;position:relative;";

    // 关闭按钮
    var closeBtn = document.createElement("span");
    closeBtn.textContent = "✕";
    closeBtn.style.cssText =
      "position:absolute;top:12px;right:16px;font-size:18px;color:#999;" +
      "cursor:pointer;line-height:1;";
    closeBtn.addEventListener("click", function () {
      overlay.remove();
    });

    // 标题
    var titleEl = document.createElement("div");
    titleEl.style.cssText =
      "font-size:18px;font-weight:bold;color:#333;margin-bottom:8px;text-align:center;";
    titleEl.textContent = "⚠️ " + title;

    // 说明
    var desc = document.createElement("div");
    desc.style.cssText =
      "font-size:13px;color:#666;margin-bottom:20px;text-align:center;line-height:1.6;";
    desc.textContent =
      "请下载页面源代码并提交到 GitHub Issue，帮助作者适配此页面";

    // 按钮容器
    var btns = document.createElement("div");
    btns.style.cssText = "display:flex;gap:10px;";

    // 下载按钮
    var downloadBtn = document.createElement("button");
    downloadBtn.textContent = "📥 下载页面源代码";
    downloadBtn.style.cssText =
      "flex:1;padding:12px;background:linear-gradient(135deg,#0ea5e9 0%,#10b981 100%);" +
      "color:#fff;border:none;border-radius:8px;font-size:14px;font-weight:bold;cursor:pointer;";
    downloadBtn.addEventListener("click", function () {
      var html = "<!DOCTYPE html>\n" + document.documentElement.outerHTML;
      var blob = new Blob([html], { type: "text/html;charset=UTF-8" });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url;
      a.download = "unipus-page-source-" + Date.now() + ".html";
      a.click();
      URL.revokeObjectURL(url);
      addLog("✅ 页面源代码已下载");
    });

    // Issue 按钮
    var issueBtn = document.createElement("button");
    issueBtn.textContent = "🐛 提交 Issue";
    issueBtn.style.cssText =
      "flex:1;padding:12px;background:#333;color:#fff;border:none;" +
      "border-radius:8px;font-size:14px;font-weight:bold;cursor:pointer;";
    issueBtn.addEventListener("click", function () {
      window.open(
        "https://github.com/uxudjs/UnipusAIAutoPlayer/issues/new",
        "_blank",
      );
    });

    btns.appendChild(downloadBtn);
    btns.appendChild(issueBtn);

    card.appendChild(closeBtn);
    card.appendChild(titleEl);
    card.appendChild(desc);
    card.appendChild(btns);
    overlay.appendChild(card);

    // 点击遮罩关闭
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) overlay.remove();
    });

    document.body.appendChild(overlay);
  }

  function addPauseLog(message) {
    const log = document.getElementById("unipus-log");
    if (!log) return;
    const old = log.querySelector(".pause-line");
    if (old) old.remove();
    const div = document.createElement("div");
    div.className = "pause-line";
    div.textContent = message;
    log.appendChild(div);
    log.scrollTop = log.scrollHeight;
  }

  function removePauseLine() {
    const log = document.getElementById("unipus-log");
    if (!log) return;
    const el = log.querySelector(".pause-line");
    if (el) el.remove();
  }

  function removeCountdownLine() {
    const log = document.getElementById("unipus-log");
    if (!log) return;
    const el = log.querySelector(".countdown-line");
    if (el) el.remove();
  }

  function createFloatingBall() {
    let ball = document.createElement("div");
    ball.id = "unipus-ball";
    ball.style.cssText =
      "position:fixed;bottom:20px;right:20px;width:60px;height:60px;" +
      "border-radius:30px;background:linear-gradient(135deg,#0ea5e9 0%,#10b981 100%);" +
      "z-index:99999;box-shadow:0 4px 15px rgba(14,165,233,0.4);display:flex;" +
      "justify-content:center;align-items:center;cursor:pointer;font-size:24px;" +
      "transition:all 0.3s ease;";
    ball.innerText = "🎓";
    ball.title = "点击展开U校园AI自动刷时长工具";
    document.body.appendChild(ball);
    ball.onmouseenter = function () {
      this.style.transform = "scale(1.1)";
      this.style.boxShadow = "0 6px 20px rgba(14,165,233,0.6)";
    };
    ball.onmouseleave = function () {
      this.style.transform = "scale(1)";
      this.style.boxShadow = "0 4px 15px rgba(14,165,233,0.4)";
    };
    ball.onclick = function () {
      const panel = document.getElementById("unipus-panel");
      if (panel) {
        panel.style.display = panel.style.display === "none" ? "block" : "none";
        return;
      }
      createControlPanel();
    };
  }

  function createControlPanel() {
    let panel = document.createElement("div");
    panel.id = "unipus-panel";
    panel.style.cssText =
      "position:fixed;right:20px;bottom:90px;width:380px;" +
      "background:linear-gradient(135deg,#0ea5e9 0%,#10b981 100%);" +
      "border:none;box-shadow:0 8px 32px rgba(0,0,0,0.3);border-radius:16px;" +
      "z-index:99999;font-family:sans-serif;padding:20px;display:block;";

    const mkDiv = (style = "") => {
      const d = document.createElement("div");
      d.style.cssText = style;
      return d;
    };
    const mkEl = (tag, style = "") => {
      const el = document.createElement(tag);
      el.style.cssText = style;
      return el;
    };

    let title = mkDiv(
      "font-size:18px;font-weight:bold;color:#fff;margin-bottom:8px;text-align:center;",
    );
    title.innerHTML =
      '📚 U校园AI自动刷时长工具 <span style="font-size:12px;opacity:0.7;">v5.2.13</span>';

    let authorInfo = mkDiv(
      "display:flex;align-items:center;justify-content:space-between;margin-bottom:2px;padding-bottom:2px;",
    );
    let authorText = mkEl(
      "p",
      "margin:0;font-size:12px;color:rgba(255,255,255,0.9);",
    );
    authorText.textContent = "作者: UXU倒計时";
    let githubLink = mkEl("a", "font-size:12px;color:#fff;");
    githubLink.href = "https://github.com/uxudjs/UnipusAIAutoPlayer";
    githubLink.textContent = "📦 GitHub仓库";
    authorInfo.appendChild(authorText);
    // 反馈按钮
    var feedbackBtn = mkEl(
      "a",
      "font-size:12px;color:#fff;cursor:pointer;margin-right:10px;",
    );
    feedbackBtn.textContent = "🛠️ 反馈";
    feedbackBtn.addEventListener("click", function (e) {
      e.preventDefault();
      showFeedbackPopup("反馈问题");
    });
    authorInfo.appendChild(feedbackBtn);
    authorInfo.appendChild(githubLink);

    let contentBox = mkDiv("background:#fff;border-radius:12px;padding:16px;");

    let menuList = [];
    let menuLabel = mkEl(
      "label",
      "display:block;margin-bottom:8px;font-size:14px;font-weight:600;color:#333;",
    );
    menuLabel.innerHTML = "📖 选择起始目录:";

    let menuRow = mkDiv("display:flex;gap:8px;margin-bottom:15px;");

    let menuSelect = mkDiv(
      "flex:1;min-width:0;position:relative;user-select:none;",
    );
    menuSelect.value = "0";

    let menuTrigger = mkDiv(
      "padding:8px 32px 8px 8px;border-radius:8px;border:2px solid #e0e0e0;" +
        "font-size:13px;background:#fff;cursor:pointer;overflow:hidden;text-overflow:ellipsis;" +
        "white-space:nowrap;position:relative;box-sizing:border-box;",
    );
    menuTrigger.textContent = "请选择起始目录";

    let menuArrow = mkEl(
      "span",
      "position:absolute;right:8px;top:50%;transform:translateY(-50%);pointer-events:none;font-size:10px;color:#999;",
    );
    menuArrow.textContent = "▼";
    menuTrigger.appendChild(menuArrow);

    let menuDropdown = mkDiv(
      "display:none;position:absolute;top:100%;left:0;right:0;max-height:300px;" +
        "overflow-x:hidden;overflow-y:auto;background:#fff;border:2px solid #e0e0e0;" +
        "border-radius:8px;z-index:100000;box-shadow:0 4px 12px rgba(0,0,0,0.15);" +
        "margin-top:4px;box-sizing:border-box;",
    );
    menuSelect.appendChild(menuTrigger);
    menuSelect.appendChild(menuDropdown);

    menuTrigger.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = menuDropdown.style.display === "block";
      menuDropdown.style.display = isOpen ? "none" : "block";
      menuArrow.textContent = isOpen ? "▼" : "▲";
    });
    document.addEventListener("click", (e) => {
      if (!menuSelect.contains(e.target)) {
        menuDropdown.style.display = "none";
        menuArrow.textContent = "▼";
      }
    });

    let refreshBtn = mkEl(
      "button",
      "padding:8px 12px;border-radius:8px;border:2px solid #e0e0e0;" +
        "background:#f0f0f0;cursor:pointer;font-size:16px;transition:all 0.2s ease;",
    );
    refreshBtn.innerHTML = "🔄";
    refreshBtn.title = "刷新目录列表";
    menuRow.appendChild(menuSelect);
    menuRow.appendChild(refreshBtn);

    let startBtn;
    let _lastMenuHash = "";
    let _menuDetectionDone = false;

    function populateMenuSelect(list) {
      if (!Array.isArray(list) || list.length === 0) {
        menuDropdown.innerHTML = "";
        const empty = mkDiv(
          "padding:10px 12px;font-size:13px;color:#999;text-align:center;",
        );
        empty.textContent = "未识别到目录，请展开左侧目录后重试";
        menuDropdown.appendChild(empty);
        menuTrigger.textContent = "请选择起始目录";
        menuSelect.value = "0";
        _lastMenuHash = "";
        if (startBtn) {
          startBtn.disabled = true;
          startBtn.style.opacity = "0.5";
          startBtn.style.cursor = "not-allowed";
        }
        if (_menuDetectionDone) {
          showFeedbackPopup("目录识别失败");
        }
        return;
      }
      const newHash = JSON.stringify(
        list.map(function (n) {
          return n.unit + "|" + n.section + "|" + n.micro;
        }),
      );
      if (newHash === _lastMenuHash) return;
      _lastMenuHash = newHash;
      menuDropdown.innerHTML = "";
      menuList = list;
      let prevUnit = "";
      list.forEach((item, i) => {
        if (item.unit && item.unit !== prevUnit) {
          prevUnit = item.unit;
          const header = mkDiv(
            "padding:6px 12px 2px;font-size:11px;font-weight:bold;color:#0ea5e9;text-overflow:ellipsis;overflow:hidden;white-space:nowrap;" +
              (i > 0 ? "border-top:1px solid #f0f0f0;" : ""),
          );
          header.textContent = "📁 " + item.unit;
          menuDropdown.appendChild(header);
        }
        const itemDiv = mkDiv(
          "padding:8px 12px;padding-left:" +
            (item.section ? "36px" : "24px") +
            ";" +
            "font-size:13px;color:#333;cursor:pointer;overflow:hidden;text-overflow:ellipsis;" +
            "white-space:nowrap;box-sizing:border-box;transition:background 0.15s ease;",
        );
        itemDiv.textContent = item.micro;
        itemDiv.dataset.index = i;
        itemDiv.addEventListener("mouseenter", function () {
          this.style.background = "#e8f4fd";
        });
        itemDiv.addEventListener("mouseleave", function () {
          this.style.background = "";
        });
        itemDiv.addEventListener("click", (e) => {
          e.stopPropagation();
          menuSelect.value = String(i);
          menuTrigger.textContent = item.micro;
          menuDropdown.style.display = "none";
          menuArrow.textContent = "▼";
          menuDropdown.querySelectorAll(".menu-item-selected").forEach((el) => {
            el.classList.remove("menu-item-selected");
            el.style.background = "";
            el.style.fontWeight = "normal";
          });
          itemDiv.classList.add("menu-item-selected");
          itemDiv.style.background = "#d0ecfb";
          itemDiv.style.fontWeight = "bold";
        });
        menuDropdown.appendChild(itemDiv);
        if (i === 0) {
          menuSelect.value = "0";
          menuTrigger.textContent = item.micro;
        }
      });
      if (startBtn) {
        startBtn.disabled = false;
        startBtn.style.opacity = "1";
        startBtn.style.cursor = "pointer";
      }
      addLog("✅ 成功识别 " + list.length + " 个目录项");
    }

    let timeLabel = mkEl(
      "label",
      "display:block;margin-bottom:8px;font-size:14px;font-weight:600;color:#333;",
    );
    timeLabel.innerHTML = "⏱️ 总刷课时长(分钟):";
    let timeInput = mkEl(
      "input",
      "width:100%;padding:8px;border-radius:8px;border:2px solid #e0e0e0;" +
        "font-size:14px;margin-bottom:15px;box-sizing:border-box;",
    );
    timeInput.type = "number";
    timeInput.value = 60;
    timeInput.min = 1;
    timeInput.id = "unipus-time-input";

    let videoRow = mkDiv(
      "display:flex;align-items:center;gap:8px;margin-bottom:15px;",
    );
    let videoCheckbox = mkEl("input", "width:18px;height:18px;cursor:pointer;");
    videoCheckbox.type = "checkbox";
    videoCheckbox.id = "unipus-video-toggle";
    let videoLabelEl = mkEl(
      "label",
      "font-size:13px;color:#555;cursor:pointer;",
    );
    videoLabelEl.htmlFor = "unipus-video-toggle";
    videoLabelEl.textContent =
      "🎬 启用视频播放（等待视频结束后自动跳转，播放期间不计时）";
    videoCheckbox.addEventListener("change", function () {
      videoPlaybackEnabled = this.checked;
      addLog(
        videoPlaybackEnabled
          ? "🎬 已启用视频播放模式"
          : "⏱️ 已切换为纯倒计时模式",
      );
    });
    videoRow.appendChild(videoCheckbox);
    videoRow.appendChild(videoLabelEl);

    let btnContainer = mkDiv("display:flex;gap:10px;margin-bottom:15px;");
    startBtn = mkEl(
      "button",
      "flex:1;padding:12px;background:linear-gradient(135deg,#0ea5e9 0%,#10b981 100%);" +
        "color:#fff;border-radius:8px;border:none;font-size:15px;font-weight:bold;cursor:pointer;transition:all 0.3s ease;",
    );
    startBtn.innerHTML = "🚀 开始刷课";

    let pauseBtn = mkEl(
      "button",
      "flex:1;padding:12px;background:#ffa500;color:#fff;border-radius:8px;" +
        "border:none;font-size:15px;font-weight:bold;cursor:pointer;transition:all 0.3s ease;display:none;",
    );
    pauseBtn.innerHTML = "⏸️ 暂停";

    let log = mkEl(
      "div",
      "height:120px;overflow-y:auto;font-size:12px;border:2px solid #e0e0e0;" +
        "background:#f9f9f9;padding:10px;border-radius:8px;font-family:monospace;color:#555;",
    );
    log.id = "unipus-log";

    btnContainer.appendChild(startBtn);
    btnContainer.appendChild(pauseBtn);
    contentBox.appendChild(menuLabel);
    contentBox.appendChild(menuRow);
    contentBox.appendChild(timeLabel);
    contentBox.appendChild(timeInput);
    contentBox.appendChild(videoRow);
    contentBox.appendChild(btnContainer);
    contentBox.appendChild(log);
    panel.appendChild(title);
    panel.appendChild(authorInfo);
    panel.appendChild(contentBox);
    document.body.appendChild(panel);

    populateMenuSelect([]);

    function initMenuDetection() {
      if (_menuDetectionDone) return;
      clickIKnow();
      requestIframeScan();
      const initialList = getMenuList_main();
      if (initialList && initialList.length > 0) {
        _menuDetectionDone = true;
        populateMenuSelect(initialList);
        return;
      }
      addLog("⏳ 正在等待目录加载...");
      getMenuListWithRetry(
        15,
        1200,
        (list) => {
          if (!_menuDetectionDone) {
            _menuDetectionDone = true;
            populateMenuSelect(list);
          }
        },
        () => {
          addLog("⚠️ 目录检测超时");
          showFeedbackPopup("目录识别失败");
        },
      );
      watchForMenu(() => {
        if (_menuDetectionDone) return;
        _menuDetectionDone = true;
        addLog("🔍 检测到目录变化，重新扫描...");
        const fresh = getMenuList_main();
        if (fresh && fresh.length > 0) populateMenuSelect(fresh);
      }, 20000);
    }

    window.addEventListener("UAI_MENU_READY", (e) => {
      const list = e.detail;
      if (Array.isArray(list) && list.length > 0) {
        _menuDetectionDone = true;
        populateMenuSelect(list);
      }
    });

    setTimeout(initMenuDetection, 600);

    refreshBtn.onclick = function () {
      addLog("🔄 正在刷新目录列表...");
      this.style.background = "#e0e0e0";
      setTimeout(() => {
        this.style.background = "#f0f0f0";
      }, 300);
      _menuListCache = [];
      _menuDetectionDone = false;
      _lastMenuHash = "";
      initMenuDetection();
    };
    refreshBtn.onmouseenter = function () {
      this.style.background = "#e8e8e8";
    };
    refreshBtn.onmouseleave = function () {
      this.style.background = "#f0f0f0";
    };

    pauseBtn.onclick = function () {
      isPaused = !isPaused;
      if (isPaused) {
        pauseBtn.innerHTML = "▶️ 继续";
        pauseBtn.style.background = "#28a745";
        addPauseLog("⏸️ 已暂停");
      } else {
        pauseBtn.innerHTML = "⏸️ 暂停";
        pauseBtn.style.background = "#ffa500";
        removePauseLine();
        const curTime = Math.max(1, +timeInput.value);
        const curIdx = +(menuSelect.value || "0");
        if (curTime !== lastTimeValue || curIdx !== lastStartIdx) {
          removeCountdownLine();
          const jobs = menuList.slice(curIdx);
          if (!Array.isArray(jobs) || !jobs.length) {
            addLog("⚠️ 目录列表为空，请先展开目录后重试");
            return;
          }
          perStepTime = (curTime * 60) / jobs.length;
          addLog(
            `⚙️ 配置已修改，立即跳转: 共${jobs.length}个目录，每个约${Math.round(perStepTime)}秒`,
          );
          lastTimeValue = curTime;
          lastStartIdx = curIdx;
          shouldRestart = true;
        } else {
          addLog("▶️ 继续运行");
        }
      }
    };

    startBtn.onclick = function () {
      if (isRunning) {
        addLog("⚠️ 已经在运行中...");
        return;
      }
      if (!Array.isArray(menuList) || menuList.length === 0) {
        const fresh = getMenuList_main();
        if (Array.isArray(fresh) && fresh.length > 0) {
          menuList = fresh;
          const oldVal = +(menuSelect.value || "0");
          populateMenuSelect(menuList);
          const restoredIdx = Math.min(
            oldVal,
            Math.max(0, menuList.length - 1),
          );
          menuSelect.value = String(restoredIdx);
          menuTrigger.textContent = menuList[restoredIdx]
            ? menuList[restoredIdx].micro
            : "";
          addLog("✅ 已重新识别目录，请重新点击开始刷课");
        } else {
          addLog("⚠️ 未识别到目录");
          showFeedbackPopup("目录识别失败");
        }
        return;
      }

      isRunning = true;
      isPaused = false;
      shouldRestart = false;
      startBtn.style.display = "none";
      pauseBtn.style.display = "block";
      pauseBtn.innerHTML = "⏸️ 暂停";
      pauseBtn.style.background = "#ffa500";

      lastTimeValue = Math.max(1, +timeInput.value);
      lastStartIdx = +(menuSelect.value || "0");
      let jobs = menuList.slice(lastStartIdx);
      if (!jobs.length) {
        addLog("⚠️ 目录列表为空，请先展开目录后重试");
        isRunning = false;
        startBtn.style.display = "block";
        pauseBtn.style.display = "none";
        return;
      }
      perStepTime = (lastTimeValue * 60) / jobs.length;

      (async function loop() {
        addLog(`🚀 共${jobs.length}个目录，每个约${Math.round(perStepTime)}秒`);

        for (let idx = 0; isRunning && idx < jobs.length; idx++) {
          await waitWhilePaused();
          if (shouldRestart) {
            shouldRestart = false;
            const newIdx = +(menuSelect.value || "0");
            jobs = menuList.slice(newIdx);
            idx = -1;
            clickIKnow();
            addLog(
              `🔄 配置已重置，继续从 [${newIdx + 1}] ${jobs[0]?.micro || ""} 开始`,
            );
            continue;
          }
          if (!isRunning || isPaused) continue;

          clickIKnow();
          addLog(
            `📂 [${lastStartIdx + idx + 1}/${menuList.length}] ${jobs[idx].micro}`,
          );

          if (jobs[idx].element) {
            clickIKnow();
            const ok = await safeClickAsync(jobs[idx].element);
            clickIKnow();
            if (!ok) {
              addLog("⚠️ 目录点击失败，已跳过此目录");
              continue;
            }
          }

          if (shouldRestart) continue;

          clickIKnow();
          await waitForElement(".pc-header-tabs-container", 3000);
          if (shouldRestart) continue;

          clickIKnow();
          const tabs = getTabs();

          if (tabs.length > 0) {
            const tabTime = perStepTime / tabs.length;
            for (let t = 0; t < tabs.length; t++) {
              if (shouldRestart) break;
              await waitWhilePaused();
              if (shouldRestart || !isRunning) break;
              clickIKnow();
              addLog(`📑 Tab[${t + 1}/${tabs.length}]: ${tabs[t].name}`);
              if (tabs[t].element && tabs.length > 1 && !isTabActive(tabs[t])) {
                clickIKnow();
                safeClick(tabs[t].element);
                clickIKnow();
              }
              if (shouldRestart) break;
              clickIKnow();
              await waitForElement(".pc-header-tasks-row", 3000);
              if (shouldRestart) break;
              let videoPlayed = false;
              if (videoPlaybackEnabled) {
                addLog("🎬 等待视频播放结束...");
                videoPlayed = await waitForVideoEnd();
                if (videoPlayed) {
                  addLog("🎬 视频播放完成，继续处理本页任务");
                }
              }
              clickIKnow();
              const tabTasks = getTasks();
              if (tabTasks.length > 0) {
                const taskTime = tabTime / tabTasks.length;
                for (let k = 0; k < tabTasks.length; k++) {
                  if (shouldRestart) break;
                  await waitWhilePaused();
                  if (shouldRestart || !isRunning) break;
                  const taskName = `✏️ Task[${k + 1}/${tabTasks.length}]: ${tabTasks[k].name}`;
                  if (
                    tabTasks[k].element &&
                    tabTasks.length > 1 &&
                    !isTaskActive(tabTasks[k])
                  ) {
                    clickIKnow();
                    tabTasks[k].element.click();
                    clickIKnow();
                  }
                  await waitTime(taskTime, taskName);
                  if (shouldRestart) break;
                  clickIKnow();
                }
                if (shouldRestart) break;
              } else {
                if (videoPlayed) continue;
                await waitTime(tabTime, "");
                if (shouldRestart) break;
                clickIKnow();
              }
            }
            if (shouldRestart) continue;
          } else {
            const directTasks = getTasks();
            if (directTasks.length > 0) {
              const taskTime = perStepTime / directTasks.length;
              for (let k = 0; k < directTasks.length; k++) {
                if (shouldRestart) break;
                await waitWhilePaused();
                if (shouldRestart || !isRunning) break;
                const taskName = `✏️ Task[${k + 1}/${directTasks.length}]: ${directTasks[k].name}`;
                if (
                  directTasks[k].element &&
                  directTasks.length > 1 &&
                  !isTaskActive(directTasks[k])
                ) {
                  clickIKnow();
                  directTasks[k].element.click();
                  clickIKnow();
                }
                await waitTime(taskTime, taskName);
                if (shouldRestart) break;
                clickIKnow();
              }
              if (shouldRestart) continue;
            } else {
              await waitTime(perStepTime, "");
              if (shouldRestart) continue;
              clickIKnow();
            }
          }
        }

        addLog("🎉 刷课完成！");
        isRunning = false;
        startBtn.style.display = "block";
        pauseBtn.style.display = "none";
        startBtn.innerHTML = "🚀 开始刷课";
      })();
    };
  }

  async function waitWhilePaused() {
    while (isPaused && isRunning && !shouldRestart) {
      await new Promise((r) => setTimeout(r, 500));
    }
  }

  async function waitTime(seconds, taskName) {
    let remaining = Math.round(seconds);
    let tick = 0;
    while (remaining > 0) {
      await waitWhilePaused();
      if (shouldRestart || !isRunning) break;
      if (tick % 5 === 0) clickIKnow();
      tick++;
      // 视频播放检测：播放时暂停倒计时
      if (videoPlaybackEnabled) {
        const video = findVideoElement();
        if (video && isVideoPlaying(video)) {
          if (taskName) addLog(taskName, true);
          addLog("🎬 检测到视频播放中，暂停倒计时...");
          await waitForVideoEnd();
          addLog("🎬 视频播放结束，恢复倒计时");
          continue;
        }
        if (video && video.paused && !video.ended) {
          playVideo();
        }
      }
      if (taskName) addLog(`${taskName} ⏳${remaining}秒`, true);
      await new Promise((r) => setTimeout(r, 1000));
      remaining--;
    }
    if (taskName && !shouldRestart) {
      const log = document.getElementById("unipus-log");
      const cl = log?.querySelector(".countdown-line");
      if (cl) cl.remove();
      addLog(taskName);
    } else if (shouldRestart) {
      removeCountdownLine();
    }
  }

  window.addEventListener("load", function () {
    setTimeout(() => {
      createFloatingBall();
      clickIKnow();
    }, 1600);
  });
})();
