// 新北市林口區麗園國民小學 115學年度六年級戶外教育參觀活動 電子手冊互動核心
document.addEventListener("DOMContentLoaded", () => {
  initCountdown();
  initStudentPass();
  initDayTabs();
  initChecklist();
  initQuizzes();
  initDoodleCanvas();
  initGuestbookNotes();
  initViewModeToggle();
  initFlipbook();
  initGlobalSearch();
});

/* --------------------------------------------------------------------------
   1. 出發倒數計時器 (民國115年11月25日 06:30 = 西元2026年11月25日 06:30:00)
   -------------------------------------------------------------------------- */
function initCountdown() {
  const targetDate = new Date("2026-11-25T06:30:00+08:00").getTime();
  const daysEl = document.getElementById("cdDays");
  const hoursEl = document.getElementById("cdHours");
  const minsEl = document.getElementById("cdMins");
  const secsEl = document.getElementById("cdSecs");

  function update() {
    const now = new Date().getTime();
    const diff = targetDate - now;

    if (diff <= 0) {
      if (daysEl) daysEl.textContent = "0";
      if (hoursEl) hoursEl.textContent = "0";
      if (minsEl) minsEl.textContent = "0";
      if (secsEl) secsEl.textContent = "0";
      return;
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    if (daysEl) daysEl.textContent = d;
    if (hoursEl) hoursEl.textContent = String(h).padStart(2, "0");
    if (minsEl) minsEl.textContent = String(m).padStart(2, "0");
    if (secsEl) secsEl.textContent = String(s).padStart(2, "0");
  }

  update();
  setInterval(update, 1000);
}

/* --------------------------------------------------------------------------
   2. 學生個人名牌數位卡 (LocalStorage 保存)
   -------------------------------------------------------------------------- */
function initStudentPass() {
  const fields = [
    "studentName", "studentClass", "studentBlood",
    "studentPhoneParent", "studentPhoneTeacher",
    "studentBusNo", "studentRoomPuli", "studentRoomLihpao", "studentTableNo"
  ];

  // Load saved data
  fields.forEach(f => {
    const el = document.getElementById(f);
    if (el) {
      const saved = localStorage.getItem("ly_pass_" + f);
      if (saved) el.value = saved;
      el.addEventListener("input", () => {
        localStorage.setItem("ly_pass_" + f, el.value);
        updatePassWelcome();
      });
    }
  });

  const saveBtn = document.getElementById("btnSavePass");
  if (saveBtn) {
    saveBtn.addEventListener("click", () => {
      alert("✅ 個人資料已成功儲存在此裝置！旅途中隨時可在此查看。");
      updatePassWelcome();
    });
  }

  const printBtn = document.getElementById("btnPrintPass");
  if (printBtn) {
    printBtn.addEventListener("click", () => {
      window.print();
    });
  }

  updatePassWelcome();
}

function updatePassWelcome() {
  const nameEl = document.getElementById("studentName");
  const classEl = document.getElementById("studentClass");
  const welcomeEl = document.getElementById("passWelcomeText");
  if (welcomeEl && nameEl) {
    const name = nameEl.value.trim();
    const cls = classEl ? classEl.value.trim() : "";
    if (name) {
      welcomeEl.textContent = `👋 你好！${cls ? cls + " " : ""}${name} 同學的專屬戶外教育手冊`;
    } else {
      welcomeEl.textContent = "🎒 填寫下方個人資料，建立你的個人專屬電子證件卡！";
    }
  }
}

/* --------------------------------------------------------------------------
   3. 三日行程頁籤切換
   -------------------------------------------------------------------------- */
function initDayTabs() {
  const tabs = document.querySelectorAll(".day-tab-btn");
  const dayContents = document.querySelectorAll(".day-timeline-content");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const targetDay = tab.getAttribute("data-day");
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      dayContents.forEach(c => {
        if (c.getAttribute("data-day") === targetDay) {
          c.style.display = "block";
        } else {
          c.style.display = "none";
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   4. 行李打包清單 (可打勾、動態新增、進度條)
   -------------------------------------------------------------------------- */
function initChecklist() {
  const container = document.getElementById("checklistItemsWrapper");
  if (!container) return;

  const defaultItems = [
    { id: "c_hb", cat: "隨身背包", name: "活動手冊（本電子手冊或紙本）", req: true },
    { id: "c_ic", cat: "隨身背包", name: "健保卡 (務必隨身攜帶！)", req: true },
    { id: "c_chop", cat: "隨身背包", name: "環保餐具 / 環保筷 (本次旅程皆不提供免洗餐具)", req: true },
    { id: "c_cup", cat: "隨身背包", name: "環保水壺 (旅程不主動提供瓶裝水)", req: true },
    { id: "c_rain", cat: "隨身背包", name: "雨具 (環保雨衣或折疊傘)", req: true },
    { id: "c_mask", cat: "隨身背包", name: "備用口罩", req: false },
    { id: "c_pen", cat: "隨身背包", name: "筆、筆記本", req: false },
    { id: "c_tissue", cat: "隨身背包", name: "面紙 / 濕紙巾", req: false },
    { id: "c_money", cat: "隨身背包", name: "零用錢錢包 (請勿攜帶過多金錢)", req: false },
    { id: "c_sanitary", cat: "隨身背包", name: "個人生理衛生用品 (女生)", req: false },
    { id: "c_med", cat: "隨身背包", name: "備用個人藥品 (如暈車藥、防蚊液)", req: true },
    
    { id: "c_cloth_d2", cat: "行李袋/行李箱", name: "第二天班服", req: true },
    { id: "c_cloth_d3", cat: "行李袋/行李箱", name: "第三天運動服", req: true },
    { id: "c_jacket", cat: "行李袋/行李箱", name: "保暖禦寒外套 (早晚溫差大)", req: true },
    { id: "c_underwear", cat: "行李袋/行李箱", name: "換洗內衣褲 (2~3套)", req: true },
    { id: "c_pajamas", cat: "行李袋/行李箱", name: "睡衣、睡褲", req: false },
    { id: "c_dirty_bag", cat: "行李袋/行李箱", name: "換洗髒衣袋", req: false },
    { id: "c_slippers", cat: "行李袋/行李箱", name: "室內拖鞋", req: false },
    { id: "c_toiletries", cat: "行李袋/行李箱", name: "盥洗用具 (牙刷、牙膏自備，減塑飯店不提供)", req: true }
  ];

  let items = JSON.parse(localStorage.getItem("ly_checklist_items")) || defaultItems;
  let checks = JSON.parse(localStorage.getItem("ly_checklist_state")) || {};

  function render() {
    container.innerHTML = "";
    const backpackItems = items.filter(it => it.cat === "隨身背包");
    const luggageItems = items.filter(it => it.cat.includes("行李"));

    const makeGroup = (title, icon, list) => {
      const col = document.createElement("div");
      col.className = "checklist-col";
      col.innerHTML = `<h4 class="check-category-title"><span>${icon}</span> ${title}</h4>`;
      list.forEach(item => {
        const checked = !!checks[item.id];
        const label = document.createElement("label");
        label.className = `check-item ${checked ? "done" : ""}`;
        label.innerHTML = `
          <input type="checkbox" data-id="${item.id}" ${checked ? "checked" : ""}>
          <span>${item.name}</span>
          ${item.req ? '<span class="badge badge-orange" style="margin-left:auto;font-size:0.68rem;">必帶</span>' : ""}
        `;
        const cb = label.querySelector("input");
        cb.addEventListener("change", (e) => {
          checks[item.id] = e.target.checked;
          localStorage.setItem("ly_checklist_state", JSON.stringify(checks));
          render();
        });
        col.appendChild(label);
      });
      return col;
    };

    container.appendChild(makeGroup("隨身背包（貴重與常用品）", "🎒", backpackItems));
    container.appendChild(makeGroup("行李箱 / 行李袋（換洗衣物）", "🧳", luggageItems));

    // Update Progress
    const total = items.length;
    const done = items.filter(it => checks[it.id]).length;
    const pct = total === 0 ? 0 : Math.round((done / total) * 100);
    const progressFill = document.getElementById("checkProgressFill");
    const progressText = document.getElementById("checkProgressText");
    if (progressFill) progressFill.style.width = pct + "%";
    if (progressText) progressText.textContent = `已準備 ${done} / ${total} 項 (${pct}%)`;
  }

  // Add custom item
  const addBtn = document.getElementById("btnAddCustomItem");
  const inputEl = document.getElementById("customItemInput");
  const selectCat = document.getElementById("customItemCat");
  if (addBtn && inputEl) {
    addBtn.addEventListener("click", () => {
      const text = inputEl.value.trim();
      if (!text) return;
      const newItem = {
        id: "custom_" + Date.now(),
        cat: selectCat ? selectCat.value : "隨身背包",
        name: text,
        req: false
      };
      items.push(newItem);
      localStorage.setItem("ly_checklist_items", JSON.stringify(items));
      inputEl.value = "";
      render();
    });
  }

  // Reset Checklist
  const resetBtn = document.getElementById("btnResetChecklist");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      if (confirm("確定要重設為預設清單並清除勾選紀錄嗎？")) {
        items = defaultItems;
        checks = {};
        localStorage.removeItem("ly_checklist_items");
        localStorage.removeItem("ly_checklist_state");
        render();
      }
    });
  }

  render();
}

/* --------------------------------------------------------------------------
   5. 互動學習單核心 (921、鹿港、麗寶探索樂園)
   -------------------------------------------------------------------------- */
function initQuizzes() {
  if (typeof quizData === "undefined") return;

  // 1. Tab switching
  const tabs = document.querySelectorAll(".quiz-tab-btn");
  const containers = document.querySelectorAll(".quiz-panel");
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      const target = tab.getAttribute("data-quiz");
      containers.forEach(c => {
        if (c.getAttribute("data-quiz") === target) {
          c.style.display = "block";
        } else {
          c.style.display = "none";
        }
      });
    });
  });

  // Render 921 Quiz
  renderEarthquakeQuiz();

  // Render Lukang Quiz
  renderLukangQuiz();

  // Render Lihpao Quiz
  renderLihpaoQuiz();
}

