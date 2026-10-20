// 新北市林口區麗園國民小學 115學年度六年級戶外教育參觀活動 電子手冊書核心控制器
let currentPage = 1; // 1 to 24
let isScanMode = false;
let isMobile = window.innerWidth < 1024;
let fontScale = 1.0;

document.addEventListener("DOMContentLoaded", () => {
  initBookCountdown();
  initTocDrawer();
  initBookNavigation();
  initKeyboardNav();
  initTouchSwipe();

  // Load last read page
  const savedPage = parseInt(localStorage.getItem("ly_handbook_page") || "1");
  goToPage(savedPage >= 1 && savedPage <= 24 ? savedPage : 1);

  window.addEventListener("resize", () => {
    const newIsMobile = window.innerWidth < 1024;
    if (newIsMobile !== isMobile) {
      isMobile = newIsMobile;
      renderBook();
    }
  });
});

/* --------------------------------------------------------------------------
   1. 字體大小調整 (Mobile-friendly)
   -------------------------------------------------------------------------- */
window.adjustFontSize = function(delta) {
  fontScale = Math.max(0.85, Math.min(1.35, fontScale + delta));
  document.documentElement.style.setProperty('--base-font-size', (16 * fontScale) + 'px');
};

/* --------------------------------------------------------------------------
   2. 集合出發倒數計時器
   -------------------------------------------------------------------------- */
function initBookCountdown() {
  const targetDate = new Date("2026-11-25T06:30:00+08:00").getTime();
  const el = document.getElementById("headerCountdown");

  function tick() {
    const now = new Date().getTime();
    const diff = targetDate - now;
    if (diff <= 0) {
      if (el) el.textContent = "已出發！祝旅途平安！";
      return;
    }
    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);
    if (el) el.textContent = `${d}天 ${String(h).padStart(2, "0")}時 ${String(m).padStart(2, "0")}分 ${String(s).padStart(2, "0")}秒`;
  }
  tick();
  setInterval(tick, 1000);
}

/* --------------------------------------------------------------------------
   3. 書本頁面渲染核心 (手機單頁自然滾動 vs 電腦雙頁對開)
   -------------------------------------------------------------------------- */
function renderBook() {
  const leftContainer = document.getElementById("pageLeft");
  const rightContainer = document.getElementById("pageRight");
  if (!leftContainer || !rightContainer) return;

  if (isMobile) {
    // 【手機端模式】：單頁順暢閱讀，包含全部 1~24 頁，無任何跳頁或隱藏！
    rightContainer.style.display = "none";
    const currentData = pagesContent.find(p => p.num === currentPage);
    if (currentData) {
      leftContainer.innerHTML = buildPageHtml(currentData, "single");
    }
    updateNavControls(currentPage, currentPage);
    initDynamicComponentsOnPage(currentPage);
  } else {
    // 【電腦端模式】：雙頁對開（左頁奇數、右頁偶數）
    rightContainer.style.display = "flex";
    const leftPageNum = currentPage % 2 === 1 ? currentPage : currentPage - 1;
    const rightPageNum = leftPageNum + 1;

    const leftData = pagesContent.find(p => p.num === leftPageNum);
    const rightData = pagesContent.find(p => p.num === rightPageNum);

    if (leftData) {
      leftContainer.innerHTML = buildPageHtml(leftData, "left");
      leftContainer.scrollTop = 0;
    }
    if (rightData) {
      rightContainer.innerHTML = buildPageHtml(rightData, "right");
      rightContainer.scrollTop = 0;
    } else {
      rightContainer.innerHTML = `<div style="display:flex; justify-content:center; align-items:center; height:100%; color:#94a3b8;">封底 (End of Handbook)</div>`;
    }

    updateNavControls(leftPageNum, rightPageNum);
    initDynamicComponentsOnPage(leftPageNum);
    initDynamicComponentsOnPage(rightPageNum);
  }

  // 記住閱讀進度
  localStorage.setItem("ly_handbook_page", currentPage);
}

