// 麗園國小 115學年度六年級戶外教育 - 教師專用學生房間表與查房點名系統
let currentSheetClass = "601";
let currentHotelId = 1; // 1: 今埔里渡假大酒店, 2: 麗寶福容大飯店
let activePatrolClassFilter = "all";
let patrolSearchQuery = "";

// 飯店資訊
const hotelInfo = {
  1: {
    name: "今埔里渡假大酒店",
    address: "南投縣埔里鎮南安路159號",
    tel: "049-2422088",
    storageKey: "ly_teacher_check_h1"
  },
  2: {
    name: "麗寶福容大飯店",
    address: "台中市后里區福容路88號",
    tel: "04-25592888",
    storageKey: "ly_teacher_check_h2"
  }
};

// ==========================================================================
// 【個資保護規範】：學生姓名去中字，以全形「Ｏ」代替
// ==========================================================================
function maskStudentName(name) {
  if (!name || typeof name !== "string") return "";
  const trimmed = name.trim();
  if (trimmed.length <= 1) return trimmed;
  // 若已經包含全形「Ｏ」或「○」「〇」「O」，則直接返回避免重複替換
  if (trimmed.includes("Ｏ") || trimmed.includes("○") || trimmed.includes("〇") || trimmed.includes("O")) {
    return trimmed;
  }
  // 兩個字：王明 -> 王Ｏ
  if (trimmed.length === 2) {
    return trimmed[0] + "Ｏ";
  }
  // 三個字：林小明 -> 林Ｏ明
  if (trimmed.length === 3) {
    return trimmed[0] + "Ｏ" + trimmed[2];
  }
  // 四個字（如複姓）：歐陽建豪 -> 歐陽Ｏ豪
  if (trimmed.length === 4) {
    return trimmed.slice(0, 2) + "Ｏ" + trimmed[3];
  }
  // 五個字以上：替換正中間字
  const mid = Math.floor(trimmed.length / 2);
  return trimmed.slice(0, mid) + "Ｏ" + trimmed.slice(mid + 1);
}

// 7 個班級初始資料結構 (各班男女生 1~25 號)
const initialClasses = ["601", "602", "603", "604", "605", "606", "607"];

function generateEmptySlots() {
  const arr = [];
  for (let i = 1; i <= 25; i++) {
    arr.push({ no: i, name: "", room1: "", room2: "", table: "" });
  }
  return arr;
}

function sanitizeSheetData(data) {
  if (!data) return data;
  Object.keys(data).forEach(c => {
    if (data[c] && data[c].boys) {
      data[c].boys.forEach(b => {
        if (b.name) b.name = maskStudentName(b.name);
      });
    }
    if (data[c] && data[c].girls) {
      data[c].girls.forEach(g => {
        if (g.name) g.name = maskStudentName(g.name);
      });
    }
  });
  return data;
}

function getInitialSheetData() {
  const saved = localStorage.getItem("ly_room_table_sheets");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      return sanitizeSheetData(parsed);
    } catch (e) {
      console.error(e);
    }
  }

  const data = {};
  initialClasses.forEach(c => {
    data[c] = {
      className: c,
      teacher: c === "601" ? "導師" : "",
      totalCount: c === "601" ? 28 : 0,
      boys: generateEmptySlots(),
      girls: generateEmptySlots()
    };
  });

  // 601 班置入範例資料方便預覽（中字以全形「Ｏ」代替）
  data["601"].boys[0] = { no: 1, name: "林Ｏ明", room1: "301", room2: "501", table: "1" };
  data["601"].boys[1] = { no: 2, name: "陳Ｏ偉", room1: "301", room2: "501", table: "1" };
  data["601"].boys[2] = { no: 3, name: "張Ｏ豪", room1: "301", room2: "501", table: "1" };
  data["601"].boys[3] = { no: 4, name: "黃Ｏ傑", room1: "301", room2: "501", table: "1" };

  data["601"].girls[0] = { no: 1, name: "李Ｏ婷", room1: "302", room2: "502", table: "2" };
  data["601"].girls[1] = { no: 2, name: "王Ｏ琪", room1: "302", room2: "502", table: "2" };
  data["601"].girls[2] = { no: 3, name: "周Ｏ雨", room1: "302", room2: "502", table: "2" };
  data["601"].girls[3] = { no: 4, name: "蔡Ｏ君", room1: "302", room2: "502", table: "2" };

  return data;
}

let sheetData = getInitialSheetData();