function renderEarthquakeQuiz() {
  const container = document.getElementById("quizEarthquakeContent");
  if (!container) return;

  const data = quizData.earthquake;
  let html = `
    <div class="quiz-item">
      <div class="quiz-question-title">${data.causes.question}</div>
      <div class="quiz-options-group">
  `;

  data.causes.options.forEach((opt, idx) => {
    html += `
      <label class="quiz-option-label" id="eq_cause_lbl_${idx}">
        <input type="checkbox" name="eq_cause" value="${idx}">
        <span>${opt.text}</span>
      </label>
    `;
  });
  html += `
      </div>
      <div class="quiz-explanation-box" id="eq_cause_exp"></div>
    </div>
    
    <div class="quiz-item">
      <div class="quiz-question-title">二、是非題（請判斷下列敘述是否正確）：</div>
  `;

  data.trueFalse.forEach((item, idx) => {
    html += `
      <div style="margin-bottom: 16px;">
        <div style="font-weight: 600; margin-bottom: 6px; font-size: 0.95rem;">${item.q}</div>
        <div style="display:flex; gap:16px; margin-left: 12px;">
          <label class="quiz-option-label" id="eq_tf_${idx}_true" style="padding: 4px 14px;">
            <input type="radio" name="eq_tf_${idx}" value="true"> ○ 正確
          </label>
          <label class="quiz-option-label" id="eq_tf_${idx}_false" style="padding: 4px 14px;">
            <input type="radio" name="eq_tf_${idx}" value="false"> ╳ 錯誤
          </label>
        </div>
        <div class="quiz-explanation-box" id="eq_tf_exp_${idx}"></div>
      </div>
    `;
  });

  html += `
    </div>
    <div class="quiz-item">
      <div class="quiz-question-title">三、參觀心得分享：參觀「921 地震教育園區」後，寫下你對這次參觀最深刻的感想！</div>
      <textarea id="eqThoughts" rows="4" style="width: 100%; border: 1px solid var(--border-subtle); border-radius: 8px; padding: 12px; font-family: inherit; font-size: 0.9rem;" placeholder="寫下你的心得、防震常識感想或想對救災英雄說的話..."></textarea>
    </div>
    <div style="text-align: right; margin-top: 16px;">
      <button class="btn-primary" id="btnSubmitEqQuiz">📝 送出並批改 921 學習單</button>
    </div>
    <div class="quiz-score-banner" id="eqScoreBanner"></div>
  `;

  container.innerHTML = html;

  // Grade button
  document.getElementById("btnSubmitEqQuiz").addEventListener("click", () => {
    let score = 0;
    let totalQuestions = 1 + data.trueFalse.length;

    // Causes (plate movement + volcanic)
    const selectedCauses = Array.from(document.querySelectorAll("input[name='eq_cause']:checked")).map(el => parseInt(el.value));
    const isCauseCorrect = selectedCauses.includes(2) && selectedCauses.includes(3) && selectedCauses.length === 2;
    const causeExp = document.getElementById("eq_cause_exp");
    causeExp.style.display = "block";
    if (isCauseCorrect) {
      score++;
      causeExp.innerHTML = "🎉 <b>太棒了！全對！</b> 地震的科學成因主要是「板塊運動」與「火山活動」，鯰魚與地牛則是生動的民間神話！";
    } else {
      causeExp.innerHTML = "💡 <b>解析：</b> 地球科學中，地震主因為<b>「板塊運動」</b>與<b>「火山活動」</b>。鯰魚游動、地牛翻身為民間神話傳奇，神明生氣則為古代民俗解讀喔！";
    }

    // True / False
    data.trueFalse.forEach((item, idx) => {
      const selected = document.querySelector(`input[name='eq_tf_${idx}']:checked`);
      const expEl = document.getElementById(`eq_tf_exp_${idx}`);
      expEl.style.display = "block";
      const lblTrue = document.getElementById(`eq_tf_${idx}_true`);
      const lblFalse = document.getElementById(`eq_tf_${idx}_false`);

      lblTrue.classList.remove("is-correct", "is-wrong");
      lblFalse.classList.remove("is-correct", "is-wrong");

      const correctVal = item.correct;
      if (correctVal) {
        lblTrue.classList.add("is-correct");
      } else {
        lblFalse.classList.add("is-correct");
      }

      if (selected && (selected.value === "true") === correctVal) {
        score++;
        expEl.innerHTML = `✅ <b>回答正確！</b> ${item.explanation}`;
      } else {
        if (selected) {
          const wrongLbl = selected.value === "true" ? lblTrue : lblFalse;
          wrongLbl.classList.add("is-wrong");
        }
        expEl.innerHTML = `❌ <b>回答有誤！</b> ${item.explanation}`;
      }
    });

    // Score Banner
    const banner = document.getElementById("eqScoreBanner");
    banner.style.display = "flex";
    banner.innerHTML = `
      <div>
        <h3 style="color:#1e40af; font-size:1.15rem; margin-bottom:4px;">🎖️ 921學習單測驗結果：${score} / ${totalQuestions} 題正確！</h3>
        <p style="font-size:0.85rem; color:#3b82f6;">${score === totalQuestions ? "完美通關！你是防災與地質小博士！🌟" : "很棒的嘗試！仔細查看解析更能融會貫通喔！"}</p>
      </div>
      <button class="btn-secondary" onclick="window.print()">🖨️ 列印學習單</button>
    `;
  });
}

