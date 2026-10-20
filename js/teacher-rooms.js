// 麗園國小 115學年度六年級戶外教育 - 教師專用學生房間表與查房點名系統
let activeTeacherTab = "sheet"; // "sheet" (房桌號表) | "patrol" (夜間查房)
let currentSheetClass = "601";
let currentHotelId = 1; // 1: 今埔里渡假大酒店, 2: 麗寶福容大飯店
let activeClassFilter = "all";
let roomSearchQuery = "";

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

// 7 個班級初始資料結構 (各班男女生 1~25 號)
const initialClasses = ["601", "602", "603", "604", "605", "606", "607"];

function generateEmptySlots() {
  const arr = [];
  for (let i = 1; i <= 25; i++) {
    arr.push({ no: i, name: "", room1: "", room2: "", table: "" });
  }
  return arr;
}

function getInitialSheetData() {
  const saved = localStorage.getItem("ly_room_table_sheets");
  if (saved) {
    try {
      return JSON.parse(saved);
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

  // 601 班置入範例資料方便預覽
  data["601"].boys[0] = { no: 1, name: "林小明", room1: "301", room2: "501", table: "1" };
  data["601"].boys[1] = { no: 2, name: "陳大偉", room1: "301", room2: "501", table: "1" };
  data["601"].boys[2] = { no: 3, name: "張建豪", room1: "301", room2: "501", table: "1" };
  data["601"].boys[3] = { no: 4, name: "黃俊傑", room1: "301", room2: "501", table: "1" };

  data["601"].girls[0] = { no: 1, name: "李雅婷", room1: "302", room2: "502", table: "2" };
  data["601"].girls[1] = { no: 2, name: "王美琪", room1: "302", room2: "502", table: "2" };
  data["601"].girls[2] = { no: 3, name: "周思雨", room1: "302", room2: "502", table: "2" };
  data["601"].girls[3] = { no: 4, name: "蔡宜君", room1: "302", room2: "502", table: "2" };

  return data;
}

let sheetData = getInitialSheetData();

// 巡房卡片資料（自動根據 sheetData 彙整）
function getPatrolRooms(hotelNum) {
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
        roomMap[rm].students.push(st.name);
      }
    });
  });

  const list = Object.values(roomMap);
  // 若尚無資料，顯示預設房間
  if (list.length === 0) {
    return [
      { id: `h${hotelNum}_301`, room: "301", class: "601", type: "四人房", students: ["林小明", "陳大偉", "張建豪", "黃俊傑"], note: "" },
      { id: `h${hotelNum}_302`, room: "302", class: "601", type: "四人房", students: ["李雅婷", "王美琪", "周思雨", "蔡宜君"], note: "" }
    ];
  }
  return list.sort((a, b) => a.room.localeCompare(b.room, undefined, { numeric: true }));
}

// 儲存的查房打勾狀態
let checkState = {
  1: JSON.parse(localStorage.getItem(hotelInfo[1].storageKey) || "{}"),
  2: JSON.parse(localStorage.getItem(hotelInfo[2].storageKey) || "{}")
};

document.addEventListener("DOMContentLoaded", () => {
  initRoomModal();
  renderSheetClassSelector();
  renderRoomSheetTable();
});

function initRoomModal() {
  const openBtn = document.getElementById("btnOpenRooms");
  const closeBtn = document.getElementById("btnCloseRooms");
  const modal = document.getElementById("roomModalContainer");
  const backdrop = document.getElementById("roomModalBackdrop");

  if (openBtn) {
    openBtn.addEventListener("click", () => {
      modal.classList.add("open");
      backdrop.classList.add("open");
      if (activeTeacherTab === "sheet") {
        renderRoomSheetTable();
      } else {
        renderPatrolGrid();
      }
    });
  }

  function closeModal() {
    if (modal) modal.classList.remove("open");
    if (backdrop) backdrop.classList.remove("open");
  }

  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  if (backdrop) backdrop.addEventListener("click", closeModal);
}