// 儲存的查房打勾狀態
let checkState = {
  1: JSON.parse(localStorage.getItem(hotelInfo[1].storageKey) || "{}"),
  2: JSON.parse(localStorage.getItem(hotelInfo[2].storageKey) || "{}")
};

// ==========================================================================
// 【關鍵實裝】：將「房桌號表 (查房表)」直接併入手冊第 25 頁（最後一頁）
// ==========================================================================
if (typeof pagesContent !== "undefined") {
  pagesContent.push({
    num: 25,
    title: "學生校外教學活動房桌號表 (查房表)",
    category: "住宿查房",
    render: () => renderSheetPageHtml()
  });
}

function renderSheetPageHtml() {
  return `
    <div class="sheet-page-container">
      <div class="page-title" style="margin-bottom:6px;">📋 麗園國小學生校外教學活動房桌號表</div>
      <div style="font-size:0.82rem; color:#64748b; margin-bottom:10px; font-weight:700;">
        🍎 教師專用頁面 · 第一晚：今埔里渡假大酒店 ｜ 第二晚：麗寶福容大飯店
      </div>

      <!-- 個資保護提示 -->
      <div style="background:#eff6ff; border:1px solid #bfdbfe; border-radius:6px; padding:6px 10px; margin-bottom:10px; font-size:0.78rem; color:#1e40af; display:flex; align-items:center; gap:6px;">
        <span>🔒</span>
        <span><b>個資保護規範：</b>學生姓名已依規定去中字並以全形「Ｏ」代替（如：林Ｏ明）。</span>
      </div>

      <!-- 切換班級工具列 -->
      <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px; margin-bottom:12px; background:#f1f5f9; padding:8px 12px; border-radius:8px; border:1px solid #e2e8f0;">
        <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
          <span style="font-size:0.82rem; font-weight:800; color:#334155;">選擇班級：</span>
          <div class="class-filter-chips" id="sheetClassTabsPage" style="display:inline-flex;"></div>
        </div>
        <div style="display:flex; align-items:center; gap:8px;">
          <span id="sheetSaveNoticePage" style="font-size:0.75rem; color:#059669; font-weight:700; opacity:0; transition:opacity 0.3s ease;">💾 已自動儲存</span>
          <button onclick="window.print()" style="background:#2563eb; color:white; border:none; padding:6px 14px; border-radius:6px; font-weight:700; font-size:0.8rem; cursor:pointer; box-shadow:0 2px 4px rgba(37,99,235,0.2);">🖨️ 列印此表</button>
        </div>
      </div>

      <!-- 表格主體 (完全比照實體單版面) -->
      <div class="sheet-container" style="border:1px solid #cbd5e1; padding:14px 10px; margin-bottom:20px;">
        
        <!-- 表格主標題 -->
        <div class="sheet-title-header">
          <div class="sheet-main-title">麗園國小學生校外教學活動房桌號表</div>
        </div>

        <!-- 班級、合計、導師 Meta 列 -->
        <div class="sheet-meta-bar" style="margin-bottom:12px; padding:8px 12px;">
          <div>
            <span>班級：</span>
            <span id="sheetDisplayClassPage" style="color:#2563eb; font-weight:800; font-size:1.05rem;">6年1班</span>
          </div>
          <div>
            <span>合計：</span>
            <input type="number" id="sheetInputTotalPage" class="sheet-meta-input" style="width:55px; text-align:center; font-size:1rem;" placeholder="人數" onchange="updateSheetMeta('totalCount', this.value)">
            <span>人</span>
          </div>
          <div>
            <span>導師：</span>
            <input type="text" id="sheetInputTeacherPage" class="sheet-meta-input" style="width:110px; font-size:1rem;" placeholder="填寫導師姓名" onchange="updateSheetMeta('teacher', this.value)">
          </div>
        </div>

        <!-- 雙大欄表格：左男生 (1~25)、右女生 (1~25) -->
        <div class="sheet-tables-wrap">
          
          <!-- 男生表格 -->
          <div class="table-box">
            <div class="table-box-header boys">👦 男生房桌號表 (編號 1 ~ 25)</div>
            <table class="room-sheet-table">
              <thead>
                <tr>
                  <th class="col-no">編號</th>
                  <th class="col-name">男生姓名</th>
                  <th class="col-room">第一晚<br>房號</th>
                  <th class="col-room">第二晚<br>房號</th>
                  <th class="col-table">桌號</th>
                </tr>
              </thead>
              <tbody id="sheetBoysTbodyPage"></tbody>
            </table>
          </div>

          <!-- 女生表格 -->
          <div class="table-box">
            <div class="table-box-header girls">👧 女生房桌號表 (編號 1 ~ 25)</div>
            <table class="room-sheet-table">
              <thead>
                <tr>
                  <th class="col-no">編號</th>
                  <th class="col-name">女生姓名</th>
                  <th class="col-room">第一晚<br>房號</th>
                  <th class="col-room">第二晚<br>房號</th>
                  <th class="col-table">桌號</th>
                </tr>
              </thead>
              <tbody id="sheetGirlsTbodyPage"></tbody>
            </table>
          </div>

        </div>

      </div>

      <!-- 夜間查房快速點名區塊 -->
      <div style="padding:16px; background:#fffbeb; border:2px solid #fde68a; border-radius:12px; margin-top:16px;">
        <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:10px; margin-bottom:12px;">
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-size:1.3rem;">🏨</span>
            <div>
              <b style="color:#92400e; font-size:0.95rem;">夜間查房點名系統（依房號即時勾選）</b>
              <p style="margin:2px 0 0; font-size:0.75rem; color:#b45309;">由上方房桌號表自動彙整房號，老師晚間巡房時可單手輕按標記已就寢。</p>
            </div>
          </div>
          <div class="hotel-tab-bar" style="background:#fef3c7; border:1px solid #fcd34d;">
            <button class="hotel-tab-btn active" id="tabHotel1Page" onclick="switchHotelPage(1)">第一晚：今埔里</button>
            <button class="hotel-tab-btn" id="tabHotel2Page" onclick="switchHotelPage(2)">第二晚：麗寶福容</button>
          </div>
        </div>

        <!-- 查房進度條 -->
        <div class="room-stats-card" style="border:1px solid #fef08a; border-radius:8px; margin-bottom:12px;">
          <div class="stats-text">
            <span>查房進度：<b id="checkedCountPage" style="color:#059669;">0</b> / <span id="totalRoomsCountPage">0</span> 間 (<span id="progressPctPage">0%</span>)</span>
            <button class="reset-stats-btn" onclick="resetCurrentHotelChecksPage()">🔄 重置打勾</button>
          </div>
          <div class="progress-bar-bg">
            <div class="progress-bar-fill" id="progressBarFillPage" style="width: 0%;"></div>
          </div>
        </div>

        <!-- 房間卡片網格 -->
        <div class="rooms-grid-scroll" id="roomsGridPage" style="max-height:480px; padding:4px 0 10px;"></div>
      </div>

    </div>
  `;
}