function buildPageHtml(pageData, side) {
  if (isScanMode) {
    return `
      <div class="page-header-row">
        <span>原版掃描頁面</span>
        <span>第 ${pageData.num} 頁</span>
      </div>
      <div style="flex:1; display:flex; justify-content:center; align-items:center; background:#ffffff; border-radius:8px; overflow:hidden; padding:4px;">
        <img class="scan-view-frame" src="assets/images/p_${pageData.num}.jpg" alt="第 ${pageData.num} 頁原版手冊掃描" loading="lazy">
      </div>
      <div class="page-footer-row">
        <span>新北市林口區麗園國小</span>
        <span class="page-num-badge">第 ${pageData.num} 頁</span>
      </div>
    `;
  }

  return `
    <div class="page-header-row">
      <span>${pageData.category}</span>
      <span>麗園國小 115戶外教育</span>
    </div>
    <div class="book-page-body">
      ${pageData.render()}
    </div>
    <div class="page-footer-row">
      <span>原民旅行社承辦</span>
      <span class="page-num-badge">第 ${pageData.num} 頁 / 共 24 頁</span>
    </div>
  `;
}

function updateNavControls(activePage, rightPage) {
  const prevBtn = document.getElementById("btnPrevPage");
  const nextBtn = document.getElementById("btnNextPage");
  const jumpSelect = document.getElementById("pageJumpSelect");

  if (isMobile) {
    if (prevBtn) prevBtn.disabled = activePage <= 1;
    if (nextBtn) nextBtn.disabled = activePage >= 24;
  } else {
    if (prevBtn) prevBtn.disabled = activePage <= 1;
    if (nextBtn) nextBtn.disabled = rightPage >= 24;
  }

  if (jumpSelect) {
    jumpSelect.value = activePage;
  }
}

/* --------------------------------------------------------------------------
   4. 翻頁與目錄導航
   -------------------------------------------------------------------------- */
function initBookNavigation() {
  const prevBtn = document.getElementById("btnPrevPage");
  const nextBtn = document.getElementById("btnNextPage");
  const jumpSelect = document.getElementById("pageJumpSelect");
  const toggleScanBtn = document.getElementById("btnToggleScan");

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      if (isMobile) {
        if (currentPage > 1) {
          currentPage--;
          renderBook();
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      } else {
        const step = (currentPage % 2 === 1) ? 2 : 1;
        if (currentPage > 1) {
          currentPage = Math.max(1, currentPage - 2);
          renderBook();
        }
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      if (isMobile) {
        if (currentPage < 24) {
          currentPage++;
          renderBook();
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      } else {
        if (currentPage < 23) {
          currentPage = Math.min(23, currentPage + 2);
          renderBook();
        }
      }
    });
  }

  // Populate Dropdown
  if (jumpSelect) {
    jumpSelect.innerHTML = "";
    pagesContent.forEach(p => {
      const opt = document.createElement("option");
      opt.value = p.num;
      opt.textContent = `第 ${p.num} 頁：${p.title}`;
      jumpSelect.appendChild(opt);
    });

    jumpSelect.addEventListener("change", (e) => {
      goToPage(parseInt(e.target.value));
    });
  }

  // Toggle Original Scan
  if (toggleScanBtn) {
    toggleScanBtn.addEventListener("click", () => {
      isScanMode = !isScanMode;
      const textEl = document.getElementById("scanModeText");
      if (textEl) {
        textEl.textContent = isScanMode ? "📖 精美排版" : "📷 原版";
      }
      toggleScanBtn.classList.toggle("active", isScanMode);
      renderBook();
    });
  }
}