// 切換頂部大分頁：【房桌號表】 vs 【夜間查房點名】
window.switchTeacherTab = function(tabName) {
  activeTeacherTab = tabName;
  document.getElementById("teacherTabSheet").classList.toggle("active", tabName === "sheet");
  document.getElementById("teacherTabPatrol").classList.toggle("active", tabName === "patrol");

  document.getElementById("sectionSheetView").style.display = tabName === "sheet" ? "block" : "none";
  document.getElementById("sectionPatrolView").style.display = tabName === "patrol" ? "block" : "none";

  if (tabName === "sheet") {
    renderRoomSheetTable();
  } else {
    renderPatrolGrid();
  }
};

/* --------------------------------------------------------------------------
   1. 麗園國小學生校外教學活動房桌號表 (實體單對應)
   -------------------------------------------------------------------------- */
function renderSheetClassSelector() {
  const container = document.getElementById("sheetClassTabs");
  if (!container) return;

  container.innerHTML = initialClasses.map(c => `
    <button class="class-chip ${currentSheetClass === c ? "active" : ""}" onclick="selectSheetClass('${c}')">
      ${c} 班
    </button>
  `).join("");
}

window.selectSheetClass = function(c) {
  currentSheetClass = c;
  renderSheetClassSelector();
  renderRoomSheetTable();
};

function renderRoomSheetTable() {
  const cData = sheetData[currentSheetClass] || {
    className: currentSheetClass,
    teacher: "",
    totalCount: 0,
    boys: generateEmptySlots(),
    girls: generateEmptySlots()
  };

  // 更新 Meta 欄位
  const classDisplay = document.getElementById("sheetDisplayClass");
  const totalInput = document.getElementById("sheetInputTotal");
  const teacherInput = document.getElementById("sheetInputTeacher");

  if (classDisplay) classDisplay.textContent = `6年${currentSheetClass.replace("6", "")}班 (${currentSheetClass}班)`;
  if (totalInput) totalInput.value = cData.totalCount || "";
  if (teacherInput) teacherInput.value = cData.teacher || "";

  // 渲染男生名單 (1~25)
  const boysTbody = document.getElementById("sheetBoysTbody");
  if (boysTbody) {
    boysTbody.innerHTML = cData.boys.map((b, idx) => `
      <tr>
        <td class="col-no">${b.no}</td>
        <td class="col-name"><input type="text" value="${b.name || ""}" placeholder="姓名" onchange="updateStudentField('${currentSheetClass}', 'boys', ${idx}, 'name', this.value)"></td>
        <td class="col-room"><input type="text" value="${b.room1 || ""}" placeholder="房號" onchange="updateStudentField('${currentSheetClass}', 'boys', ${idx}, 'room1', this.value)"></td>
        <td class="col-room"><input type="text" value="${b.room2 || ""}" placeholder="房號" onchange="updateStudentField('${currentSheetClass}', 'boys', ${idx}, 'room2', this.value)"></td>
        <td class="col-table"><input type="text" value="${b.table || ""}" placeholder="桌" onchange="updateStudentField('${currentSheetClass}', 'boys', ${idx}, 'table', this.value)"></td>
      </tr>
    `).join("");
  }

  // 渲染女生名單 (1~25)
  const girlsTbody = document.getElementById("sheetGirlsTbody");
  if (girlsTbody) {
    girlsTbody.innerHTML = cData.girls.map((g, idx) => `
      <tr>
        <td class="col-no">${g.no}</td>
        <td class="col-name"><input type="text" value="${g.name || ""}" placeholder="姓名" onchange="updateStudentField('${currentSheetClass}', 'girls', ${idx}, 'name', this.value)"></td>
        <td class="col-room"><input type="text" value="${g.room1 || ""}" placeholder="房號" onchange="updateStudentField('${currentSheetClass}', 'girls', ${idx}, 'room1', this.value)"></td>
        <td class="col-room"><input type="text" value="${g.room2 || ""}" placeholder="房號" onchange="updateStudentField('${currentSheetClass}', 'girls', ${idx}, 'room2', this.value)"></td>
        <td class="col-table"><input type="text" value="${g.table || ""}" placeholder="桌" onchange="updateStudentField('${currentSheetClass}', 'girls', ${idx}, 'table', this.value)"></td>
      </tr>
    `).join("");
  }
}