// 掛載動態元件
window.initSheetPageComponents = function() {
  renderSheetClassSelectorPage();
  renderRoomSheetTablePage();
  renderPatrolGridPage();
};

document.addEventListener("DOMContentLoaded", () => {
  // 頂部導覽列「📋 房桌號表」按鈕一鍵跳轉到最後一頁 (第25頁)
  const openBtn = document.getElementById("btnOpenRooms");
  if (openBtn) {
    openBtn.addEventListener("click", () => {
      if (typeof goToPage === "function") {
        goToPage(pagesContent.length);
      }
    });
  }

  // 若當前頁面恰好為最後一頁，進行渲染
  if (currentPage === 25) {
    initSheetPageComponents();
  }
});

/* --------------------------------------------------------------------------
   第 25 頁房桌號表互動
   -------------------------------------------------------------------------- */
function renderSheetClassSelectorPage() {
  const container = document.getElementById("sheetClassTabsPage");
  if (!container) return;

  container.innerHTML = initialClasses.map(c => `
    <button class="class-chip ${currentSheetClass === c ? "active" : ""}" onclick="selectSheetClassPage('${c}')">
      ${c} 班
    </button>
  `).join("");
}

window.selectSheetClassPage = function(c) {
  currentSheetClass = c;
  renderSheetClassSelectorPage();
  renderRoomSheetTablePage();
  renderPatrolGridPage();
};