function goToPage(pageNum) {
  currentPage = pageNum;
  renderBook();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function initKeyboardNav() {
  document.addEventListener("keydown", (e) => {
    if (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA") return;
    if (e.key === "ArrowLeft") {
      document.getElementById("btnPrevPage").click();
    } else if (e.key === "ArrowRight") {
      document.getElementById("btnNextPage").click();
    }
  });
}

function initTouchSwipe() {
  const stage = document.getElementById("bookWrapper");
  if (!stage) return;
  let startX = 0;
  let startY = 0;

  stage.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }, { passive: true });

  stage.addEventListener("touchend", (e) => {
    const diffX = e.changedTouches[0].clientX - startX;
    const diffY = e.changedTouches[0].clientY - startY;

    // Only swipe if horizontal move is significant and greater than vertical scroll
    if (Math.abs(diffX) > 60 && Math.abs(diffX) > Math.abs(diffY) * 1.5) {
      if (diffX < 0) {
        document.getElementById("btnNextPage").click();
      } else {
        document.getElementById("btnPrevPage").click();
      }
    }
  }, { passive: true });
}

/* --------------------------------------------------------------------------
   5. 目錄側邊欄
   -------------------------------------------------------------------------- */
function initTocDrawer() {
  const openBtn = document.getElementById("btnOpenToc");
  const closeBtn = document.getElementById("btnCloseToc");
  const drawer = document.getElementById("tocDrawer");
  const backdrop = document.getElementById("tocBackdrop");
  const listEl = document.getElementById("tocList");

  if (!openBtn || !drawer || !backdrop || !listEl) return;

  // Build TOC List
  listEl.innerHTML = "";
  pagesContent.forEach(p => {
    const item = document.createElement("div");
    item.className = "toc-item";
    item.innerHTML = `
      <span>第 ${p.num} 頁：${p.title}</span>
      <span style="font-size:0.75rem; color:#94a3b8;">${p.category}</span>
    `;
    item.addEventListener("click", () => {
      goToPage(p.num);
      closeToc();
    });
    listEl.appendChild(item);
  });

  function openToc() {
    drawer.classList.add("open");
    backdrop.classList.add("open");
  }

  function closeToc() {
    drawer.classList.remove("open");
    backdrop.classList.remove("open");
  }

  openBtn.addEventListener("click", openToc);
  closeBtn.addEventListener("click", closeToc);
  backdrop.addEventListener("click", closeToc);
}

/* --------------------------------------------------------------------------
   6. 動態元件掛載
   -------------------------------------------------------------------------- */
function initDynamicComponentsOnPage(pageNum) {
  if (pageNum === 1) {
    const fields = ["name", "class", "blood", "addr", "parent", "teacher", "bus", "table", "room1", "room2"];
    fields.forEach(f => {
      const el = document.getElementById("pass_" + f);
      if (el) {
        el.value = localStorage.getItem("ly_bookpass_" + f) || "";
        el.addEventListener("input", () => {
          localStorage.setItem("ly_bookpass_" + f, el.value);
        });
      }
    });
  }

  if (pageNum === 5) renderBookChecklist();
  if (pageNum === 16) renderBookQuiz1();
  if (pageNum === 17) renderBookQuiz2();
  if (pageNum === 18) renderBookQuiz3();
  if (pageNum === 19) initBookDoodleCanvas();
  if (pageNum === 21) renderBookNotesWall();
}

window.saveStudentPass = function() {
  const fields = ["name", "class", "blood", "addr", "parent", "teacher", "bus", "table", "room1", "room2"];
  fields.forEach(f => {
    const el = document.getElementById("pass_" + f);
    if (el) localStorage.setItem("ly_bookpass_" + f, el.value);
  });
  alert("✅ 個人資料已成功儲存在此手機/電腦中！");
};

/* --------------------------------------------------------------------------
   7. 行李清單互動
   -------------------------------------------------------------------------- */