function renderLukangQuiz() {
  const container = document.getElementById("quizLukangContent");
  if (!container) return;

  const data = quizData.lukang;
  let html = `
    <div class="quiz-item">
      <div class="quiz-question-title">一、選擇題：</div>
  `;

  data.multipleChoice.forEach((item, idx) => {
    html += `
      <div style="margin-bottom: 20px;">
        <div style="font-weight: 600; margin-bottom: 8px; font-size: 0.95rem;">${item.q}</div>
        <div class="quiz-options-group">
    `;
    item.options.forEach((opt, oIdx) => {
      html += `
        <label class="quiz-option-label" id="lk_mc_${idx}_lbl_${oIdx}">
          <input type="radio" name="lk_mc_${idx}" value="${oIdx}">
          <span>(${oIdx + 1}) ${opt}</span>
        </label>
      `;
    });
    html += `
        </div>
        <div class="quiz-explanation-box" id="lk_mc_exp_${idx}"></div>
      </div>
    `;
  });

  html += `
    </div>
    <div class="quiz-item">
      <div class="quiz-question-title">二、古蹟配合題：在鹿港進行古蹟巡禮之後，考考大家對這些古蹟還記得多少！請選出相應的古蹟名稱：</div>
      <div style="margin-bottom: 14px; font-size: 0.85rem; color: var(--text-muted);">
        選項代號：<b>[A] 天后宮</b> ｜ <b>[B] 隘門</b> ｜ <b>[C] 餓鬼埕</b> ｜ <b>[D] 新祖宮</b> ｜ <b>[E] 半邊井</b>
      </div>
  `;

  data.matching.forEach((item, idx) => {
    html += `
      <div class="matching-row">
        <div>
          <b>${idx + 1}.</b> ${item.desc}
        </div>
        <div>
          <select class="matching-select" id="lk_match_${idx}">
            <option value="">-- 請選擇對應古蹟 --</option>
            <option value="A">○A 天后宮</option>
            <option value="B">○B 隘門</option>
            <option value="C">○C 餓鬼埕</option>
            <option value="D">○D 新祖宮</option>
            <option value="E">○E 半邊井</option>
          </select>
        </div>
        <div class="quiz-explanation-box" id="lk_match_exp_${idx}" style="grid-column: 1 / -1;"></div>
      </div>
    `;
  });

  html += `
    </div>
    <div style="text-align: right; margin-top: 16px;">
      <button class="btn-primary" id="btnSubmitLkQuiz">📝 送出並批改 鹿港老街學習單</button>
    </div>
    <div class="quiz-score-banner" id="lkScoreBanner"></div>
  `;

  container.innerHTML = html;

  // Grade Lukang Quiz
  document.getElementById("btnSubmitLkQuiz").addEventListener("click", () => {
    let score = 0;
    let totalQuestions = data.multipleChoice.length + data.matching.length;

    // MC
    data.multipleChoice.forEach((item, idx) => {
      const selected = document.querySelector(`input[name='lk_mc_${idx}']:checked`);
      const expEl = document.getElementById(`lk_mc_exp_${idx}`);
      expEl.style.display = "block";

      item.options.forEach((_, oIdx) => {
        const lbl = document.getElementById(`lk_mc_${idx}_lbl_${oIdx}`);
        lbl.classList.remove("is-correct", "is-wrong");
        if (oIdx === item.correct) lbl.classList.add("is-correct");
      });

      if (selected && parseInt(selected.value) === item.correct) {
        score++;
        expEl.innerHTML = `✅ <b>答對了！</b> ${item.explanation}`;
      } else {
        if (selected) {
          document.getElementById(`lk_mc_${idx}_lbl_${selected.value}`).classList.add("is-wrong");
        }
        expEl.innerHTML = `❌ <b>回答有誤！</b> 正確答案為 (${item.correct + 1})。${item.explanation}`;
      }
    });

    // Matching
    data.matching.forEach((item, idx) => {
      const sel = document.getElementById(`lk_match_${idx}`);
      const expEl = document.getElementById(`lk_match_exp_${idx}`);
      expEl.style.display = "block";

      if (sel.value === item.target) {
        score++;
        sel.style.borderColor = "#22c55e";
        sel.style.background = "#f0fdf4";
        expEl.innerHTML = `✅ <b>配對正確！【${item.name}】</b> ${item.note}`;
      } else {
        sel.style.borderColor = "#ef4444";
        sel.style.background = "#fef2f2";
        expEl.innerHTML = `❌ <b>配對錯誤！</b> 正確解答為 <b>【${item.target} ${item.name}】</b>。${item.note}`;
      }
    });

    // Score Banner
    const banner = document.getElementById("lkScoreBanner");
    banner.style.display = "flex";
    banner.innerHTML = `
      <div>
        <h3 style="color:#1e40af; font-size:1.15rem; margin-bottom:4px;">🎖️ 鹿港古蹟學習單測驗結果：${score} / ${totalQuestions} 題正確！</h3>
        <p style="font-size:0.85rem; color:#3b82f6;">${score === totalQuestions ? "太厲害了！鹿港歷史小狀元！💯" : "很精彩的作答！鹿港古蹟背後的人文故事值得細細回味！"}</p>
      </div>
      <button class="btn-secondary" onclick="window.print()">🖨️ 列印學習單</button>
    `;
  });
}