function renderRoomSheetTablePage() {
  const cData = sheetData[currentSheetClass] || {
    className: currentSheetClass,
    teacher: "",
    totalCount: 0,
    boys: generateEmptySlots(),
    girls: generateEmptySlots()
  };

  const classDisplay = document.getElementById("sheetDisplayClassPage");
  const totalInput = document.getElementById("sheetInputTotalPage");
  const teacherInput = document.getElementById("sheetInputTeacherPage");

  if (classDisplay) classDisplay.textContent = `6年${currentSheetClass.replace("6", "")}班 (${currentSheetClass}班)`;
  if (totalInput) totalInput.value = cData.totalCount || "";
  if (teacherInput) teacherInput.value = cData.teacher || "";

  // 渲染男生 (1~25)，學生姓名去中字以全形「Ｏ」代替
  const boysTbody = document.getElementById("sheetBoysTbodyPage");
  if (boysTbody) {
    boysTbody.innerHTML = cData.boys.map((b, idx) => `
      <tr>
        <td class="col-no">${b.no}</td>
        <td class="col-name"><input type="text" value="${maskStudentName(b.name) || ""}" placeholder="姓名" onchange="updateStudentFieldPage('${currentSheetClass}', 'boys', ${idx}, 'name', this.value)"></td>
        <td class="col-room"><input type="text" value="${b.room1 || ""}" placeholder="房號" onchange="updateStudentFieldPage('${currentSheetClass}', 'boys', ${idx}, 'room1', this.value)"></td>
        <td class="col-room"><input type="text" value="${b.room2 || ""}" placeholder="房號" onchange="updateStudentFieldPage('${currentSheetClass}', 'boys', ${idx}, 'room2', this.value)"></td>
        <td class="col-table"><input type="text" value="${b.table || ""}" placeholder="桌" onchange="updateStudentFieldPage('${currentSheetClass}', 'boys', ${idx}, 'table', this.value)"></td>
      </tr>
    `).join("");
  }

  // 渲染女生 (1~25)，學生姓名去中字以全形「Ｏ」代替
  const girlsTbody = document.getElementById("sheetGirlsTbodyPage");
  if (girlsTbody) {
    girlsTbody.innerHTML = cData.girls.map((g, idx) => `
      <tr>
        <td class="col-no">${g.no}</td>
        <td class="col-name"><input type="text" value="${maskStudentName(g.name) || ""}" placeholder="姓名" onchange="updateStudentFieldPage('${currentSheetClass}', 'girls', ${idx}, 'name', this.value)"></td>
        <td class="col-room"><input type="text" value="${g.room1 || ""}" placeholder="房號" onchange="updateStudentFieldPage('${currentSheetClass}', 'girls', ${idx}, 'room1', this.value)"></td>
        <td class="col-room"><input type="text" value="${g.room2 || ""}" placeholder="房號" onchange="updateStudentFieldPage('${currentSheetClass}', 'girls', ${idx}, 'room2', this.value)"></td>
        <td class="col-table"><input type="text" value="${g.table || ""}" placeholder="桌" onchange="updateStudentFieldPage('${currentSheetClass}', 'girls', ${idx}, 'table', this.value)"></td>
      </tr>
    `).join("");
  }
}

window.updateStudentFieldPage = function(className, gender, idx, field, value) {
  if (!sheetData[className]) return;
  let finalVal = value.trim();
  // 姓名欄位自動去中字替換為「Ｏ」
  if (field === "name" && finalVal) {
    finalVal = maskStudentName(finalVal);
  }
  sheetData[className][gender][idx][field] = finalVal;
  saveSheetDataPage();
  renderRoomSheetTablePage();
};

window.updateSheetMeta = function(field, value) {
  if (!sheetData[currentSheetClass]) return;
  sheetData[currentSheetClass][field] = value.trim();
  saveSheetDataPage();
};

function saveSheetDataPage() {
  localStorage.setItem("ly_room_table_sheets", JSON.stringify(sheetData));
  const saveNotice = document.getElementById("sheetSaveNoticePage");
  if (saveNotice) {
    saveNotice.style.opacity = "1";
    setTimeout(() => { saveNotice.style.opacity = "0"; }, 1500);
  }
  renderPatrolGridPage();
}

/* --------------------------------------------------------------------------
   第 25 頁夜間查房點名系統
   -------------------------------------------------------------------------- */
function getPatrolRoomsForPage(hotelNum) {
  const roomMap = {};
  const roomField = hotelNum === 1 ? "room1" : "room2";

  Object.keys(sheetData).forEach(cKey => {
    const cObj = sheetData[cKey];
    [...cObj.boys, ...cObj.girls].forEach(st => {
      const rm = st[roomField] ? st[roomField].trim() : "";
      if (rm && st.name) {
        if (!roomMap[rm]) {
          roomMap[rm] = {
            id: `h${hotelNum}_${rm}`,
            room: rm,
            class: cKey,
            type: "四人房",
            students: [],
            note: ""
          };
        }
        roomMap[rm].students.push(maskStudentName(st.name));
      }
    });
  });

  const list = Object.values(roomMap);
  if (list.length === 0) {
    return [
      { id: `h${hotelNum}_301`, room: "301", class: "601", type: "四人房", students: ["林Ｏ明", "陳Ｏ偉", "張Ｏ豪", "黃Ｏ傑"], note: "" },
      { id: `h${hotelNum}_302`, room: "302", class: "601", type: "四人房", students: ["李Ｏ婷", "王Ｏ琪", "周Ｏ雨", "蔡Ｏ君"], note: "" }
    ];
  }
  return list.sort((a, b) => a.room.localeCompare(b.room, undefined, { numeric: true }));
}