const defaultChecklist = [
  { id: "bk_handbook", cat: "隨身背包", name: "活動手冊（本電子手冊或紙本）" },
  { id: "bk_ic", cat: "隨身背包", name: "健保卡 (務必隨身攜帶！)" },
  { id: "bk_chop", cat: "隨身背包", name: "環保餐具 (旅程不提供免洗餐具)" },
  { id: "bk_water", cat: "隨身背包", name: "環保水壺 (旅程不主動提供瓶裝水)" },
  { id: "bk_rain", cat: "隨身背包", name: "雨具 (環保雨衣或折疊傘)" },
  { id: "bk_mask", cat: "隨身背包", name: "備用口罩" },
  { id: "bk_pen", cat: "隨身背包", name: "筆、筆記本" },
  { id: "bk_tissue", cat: "隨身背包", name: "面紙 / 濕紙巾" },
  { id: "bk_money", cat: "隨身背包", name: "零用錢錢包 (請勿帶過多金錢)" },
  { id: "bk_sanitary", cat: "隨身背包", name: "衛生棉 (女)" },
  { id: "bk_med", cat: "隨身背包", name: "備用藥品 (暈車藥、防蚊液)" },
  
  { id: "lg_c2", cat: "行李", name: "第二天班服" },
  { id: "lg_c3", cat: "行李", name: "第三天運動服" },
  { id: "lg_jacket", cat: "行李", name: "保暖禦寒外套 (早晚溫差大)" },
  { id: "lg_underwear", cat: "行李", name: "個人換洗衣物、內衣褲" },
  { id: "lg_pajamas", cat: "行李", name: "睡衣褲" },
  { id: "lg_dirty", cat: "行李", name: "髒衣袋" },
  { id: "lg_slippers", cat: "行李", name: "拖鞋" },
  { id: "lg_toilet", cat: "行李", name: "盥洗用具 (牙刷、牙膏自備，減塑飯店不提供)" }
];

function renderBookChecklist() {
  const bpContainer = document.getElementById("bookBackpackList");
  const lgContainer = document.getElementById("bookLuggageList");
  const progEl = document.getElementById("bookCheckProgress");
  if (!bpContainer || !lgContainer) return;

  const checks = JSON.parse(localStorage.getItem("ly_book_checks") || "{}");

  const buildItems = (container, cat) => {
    container.innerHTML = "";
    defaultChecklist.filter(it => it.cat.includes(cat)).forEach(item => {
      const checked = !!checks[item.id];
      const label = document.createElement("label");
      label.style.display = "flex";
      label.style.alignItems = "center";
      label.style.gap = "10px";
      label.style.fontSize = "0.92rem";
      label.style.padding = "6px 0";
      label.style.cursor = "pointer";
      label.style.color = checked ? "#94a3b8" : "#334155";
      label.style.textDecoration = checked ? "line-through" : "none";
      label.innerHTML = `
        <input type="checkbox" ${checked ? "checked" : ""} style="width:18px; height:18px; accent-color:#10b981;">
        <span>${item.name}</span>
      `;
      label.querySelector("input").addEventListener("change", (e) => {
        checks[item.id] = e.target.checked;
        localStorage.setItem("ly_book_checks", JSON.stringify(checks));
        renderBookChecklist();
      });
      container.appendChild(label);
    });
  };

  buildItems(bpContainer, "隨身");
  buildItems(lgContainer, "行李");

  const total = defaultChecklist.length;
  const done = defaultChecklist.filter(it => checks[it.id]).length;
  const pct = Math.round((done / total) * 100);
  if (progEl) {
    progEl.textContent = `打包進度：已準備 ${done} / ${total} 項 (${pct}%)`;
  }
}

window.resetBookChecklist = function() {
  if (confirm("確定要重設打包清單嗎？")) {
    localStorage.removeItem("ly_book_checks");
    renderBookChecklist();
  }
};

/* --------------------------------------------------------------------------
   8. 學習單作答與批改
   -------------------------------------------------------------------------- */