function renderLihpaoQuiz() {
  const container = document.getElementById("quizLihpaoContent");
  if (!container) return;

  const data = quizData.lihpao;
  let html = `
    <div style="background:#eff6ff; padding:12px 16px; border-radius:8px; margin-bottom:20px; font-size:0.88rem; color:#1e40af;">
      🎢 <b>親愛的同學：</b> 你今天總共玩了多少遊樂設施呢？設施中的科學與人文小知識記得把它記下來，一起動動腦挑戰以下 10 道趣味知識題吧！
    </div>
  `;

  data.questions.forEach((item, idx) => {
    html += `
      <div class="quiz-item" style="margin-bottom: 20px;">
        <div class="quiz-question-title">${item.q}</div>
        <div class="quiz-options-group">
    `;
    item.options.forEach((opt, oIdx) => {
      html += `
        <label class="quiz-option-label" id="lp_lbl_${idx}_${oIdx}">
          <input type="radio" name="lp_q_${idx}" value="${oIdx}">
          <span>(${oIdx + 1}) ${opt}</span>
        </label>
      `;
    });
    html += `
        </div>
        <div class="quiz-explanation-box" id="lp_exp_${idx}"></div>
      </div>
    `;
  });

  html += `
    <div style="text-align: right; margin-top: 16px;">
      <button class="btn-primary" id="btnSubmitLpQuiz">📝 送出並批改 麗寶樂園學習單</button>
    </div>
    <div class="quiz-score-banner" id="lpScoreBanner"></div>
  `;

  container.innerHTML = html;

  // Grade Lihpao Quiz
  document.getElementById("btnSubmitLpQuiz").addEventListener("click", () => {
    let score = 0;
    let totalQuestions = data.questions.length;

    data.questions.forEach((item, idx) => {
      const selected = document.querySelector(`input[name='lp_q_${idx}']:checked`);
      const expEl = document.getElementById(`lp_exp_${idx}`);
      expEl.style.display = "block";

      item.options.forEach((_, oIdx) => {
        const lbl = document.getElementById(`lp_lbl_${idx}_${oIdx}`);
        lbl.classList.remove("is-correct", "is-wrong");
        if (oIdx === item.correct) lbl.classList.add("is-correct");
      });

      if (selected && parseInt(selected.value) === item.correct) {
        score++;
        expEl.innerHTML = `✅ <b>答對了！</b> ${item.explanation}`;
      } else {
        if (selected) {
          document.getElementById(`lp_lbl_${idx}_${selected.value}`).classList.add("is-wrong");
        }
        expEl.innerHTML = `❌ <b>回答有誤！</b> 正確答案為 (${item.correct + 1})。${item.explanation}`;
      }
    });

    // Score Banner
    const banner = document.getElementById("lpScoreBanner");
    banner.style.display = "flex";
    banner.innerHTML = `
      <div>
        <h3 style="color:#1e40af; font-size:1.15rem; margin-bottom:4px;">🎡 麗寶樂園學習單測驗結果：${score} / ${totalQuestions} 題正確！</h3>
        <p style="font-size:0.85rem; color:#3b82f6;">${score >= 8 ? "恭喜你！榮獲探索樂園知識大師徽章！🏆" : "表現很棒！很多設施背後的物理與機械原理很有趣吧！"}</p>
      </div>
      <button class="btn-secondary" onclick="window.print()">🖨️ 列印學習單</button>
    `;
  });
}