window.switchHotelPage = function(hotelId) {
  currentHotelId = hotelId;
  const t1 = document.getElementById("tabHotel1Page");
  const t2 = document.getElementById("tabHotel2Page");
  if (t1) t1.classList.toggle("active", hotelId === 1);
  if (t2) t2.classList.toggle("active", hotelId === 2);
  renderPatrolGridPage();
};

function renderPatrolGridPage() {
  const grid = document.getElementById("roomsGridPage");
  if (!grid) return;

  const allRooms = getPatrolRoomsForPage(currentHotelId);
  const hotelChecks = checkState[currentHotelId] || {};

  const totalCount = allRooms.length;
  const checkedCount = allRooms.filter(r => (hotelChecks[r.id] && hotelChecks[r.id].status === "checked")).length;
  const pct = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0;

  const countEl = document.getElementById("checkedCountPage");
  const totalEl = document.getElementById("totalRoomsCountPage");
  const pctEl = document.getElementById("progressPctPage");
  const barEl = document.getElementById("progressBarFillPage");

  if (countEl) countEl.textContent = checkedCount;
  if (totalEl) totalEl.textContent = totalCount;
  if (pctEl) pctEl.textContent = `${pct}%`;
  if (barEl) barEl.style.width = `${pct}%`;

  grid.innerHTML = allRooms.map(r => {
    const itemState = hotelChecks[r.id] || { status: "pending", note: "" };
    const statusClass = itemState.status === "checked" ? "checked" : (itemState.status === "absent" ? "absent" : "");
    const statusText = itemState.status === "checked" ? "✅ 已查房 (已就寢)" : (itemState.status === "absent" ? "⚠️ 待確認 (缺席/未歸)" : "⏳ 待查房 (點此標記)");

    return `
      <div class="room-card ${statusClass}" id="card_${r.id}">
        <div class="room-card-header">
          <div>
            <span class="room-num-badge">${r.room} 房</span>
            <span style="font-size:0.75rem; color:#64748b; margin-left:6px;">(${r.type})</span>
          </div>
          <span class="room-class-tag">${r.class} 班</span>
        </div>

        <div class="room-students-list">
          ${r.students.map(s => `<span class="student-pill">${maskStudentName(s)}</span>`).join("")}
        </div>

        <input type="text" class="room-note-field" placeholder="點此輸入查房備註（如：已吃藥）" value="${itemState.note || ""}" onchange="saveRoomNotePage('${r.id}', this.value)">

        <div class="room-action-row">
          <button class="room-status-btn ${statusClass}" onclick="toggleRoomStatusPage('${r.id}')">
            ${statusText}
          </button>
        </div>
      </div>
    `;
  }).join("");
}

window.toggleRoomStatusPage = function(roomId) {
  if (!checkState[currentHotelId]) checkState[currentHotelId] = {};
  const current = checkState[currentHotelId][roomId] || { status: "pending", note: "" };

  let nextStatus = "checked";
  if (current.status === "checked") nextStatus = "absent";
  else if (current.status === "absent") nextStatus = "pending";

  checkState[currentHotelId][roomId] = {
    ...current,
    status: nextStatus
  };

  localStorage.setItem(hotelInfo[currentHotelId].storageKey, JSON.stringify(checkState[currentHotelId]));
  renderPatrolGridPage();
};

window.saveRoomNotePage = function(roomId, noteVal) {
  if (!checkState[currentHotelId]) checkState[currentHotelId] = {};
  const current = checkState[currentHotelId][roomId] || { status: "pending", note: "" };

  checkState[currentHotelId][roomId] = {
    ...current,
    note: noteVal.trim()
  };

  localStorage.setItem(hotelInfo[currentHotelId].storageKey, JSON.stringify(checkState[currentHotelId]));
};

window.resetCurrentHotelChecksPage = function() {
  if (confirm(`確定要重置【${hotelInfo[currentHotelId].name}】的所有查房打勾紀錄嗎？`)) {
    checkState[currentHotelId] = {};
    localStorage.removeItem(hotelInfo[currentHotelId].storageKey);
    renderPatrolGridPage();
  }
};