function renderBookQuiz1() {
  const container = document.getElementById("quiz1_container");
  if (!container || typeof quizData === "undefined") return;

  const d = quizData.earthquake;
  let html = `
    <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:14px; margin-bottom:14px;">
      <b style="color:#0f172a; font-size:1rem;">一、地震成因多選題：</b><br>
      <span style="font-size:0.9rem; color:#475569;">${d.causes.question}</span>
      <div style="display:flex; flex-direction:column; gap:8px; margin-top:10px;">
  `;
  d.causes.options.forEach((opt, idx) => {
    html += `
      <label style="display:flex; align-items:center; gap:10px; font-size:0.92rem; cursor:pointer; padding:6px 8px; border-radius:6px; background:#ffffff; border:1px solid #e2e8f0;">
        <input type="checkbox" name="bk_q1_cause" value="${idx}" style="width:18px; height:18px;">
        <span>${opt.text}</span>
      </label>
    `;
  });
  html += `
      </div>
      <div id="bk_q1_cause_exp" style="display:none; margin-top:10px; font-size:0.85rem; color:#0369a1; background:#e0f2fe; padding:8px 12px; border-radius:6px;"></div>
    </div>

    <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:14px; margin-bottom:14px;">
      <b style="color:#0f172a; font-size:1rem;">二、是非題：</b>
  `;
  d.trueFalse.forEach((tf, idx) => {
    html += `
      <div style="margin-top:12px; font-size:0.92rem; border-bottom:1px dashed #e2e8f0; padding-bottom:10px;">
        <div><b>${idx + 1}.</b> ${tf.q}</div>
        <div style="display:flex; gap:18px; margin-left:12px; margin-top:6px;">
          <label style="cursor:pointer; display:flex; align-items:center; gap:6px;"><input type="radio" name="bk_q1_tf_${idx}" value="true" style="width:18px; height:18px;"> ○ 正確</label>
          <label style="cursor:pointer; display:flex; align-items:center; gap:6px;"><input type="radio" name="bk_q1_tf_${idx}" value="false" style="width:18px; height:18px;"> ╳ 錯誤</label>
        </div>
        <div id="bk_q1_tf_exp_${idx}" style="display:none; font-size:0.82rem; margin-top:6px; padding:6px 10px; border-radius:6px;"></div>
      </div>
    `;
  });
  html += `
    </div>

    <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:14px; margin-bottom:14px;">
      <b style="color:#0f172a; font-size:1rem;">三、參觀感想：</b>
      <textarea id="bk_q1_thoughts" rows="3" placeholder="寫下你參觀921地震教育園區的心得與感想..." style="width:100%; border:1px solid #cbd5e1; border-radius:6px; padding:10px; font-family:inherit; font-size:0.92rem; margin-top:8px;"></textarea>
    </div>

    <div style="text-align:right;">
      <button class="nav-arrow-btn" onclick="gradeBookQuiz1()" style="padding:8px 20px; font-size:0.92rem; height:auto; max-width:none;">📝 送出並批改 921 學習單</button>
    </div>
    <div id="bk_q1_score" style="display:none; margin-top:12px; padding:12px; border-radius:8px; background:#dcfce7; color:#166534; font-weight:700;"></div>
  `;

  container.innerHTML = html;
}

window.gradeBookQuiz1 = function() {
  const d = quizData.earthquake;
  let score = 0;
  let total = 1 + d.trueFalse.length;

  const causes = Array.from(document.querySelectorAll("input[name='bk_q1_cause']:checked")).map(el => parseInt(el.value));
  const isCauseOk = causes.includes(2) && causes.includes(3) && causes.length === 2;
  const cExp = document.getElementById("bk_q1_cause_exp");
  cExp.style.display = "block";
  if (isCauseOk) {
    score++;
    cExp.innerHTML = "✅ <b>答對了！</b> 地震的科學成因為「板塊運動」與「火山活動」。";
  } else {
    cExp.innerHTML = "💡 <b>解析：</b> 科學成因為<b>「板塊運動」</b>與<b>「火山活動」</b>。鯰魚與地牛為民間神話。";
  }

  d.trueFalse.forEach((tf, idx) => {
    const sel = document.querySelector(`input[name='bk_q1_tf_${idx}']:checked`);
    const exp = document.getElementById(`bk_q1_tf_exp_${idx}`);
    exp.style.display = "block";
    if (sel && (sel.value === "true") === tf.correct) {
      score++;
      exp.style.background = "#dcfce7";
      exp.style.color = "#15803d";
      exp.innerHTML = `✅ 正確！${tf.explanation}`;
    } else {
      exp.style.background = "#fee2e2";
      exp.style.color = "#b91c1c";
      exp.innerHTML = `❌ 錯誤！${tf.explanation}`;
    }
  });

  const banner = document.getElementById("bk_q1_score");
  banner.style.display = "block";
  banner.textContent = `🎉 921學習單測驗結果：${score} / ${total} 題正確！`;
};