/* --------------------------------------------------------------------------
   6. 塗鴉板 (Canvas Doodle Pad)
   -------------------------------------------------------------------------- */
function initDoodleCanvas() {
  const canvas = document.getElementById("doodleCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let drawing = false;
  let currentColor = "#f97316";
  let currentWidth = 3;

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    if (canvas.width !== rect.width || canvas.height !== rect.height) {
      const tempImg = ctx.getImageData(0, 0, canvas.width, canvas.height);
      canvas.width = rect.width;
      canvas.height = rect.height;
      ctx.putImageData(tempImg, 0, 0);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
    }
  }

  window.addEventListener("resize", resizeCanvas);
  setTimeout(resizeCanvas, 200);

  function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height)
    };
  }

  function start(e) {
    e.preventDefault();
    drawing = true;
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  }

  function move(e) {
    if (!drawing) return;
    e.preventDefault();
    const pos = getPos(e);
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = currentWidth;
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  }

  function end() {
    drawing = false;
  }

  canvas.addEventListener("mousedown", start);
  canvas.addEventListener("mousemove", move);
  window.addEventListener("mouseup", end);

  canvas.addEventListener("touchstart", start, { passive: false });
  canvas.addEventListener("touchmove", move, { passive: false });
  window.addEventListener("touchend", end);

  // Color Swatches
  document.querySelectorAll(".color-swatch").forEach(swatch => {
    swatch.addEventListener("click", () => {
      document.querySelectorAll(".color-swatch").forEach(s => s.classList.remove("active"));
      swatch.classList.add("active");
      currentColor = swatch.getAttribute("data-color");
      if (currentColor === "eraser") {
        ctx.globalCompositeOperation = "destination-out";
        currentWidth = 18;
      } else {
        ctx.globalCompositeOperation = "source-over";
        currentWidth = 3;
      }
    });
  });

  // Clear Canvas
  const clearBtn = document.getElementById("btnClearCanvas");
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      if (confirm("確定要清空畫布嗎？")) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    });
  }

  // Download Canvas
  const dlBtn = document.getElementById("btnDownloadCanvas");
  if (dlBtn) {
    dlBtn.addEventListener("click", () => {
      // Create a background-filled canvas for export
      const exportCanvas = document.createElement("canvas");
      exportCanvas.width = canvas.width;
      exportCanvas.height = canvas.height;
      const expCtx = exportCanvas.getContext("2d");
      expCtx.fillStyle = "#ffffff";
      expCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
      expCtx.drawImage(canvas, 0, 0);

      const link = document.createElement("a");
      link.download = `麗園國小畢業旅行塗鴉留念_${Date.now()}.png`;
      link.href = exportCanvas.toDataURL("image/png");
      link.click();
    });
  }
}