window.updateStudentField = function(className, gender, idx, field, value) {
  if (!sheetData[className]) return;
  sheetData[className][gender][idx][field] = value.trim();
  saveSheetData();
};

window.updateSheetMeta = function(field, value) {
  if (!sheetData[currentSheetClass]) return;
  sheetData[currentSheetClass][field] = value.trim();
  saveSheetData();
};

function saveSheetData() {
  localStorage.setItem("ly_room_table_sheets", JSON.stringify(sheetData));
  const saveNotice = document.getElementById("sheetSaveNotice");
  if (saveNotice) {
    saveNotice.style.opacity = "1";
    setTimeout(() => { saveNotice.style.opacity = "0"; }, 1500);
  }
}

window.printRoomSheet = function() {
  window.print();
};

/* --------------------------------------------------------------------------
   2. 夜間查房點名系統 (Patrol)
   -------------------------------------------------------------------------- */
window.switchHotel = function(hotelId) {
  currentHotelId = hotelId;
  document.getElementById("tabHotel1").classList.toggle("active", hotelId === 1);
  document.getElementById("tabHotel2").classList.toggle("active", hotelId === 2);
  renderPatrolGrid();
};

function renderPatrolGrid() {
  const grid = document.getElementById("roomsGrid");
  if (!grid) return;

  const allRooms = getPatrolRooms(currentHotelId);
  const hotelChecks = checkState[currentHotelId] || {};

  const filtered = allRooms.filter(r => {
    const matchClass = (activeClassFilter === "all" || r.class === activeClassFilter);
    const matchQuery = !roomSearchQuery || 
      r.room.toLowerCase().includes(roomSearchQuery) || 
      r.class.toLowerCase().includes(roomSearchQuery) || 
      r.students.some(s => s.toLowerCase().includes(roomSearchQuery));
    return matchClass && matchQuery;
  });

  const totalCount = allRooms.length;
  const checkedCount = allRooms.filter(r => (hotelChecks[r.id] && hotelChecks[r.id].status === "checked")).length;
  const pct = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0;

  const countEl = document.getElementById("checkedCount");
  const totalEl = document.getElementById("totalRoomsCount");
  const pctEl = document.getElementById("progressPct");
  const barEl = document.getElementById("progressBarFill");

  if (countEl) countEl.textContent = checkedCount;
  if (totalEl) totalEl.textContent = totalCount;
  if (pctEl) pctEl.textContent = `${pct}%`;
  if (barEl) barEl.style.width = `${pct}%`;

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align:center; padding: 40px 20px; color:#64748b;">
        <span style="font-size:2rem;">🔍</span>
        <p style="margin-top:10px; font-weight:700;">查無符合條件的房間</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(r => {
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
          ${r.students.map(s => `<span class="student-pill">${s}</span>`).join("")}
        </div>

        <input type="text" class="room-note-field" placeholder="點此輸入查房備註（如：已吃藥）" value="${itemState.note || ""}" onchange="saveRoomNote('${r.id}', this.value)">

        <div class="room-action-row">
          <button class="room-status-btn ${statusClass}" onclick="toggleRoomStatus('${r.id}')">
            ${statusText}
          </button>
        </div>
      </div>
    `;
  }).join("");
}

window.toggleRoomStatus = function(roomId) {
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
  renderPatrolGrid();
};

window.saveRoomNote = function(roomId, noteVal) {
  if (!checkState[currentHotelId]) checkState[currentHotelId] = {};
  const current = checkState[currentHotelId][roomId] || { status: "pending", note: "" };

  checkState[currentHotelId][roomId] = {
    ...current,
    note: noteVal.trim()
  };

  localStorage.setItem(hotelInfo[currentHotelId].storageKey, JSON.stringify(checkState[currentHotelId]));
};

window.resetCurrentHotelChecks = function() {
  if (confirm(`確定要重置【${hotelInfo[currentHotelId].name}】的所有查房打勾紀錄嗎？`)) {
    checkState[currentHotelId] = {};
    localStorage.removeItem(hotelInfo[currentHotelId].storageKey);
    renderPatrolGrid();
  }
};