function renderBookQuiz2() {
  const container = document.getElementById("quiz2_container");
  if (!container || typeof quizData === "undefined") return;

  const d = quizData.lukang;
  let html = `
    <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:14px; margin-bottom:14px;">
      <b style="color:#0f172a; font-size:1rem;">一、選擇題：</b>
  `;
  d.multipleChoice.forEach((mc, idx) => {
    html += `
      <div style="margin-top:10px; font-size:0.92rem;">
        <div><b>${idx + 1}.</b> ${mc.q}</div>
        <div style="display:flex; flex-direction:column; gap:6px; margin-left:12px; margin-top:6px;">
    `;
    mc.options.forEach((opt, oIdx) => {
      html += `<label style="cursor:pointer; display:flex; align-items:center; gap:8px;"><input type="radio" name="bk_q2_mc_${idx}" value="${oIdx}" style="width:18px; height:18px;"> (${oIdx + 1}) ${opt}</label>`;
    });
    html += `
        </div>
        <div id="bk_q2_mc_exp_${idx}" style="display:none; font-size:0.82rem; margin-top:6px; padding:6px 10px; border-radius:6px;"></div>
      </div>
    `;
  });
  html += `
    </div>

    <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:14px; margin-bottom:14px;">
      <b style="color:#0f172a; font-size:1rem;">二、古蹟配合題：</b>
  `;
  d.matching.forEach((m, idx) => {
    html += `
      <div style="margin-top:10px; font-size:0.92rem; border-bottom:1px dashed #e2e8f0; padding-bottom:10px;">
        <div style="margin-bottom:6px;"><b>${idx + 1}.</b> ${m.desc}</div>
        <div>
          <select id="bk_q2_m_${idx}" style="padding:6px 12px; border-radius:6px; border:1px solid #cbd5e1; font-size:0.88rem; width:100%; max-width:260px;">
            <option value="">-- 請選擇對應古蹟 --</option>
            <option value="A">○A 天后宮</option>
            <option value="B">○B 隘門</option>
            <option value="C">○C 餓鬼埕</option>
            <option value="D">○D 新祖宮</option>
            <option value="E">○E 半邊井</option>
          </select>
        </div>
        <div id="bk_q2_m_exp_${idx}" style="display:none; font-size:0.82rem; margin-top:6px; padding:6px 10px; border-radius:6px;"></div>
      </div>
    `;
  });
  html += `
    </div>

    <div style="text-align:right;">
      <button class="nav-arrow-btn" onclick="gradeBookQuiz2()" style="padding:8px 20px; font-size:0.92rem; height:auto; max-width:none;">📝 送出並批改 鹿港學習單</button>
    </div>
    <div id="bk_q2_score" style="display:none; margin-top:12px; padding:12px; border-radius:8px; background:#dcfce7; color:#166534; font-weight:700;"></div>
  `;

  container.innerHTML = html;
}

window.gradeBookQuiz2 = function() {
  const d = quizData.lukang;
  let score = 0;
  let total = d.multipleChoice.length + d.matching.length;

  d.multipleChoice.forEach((mc, idx) => {
    const sel = document.querySelector(`input[name='bk_q2_mc_${idx}']:checked`);
    const exp = document.getElementById(`bk_q2_mc_exp_${idx}`);
    exp.style.display = "block";
    if (sel && parseInt(sel.value) === mc.correct) {
      score++;
      exp.style.background = "#dcfce7";
      exp.style.color = "#15803d";
      exp.innerHTML = `✅ 答對！${mc.explanation}`;
    } else {
      exp.style.background = "#fee2e2";
      exp.style.color = "#b91c1c";
      exp.innerHTML = `❌ 正確答案為 (${mc.correct + 1})。${mc.explanation}`;
    }
  });

  d.matching.forEach((m, idx) => {
    const sel = document.getElementById(`bk_q2_m_${idx}`);
    const exp = document.getElementById(`bk_q2_m_exp_${idx}`);
    exp.style.display = "block";
    if (sel && sel.value === m.target) {
      score++;
      exp.style.background = "#dcfce7";
      exp.style.color = "#15803d";
      exp.innerHTML = `✅ 配對正確！【${m.name}】${m.note}`;
    } else {
      exp.style.background = "#fee2e2";
      exp.style.color = "#b91c1c";
      exp.innerHTML = `❌ 應為【${m.target} ${m.name}】。${m.note}`;
    }
  });

  const banner = document.getElementById("bk_q2_score");
  banner.style.display = "block";
  banner.textContent = `🎉 鹿港學習單測驗結果：${score} / ${total} 題正確！`;
};