/* --------------------------------------------------------------------------
   7. 留言便利貼 (Guestbook Sticky Notes)
   -------------------------------------------------------------------------- */
function initGuestbookNotes() {
  const container = document.getElementById("guestbookNotesGrid");
  const addBtn = document.getElementById("btnAddNote");
  const authorInput = document.getElementById("noteAuthor");
  const textInput = document.getElementById("noteText");

  if (!container) return;

  const defaultNotes = [
    { author: "六年一班 小宇", text: "希望這三天都是大晴天！斷軌雲霄飛車我來了！🎢", time: "10/20" },
    { author: "六年二班 雅婷", text: "期待和大家在鹿港老街吃牛舌餅與麵線糊！😋", time: "10/20" },
    { author: "帶隊老師叮嚀", text: "大家出門在外一定要注意安全、小組同行彼此守望喔！❤️", time: "10/20" }
  ];

  let notes = JSON.parse(localStorage.getItem("ly_guestbook_notes")) || defaultNotes;

  function render() {
    container.innerHTML = "";
    notes.forEach((note, idx) => {
      const card = document.createElement("div");
      card.className = "guestbook-note";
      card.innerHTML = `
        <div style="font-weight: 700; margin-bottom: 6px; font-size:0.9rem;">📌 ${note.author}</div>
        <div style="font-size: 0.88rem; line-height: 1.5; margin-bottom: 8px;">${note.text}</div>
        <div style="font-size: 0.72rem; color: #9a3412; text-align: right;">${note.time}</div>
      `;
      container.appendChild(card);
    });
  }

  if (addBtn && textInput) {
    addBtn.addEventListener("click", () => {
      const text = textInput.value.trim();
      const author = authorInput.value.trim() || "麗園同學";
      if (!text) return;

      const dateStr = `${new Date().getMonth() + 1}/${new Date().getDate()}`;
      notes.unshift({ author, text, time: dateStr });
      localStorage.setItem("ly_guestbook_notes", JSON.stringify(notes));
      textInput.value = "";
      render();
    });
  }

  render();
}

/* --------------------------------------------------------------------------
   8. 雙閱覽模式切換 (數位互動 vs 原書高畫質翻頁)
   -------------------------------------------------------------------------- */
function initViewModeToggle() {
  const interactiveView = document.getElementById("interactiveView");
  const flipbookView = document.getElementById("flipbookView");
  const btnInteractive = document.getElementById("btnModeInteractive");
  const btnFlipbook = document.getElementById("btnModeFlipbook");

  if (!btnInteractive || !btnFlipbook) return;

  btnInteractive.addEventListener("click", () => {
    btnInteractive.classList.add("active");
    btnFlipbook.classList.remove("active");
    interactiveView.style.display = "block";
    flipbookView.style.display = "none";
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  btnFlipbook.addEventListener("click", () => {
    btnFlipbook.classList.add("active");
    btnInteractive.classList.remove("active");
    interactiveView.style.display = "none";
    flipbookView.style.display = "block";
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* --------------------------------------------------------------------------
   9. 高畫質原版手冊翻頁閱讀器
   -------------------------------------------------------------------------- */
function initFlipbook() {
  const imgEl = document.getElementById("flipbookImage");
  const pageSelect = document.getElementById("flipbookPageSelect");
  const prevBtn = document.getElementById("btnPrevPage");
  const nextBtn = document.getElementById("btnNextPage");
  const indicator = document.getElementById("flipbookIndicator");
  const toggleSpreadBtn = document.getElementById("btnToggleSpread");

  if (!imgEl || !pageSelect) return;

  let currentPage = 1;
  const totalPages = 24;
  let isSpreadMode = false;

  const pageTitles = [
    "封面：個人資料表", "實施計劃與注意事項",
    "第一至三天活動行程表", "出門前的叮嚀與退費規定",
    "外出旅遊攜帶物品選取表", "旅遊注意事項：行動與車上安全",
    "旅遊注意事項：住宿安全與禮儀", "護理篇與緊急救護常識",
    "921地震教育園區：緣起介紹", "921地震教育園區：展館設施",
    "林班道體驗工廠", "鹿港老街：古鎮巡禮",
    "鹿港老街：老街風貌與建築", "麗寶樂園渡假區介紹",
    "麗寶探索樂園：分區設施導覽", "921地震教育園區學習單",
    "鹿港老街學習單", "麗寶探索樂園學習單",
    "留言板 (一)", "留言板 (二)",
    "留言板 (三)", "晚點名貼心小叮嚀",
    "家長聯絡單 (電話與住宿表)", "行程表 (家長存查撕下聯)"
  ];

  // Populate Dropdown
  pageSelect.innerHTML = "";
  pageTitles.forEach((t, i) => {
    const opt = document.createElement("option");
    opt.value = i + 1;
    opt.textContent = `第 ${i + 1} 頁：${t}`;
    pageSelect.appendChild(opt);
  });

  function updateView() {
    if (isSpreadMode) {
      // 12 sheets
      const sheetIdx = Math.ceil(currentPage / 2);
      imgEl.src = `assets/images/sheet_${sheetIdx}.jpg`;
      indicator.textContent = `跨頁對開：第 ${(sheetIdx - 1) * 2 + 1} ~ ${sheetIdx * 2} 頁 / 共 24 頁`;
    } else {
      imgEl.src = `assets/images/p_${currentPage}.jpg`;
      indicator.textContent = `第 ${currentPage} 頁 / 共 ${totalPages} 頁`;
    }
    pageSelect.value = currentPage;

    prevBtn.disabled = isSpreadMode ? Math.ceil(currentPage / 2) <= 1 : currentPage <= 1;
    nextBtn.disabled = isSpreadMode ? Math.ceil(currentPage / 2) >= 12 : currentPage >= totalPages;
  }

  prevBtn.addEventListener("click", () => {
    if (isSpreadMode) {
      currentPage = Math.max(1, currentPage - 2);
    } else {
      currentPage = Math.max(1, currentPage - 1);
    }
    updateView();
  });

  nextBtn.addEventListener("click", () => {
    if (isSpreadMode) {
      currentPage = Math.min(totalPages, currentPage + 2);
    } else {
      currentPage = Math.min(totalPages, currentPage + 1);
    }
    updateView();
  });

  pageSelect.addEventListener("change", (e) => {
    currentPage = parseInt(e.target.value);
    updateView();
  });

  if (toggleSpreadBtn) {
    toggleSpreadBtn.addEventListener("click", () => {
      isSpreadMode = !isSpreadMode;
      toggleSpreadBtn.textContent = isSpreadMode ? "📖 切換為單頁閱讀" : "📑 切換為雙頁開本";
      updateView();
    });
  }

  updateView();
}

/* --------------------------------------------------------------------------
   10. 全站全文搜尋
   -------------------------------------------------------------------------- */
function initGlobalSearch() {
  const triggerBtn = document.getElementById("btnOpenSearch");
  const backdrop = document.getElementById("searchModalBackdrop");
  const closeBtn = document.getElementById("btnCloseSearch");
  const searchInput = document.getElementById("globalSearchInput");
  const resultsContainer = document.getElementById("searchResultsList");

  if (!triggerBtn || !backdrop || !searchInput) return;

  const searchDatabase = [
    { title: "集合時間與出發", snippet: "第一天 6:00~6:30 集合，7:00 準時出發，逾時交通自理", target: "#scheduleSection" },
    { title: "第一天行程（穿著便服）", snippet: "921地震教育園區 ➔ 林班道體驗工廠 ➔ 今埔里渡假大酒店", target: "#scheduleSection" },
    { title: "第二天行程（穿著班服）", snippet: "薰衣草森林九九峰 ➔ 鹿港老街 ➔ 青春晚會 ➔ 麗寶福容大飯店", target: "#scheduleSection" },
    { title: "第三天行程（穿著運動服）", snippet: "麗寶樂園探索世界（午餐必勝客個人套餐） ➔ 16:00 返抵學校", target: "#scheduleSection" },
    { title: "921地震教育園區", snippet: "車籠埔斷層保存館、影像館、地震工程館、防災館、重建記錄館", target: "#attractionsSection" },
    { title: "車埕林班道體驗工廠", snippet: "木工教室、特色小店、樂活倉庫、木茶房湖畔餐廳", target: "#attractionsSection" },
    { title: "鹿港老街古蹟巡禮", snippet: "天后宮、新祖宮、半邊井、隘門、餓鬼埕、不見天街典故", target: "#attractionsSection" },
    { title: "麗寶樂園遊樂設施", snippet: "搶救地心斷軌雲霄飛車、魔法森林、POPA歡樂王國、火山冒險", target: "#attractionsSection" },
    { title: "攜帶物品與行李清單", snippet: "健保卡、環保餐具、環保杯、個人換洗衣物、盥洗用具（牙刷牙膏自備）", target: "#checklistSection" },
    { title: "護理與暈車藥須知", snippet: "暈車藥自備並於開車前半小時服用；學校依法無法提供口服藥品", target: "#safetySection" },
    { title: "急救小常識（燙傷、出血、扭傷）", snippet: "灼燙傷沖冷水5-15分鐘；外傷加壓抬高；扭傷瘀腫冰敷休息", target: "#safetySection" },
    { title: "今埔里渡假大酒店", snippet: "地址：南投縣埔里鎮南興街79號 / 電話：(049)242-2088", target: "#contactsSection" },
    { title: "麗寶福容大飯店", snippet: "地址：台中市后里區福容路88號 / 電話：(04)2559-2888", target: "#contactsSection" },
    { title: "線上互動學習單", snippet: "921地震學習單、鹿港老街學習單、麗寶探索樂園學習單", target: "#quizSection" },
    { title: "晚點名叮嚀與飯店須知", snippet: "冷氣不低於25度、晚點名後禁止擅自離房、愛惜飯店公物", target: "#safetySection" }
  ];

  function openModal() {
    backdrop.style.display = "flex";
    searchInput.value = "";
    renderResults("");
    setTimeout(() => searchInput.focus(), 50);
  }

  function closeModal() {
    backdrop.style.display = "none";
  }

  function renderResults(q) {
    resultsContainer.innerHTML = "";
    const term = q.trim().toLowerCase();
    const filtered = term ? searchDatabase.filter(item => 
      item.title.toLowerCase().includes(term) || item.snippet.toLowerCase().includes(term)
    ) : searchDatabase.slice(0, 6);

    if (filtered.length === 0) {
      resultsContainer.innerHTML = `<div style="padding:20px; text-align:center; color:var(--text-muted);">查無符合「${q}」的內容</div>`;
      return;
    }

    filtered.forEach(item => {
      const el = document.createElement("div");
      el.className = "search-result-item";
      el.innerHTML = `
        <div class="item-title">🔍 ${item.title}</div>
        <div class="item-snippet">${item.snippet}</div>
      `;
      el.addEventListener("click", () => {
        closeModal();
        const targetEl = document.querySelector(item.target);
        if (targetEl) {
          // Switch to interactive view if currently in flipbook
          document.getElementById("btnModeInteractive").click();
          targetEl.scrollIntoView({ behavior: "smooth" });
          targetEl.style.transition = "outline 0.3s ease";
          targetEl.style.outline = "3px solid #f97316";
          setTimeout(() => targetEl.style.outline = "none", 1500);
        }
      });
      resultsContainer.appendChild(el);
    });
  }

  triggerBtn.addEventListener("click", openModal);
  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop) closeModal();
  });

  searchInput.addEventListener("input", (e) => {
    renderResults(e.target.value);
  });

  // Hotkey "/" to open search
  document.addEventListener("keydown", (e) => {
    if (e.key === "/" && document.activeElement.tagName !== "INPUT" && document.activeElement.tagName !== "TEXTAREA") {
      e.preventDefault();
      openModal();
    }
    if (e.key === "Escape" && backdrop.style.display === "flex") {
      closeModal();
    }
  });
}