function renderBookQuiz3() {
  const container = document.getElementById("quiz3_container");
  if (!container || typeof quizData === "undefined") return;

  const d = quizData.lihpao;
  let html = `<div style="display:flex; flex-direction:column; gap:12px;">`;

  d.questions.forEach((q, idx) => {
    html += `
      <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:12px 14px; font-size:0.92rem;">
        <b>${q.q}</b>
        <div style="display:flex; flex-direction:column; gap:6px; margin-left:12px; margin-top:8px;">
    `;
    q.options.forEach((opt, oIdx) => {
      html += `<label style="cursor:pointer; display:flex; align-items:center; gap:8px;"><input type="radio" name="bk_q3_${idx}" value="${oIdx}" style="width:18px; height:18px;"> (${oIdx + 1}) ${opt}</label>`;
    });
    html += `
        </div>
        <div id="bk_q3_exp_${idx}" style="display:none; font-size:0.82rem; margin-top:6px; padding:6px 10px; border-radius:6px;"></div>
      </div>
    `;
  });

  html += `
    </div>
    <div style="text-align:right; margin-top:14px;">
      <button class="nav-arrow-btn" onclick="gradeBookQuiz3()" style="padding:8px 20px; font-size:0.92rem; height:auto; max-width:none;">📝 送出並批改 麗寶學習單</button>
    </div>
    <div id="bk_q3_score" style="display:none; margin-top:12px; padding:12px; border-radius:8px; background:#dcfce7; color:#166534; font-weight:700;"></div>
  `;

  container.innerHTML = html;
}

window.gradeBookQuiz3 = function() {
  const d = quizData.lihpao;
  let score = 0;
  let total = d.questions.length;

  d.questions.forEach((q, idx) => {
    const sel = document.querySelector(`input[name='bk_q3_${idx}']:checked`);
    const exp = document.getElementById(`bk_q3_exp_${idx}`);
    exp.style.display = "block";
    if (sel && parseInt(sel.value) === q.correct) {
      score++;
      exp.style.background = "#dcfce7";
      exp.style.color = "#15803d";
      exp.innerHTML = `✅ 答對！${q.explanation}`;
    } else {
      exp.style.background = "#fee2e2";
      exp.style.color = "#b91c1c";
      exp.innerHTML = `❌ 正確答案為 (${q.correct + 1})。${q.explanation}`;
    }
  });

  const banner = document.getElementById("bk_q3_score");
  banner.style.display = "block";
  banner.textContent = `🎉 麗寶樂園學習單測驗結果：${score} / ${total} 題正確！`;
};

/* --------------------------------------------------------------------------
   9. 塗鴉板與便利貼
   -------------------------------------------------------------------------- */
let canvasCtx = null;
let canvasDrawing = false;
let canvasColor = "#f97316";
let canvasLineWidth = 3;

function initBookDoodleCanvas() {
  const canvas = document.getElementById("pageDoodleCanvas");
  if (!canvas) return;
  canvasCtx = canvas.getContext("2d");

  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;
  canvasCtx.lineCap = "round";
  canvasCtx.lineJoin = "round";

  function getP(e) {
    const r = canvas.getBoundingClientRect();
    const cx = e.touches ? e.touches[0].clientX : e.clientX;
    const cy = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: (cx - r.left) * (canvas.width / r.width),
      y: (cy - r.top) * (canvas.height / r.height)
    };
  }

  canvas.onmousedown = (e) => {
    canvasDrawing = true;
    const p = getP(e);
    canvasCtx.beginPath();
    canvasCtx.moveTo(p.x, p.y);
  };
  canvas.onmousemove = (e) => {
    if (!canvasDrawing) return;
    const p = getP(e);
    canvasCtx.strokeStyle = canvasColor;
    canvasCtx.lineWidth = canvasLineWidth;
    canvasCtx.lineTo(p.x, p.y);
    canvasCtx.stroke();
  };
  window.onmouseup = () => { canvasDrawing = false; };

  canvas.ontouchstart = (e) => {
    canvasDrawing = true;
    const p = getP(e);
    canvasCtx.beginPath();
    canvasCtx.moveTo(p.x, p.y);
  };
  canvas.ontouchmove = (e) => {
    if (!canvasDrawing) return;
    e.preventDefault();
    const p = getP(e);
    canvasCtx.strokeStyle = canvasColor;
    canvasCtx.lineWidth = canvasLineWidth;
    canvasCtx.lineTo(p.x, p.y);
    canvasCtx.stroke();
  };
  window.ontouchend = () => { canvasDrawing = false; };
}

window.setPenColor = function(c) {
  canvasColor = c;
  canvasLineWidth = 3;
  if (canvasCtx) canvasCtx.globalCompositeOperation = "source-over";
};

window.setPenEraser = function() {
  canvasLineWidth = 18;
  if (canvasCtx) canvasCtx.globalCompositeOperation = "destination-out";
};

window.clearBookCanvas = function() {
  const canvas = document.getElementById("pageDoodleCanvas");
  if (canvas && canvasCtx) {
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
  }
};

window.downloadBookCanvas = function() {
  const canvas = document.getElementById("pageDoodleCanvas");
  if (!canvas) return;
  const exp = document.createElement("canvas");
  exp.width = canvas.width;
  exp.height = canvas.height;
  const expCtx = exp.getContext("2d");
  expCtx.fillStyle = "#ffffff";
  expCtx.fillRect(0, 0, exp.width, exp.height);
  expCtx.drawImage(canvas, 0, 0);

  const a = document.createElement("a");
  a.download = `麗園國小塗鴉留念_${Date.now()}.png`;
  a.href = exp.toDataURL("image/png");
  a.click();
};

function renderBookNotesWall() {
  const container = document.getElementById("bookNotesWall");
  if (!container) return;
  const defaultNotes = [
    { author: "六年一班 小宇", text: "希望這三天都是大晴天！斷軌雲霄飛車我來了！🎢" },
    { author: "六年二班 雅婷", text: "期待和大家在鹿港老街吃牛舌餅與麵線糊！😋" },
    { author: "六年級導師", text: "出門在外注意安全，小組同行彼此守望照顧！❤️" }
  ];
  const notes = JSON.parse(localStorage.getItem("ly_book_notes") || JSON.stringify(defaultNotes));
  container.innerHTML = "";
  notes.forEach(n => {
    const card = document.createElement("div");
    card.style.background = "#fef08a";
    card.style.borderRadius = "8px";
    card.style.padding = "10px 12px";
    card.style.fontSize = "0.85rem";
    card.style.color = "#713f12";
    card.style.boxShadow = "0 2px 6px rgba(0,0,0,0.06)";
    card.innerHTML = `<b>📌 ${n.author}</b><div style="margin-top:4px; line-height:1.5;">${n.text}</div>`;
    container.appendChild(card);
  });
}

window.addBookNote = function() {
  const authorEl = document.getElementById("bm_author");
  const msgEl = document.getElementById("bm_msg");
  if (!msgEl || !msgEl.value.trim()) return;

  const notes = JSON.parse(localStorage.getItem("ly_book_notes") || "[]");
  notes.unshift({
    author: (authorEl && authorEl.value.trim()) || "麗園同學",
    text: msgEl.value.trim()
  });
  localStorage.setItem("ly_book_notes", JSON.stringify(notes));
  msgEl.value = "";
  renderBookNotesWall();
};
