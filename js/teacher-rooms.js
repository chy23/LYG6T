/**
 * ============================================================================
 * 麗園國小 115學年度六年級戶外教育 - 教師專用學生房間表與查房點名系統 (全9班 601~609 官方正式分房表)
 * 建立於林口區麗園國小楊家驊老師
 * 
 * 【開發歷程與時間表】
 * - 2026-10-20 (Phase 1): 實裝 601~609 房桌號名冊、雙飯店切換、夜間巡房打勾、本地即時儲存
 * - 2026-10-20 (Phase 2): 落實個資保護架構，學生姓名去中字以全形「Ｏ」遮蔽、導師姓名去識別化保護
 * - 2026-10-25 (Phase 3): 導入同房同桌專屬米色色塊視覺分組系統 (米黃、米紅、米藍、米綠、米紫、米橙)
 * - 2026-10-26 (Phase 4): 極簡閱讀重構 (漢堡抽屜選單、多檢視無縫切換防崩潰)、男女生房標籤、一鍵清除點名
 * - 2026-10-26 (Phase 4): 房桌號表與夜間查房點名 100% 深度融合為單一介面、支援全校六年級總覽與跳轉聚焦
 * - 2026-10-26 (Phase 5): 全解析度自適應防破版防溢出重構，智慧精簡按鈕排版，確保任何手機螢幕完美呈現
 * ============================================================================
 */
let currentSheetClass = "601";
let currentHotelId = 1; // 1: 今埔里渡假大酒店, 2: 麗寶福容大飯店
let activePatrolClassFilter = "all";
let patrolSearchQuery = "";

// 飯店資訊
const hotelInfo = {
  1: {
    name: "今埔里渡假大酒店",
    address: "南投縣埔里鎮南興街79號",
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

// 9 個班級清單 (601 ~ 609)
const initialClasses = ["601", "602", "603", "604", "605", "606", "607", "608", "609"];

// 官方正式匯入各班房桌號表資料 (中字已依規定全數替換為全形「Ｏ」)
const officialSheetData = {
  "601": {
    "className": "601",
    "teacher": "詹Ｏ文",
    "totalCount": 22,
    "boys": [
      {
        "no": 1,
        "name": "潘Ｏ達",
        "room1": "2005",
        "room2": "B",
        "table": "2"
      },
      {
        "no": 2,
        "name": "曾Ｏ群",
        "room1": "2006",
        "room2": "C",
        "table": "2"
      },
      {
        "no": 3,
        "name": "謝Ｏ逸",
        "room1": "2003",
        "room2": "A",
        "table": "2"
      },
      {
        "no": 4,
        "name": "胡Ｏ仁",
        "room1": "2005",
        "room2": "B",
        "table": "2"
      },
      {
        "no": 5,
        "name": "陳Ｏ旭",
        "room1": "2005",
        "room2": "B",
        "table": "3"
      },
      {
        "no": 6,
        "name": "陳Ｏ安",
        "room1": "2003",
        "room2": "A",
        "table": "2"
      },
      {
        "no": 7,
        "name": "林Ｏ宇",
        "room1": "2003",
        "room2": "A",
        "table": "3"
      },
      {
        "no": 8,
        "name": "吳Ｏ揚",
        "room1": "2006",
        "room2": "C",
        "table": "2"
      },
      {
        "no": 9,
        "name": "蘇Ｏ朋",
        "room1": "2003",
        "room2": "A",
        "table": "2"
      },
      {
        "no": 10,
        "name": "陳Ｏ杰",
        "room1": "2005",
        "room2": "B",
        "table": "2"
      },
      {
        "no": 11,
        "name": "蕭Ｏ方",
        "room1": "2006",
        "room2": "C",
        "table": "2"
      },
      {
        "no": 12,
        "name": "陳Ｏ恩",
        "room1": "2006",
        "room2": "C",
        "table": "2"
      },
      {
        "no": 13,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 14,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 15,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 16,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 17,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 18,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 19,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 20,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 21,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 22,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 23,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 24,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 25,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      }
    ],
    "girls": [
      {
        "no": 1,
        "name": "賴Ｏ孜",
        "room1": "5018",
        "room2": "1",
        "table": "1"
      },
      {
        "no": 2,
        "name": "王Ｏ芮",
        "room1": "5018",
        "room2": "1",
        "table": "1"
      },
      {
        "no": 3,
        "name": "蒲Ｏ宇",
        "room1": "5017",
        "room2": "2",
        "table": "1"
      },
      {
        "no": 4,
        "name": "李Ｏ穎",
        "room1": "5018",
        "room2": "1",
        "table": "1"
      },
      {
        "no": 5,
        "name": "王Ｏ羽",
        "room1": "5017",
        "room2": "2",
        "table": "1"
      },
      {
        "no": 6,
        "name": "廖Ｏ墨",
        "room1": "5017",
        "room2": "2",
        "table": "1"
      },
      {
        "no": 7,
        "name": "周Ｏ霏",
        "room1": "5018",
        "room2": "1",
        "table": "1"
      },
      {
        "no": 8,
        "name": "蘇Ｏ葳",
        "room1": "5021",
        "room2": "2",
        "table": "1"
      },
      {
        "no": 9,
        "name": "蘇Ｏ蓁",
        "room1": "5021",
        "room2": "2",
        "table": "1"
      },
      {
        "no": 10,
        "name": "黃Ｏ頤",
        "room1": "5021",
        "room2": "2",
        "table": "1"
      },
      {
        "no": 11,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 12,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 13,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 14,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 15,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 16,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 17,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 18,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 19,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 20,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 21,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 22,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 23,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 24,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 25,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      }
    ]
  },
  "602": {
    "className": "602",
    "teacher": "胡Ｏ鈞",
    "totalCount": 22,
    "boys": [
      {
        "no": 1,
        "name": "吳Ｏ安",
        "room1": "2009",
        "room2": "A",
        "table": "5"
      },
      {
        "no": 2,
        "name": "楊Ｏ賢",
        "room1": "2012",
        "room2": "A",
        "table": "5"
      },
      {
        "no": 3,
        "name": "王Ｏ程",
        "room1": "2012",
        "room2": "A",
        "table": "5"
      },
      {
        "no": 4,
        "name": "賴Ｏ栯",
        "room1": "2010",
        "room2": "B",
        "table": "4"
      },
      {
        "no": 5,
        "name": "葉Ｏ衡",
        "room1": "2010",
        "room2": "B",
        "table": "4"
      },
      {
        "no": 6,
        "name": "蔡Ｏ鐿",
        "room1": "2010",
        "room2": "B",
        "table": "4"
      },
      {
        "no": 7,
        "name": "楊Ｏ樂",
        "room1": "2010",
        "room2": "B",
        "table": "4"
      },
      {
        "no": 8,
        "name": "林Ｏ皓",
        "room1": "2011",
        "room2": "C",
        "table": "4"
      },
      {
        "no": 9,
        "name": "洪Ｏ呈",
        "room1": "2012",
        "room2": "C",
        "table": "5"
      },
      {
        "no": 10,
        "name": "曾Ｏ祥",
        "room1": "2009",
        "room2": "C",
        "table": "4"
      },
      {
        "no": 11,
        "name": "楊Ｏ筳",
        "room1": "2011",
        "room2": "C",
        "table": "4"
      },
      {
        "no": 12,
        "name": "陳Ｏ漢",
        "room1": "2011",
        "room2": "C",
        "table": "4"
      },
      {
        "no": 13,
        "name": "王Ｏ巽",
        "room1": "2011",
        "room2": "C",
        "table": "4"
      },
      {
        "no": 14,
        "name": "邱Ｏ賢",
        "room1": "2009",
        "room2": "B",
        "table": "4"
      },
      {
        "no": 15,
        "name": "陳Ｏ成",
        "room1": "2012",
        "room2": "A",
        "table": "5"
      },
      {
        "no": 16,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 17,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 18,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 19,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 20,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 21,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 22,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 23,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 24,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 25,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      }
    ],
    "girls": [
      {
        "no": 1,
        "name": "盧Ｏ涵",
        "room1": "5019",
        "room2": "1",
        "table": "5"
      },
      {
        "no": 2,
        "name": "葉Ｏ安",
        "room1": "5020",
        "room2": "2",
        "table": "3"
      },
      {
        "no": 3,
        "name": "葉Ｏ希",
        "room1": "5020",
        "room2": "2",
        "table": "3"
      },
      {
        "no": 4,
        "name": "楊Ｏ珈",
        "room1": "5019",
        "room2": "1",
        "table": "5"
      },
      {
        "no": 5,
        "name": "林Ｏ晴",
        "room1": "5019",
        "room2": "1",
        "table": "5"
      },
      {
        "no": 6,
        "name": "范Ｏ菲",
        "room1": "5020",
        "room2": "2",
        "table": "5"
      },
      {
        "no": 7,
        "name": "張Ｏ昕",
        "room1": "5020",
        "room2": "2",
        "table": "5"
      },
      {
        "no": 8,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 9,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 10,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 11,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 12,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 13,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 14,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 15,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 16,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 17,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 18,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 19,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 20,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 21,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 22,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 23,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 24,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 25,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      }
    ]
  },
  "603": {
    "className": "603",
    "teacher": "唐Ｏ倫",
    "totalCount": 25,
    "boys": [
      {
        "no": 1,
        "name": "陳Ｏ翔",
        "room1": "2020",
        "room2": "A4-2",
        "table": "6"
      },
      {
        "no": 2,
        "name": "徐Ｏ睿",
        "room1": "2019",
        "room2": "A6",
        "table": "6"
      },
      {
        "no": 3,
        "name": "游Ｏ鈞",
        "room1": "2017",
        "room2": "A6",
        "table": "6"
      },
      {
        "no": 4,
        "name": "楊Ｏ瑜",
        "room1": "2018",
        "room2": "A6",
        "table": "6"
      },
      {
        "no": 5,
        "name": "牛Ｏ安",
        "room1": "2017",
        "room2": "A6",
        "table": "6"
      },
      {
        "no": 6,
        "name": "陳Ｏ昕",
        "room1": "2019",
        "room2": "A4-1",
        "table": "6"
      },
      {
        "no": 7,
        "name": "許Ｏ銘",
        "room1": "2019",
        "room2": "A4-1",
        "table": "6"
      },
      {
        "no": 8,
        "name": "莊Ｏ禾",
        "room1": "2017",
        "room2": "A6",
        "table": "7"
      },
      {
        "no": 9,
        "name": "王Ｏ丞",
        "room1": "2018",
        "room2": "A6",
        "table": "7"
      },
      {
        "no": 10,
        "name": "張Ｏ博",
        "room1": "2020",
        "room2": "A4-2",
        "table": "7"
      },
      {
        "no": 11,
        "name": "吳Ｏ樺",
        "room1": "2019",
        "room2": "A4-1",
        "table": "7"
      },
      {
        "no": 12,
        "name": "張Ｏ穎",
        "room1": "2020",
        "room2": "A4-2",
        "table": "7"
      },
      {
        "no": 13,
        "name": "曹Ｏ銘",
        "room1": "2018",
        "room2": "A4-1",
        "table": "7"
      },
      {
        "no": 14,
        "name": "吳Ｏ駿",
        "room1": "2020",
        "room2": "A4-2",
        "table": "7"
      },
      {
        "no": 15,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 16,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 17,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 18,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 19,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 20,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 21,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 22,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 23,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 24,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 25,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      }
    ],
    "girls": [
      {
        "no": 1,
        "name": "李Ｏ嫻",
        "room1": "6006",
        "room2": "B6",
        "table": "3"
      },
      {
        "no": 2,
        "name": "范Ｏ馨",
        "room1": "6006",
        "room2": "B5",
        "table": "3"
      },
      {
        "no": 3,
        "name": "黃Ｏ晨",
        "room1": "6006",
        "room2": "B6",
        "table": "3"
      },
      {
        "no": 4,
        "name": "楊Ｏ琳",
        "room1": "6005",
        "room2": "B5",
        "table": "3"
      },
      {
        "no": 5,
        "name": "吳Ｏ瞳",
        "room1": "6005",
        "room2": "B5",
        "table": "3"
      },
      {
        "no": 6,
        "name": "吳Ｏ妮",
        "room1": "6003",
        "room2": "B6",
        "table": "6"
      },
      {
        "no": 7,
        "name": "傅Ｏ霏",
        "room1": "6005",
        "room2": "B5",
        "table": "6"
      },
      {
        "no": 8,
        "name": "林Ｏ儀",
        "room1": "6005",
        "room2": "B5",
        "table": "6"
      },
      {
        "no": 9,
        "name": "翁Ｏ淇",
        "room1": "6006",
        "room2": "B6",
        "table": "7"
      },
      {
        "no": 10,
        "name": "鄭Ｏ葳",
        "room1": "6003",
        "room2": "B6",
        "table": "7"
      },
      {
        "no": 11,
        "name": "葉Ｏ妍",
        "room1": "6003",
        "room2": "B6",
        "table": "7"
      },
      {
        "no": 12,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 13,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 14,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 15,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 16,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 17,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 18,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 19,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 20,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 21,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 22,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 23,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 24,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 25,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      }
    ]
  },
  "604": {
    "className": "604",
    "teacher": "黃Ｏ芬",
    "totalCount": 24,
    "boys": [
      {
        "no": 1,
        "name": "嚴Ｏ彧",
        "room1": "3003",
        "room2": "A",
        "table": "8"
      },
      {
        "no": 2,
        "name": "陳Ｏ",
        "room1": "3005",
        "room2": "C",
        "table": "8"
      },
      {
        "no": 3,
        "name": "陳Ｏ翔",
        "room1": "3005",
        "room2": "C",
        "table": "9"
      },
      {
        "no": 4,
        "name": "林Ｏ翰",
        "room1": "3007",
        "room2": "B",
        "table": "9"
      },
      {
        "no": 5,
        "name": "李Ｏ勳",
        "room1": "3007",
        "room2": "A",
        "table": "9"
      },
      {
        "no": 6,
        "name": "陳Ｏ齊",
        "room1": "3007",
        "room2": "C",
        "table": "8"
      },
      {
        "no": 7,
        "name": "呂Ｏ誠",
        "room1": "3006",
        "room2": "B",
        "table": "10"
      },
      {
        "no": 8,
        "name": "陳Ｏ博",
        "room1": "3006",
        "room2": "B",
        "table": "8"
      },
      {
        "no": 9,
        "name": "儲Ｏ庭",
        "room1": "3003",
        "room2": "A",
        "table": "9"
      },
      {
        "no": 10,
        "name": "林Ｏ廷",
        "room1": "3007",
        "room2": "C",
        "table": "9"
      },
      {
        "no": 11,
        "name": "翁Ｏ碩",
        "room1": "3005",
        "room2": "C",
        "table": "8"
      },
      {
        "no": 12,
        "name": "紀Ｏ諒",
        "room1": "3006",
        "room2": "B",
        "table": "10"
      },
      {
        "no": 13,
        "name": "俞Ｏ太",
        "room1": "3003",
        "room2": "A",
        "table": "9"
      },
      {
        "no": 14,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 15,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 16,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 17,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 18,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 19,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 20,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 21,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 22,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 23,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 24,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 25,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      }
    ],
    "girls": [
      {
        "no": 1,
        "name": "林Ｏ媛",
        "room1": "6007",
        "room2": "D",
        "table": "9"
      },
      {
        "no": 2,
        "name": "李Ｏ晴",
        "room1": "6012",
        "room2": "E",
        "table": "8"
      },
      {
        "no": 3,
        "name": "何Ｏ璇",
        "room1": "6007",
        "room2": "E",
        "table": "8"
      },
      {
        "no": 4,
        "name": "鄭Ｏ亭",
        "room1": "6012",
        "room2": "E",
        "table": "10"
      },
      {
        "no": 5,
        "name": "許Ｏ瑄",
        "room1": "6008",
        "room2": "D",
        "table": "9"
      },
      {
        "no": 6,
        "name": "温Ｏ萱",
        "room1": "6008",
        "room2": "D",
        "table": "9"
      },
      {
        "no": 7,
        "name": "邱Ｏ涵",
        "room1": "6008",
        "room2": "D",
        "table": "10"
      },
      {
        "no": 8,
        "name": "張Ｏ云",
        "room1": "6012",
        "room2": "E",
        "table": "8"
      },
      {
        "no": 9,
        "name": "陳Ｏ嵐",
        "room1": "6012",
        "room2": "E",
        "table": "8"
      },
      {
        "no": 10,
        "name": "童Ｏ芃",
        "room1": "6008",
        "room2": "D",
        "table": "9"
      },
      {
        "no": 11,
        "name": "邱Ｏ蓁",
        "room1": "6007",
        "room2": "E",
        "table": "8"
      },
      {
        "no": 12,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 13,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 14,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 15,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 16,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 17,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 18,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 19,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 20,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 21,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 22,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 23,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 24,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 25,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      }
    ]
  },
  "605": {
    "className": "605",
    "teacher": "楊Ｏ驊",
    "totalCount": 23,
    "boys": [
      {
        "no": 1,
        "name": "陳Ｏ東",
        "room1": "2001",
        "room2": "A",
        "table": "13"
      },
      {
        "no": 2,
        "name": "陳Ｏ逸",
        "room1": "2008",
        "room2": "B",
        "table": "14"
      },
      {
        "no": 3,
        "name": "陳Ｏ杰",
        "room1": "2001",
        "room2": "A",
        "table": "14"
      },
      {
        "no": 4,
        "name": "陳Ｏ宇",
        "room1": "2001",
        "room2": "A",
        "table": "14"
      },
      {
        "no": 5,
        "name": "黃Ｏ祐",
        "room1": "2008",
        "room2": "B",
        "table": "15"
      },
      {
        "no": 6,
        "name": "李Ｏ碩",
        "room1": "2007",
        "room2": "C",
        "table": "13"
      },
      {
        "no": 7,
        "name": "林Ｏ倫",
        "room1": "2007",
        "room2": "C",
        "table": "13"
      },
      {
        "no": 8,
        "name": "凌Ｏ邑",
        "room1": "2008",
        "room2": "B",
        "table": "14"
      },
      {
        "no": 9,
        "name": "劉Ｏ辰",
        "room1": "2001",
        "room2": "A",
        "table": "13"
      },
      {
        "no": 10,
        "name": "王Ｏ澄",
        "room1": "2008",
        "room2": "B",
        "table": "14"
      },
      {
        "no": 11,
        "name": "吳Ｏ宸",
        "room1": "2007",
        "room2": "C",
        "table": "15"
      },
      {
        "no": 12,
        "name": "嚴Ｏ榮",
        "room1": "2007",
        "room2": "C",
        "table": "13"
      },
      {
        "no": 13,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 14,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 15,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 16,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 17,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 18,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 19,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 20,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 21,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 22,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 23,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 24,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 25,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      }
    ],
    "girls": [
      {
        "no": 1,
        "name": "嚴Ｏ宸",
        "room1": "6010",
        "room2": "2",
        "table": "13"
      },
      {
        "no": 2,
        "name": "羅Ｏ洢",
        "room1": "6009",
        "room2": "1",
        "table": "14"
      },
      {
        "no": 3,
        "name": "羅Ｏ婷",
        "room1": "6009",
        "room2": "2",
        "table": "15"
      },
      {
        "no": 4,
        "name": "蕭Ｏ羚",
        "room1": "6010",
        "room2": "2",
        "table": "13"
      },
      {
        "no": 5,
        "name": "張Ｏ慈",
        "room1": "6011",
        "room2": "1",
        "table": "14"
      },
      {
        "no": 6,
        "name": "茅Ｏ芳",
        "room1": "6011",
        "room2": "1",
        "table": "14"
      },
      {
        "no": 7,
        "name": "洪Ｏ晴",
        "room1": "6009",
        "room2": "2",
        "table": "13"
      },
      {
        "no": 8,
        "name": "林Ｏ橙",
        "room1": "6010",
        "room2": "2",
        "table": "13"
      },
      {
        "no": 9,
        "name": "周Ｏ妤",
        "room1": "6010",
        "room2": "2",
        "table": "13"
      },
      {
        "no": 10,
        "name": "吳Ｏ妤",
        "room1": "6011",
        "room2": "1",
        "table": "14"
      },
      {
        "no": 11,
        "name": "李Ｏ語",
        "room1": "6011",
        "room2": "1",
        "table": "14"
      },
      {
        "no": 12,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 13,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 14,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 15,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 16,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 17,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 18,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 19,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 20,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 21,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 22,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 23,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 24,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 25,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      }
    ]
  },
  "606": {
    "className": "606",
    "teacher": "王Ｏ潔",
    "totalCount": 27,
    "boys": [
      {
        "no": 1,
        "name": "王Ｏ廷",
        "room1": "3009",
        "room2": "B",
        "table": "17"
      },
      {
        "no": 2,
        "name": "麥Ｏ林",
        "room1": "3010",
        "room2": "A",
        "table": "15"
      },
      {
        "no": 3,
        "name": "劉Ｏ謙",
        "room1": "3012",
        "room2": "B",
        "table": "17"
      },
      {
        "no": 4,
        "name": "任Ｏ叡",
        "room1": "3011",
        "room2": "C",
        "table": "16"
      },
      {
        "no": 5,
        "name": "許Ｏ騰",
        "room1": "3011",
        "room2": "C",
        "table": "16"
      },
      {
        "no": 6,
        "name": "蘇Ｏ恩",
        "room1": "3009",
        "room2": "B",
        "table": "17"
      },
      {
        "no": 7,
        "name": "周Ｏ宇",
        "room1": "3012",
        "room2": "C",
        "table": "16"
      },
      {
        "no": 8,
        "name": "蔡Ｏ希",
        "room1": "3011",
        "room2": "C",
        "table": "16"
      },
      {
        "no": 9,
        "name": "吳Ｏ駿",
        "room1": "3011",
        "room2": "C",
        "table": "16"
      },
      {
        "no": 10,
        "name": "杜Ｏ叡",
        "room1": "3012",
        "room2": "C",
        "table": "16"
      },
      {
        "no": 11,
        "name": "林Ｏ宏",
        "room1": "3009",
        "room2": "B",
        "table": "17"
      },
      {
        "no": 12,
        "name": "施Ｏ碩",
        "room1": "3010",
        "room2": "A",
        "table": "15"
      },
      {
        "no": 13,
        "name": "陳Ｏ睿",
        "room1": "3010",
        "room2": "A",
        "table": "15"
      },
      {
        "no": 14,
        "name": "張Ｏ章",
        "room1": "3012",
        "room2": "B",
        "table": "15"
      },
      {
        "no": 15,
        "name": "潘Ｏ恩",
        "room1": "3010",
        "room2": "A",
        "table": "15"
      },
      {
        "no": 16,
        "name": "邱Ｏ洵",
        "room1": "3009",
        "room2": "B",
        "table": "17"
      },
      {
        "no": 17,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 18,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 19,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 20,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 21,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 22,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 23,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 24,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 25,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      }
    ],
    "girls": [
      {
        "no": 1,
        "name": "蘇Ｏ閔",
        "room1": "6021",
        "room2": "1",
        "table": "17"
      },
      {
        "no": 2,
        "name": "洪Ｏ倢",
        "room1": "6019",
        "room2": "1",
        "table": "15"
      },
      {
        "no": 3,
        "name": "許Ｏ穎",
        "room1": "6019",
        "room2": "1",
        "table": "16"
      },
      {
        "no": 4,
        "name": "傅Ｏ茜",
        "room1": "6020",
        "room2": "2",
        "table": "15"
      },
      {
        "no": 5,
        "name": "賴Ｏ晨",
        "room1": "6020",
        "room2": "2",
        "table": "17"
      },
      {
        "no": 6,
        "name": "張Ｏ筠",
        "room1": "6020",
        "room2": "2",
        "table": "17"
      },
      {
        "no": 7,
        "name": "曾Ｏ筑",
        "room1": "6020",
        "room2": "2",
        "table": "16"
      },
      {
        "no": 8,
        "name": "陳Ｏ蕎",
        "room1": "6021",
        "room2": "2",
        "table": "17"
      },
      {
        "no": 9,
        "name": "林Ｏ宓",
        "room1": "6019",
        "room2": "1",
        "table": "16"
      },
      {
        "no": 10,
        "name": "葉Ｏ萱",
        "room1": "6019",
        "room2": "1",
        "table": "16"
      },
      {
        "no": 11,
        "name": "陳Ｏ琪",
        "room1": "6021",
        "room2": "2",
        "table": "17"
      },
      {
        "no": 12,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 13,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 14,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 15,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 16,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 17,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 18,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 19,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 20,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 21,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 22,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 23,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 24,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 25,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      }
    ]
  },
  "607": {
    "className": "607",
    "teacher": "林Ｏ宏",
    "totalCount": 26,
    "boys": [
      {
        "no": 1,
        "name": "廖Ｏ傑",
        "room1": "3017",
        "room2": "A",
        "table": "10"
      },
      {
        "no": 2,
        "name": "張Ｏ圖",
        "room1": "3019",
        "room2": "C",
        "table": "10"
      },
      {
        "no": 3,
        "name": "林Ｏ恩",
        "room1": "3019",
        "room2": "C",
        "table": "12"
      },
      {
        "no": 4,
        "name": "吳Ｏ樺",
        "room1": "3020",
        "room2": "A",
        "table": "12"
      },
      {
        "no": 5,
        "name": "蘇Ｏ仁",
        "room1": "3020",
        "room2": "C",
        "table": "12"
      },
      {
        "no": 6,
        "name": "林Ｏ廷",
        "room1": "3018",
        "room2": "A",
        "table": "10"
      },
      {
        "no": 7,
        "name": "陳Ｏ祁",
        "room1": "3019",
        "room2": "C",
        "table": "11"
      },
      {
        "no": 8,
        "name": "許Ｏ淮",
        "room1": "3019",
        "room2": "C",
        "table": "10"
      },
      {
        "no": 9,
        "name": "顏Ｏ庭",
        "room1": "3018",
        "room2": "B",
        "table": "11"
      },
      {
        "no": 10,
        "name": "陳Ｏ智",
        "room1": "3017",
        "room2": "B",
        "table": "11"
      },
      {
        "no": 11,
        "name": "張Ｏ瑒",
        "room1": "3017",
        "room2": "A",
        "table": "11"
      },
      {
        "no": 12,
        "name": "王Ｏ筌",
        "room1": "3018",
        "room2": "B",
        "table": "11"
      },
      {
        "no": 13,
        "name": "董Ｏ綸",
        "room1": "3020",
        "room2": "C",
        "table": "11"
      },
      {
        "no": 14,
        "name": "侯Ｏ廷",
        "room1": "3018",
        "room2": "B",
        "table": "11"
      },
      {
        "no": 15,
        "name": "薛Ｏ文",
        "room1": "3020",
        "room2": "B",
        "table": "12"
      },
      {
        "no": 16,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 17,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 18,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 19,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 20,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 21,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 22,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 23,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 24,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 25,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      }
    ],
    "girls": [
      {
        "no": 1,
        "name": "李Ｏ叡",
        "room1": "7019",
        "room2": "2",
        "table": "11"
      },
      {
        "no": 2,
        "name": "顏Ｏ庭",
        "room1": "7019",
        "room2": "2",
        "table": "11"
      },
      {
        "no": 3,
        "name": "潘Ｏ蒨",
        "room1": "7018",
        "room2": "1",
        "table": "12"
      },
      {
        "no": 4,
        "name": "鄭Ｏ品",
        "room1": "7019",
        "room2": "2",
        "table": "11"
      },
      {
        "no": 5,
        "name": "林Ｏ萱",
        "room1": "7019",
        "room2": "2",
        "table": "10"
      },
      {
        "no": 6,
        "name": "王Ｏ涵",
        "room1": "7018",
        "room2": "1",
        "table": "10"
      },
      {
        "no": 7,
        "name": "王Ｏ艾",
        "room1": "7017",
        "room2": "1",
        "table": "12"
      },
      {
        "no": 8,
        "name": "劉Ｏ佑",
        "room1": "7018",
        "room2": "1",
        "table": "12"
      },
      {
        "no": 9,
        "name": "林Ｏ晴",
        "room1": "7017",
        "room2": "1",
        "table": "12"
      },
      {
        "no": 10,
        "name": "林Ｏ蓉",
        "room1": "7017",
        "room2": "2",
        "table": "12"
      },
      {
        "no": 11,
        "name": "周Ｏ",
        "room1": "7018",
        "room2": "2",
        "table": "12"
      },
      {
        "no": 12,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 13,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 14,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 15,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 16,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 17,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 18,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 19,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 20,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 21,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 22,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 23,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 24,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 25,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      }
    ]
  },
  "608": {
    "className": "608",
    "teacher": "廖Ｏ超",
    "totalCount": 24,
    "boys": [
      {
        "no": 1,
        "name": "廖Ｏ佑",
        "room1": "505",
        "room2": "A",
        "table": "20"
      },
      {
        "no": 2,
        "name": "李Ｏ宸",
        "room1": "503",
        "room2": "A",
        "table": "20"
      },
      {
        "no": 3,
        "name": "徐Ｏ城",
        "room1": "507",
        "room2": "C",
        "table": "18"
      },
      {
        "no": 4,
        "name": "吳Ｏ儁",
        "room1": "507",
        "room2": "C",
        "table": "19"
      },
      {
        "no": 5,
        "name": "蘇Ｏ凱",
        "room1": "507",
        "room2": "C",
        "table": "18"
      },
      {
        "no": 6,
        "name": "阮Ｏ樺",
        "room1": "507",
        "room2": "C",
        "table": "19"
      },
      {
        "no": 7,
        "name": "張Ｏ正",
        "room1": "505",
        "room2": "C",
        "table": "18"
      },
      {
        "no": 8,
        "name": "趙Ｏ翰",
        "room1": "506",
        "room2": "B",
        "table": "19"
      },
      {
        "no": 9,
        "name": "袁Ｏ謙",
        "room1": "506",
        "room2": "B",
        "table": "18"
      },
      {
        "no": 10,
        "name": "顏Ｏ敏",
        "room1": "505",
        "room2": "B",
        "table": "19"
      },
      {
        "no": 11,
        "name": "林Ｏ睿",
        "room1": "503",
        "room2": "A",
        "table": "20"
      },
      {
        "no": 12,
        "name": "李Ｏ安",
        "room1": "506",
        "room2": "B",
        "table": "18"
      },
      {
        "no": 13,
        "name": "陳Ｏ杰",
        "room1": "503",
        "room2": "A",
        "table": "20"
      },
      {
        "no": 14,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 15,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 16,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 17,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 18,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 19,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 20,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 21,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 22,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 23,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 24,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 25,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      }
    ],
    "girls": [
      {
        "no": 1,
        "name": "陳Ｏ菁",
        "room1": "6018",
        "room2": "B",
        "table": "18"
      },
      {
        "no": 2,
        "name": "林Ｏ倢",
        "room1": "6017",
        "room2": "B",
        "table": "19"
      },
      {
        "no": 3,
        "name": "李Ｏ欣",
        "room1": "6018",
        "room2": "B",
        "table": "18"
      },
      {
        "no": 4,
        "name": "劉Ｏ蓉",
        "room1": "6017",
        "room2": "B",
        "table": "19"
      },
      {
        "no": 5,
        "name": "黃Ｏ心",
        "room1": "6001",
        "room2": "A",
        "table": "18"
      },
      {
        "no": 6,
        "name": "蔡Ｏ心",
        "room1": "6001",
        "room2": "A",
        "table": "19"
      },
      {
        "no": 7,
        "name": "王Ｏ晴",
        "room1": "6001",
        "room2": "A",
        "table": "18"
      },
      {
        "no": 8,
        "name": "蔡Ｏ淣",
        "room1": "6001",
        "room2": "A",
        "table": "19"
      },
      {
        "no": 9,
        "name": "王Ｏ希",
        "room1": "6017",
        "room2": "B",
        "table": "18"
      },
      {
        "no": 10,
        "name": "陳Ｏ睿",
        "room1": "6018",
        "room2": "A",
        "table": "19"
      },
      {
        "no": 11,
        "name": "林Ｏ樂",
        "room1": "6018",
        "room2": "B",
        "table": "19"
      },
      {
        "no": 12,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 13,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 14,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 15,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 16,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 17,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 18,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 19,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 20,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 21,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 22,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 23,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 24,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 25,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      }
    ]
  },
  "609": {
    "className": "609",
    "teacher": "劉Ｏ綾",
    "totalCount": 26,
    "boys": [
      {
        "no": 1,
        "name": "李Ｏ熙",
        "room1": "5011",
        "room2": "B",
        "table": "21"
      },
      {
        "no": 2,
        "name": "陳Ｏ睿",
        "room1": "5011",
        "room2": "C",
        "table": "20"
      },
      {
        "no": 3,
        "name": "黃Ｏ凱",
        "room1": "5010",
        "room2": "B",
        "table": "21"
      },
      {
        "no": 4,
        "name": "范Ｏ禾",
        "room1": "5011",
        "room2": "C",
        "table": "20"
      },
      {
        "no": 5,
        "name": "賴Ｏ穎",
        "room1": "5008",
        "room2": "C",
        "table": "20"
      },
      {
        "no": 6,
        "name": "謝Ｏ易",
        "room1": "5010",
        "room2": "B",
        "table": "21"
      },
      {
        "no": 7,
        "name": "李Ｏ俊",
        "room1": "5009",
        "room2": "A",
        "table": "21"
      },
      {
        "no": 8,
        "name": "林Ｏ軒",
        "room1": "5010",
        "room2": "B",
        "table": "21"
      },
      {
        "no": 9,
        "name": "張Ｏ睿",
        "room1": "5011",
        "room2": "C",
        "table": "20"
      },
      {
        "no": 10,
        "name": "謝Ｏ澄",
        "room1": "5009",
        "room2": "A",
        "table": "21"
      },
      {
        "no": 11,
        "name": "郭Ｏ語",
        "room1": "5009",
        "room2": "A",
        "table": "21"
      },
      {
        "no": 12,
        "name": "黃Ｏ翔",
        "room1": "5009",
        "room2": "A",
        "table": "21"
      },
      {
        "no": 13,
        "name": "陳Ｏ儒",
        "room1": "5010",
        "room2": "B",
        "table": "21"
      },
      {
        "no": 14,
        "name": "曹Ｏ軒",
        "room1": "5008",
        "room2": "C",
        "table": "20"
      },
      {
        "no": 15,
        "name": "宋Ｏ旭",
        "room1": "5008",
        "room2": "C",
        "table": "21"
      },
      {
        "no": 16,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 17,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 18,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 19,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 20,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 21,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 22,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 23,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 24,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 25,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      }
    ],
    "girls": [
      {
        "no": 1,
        "name": "洪Ｏ凌",
        "room1": "7009",
        "room2": "B",
        "table": "22"
      },
      {
        "no": 2,
        "name": "黃Ｏ菲",
        "room1": "7011",
        "room2": "B",
        "table": "22"
      },
      {
        "no": 3,
        "name": "黃Ｏ喬",
        "room1": "7011",
        "room2": "B",
        "table": "22"
      },
      {
        "no": 4,
        "name": "楊Ｏ瑜",
        "room1": "7009",
        "room2": "A",
        "table": "22"
      },
      {
        "no": 5,
        "name": "陳Ｏ彤",
        "room1": "7010",
        "room2": "A",
        "table": "20"
      },
      {
        "no": 6,
        "name": "秦Ｏ綺",
        "room1": "7010",
        "room2": "A",
        "table": "22"
      },
      {
        "no": 7,
        "name": "黃Ｏ宇",
        "room1": "7011",
        "room2": "B",
        "table": "22"
      },
      {
        "no": 8,
        "name": "汪Ｏ馷",
        "room1": "7010",
        "room2": "A",
        "table": "22"
      },
      {
        "no": 9,
        "name": "蔡Ｏ函",
        "room1": "7011",
        "room2": "B",
        "table": "22"
      },
      {
        "no": 10,
        "name": "顧Ｏ菱",
        "room1": "7009",
        "room2": "B",
        "table": "22"
      },
      {
        "no": 11,
        "name": "蕭Ｏ璇",
        "room1": "7010",
        "room2": "A",
        "table": "22"
      },
      {
        "no": 12,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 13,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 14,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 15,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 16,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 17,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 18,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 19,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 20,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 21,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 22,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 23,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 24,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      },
      {
        "no": 25,
        "name": "",
        "room1": "",
        "room2": "",
        "table": ""
      }
    ]
  }
};

// ==========================================================================
// 【米色色塊調色盤】：同班級、同房間或同桌給予相同的米色色塊呈現
// 包含：米黃、米紅、米藍、米綠、米紫、米橙、米青、米茶等柔和高易讀色彩
// ==========================================================================
const BEIGE_PALETTE = [
  { key: "yellow", name: "米黃", bg: "#fef9c3", border: "#fde047", badgeBg: "#fef08a", text: "#713f12", tagBg: "#fef3c7" },
  { key: "rose",   name: "米紅", bg: "#ffe4e6", border: "#fecdd3", badgeBg: "#fecdd3", text: "#881337", tagBg: "#fff1f2" },
  { key: "blue",   name: "米藍", bg: "#e0f2fe", border: "#bae6fd", badgeBg: "#bae6fd", text: "#075985", tagBg: "#f0f9ff" },
  { key: "green",  name: "米綠", bg: "#dcfce7", border: "#bbf7d0", badgeBg: "#bbf7d0", text: "#14532d", tagBg: "#f0fdf4" },
  { key: "purple", name: "米紫", bg: "#f3e8ff", border: "#e9d5ff", badgeBg: "#e9d5ff", text: "#581c87", tagBg: "#faf5ff" },
  { key: "orange", name: "米橙", bg: "#ffedd5", border: "#fed7aa", badgeBg: "#fed7aa", text: "#7c2d12", tagBg: "#fff7ed" },
  { key: "teal",   name: "米青", bg: "#ccfbf1", border: "#99f6e4", badgeBg: "#99f6e4", text: "#134e4a", tagBg: "#f0fdfa" },
  { key: "tea",    name: "米茶", bg: "#f5ebe0", border: "#e6ccb2", badgeBg: "#ddb892", text: "#52362b", tagBg: "#fdfaf6" }
];

// 全域狀態：簡化預設為緊湊模式（手機優先，只顯示有資料學生，點擊展開全部25格）
let sheetColorMode = "column";      // "column" | "room1" | "room2" | "table" | "none"
let sheetActiveView = "sheet";      // "sheet" | "tables" | "rooms1" | "rooms2"
let sheetShowEmptyRows = false;     // false: 緊湊模式 | true: 顯示完整 1~25 格空白列
let activeHighlight = null;         // { type: "room1"|"room2"|"table", val: string } | null
let isDrawerOpen = false;

// 人名去識別化函數 (適用學生與導師，去中字以全形「Ｏ」代替)
function maskPersonName(name) {
  return maskStudentName(name);
}

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
    if (data[c]) {
      if (data[c].teacher) {
        data[c].teacher = maskPersonName(data[c].teacher);
      }
      if (data[c].boys) {
        data[c].boys.forEach(b => {
          if (b.name) b.name = maskPersonName(b.name);
        });
      }
      if (data[c].girls) {
        data[c].girls.forEach(g => {
          if (g.name) g.name = maskPersonName(g.name);
        });
      }
    }
  });
  return data;
}

// 資料版本控管：確保更新官方資料、導師去識別化與下拉漢堡選單時，使用者端自動升級至最新版本
const OFFICIAL_DATA_VERSION = "20261026_v6_responsive_fit";

function getInitialSheetData() {
  const savedVersion = localStorage.getItem("ly_room_table_version");
  const savedData = localStorage.getItem("ly_room_table_sheets");

  if (savedVersion === OFFICIAL_DATA_VERSION && savedData) {
    try {
      const parsed = JSON.parse(savedData);
      return sanitizeSheetData(parsed);
    } catch (e) {
      console.error(e);
    }
  }

  // 升級或初次載入：寫入完整官方9班資料
  const data = JSON.parse(JSON.stringify(officialSheetData));
  localStorage.setItem("ly_room_table_version", OFFICIAL_DATA_VERSION);
  localStorage.setItem("ly_room_table_sheets", JSON.stringify(data));
  return sanitizeSheetData(data);
}

let sheetData = getInitialSheetData();

// 儲存的查房打勾狀態
let checkState = {
  1: JSON.parse(localStorage.getItem(hotelInfo[1].storageKey) || "{}"),
  2: JSON.parse(localStorage.getItem(hotelInfo[2].storageKey) || "{}")
};

// 獲取班級專屬房桌號色塊映射表 (支援男女分宿與性別專屬米色色塊)
function getClassColorMaps(className) {
  const cData = sheetData[className];
  if (!cData) {
    return { room1Map: {}, room2Map: {}, tableMap: {}, r1List: [], r2List: [], tbList: [], allSt: [] };
  }

  const allSt = [
    ...(cData.boys || []).map(b => ({ ...b, gender: "boys", genderText: "男" })),
    ...(cData.girls || []).map(g => ({ ...g, gender: "girls", genderText: "女" }))
  ];

  const r1List = [];
  const r2List = [];
  const tbList = [];

  const r1BoysList = [];
  const r1GirlsList = [];
  const r2BoysList = [];
  const r2GirlsList = [];

  (cData.boys || []).forEach(st => {
    const r1 = (st.room1 || "").trim();
    const r2 = (st.room2 || "").trim();
    if (r1 && !r1BoysList.includes(r1)) r1BoysList.push(r1);
    if (r2 && !r2BoysList.includes(r2)) r2BoysList.push(r2);
  });

  (cData.girls || []).forEach(st => {
    const r1 = (st.room1 || "").trim();
    const r2 = (st.room2 || "").trim();
    if (r1 && !r1GirlsList.includes(r1)) r1GirlsList.push(r1);
    if (r2 && !r2GirlsList.includes(r2)) r2GirlsList.push(r2);
  });

  allSt.forEach(st => {
    const r1 = (st.room1 || "").trim();
    const r2 = (st.room2 || "").trim();
    const tb = (st.table || "").trim();
    if (r1 && !r1List.includes(r1)) r1List.push(r1);
    if (r2 && !r2List.includes(r2)) r2List.push(r2);
    if (tb && !tbList.includes(tb)) tbList.push(tb);
  });

  r1List.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  r2List.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  tbList.sort((a, b) => {
    const na = parseInt(a, 10);
    const nb = parseInt(b, 10);
    if (!isNaN(na) && !isNaN(nb)) return na - nb;
    return a.localeCompare(b);
  });

  const room1Map = {};
  r1List.forEach((r, idx) => {
    room1Map[r] = BEIGE_PALETTE[idx % BEIGE_PALETTE.length];
  });

  const room2Map = {};
  r2List.forEach((r, idx) => {
    room2Map[r] = BEIGE_PALETTE[idx % BEIGE_PALETTE.length];
  });

  // 為男生與女生可能同名（如 608/609 班第二晚 A、B 房）提供帶性別的專屬米色色塊，防止視覺衝突
  let r1ColorIdx = 0;
  r1BoysList.sort((a, b) => a.localeCompare(b, undefined, { numeric: true })).forEach(r => {
    room1Map[`boys_${r}`] = BEIGE_PALETTE[r1ColorIdx % BEIGE_PALETTE.length];
    r1ColorIdx++;
  });
  r1GirlsList.sort((a, b) => a.localeCompare(b, undefined, { numeric: true })).forEach(r => {
    room1Map[`girls_${r}`] = BEIGE_PALETTE[r1ColorIdx % BEIGE_PALETTE.length];
    r1ColorIdx++;
  });

  let r2ColorIdx = 0;
  r2BoysList.sort((a, b) => a.localeCompare(b, undefined, { numeric: true })).forEach(r => {
    room2Map[`boys_${r}`] = BEIGE_PALETTE[r2ColorIdx % BEIGE_PALETTE.length];
    r2ColorIdx++;
  });
  r2GirlsList.sort((a, b) => a.localeCompare(b, undefined, { numeric: true })).forEach(r => {
    room2Map[`girls_${r}`] = BEIGE_PALETTE[r2ColorIdx % BEIGE_PALETTE.length];
    r2ColorIdx++;
  });

  const tableMap = {};
  tbList.forEach((t, idx) => {
    tableMap[t] = BEIGE_PALETTE[idx % BEIGE_PALETTE.length];
  });

  return { room1Map, room2Map, tableMap, r1List, r2List, tbList, allSt };
}

// ==========================================================================
// 【關鍵實裝】：將「房桌號表 (查房表)」直接併入手冊最後一頁
// ==========================================================================
if (typeof pagesContent !== "undefined") {
  pagesContent.push({
    num: pagesContent.length + 1,
    title: "學生校外教學活動房桌號表 (查房表)",
    category: "住宿查房",
    render: () => renderSheetPageHtml()
  });
}

function renderSheetPageHtml() {
  return `
    <div class="sheet-page-container">
      
      <!-- 頂部精簡標題與個資提示 (大幅縮減垂直高度) -->
      <div class="sheet-compact-header">
        <div class="sheet-header-title-row">
          <div class="sheet-main-heading">📋 麗園國小學生校外教學活動房桌號表</div>
          <span class="privacy-compact-badge">🔒 師生姓名已去識別化</span>
        </div>
        <div class="sheet-hotel-subtitle">
          🍎 教師專用版 · 第一晚：今埔里渡假大酒店 ｜ 第二晚：麗寶福容大飯店
        </div>
      </div>

      <!-- 下拉選單與漢堡按鈕統一控制列 (極簡化版面，消除大量堆疊按鈕) -->
      <div class="sheet-unified-toolbar">
        
        <!-- 班級下拉選單 (含全校總覽與各班) -->
        <div class="toolbar-select-wrap">
          <label for="sheetClassSelect" class="toolbar-select-label">🏫 班級：</label>
          <select id="sheetClassSelect" class="toolbar-select" onchange="selectSheetClassPage(this.value)">
            <option value="all" ${currentSheetClass === "all" ? "selected" : ""}>🌐 全校六年級全部班級 (601 ~ 609)</option>
            ${initialClasses.map(c => {
              const info = sheetData[c] || {};
              const tName = maskPersonName(info.teacher || "");
              const cnt = info.totalCount || 0;
              return `<option value="${c}" ${c === currentSheetClass ? "selected" : ""}>${c} 班 (導師: ${tName} · ${cnt}人)</option>`;
            }).join("")}
          </select>
        </div>

        <!-- 檢視模式下拉選單 -->
        <div class="toolbar-select-wrap">
          <label for="sheetViewSelect" class="toolbar-select-label">👁️ 檢視：</label>
          <select id="sheetViewSelect" class="toolbar-select" onchange="setSheetViewMode(this.value)">
            <option value="sheet" ${sheetActiveView === "sheet" ? "selected" : ""}>📋 實體雙欄名冊 (1~25號)</option>
            <option value="tables" ${sheetActiveView === "tables" ? "selected" : ""}>🍽️ 用餐桌號分組一覽</option>
            <option value="rooms1" ${sheetActiveView === "rooms1" ? "selected" : ""}>🏨 第一晚查房點名 (今埔里)</option>
            <option value="rooms2" ${sheetActiveView === "rooms2" ? "selected" : ""}>🏰 第二晚查房點名 (福容)</option>
          </select>
        </div>

        <!-- 色塊模式下拉選單 (實體座位表時有效) -->
        <div class="toolbar-select-wrap" id="toolbarColorSelectWrap" style="${sheetActiveView === 'sheet' ? '' : 'display:none;'}">
          <label for="sheetColorSelect" class="toolbar-select-label">🎨 色塊：</label>
          <select id="sheetColorSelect" class="toolbar-select" onchange="setSheetColorMode(this.value)">
            <option value="column" ${sheetColorMode === "column" ? "selected" : ""}>📌 各欄獨立米色塊 (預設)</option>
            <option value="room1" ${sheetColorMode === "room1" ? "selected" : ""}>🏨 依第一晚房號整行著色</option>
            <option value="room2" ${sheetColorMode === "room2" ? "selected" : ""}>🏰 依第二晚房號整行著色</option>
            <option value="table" ${sheetColorMode === "table" ? "selected" : ""}>🍽️ 依用餐桌號整行著色</option>
            <option value="none" ${sheetColorMode === "none" ? "selected" : ""}>⚪ 純白 (極簡)</option>
          </select>
        </div>

        <!-- 漢堡選單抽屜開啟按鈕 (含更多進階設定與完整色塊圖例) -->
        <div class="toolbar-btn-wrap">
          <button class="sheet-drawer-toggle-btn" onclick="openSheetDrawer()" title="開啟功能選單與專屬米色圖例">
            <span class="burger-icon">☰</span>
            <span class="btn-text">功能/圖例</span>
            <span id="drawerHighlightIndicator" class="drawer-highlight-dot" style="${activeHighlight ? 'display:inline-block;' : 'display:none;'}"></span>
          </button>
        </div>
      </div>

      <!-- 快速模式切換膠囊列 (手機極簡直覺點選，免開下拉選單) -->
      <div class="sheet-view-pill-bar" id="sheetViewPillBar">
        <button class="view-pill-btn ${sheetActiveView === 'sheet' ? 'active' : ''}" data-view="sheet" onclick="setSheetViewMode('sheet')">
          📋 實體名冊
        </button>
        <button class="view-pill-btn ${sheetActiveView === 'tables' ? 'active' : ''}" data-view="tables" onclick="setSheetViewMode('tables')">
          🍽️ 用餐分桌
        </button>
        <button class="view-pill-btn ${sheetActiveView === 'rooms1' ? 'active' : ''}" data-view="rooms1" onclick="setSheetViewMode('rooms1')">
          🏨 今埔里查房
        </button>
        <button class="view-pill-btn ${sheetActiveView === 'rooms2' ? 'active' : ''}" data-view="rooms2" onclick="setSheetViewMode('rooms2')">
          🏰 福容查房
        </button>
      </div>

      <!-- 當前連動高亮提示列 (若有點選高亮時才浮現，乾淨不佔位) -->
      <div id="sheetActiveHighlightBar" class="sheet-active-highlight-bar" style="${activeHighlight ? 'display:flex;' : 'display:none;'}">
        <span id="sheetActiveHighlightText">✨ 已高亮聚焦中</span>
        <button onclick="clearHighlightTarget()" class="clear-highlight-btn">✕ 清除高亮</button>
      </div>

      <!-- 表格主體 (合併統一呈現，下方不再有重複區塊) -->
      <div class="sheet-container" style="border:1px solid #cbd5e1; margin-bottom:18px; width:100%; max-width:100%; box-sizing:border-box;">
        
        <!-- 表格主標題 (僅在實體座位表模式顯示) -->
        <div class="sheet-title-header" style="margin-bottom:8px; ${sheetActiveView === 'sheet' ? '' : 'display:none;'}">
          <div class="sheet-main-title" style="font-size:1.2rem;">麗園國小學生校外教學活動房桌號表</div>
        </div>

        <!-- 班級、合計、導師 (導師姓名已去識別化) Meta 列 (僅在實體座位表模式顯示) -->
        <div class="sheet-meta-bar" style="margin-bottom:10px; padding:6px 12px; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px; ${sheetActiveView === 'sheet' ? 'display:flex;' : 'display:none;'}">
          <div style="display:flex; align-items:center; gap:12px; flex-wrap:wrap;">
            <div>
              <span style="font-size:0.85rem; color:#64748b;">班級：</span>
              <span id="sheetDisplayClassPage" style="color:#2563eb; font-weight:800; font-size:1rem;">6年1班 (601班)</span>
            </div>
            <div>
              <span style="font-size:0.85rem; color:#64748b;">導師：</span>
              <input type="text" id="sheetInputTeacherPage" class="sheet-meta-input" style="width:85px; font-size:0.95rem; font-weight:800; color:#0f172a;" placeholder="填寫導師" onchange="updateSheetMeta('teacher', this.value)">
            </div>
            <div>
              <span style="font-size:0.85rem; color:#64748b;">合計：</span>
              <input type="number" id="sheetInputTotalPage" class="sheet-meta-input" style="width:45px; text-align:center; font-size:0.95rem; font-weight:800;" placeholder="人數" onchange="updateSheetMeta('totalCount', this.value)">
              <span style="font-size:0.85rem; color:#64748b;">人</span>
            </div>
          </div>

          <div style="display:flex; align-items:center; gap:6px;">
            <button class="switch-to-patrol-btn" onclick="setSheetViewMode('rooms1')" title="前往第一晚查房點名">
              🏨 查房點名
            </button>
            <button id="btnToggleEmptyRows" class="empty-rows-toggle-btn" onclick="toggleEmptyRowsMode()" title="切換緊湊檢視或顯示完整25格空白列">
              ${sheetShowEmptyRows ? '📱 切換為緊湊模式' : '📄 展開完整 25 格'}
            </button>
            <span id="sheetSaveNoticePage" style="font-size:0.75rem; color:#059669; font-weight:700; opacity:0; transition:opacity 0.3s ease;">💾 已自動儲存</span>
          </div>
        </div>

        <!-- 內容呈現區：可切換「實體男女雙欄表格」或「分組卡片檢視」 -->
        <div id="sheetMainContentArea">
          <!-- 雙大欄表格：左男生、右女生 -->
          <div class="sheet-tables-wrap" id="sheetDualTablesWrap">
            <!-- 男生表格 -->
            <div class="table-box">
              <div class="table-box-header boys">👦 男生房桌號表</div>
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
              <div class="table-box-header girls">👧 女生房桌號表</div>
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

          <!-- 分組卡片展示區塊 (當切換到用餐桌號或房間分組檢視時呈現) -->
          <div id="sheetGroupCardsWrap" style="display:none;"></div>
        </div>

      </div>

      <!-- 漢堡選單抽屜 (側邊滑出面板) -->
      <div class="sheet-drawer-backdrop" id="sheetDrawerBackdrop" onclick="closeSheetDrawer()"></div>
      <aside class="sheet-drawer" id="sheetDrawer">
        <div class="sheet-drawer-header">
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-size:1.2rem;">⚙️</span>
            <h4 style="margin:0; font-size:0.95rem; font-weight:800; color:#0f172a;">房桌號表功能與色塊設定</h4>
          </div>
          <button class="sheet-drawer-close-btn" onclick="closeSheetDrawer()">✕</button>
        </div>

        <div class="sheet-drawer-body">
          
          <!-- 班級快速切換切片 -->
          <div class="drawer-section">
            <div class="drawer-section-title">🏫 快速切換班級：</div>
            <div class="drawer-class-grid" id="drawerClassGrid">
              <button class="drawer-chip-btn ${currentSheetClass === 'all' ? 'active' : ''}" data-class="all" onclick="selectSheetClassPage('all', true)">
                🌐 全校
              </button>
              ${initialClasses.map(c => `
                <button class="drawer-chip-btn ${currentSheetClass === c ? 'active' : ''}" data-class="${c}" onclick="selectSheetClassPage('${c}', true)">
                  ${c} 班
                </button>
              `).join("")}
            </div>
          </div>

          <!-- 檢視模式選擇 -->
          <div class="drawer-section">
            <div class="drawer-section-title">👁️ 檢視方式：</div>
            <div class="drawer-btn-list">
              <button class="drawer-list-btn ${sheetActiveView === 'sheet' ? 'active' : ''}" onclick="setSheetViewMode('sheet'); closeSheetDrawer();">
                📋 實體雙欄名冊 (1~25號)
              </button>
              <button class="drawer-list-btn ${sheetActiveView === 'tables' ? 'active' : ''}" onclick="setSheetViewMode('tables'); closeSheetDrawer();">
                🍽️ 用餐桌號分組一覽
              </button>
              <button class="drawer-list-btn ${sheetActiveView === 'rooms1' ? 'active' : ''}" onclick="setSheetViewMode('rooms1'); closeSheetDrawer();">
                🏨 第一晚查房點名 (今埔里)
              </button>
              <button class="drawer-list-btn ${sheetActiveView === 'rooms2' ? 'active' : ''}" onclick="setSheetViewMode('rooms2'); closeSheetDrawer();">
                🏰 第二晚查房點名 (福容)
              </button>
            </div>
          </div>

          <!-- 色塊呈現模式選擇 -->
          <div class="drawer-section">
            <div class="drawer-section-title">🎨 色塊呈現模式：</div>
            <div class="drawer-btn-list">
              <button class="drawer-list-btn ${sheetColorMode === 'column' ? 'active' : ''}" onclick="setSheetColorMode('column')">
                📌 各欄獨立米色塊 (預設)
              </button>
              <button class="drawer-list-btn ${sheetColorMode === 'room1' ? 'active' : ''}" onclick="setSheetColorMode('room1')">
                🏨 依第一晚房號整行著色
              </button>
              <button class="drawer-list-btn ${sheetColorMode === 'room2' ? 'active' : ''}" onclick="setSheetColorMode('room2')">
                🏰 依第二晚房號整行著色
              </button>
              <button class="drawer-list-btn ${sheetColorMode === 'table' ? 'active' : ''}" onclick="setSheetColorMode('table')">
                🍽️ 依用餐桌號整行著色
              </button>
              <button class="drawer-list-btn ${sheetColorMode === 'none' ? 'active' : ''}" onclick="setSheetColorMode('none')">
                ⚪ 純白極簡
              </button>
            </div>
          </div>

          <!-- 行數顯示模式 -->
          <div class="drawer-section">
            <div class="drawer-section-title">📄 表格顯示行數：</div>
            <div class="drawer-btn-list">
              <button class="drawer-list-btn ${!sheetShowEmptyRows ? 'active' : ''}" onclick="setEmptyRowsMode(false); closeSheetDrawer();">
                📱 緊湊閱讀模式 (僅顯示實際學生，推薦手機)
              </button>
              <button class="drawer-list-btn ${sheetShowEmptyRows ? 'active' : ''}" onclick="setEmptyRowsMode(true); closeSheetDrawer();">
                📄 完整實體模式 (顯示完整 1~25 格空白欄)
              </button>
            </div>
          </div>

          <!-- 專屬米色色塊圖例與連動高亮器 -->
          <div class="drawer-section">
            <div class="drawer-section-title" style="display:flex; justify-content:space-between; align-items:center;">
              <span id="drawerLegendClassTitle">🎨 【${currentSheetClass}班】米色色塊圖例：</span>
              ${activeHighlight ? '<button onclick="clearHighlightTarget()" style="background:#e2e8f0; border:none; padding:2px 8px; border-radius:4px; font-size:0.75rem; color:#475569; cursor:pointer; font-weight:700;">✕ 清除高亮</button>' : ''}
            </div>
            <p style="font-size:0.75rem; color:#64748b; margin:2px 0 8px;">點選任一色塊膠囊，下方名冊自動連動高亮聚焦對應學生：</p>
            <div id="drawerLegendContent"></div>
          </div>

          <!-- 快捷操作 -->
          <div class="drawer-section" style="border-top:1px solid #e2e8f0; padding-top:12px;">
            <div class="drawer-section-title">⚡ 快速操作：</div>
            <div style="display:flex; flex-direction:column; gap:8px;">
              <button onclick="window.print(); closeSheetDrawer();" class="drawer-action-btn" style="background:#2563eb; color:white;">
                🖨️ 列印此表 (自動輸出完整 A4)
              </button>
              <button onclick="scrollToPatrolSection(); closeSheetDrawer();" class="drawer-action-btn" style="background:#f59e0b; color:#0f172a;">
                🏨 直達夜間巡房點名系統
              </button>
              <button onclick="openClearPatrolModal(); closeSheetDrawer();" class="drawer-action-btn" style="background:#fee2e2; border:1px solid #fca5a5; color:#991b1b;">
                🧹 清除查房點名紀錄
              </button>
            </div>
          </div>

        </div>
      </aside>

      <!-- 清除點名專屬確認彈窗 (Modal Action Sheet) -->
      <div class="patrol-modal-backdrop" id="clearPatrolModalBackdrop" onclick="closeClearPatrolModal()"></div>
      <div class="patrol-modal" id="clearPatrolModal">
        <div class="patrol-modal-header">
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-size:1.3rem;">🧹</span>
            <div>
              <h4 style="margin:0; font-size:0.95rem; font-weight:800; color:#0f172a;">清除查房點名紀錄</h4>
              <span style="font-size:0.75rem; color:#64748b;" id="clearModalHotelName">今埔里渡假大酒店</span>
            </div>
          </div>
          <button class="patrol-modal-close" onclick="closeClearPatrolModal()">✕</button>
        </div>
        <div class="patrol-modal-body">
          <p style="font-size:0.82rem; color:#475569; margin:0 0 12px; line-height:1.5;">
            請選擇您要清除的點名與備註紀錄範圍。清除後房間狀態將回復為「⏳ 待查房」，進度條將同步重新計算：
          </p>
          <div class="clear-modal-actions">
            <button class="clear-opt-btn btn-class-clear" id="btnClearClassConfirm">
              <span class="opt-icon">🧹</span>
              <div class="opt-text">
                <b class="opt-title">僅清除【<span id="clearModalClassText">601 班</span>】點名</b>
                <span class="opt-desc">保留其他班級紀錄，只重置此班的勾選狀態與備註</span>
              </div>
            </button>

            <button class="clear-opt-btn btn-all-clear" id="btnClearAllConfirm">
              <span class="opt-icon">⚠️</span>
              <div class="opt-text">
                <b class="opt-title">清除【當晚全校所有班級】點名</b>
                <span class="opt-desc">重置 601～609 全部 9 個班級的查房打勾與備註</span>
              </div>
            </button>
          </div>
        </div>
        <div class="patrol-modal-footer">
          <button class="patrol-modal-cancel-btn" onclick="closeClearPatrolModal()">取消</button>
        </div>
      </div>

    </div>
  `;
}

// 抽屜控制函數
window.openSheetDrawer = function() {
  const drawer = document.getElementById("sheetDrawer");
  const backdrop = document.getElementById("sheetDrawerBackdrop");
  if (drawer) drawer.classList.add("active");
  if (backdrop) backdrop.classList.add("active");
  isDrawerOpen = true;
  document.body.style.overflow = "hidden";
  renderSheetDrawerContent();
};

window.closeSheetDrawer = function() {
  const drawer = document.getElementById("sheetDrawer");
  const backdrop = document.getElementById("sheetDrawerBackdrop");
  if (drawer) drawer.classList.remove("active");
  if (backdrop) backdrop.classList.remove("active");
  isDrawerOpen = false;
  document.body.style.overflow = "";
};

window.toggleSheetDrawer = function() {
  if (isDrawerOpen) window.closeSheetDrawer();
  else window.openSheetDrawer();
};

window.scrollToPatrolSection = function() {
  if (sheetActiveView !== "rooms1" && sheetActiveView !== "rooms2") {
    setSheetViewMode("rooms1");
  }
  const el = document.getElementById("sheetGroupCardsWrap") || document.getElementById("sheetMainContentArea");
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

window.scrollToClass = function(cKey) {
  if (currentSheetClass !== "all") {
    selectSheetClassPage(cKey);
    return;
  }
  const el = document.getElementById(`patrol_class_${cKey}`);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    el.classList.add("flash-highlight");
    setTimeout(() => el.classList.remove("flash-highlight"), 1600);
  }
};

// 切換空白行顯示模式
window.setEmptyRowsMode = function(showEmpty) {
  sheetShowEmptyRows = showEmpty;
  const btn = document.getElementById("btnToggleEmptyRows");
  if (btn) {
    btn.textContent = sheetShowEmptyRows ? '📱 切換為緊湊模式' : '📄 展開完整 25 格';
  }
  renderRoomSheetTablePage();
};

window.toggleEmptyRowsMode = function() {
  window.setEmptyRowsMode(!sheetShowEmptyRows);
};

// 渲染抽屜內色塊圖例與高亮點名器
function renderSheetDrawerContent() {
  try {
    const titleEl = document.getElementById("drawerLegendClassTitle");
    if (titleEl) {
      titleEl.textContent = `🎨 【${currentSheetClass}班】米色色塊圖例：`;
    }

    const container = document.getElementById("drawerLegendContent");
    if (!container) return;

    const { room1Map, room2Map, tableMap, r1List, r2List, tbList, allSt } = getClassColorMaps(currentSheetClass);
    const defaultColor = (BEIGE_PALETTE && BEIGE_PALETTE[0]) || { key: "yellow", name: "米黃", bg: "#fef9c3", border: "#fde047", badgeBg: "#fef08a", text: "#854d0e", tagBg: "#fefce8" };

    container.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:8px;">
        <!-- 第一晚今埔里 -->
        <div>
          <span style="font-size:0.75rem; font-weight:800; color:#475569;">🏨 第一晚 (今埔里)：</span>
          <div style="display:flex; flex-wrap:wrap; gap:5px; margin-top:4px;">
            ${r1List.map(r => {
              const col = room1Map[r] || defaultColor;
              const cnt = allSt.filter(s => s.room1 === r && s.name).length;
              const isMatch = activeHighlight && activeHighlight.type === "room1" && activeHighlight.val === r;
              return `
                <span class="color-legend-pill ${isMatch ? "active" : ""}" style="background:${col.bg}; border:1px solid ${col.border}; color:${col.text};" onclick="toggleHighlightTarget('room1', '${r}')">
                  ${r} 房 (${cnt}人) · ${col.name}
                </span>
              `;
            }).join("")}
          </div>
        </div>

        <!-- 第二晚福容 -->
        <div>
          <span style="font-size:0.75rem; font-weight:800; color:#475569;">🏰 第二晚 (麗寶福容)：</span>
          <div style="display:flex; flex-wrap:wrap; gap:5px; margin-top:4px;">
            ${r2List.map(r => {
              const col = room2Map[r] || defaultColor;
              const cnt = allSt.filter(s => s.room2 === r && s.name).length;
              const isMatch = activeHighlight && activeHighlight.type === "room2" && activeHighlight.val === r;
              return `
                <span class="color-legend-pill ${isMatch ? "active" : ""}" style="background:${col.bg}; border:1px solid ${col.border}; color:${col.text};" onclick="toggleHighlightTarget('room2', '${r}')">
                  ${r} 房 (${cnt}人) · ${col.name}
                </span>
              `;
            }).join("")}
          </div>
        </div>

        <!-- 用餐桌號 -->
        <div>
          <span style="font-size:0.75rem; font-weight:800; color:#475569;">🍽️ 用餐桌號：</span>
          <div style="display:flex; flex-wrap:wrap; gap:5px; margin-top:4px;">
            ${tbList.map(t => {
              const col = tableMap[t] || defaultColor;
              const cnt = allSt.filter(s => s.table === t && s.name).length;
              const isMatch = activeHighlight && activeHighlight.type === "table" && activeHighlight.val === t;
              return `
                <span class="color-legend-pill ${isMatch ? "active" : ""}" style="background:${col.bg}; border:1px solid ${col.border}; color:${col.text};" onclick="toggleHighlightTarget('table', '${t}')">
                  第 ${t} 桌 (${cnt}人) · ${col.name}
                </span>
              `;
            }).join("")}
          </div>
        </div>
      </div>
    `;

    // 更新抽屜內班級切片狀態，點選後自動關閉抽屜平滑切換
    const grid = document.getElementById("drawerClassGrid");
    if (grid) {
      grid.innerHTML = initialClasses.map(c => `
        <button class="drawer-chip-btn ${currentSheetClass === c ? 'active' : ''}" onclick="selectSheetClassPage('${c}', true)">
          ${c} 班
        </button>
      `).join("");
    }
  } catch (err) {
    console.error("renderSheetDrawerContent error:", err);
  }
}

// 掛載動態元件
window.initSheetPageComponents = function() {
  renderRoomSheetTablePage();
  renderPatrolGridPage();
};

document.addEventListener("DOMContentLoaded", () => {
  // 頂部導覽列「📋 房桌號表」按鈕一鍵跳轉到最後一頁
  const openBtn = document.getElementById("btnOpenRooms");
  if (openBtn) {
    openBtn.addEventListener("click", () => {
      if (typeof goToPage === "function") {
        goToPage(pagesContent.length);
      }
    });
  }

  // 若當前頁面恰好為最後一頁，進行渲染
  if (currentPage === pagesContent.length) {
    initSheetPageComponents();
  }
});

/* --------------------------------------------------------------------------
   第 22 頁房桌號表互動與色塊控制 (下拉選單同步更新)
   -------------------------------------------------------------------------- */
window.selectSheetClassPage = function(c, closeDrawer = false) {
  if (!c || (c !== "all" && !sheetData[c])) {
    c = "601";
  }
  currentSheetClass = c;
  activePatrolClassFilter = c;
  activeHighlight = null; // 切換班級時清除高亮

  // 同步更新班級下拉選單
  const select = document.getElementById("sheetClassSelect");
  if (select) select.value = c;

  // 同步更新抽屜班級按鈕高亮
  const chips = document.querySelectorAll(".drawer-chip-btn");
  chips.forEach(btn => {
    btn.classList.toggle("active", btn.dataset.class === c);
  });

  // 同步更新檢視模式下拉選單
  const viewSelect = document.getElementById("sheetViewSelect");
  if (viewSelect) viewSelect.value = sheetActiveView;

  // 同步更新色塊模式下拉選單
  const colorSelect = document.getElementById("sheetColorSelect");
  if (colorSelect) colorSelect.value = sheetColorMode;

  // 若從抽屜快速選單點選，自動收合抽屜提升操作順暢度
  if (closeDrawer && typeof window.closeSheetDrawer === "function") {
    window.closeSheetDrawer();
  }

  renderRoomSheetTablePage();
  if (isDrawerOpen) renderSheetDrawerContent();

  // 平滑跳轉定位：點哪個班級，自動平滑定位跳轉至該班級內容區塊
  if (c !== "all") {
    const targetEl = document.getElementById(`patrol_class_${c}`);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
      targetEl.classList.add("flash-highlight");
      setTimeout(() => targetEl.classList.remove("flash-highlight"), 1600);
    } else {
      const contentEl = document.getElementById("sheetMainContentArea");
      if (contentEl) {
        contentEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  } else {
    const contentEl = document.getElementById("sheetMainContentArea");
    if (contentEl) {
      contentEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }
};

window.setSheetColorMode = function(mode) {
  sheetColorMode = mode;
  const select = document.getElementById("sheetColorSelect");
  if (select) select.value = mode;
  renderRoomSheetTablePage();
  if (isDrawerOpen) renderSheetDrawerContent();
};

window.setSheetViewMode = function(vMode) {
  if (sheetActiveView !== vMode && window.AppleFeedback) {
    window.AppleFeedback.selection();
  }
  sheetActiveView = vMode;
  const select = document.getElementById("sheetViewSelect");
  if (select) select.value = vMode;

  // 同步更新快速切換膠囊按鈕高亮
  const pillBtns = document.querySelectorAll("#sheetViewPillBar .view-pill-btn");
  pillBtns.forEach(btn => {
    btn.classList.toggle("active", btn.dataset.view === vMode);
  });

  const colorWrap = document.getElementById("toolbarColorSelectWrap");
  if (colorWrap) {
    colorWrap.style.display = (vMode === "sheet") ? "flex" : "none";
  }

  // 雙向連動飯店
  if (vMode === "rooms1") {
    currentHotelId = 1;
  } else if (vMode === "rooms2") {
    currentHotelId = 2;
  }

  renderRoomSheetTablePage();
  if (isDrawerOpen) renderSheetDrawerContent();
};

window.toggleHighlightTarget = function(type, val) {
  if (activeHighlight && activeHighlight.type === type && activeHighlight.val === val) {
    activeHighlight = null;
  } else {
    activeHighlight = { type, val };
  }
  renderRoomSheetTablePage();
  if (isDrawerOpen) renderSheetDrawerContent();
};

window.clearHighlightTarget = function() {
  activeHighlight = null;
  renderRoomSheetTablePage();
  if (isDrawerOpen) renderSheetDrawerContent();
};

function renderRoomSheetTablePage() {
  try {
    const metaBar = document.querySelector(".sheet-meta-bar");
    const titleHeader = document.querySelector(".sheet-title-header");

    // 控制標題與 Meta 列僅在實體座位表模式顯示，讓分組/查房卡片擁有最大可視高度
    if (metaBar) metaBar.style.display = (sheetActiveView === "sheet") ? "flex" : "none";
    if (titleHeader) titleHeader.style.display = (sheetActiveView === "sheet") ? "block" : "none";

    const targetClass = (currentSheetClass === "all") ? "601" : currentSheetClass;
    const cData = sheetData[targetClass] || {
      className: targetClass,
      teacher: "",
      totalCount: 0,
      boys: generateEmptySlots(),
      girls: generateEmptySlots()
    };

    const classDisplay = document.getElementById("sheetDisplayClassPage");
    const totalInput = document.getElementById("sheetInputTotalPage");
    const teacherInput = document.getElementById("sheetInputTeacherPage");

    const classNum = parseInt(targetClass.replace(/^60?/, ""), 10) || targetClass;
    if (classDisplay) {
      if (currentSheetClass === "all") {
        classDisplay.textContent = `全校六年級 (目前顯示 601 班實體雙欄座位表)`;
      } else {
        classDisplay.textContent = `6年${classNum}班 (${targetClass}班)`;
      }
    }
    if (totalInput) totalInput.value = cData.totalCount || "";
    // 導師姓名自動去識別化
    if (teacherInput) teacherInput.value = maskPersonName(cData.teacher) || "";

    // 更新連動高亮提示列
    const highlightBar = document.getElementById("sheetActiveHighlightBar");
    const highlightText = document.getElementById("sheetActiveHighlightText");
    const indicatorDot = document.getElementById("drawerHighlightIndicator");

    if (activeHighlight) {
      if (highlightBar) highlightBar.style.display = "flex";
      if (indicatorDot) indicatorDot.style.display = "inline-block";
      let typeName = activeHighlight.type === "room1" ? "第一晚房號" : (activeHighlight.type === "room2" ? "第二晚房號" : "用餐桌號");
      if (highlightText) highlightText.innerHTML = `✨ 已高亮聚焦：<b>${typeName} ${activeHighlight.val}</b> 同學名冊`;
    } else {
      if (highlightBar) highlightBar.style.display = "none";
      if (indicatorDot) indicatorDot.style.display = "none";
    }

    const dualWrap = document.getElementById("sheetDualTablesWrap");
    const groupWrap = document.getElementById("sheetGroupCardsWrap");
    const colorWrap = document.getElementById("toolbarColorSelectWrap");

    // 【關鍵修復】：始終同步渲染分組卡片檢視，確保在非實體雙欄座位表模式下切換班級絕不當掉
    if (groupWrap) {
      renderGroupCardsView(groupWrap, cData);
    }

    // 始終同步構建實體座位表 (男女雙欄)，保證資料與 DOM 100% 同步
    const { room1Map, room2Map, tableMap } = getClassColorMaps(targetClass);

    function renderStudentRow(st, gender, idx) {
      const r1 = (st.room1 || "").trim();
      const r2 = (st.room2 || "").trim();
      const tb = (st.table || "").trim();

      const r1Col = r1 ? (room1Map[r1] || null) : null;
      const r2Col = r2 ? (room2Map[r2] || null) : null;
      const tbCol = tb ? (tableMap[tb] || null) : null;

      // 檢查高亮狀態
      let isMatched = false;
      let isDimmed = false;
      if (activeHighlight && st.name) {
        if (activeHighlight.type === "room1" && r1 === activeHighlight.val) isMatched = true;
        else if (activeHighlight.type === "room2" && r2 === activeHighlight.val) isMatched = true;
        else if (activeHighlight.type === "table" && tb === activeHighlight.val) isMatched = true;
        else isDimmed = true;
      }

      // 計算整行底色（依模式）
      let rowStyle = "";
      if (sheetColorMode === "room1" && r1Col) {
        rowStyle = `background-color: ${r1Col.bg};`;
      } else if (sheetColorMode === "room2" && r2Col) {
        rowStyle = `background-color: ${r2Col.bg};`;
      } else if (sheetColorMode === "table" && tbCol) {
        rowStyle = `background-color: ${tbCol.bg};`;
      }

      // 各欄單元格底色
      const r1TdStyle = (sheetColorMode === "column" && r1Col) ? `background-color:${r1Col.bg}; border-color:${r1Col.border};` : "";
      const r1InputStyle = (r1Col) ? `color:${r1Col.text}; font-weight:800;` : "";

      const r2TdStyle = (sheetColorMode === "column" && r2Col) ? `background-color:${r2Col.bg}; border-color:${r2Col.border};` : "";
      const r2InputStyle = (r2Col) ? `color:${r2Col.text}; font-weight:800;` : "";

      const tbTdStyle = (sheetColorMode === "column" && tbCol) ? `background-color:${tbCol.bg}; border-color:${tbCol.border};` : "";
      const tbInputStyle = (tbCol) ? `color:${tbCol.text}; font-weight:800;` : "";

      const trClasses = [
        isMatched ? "highlight-matched" : "",
        isDimmed ? "highlight-dimmed" : ""
      ].filter(Boolean).join(" ");

      return `
        <tr class="${trClasses}" style="${rowStyle}">
          <td class="col-no">${st.no}</td>
          <td class="col-name"><input type="text" value="${maskPersonName(st.name) || ""}" placeholder="姓名" onchange="updateStudentFieldPage('${currentSheetClass}', '${gender}', ${idx}, 'name', this.value)"></td>
          <td class="col-room" style="${r1TdStyle}" title="${r1Col ? `${r1Col.name}色塊：第一晚 ${r1} 房` : ''}">
            <input type="text" value="${r1}" placeholder="房號" style="${r1InputStyle}" onchange="updateStudentFieldPage('${currentSheetClass}', '${gender}', ${idx}, 'room1', this.value)">
          </td>
          <td class="col-room" style="${r2TdStyle}" title="${r2Col ? `${r2Col.name}色塊：第二晚 ${r2} 房` : ''}">
            <input type="text" value="${r2}" placeholder="房號" style="${r2InputStyle}" onchange="updateStudentFieldPage('${currentSheetClass}', '${gender}', ${idx}, 'room2', this.value)">
          </td>
          <td class="col-table" style="${tbTdStyle}" title="${tbCol ? `${tbCol.name}色塊：第 ${tb} 桌` : ''}">
            <input type="text" value="${tb}" placeholder="桌" style="${tbInputStyle}" onchange="updateStudentFieldPage('${currentSheetClass}', '${gender}', ${idx}, 'table', this.value)">
          </td>
        </tr>
      `;
    }

    // 緊湊模式過濾：若未勾選顯示空行，只顯示有名字或有房間資料的學生
    const validBoys = cData.boys.filter(b => b.name && b.name.trim());
    const boysList = sheetShowEmptyRows ? cData.boys : (validBoys.length > 0 ? validBoys : cData.boys.slice(0, 10));

    const validGirls = cData.girls.filter(g => g.name && g.name.trim());
    const girlsList = sheetShowEmptyRows ? cData.girls : (validGirls.length > 0 ? validGirls : cData.girls.slice(0, 10));

    // 渲染男生
    const boysTbody = document.getElementById("sheetBoysTbodyPage");
    if (boysTbody) {
      let boysHtml = boysList.map((b, idx) => {
        const realIdx = cData.boys.findIndex(orig => orig.no === b.no);
        return renderStudentRow(b, "boys", realIdx >= 0 ? realIdx : idx);
      }).join("");

      if (!sheetShowEmptyRows && cData.boys.length > validBoys.length) {
        boysHtml += `
          <tr class="toggle-empty-rows-tr">
            <td colspan="5" onclick="setEmptyRowsMode(true)" style="padding:6px; cursor:pointer; color:#0284c7; font-size:0.75rem; background:#f0f9ff; text-align:center; font-weight:700;">
              + 展開男生其餘 ${cData.boys.length - validBoys.length} 格空白列 (至第 25 號)
            </td>
          </tr>
        `;
      }
      boysTbody.innerHTML = boysHtml;
    }

    // 渲染女生
    const girlsTbody = document.getElementById("sheetGirlsTbodyPage");
    if (girlsTbody) {
      let girlsHtml = girlsList.map((g, idx) => {
        const realIdx = cData.girls.findIndex(orig => orig.no === g.no);
        return renderStudentRow(g, "girls", realIdx >= 0 ? realIdx : idx);
      }).join("");

      if (!sheetShowEmptyRows && cData.girls.length > validGirls.length) {
        girlsHtml += `
          <tr class="toggle-empty-rows-tr">
            <td colspan="5" onclick="setEmptyRowsMode(true)" style="padding:6px; cursor:pointer; color:#0284c7; font-size:0.75rem; background:#f0f9ff; text-align:center; font-weight:700;">
              + 展開女生其餘 ${cData.girls.length - validGirls.length} 格空白列 (至第 25 號)
            </td>
          </tr>
        `;
      }
      girlsTbody.innerHTML = girlsHtml;
    }

    // 依檢視模式切換畫面容器
    if (sheetActiveView === "sheet") {
      if (dualWrap) dualWrap.style.display = "grid";
      if (groupWrap) groupWrap.style.display = "none";
      if (colorWrap) colorWrap.style.display = "flex";
    } else {
      if (dualWrap) dualWrap.style.display = "none";
      if (groupWrap) groupWrap.style.display = "block";
      if (colorWrap) colorWrap.style.display = "none";
    }
  } catch (err) {
    console.error("renderRoomSheetTablePage error:", err);
  }
}

// 渲染「分組卡片檢視」（用餐桌號分組 / 第一晚房間分組 / 第二晚房間分組，房間分組已與夜間查房點名系統全面結合）
function renderGroupCardsView(container, cData) {
  try {
    if (!container) return;
    const defaultColor = (BEIGE_PALETTE && BEIGE_PALETTE[0]) || { key: "yellow", name: "米黃", bg: "#fef9c3", border: "#fde047", badgeBg: "#fef08a", text: "#854d0e", tagBg: "#fefce8" };

    if (sheetActiveView === "tables") {
      // 用餐桌號分組
      if (currentSheetClass === "all") {
        let fullHtml = `
          <div style="margin-bottom:12px; font-weight:800; color:#334155; font-size:0.95rem; display:flex; align-items:center; justify-content:space-between;">
            <span>🍽️ 【全校六年級全部班級】用餐桌號分組一覽</span>
          </div>
        `;
        initialClasses.forEach(cKey => {
          const { tableMap, tbList, allSt } = getClassColorMaps(cKey);
          const groups = tbList.map(t => {
            const col = tableMap[t] || defaultColor;
            const students = allSt.filter(s => s.table === t && s.name);
            return { key: `第 ${t} 桌`, color: col, badgeText: `${students.length} 人`, students };
          });
          fullHtml += `
            <div class="class-patrol-section" id="patrol_class_${cKey}">
              <div class="class-patrol-header">
                <span style="font-size:1rem; font-weight:800; color:#1e293b;">🏫 ${cKey} 班 用餐分桌</span>
                <span style="font-size:0.75rem; color:#64748b;">共 ${groups.length} 桌</span>
              </div>
              <div class="group-cards-grid">
                ${renderTableCardsHtml(groups, defaultColor)}
              </div>
            </div>
          `;
        });
        container.innerHTML = fullHtml;
        return;
      }

      const { tableMap, tbList, allSt } = getClassColorMaps(currentSheetClass);
      const title = `🍽️ 【${currentSheetClass}班】用餐桌號分組一覽（同桌同米色色塊）`;
      const groups = tbList.map(t => {
        const col = tableMap[t] || defaultColor;
        const students = allSt.filter(s => s.table === t && s.name);
        return {
          key: `第 ${t} 桌`,
          color: col,
          badgeText: `${students.length} 人`,
          students
        };
      });

      container.innerHTML = `
        <div style="margin-bottom:12px; font-weight:800; color:#334155; font-size:0.95rem; display:flex; align-items:center; justify-content:space-between;">
          <span>${title}</span>
          <span style="font-size:0.78rem; color:#64748b; font-weight:600;">共 ${groups.length} 桌</span>
        </div>

        <div class="group-cards-grid">
          ${renderTableCardsHtml(groups, defaultColor)}
        </div>
      `;
      return;
    }

    // 第一晚或第二晚房間分組檢視：完全合而為一的夜間查房點名系統
    const hotelNum = sheetActiveView === "rooms1" ? 1 : 2;
    const hotelName = (hotelInfo[hotelNum] && hotelInfo[hotelNum].name) || `第 ${hotelNum} 晚`;
    const icon = hotelNum === 1 ? "🏨" : "🏰";

    const allRooms = getPatrolRoomsForPage(hotelNum, currentSheetClass);
    const hotelChecks = checkState[hotelNum] || {};

    const totalCount = allRooms.length;
    const checkedCount = allRooms.filter(r => {
      const itemState = hotelChecks[r.id] || hotelChecks[r.legacyId];
      return itemState && itemState.status === "checked";
    }).length;
    const pct = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0;

    let bodyHtml = "";

    if (currentSheetClass === "all") {
      // 全校六年級全部班級：依班級分區呈現，支援快速跳轉錨點
      bodyHtml = initialClasses.map(cKey => {
        const classRooms = allRooms.filter(r => r.class === cKey);
        const cTotal = classRooms.length;
        const cChecked = classRooms.filter(r => {
          const itemState = hotelChecks[r.id] || hotelChecks[r.legacyId];
          return itemState && itemState.status === "checked";
        }).length;
        const cPct = cTotal > 0 ? Math.round((cChecked / cTotal) * 100) : 0;

        return `
          <div class="class-patrol-section" id="patrol_class_${cKey}">
            <div class="class-patrol-header">
              <div style="display:flex; align-items:center; gap:8px;">
                <span style="font-size:1.05rem; font-weight:800; color:#1e293b;">🏫 ${cKey} 班</span>
                <span style="font-size:0.78rem; color:#64748b;">(導師: ${maskPersonName(sheetData[cKey]?.teacher || '')} · 共 ${cTotal} 間房 · 已查 ${cChecked} 間 / ${cPct}%)</span>
              </div>
              <div style="display:flex; align-items:center; gap:6px;">
                <button class="patrol-quick-clear-btn" onclick="openClearPatrolModal('${cKey}', ${hotelNum})" title="清除此班查房紀錄">
                  🧹 清除本班
                </button>
              </div>
            </div>
            <div class="group-cards-grid">
              ${classRooms.map(r => renderSingleRoomCardHtml(r, hotelNum, hotelChecks, defaultColor, icon)).join("")}
            </div>
          </div>
        `;
      }).join("");
    } else {
      // 單一班級呈現
      bodyHtml = `
        <div class="group-cards-grid">
          ${allRooms.map(r => renderSingleRoomCardHtml(r, hotelNum, hotelChecks, defaultColor, icon)).join("")}
        </div>
      `;
    }

    container.innerHTML = `
      <!-- 頂部飯店一鍵切換標籤列 (手機單手直覺點選，免開下拉選單) -->
      <div class="unified-hotel-bar">
        <button class="hotel-tab-btn ${hotelNum === 1 ? 'active' : ''}" onclick="setSheetViewMode('rooms1')">
          🏨 第 1 晚：今埔里<span class="hotel-tab-suffix">渡假大酒店</span>
        </button>
        <button class="hotel-tab-btn ${hotelNum === 2 ? 'active' : ''}" onclick="setSheetViewMode('rooms2')">
          🏰 第 2 晚：麗寶福容<span class="hotel-tab-suffix">大飯店</span>
        </button>
      </div>

      <!-- 查房進度摘要與快捷操作列 -->
      <div class="room-patrol-summary-bar">
        <div class="summary-left">
          <span class="summary-title">${icon} ${currentSheetClass === 'all' ? '【全校六年級】' : `【${currentSheetClass}班】`}${hotelNum === 1 ? '今埔里' : '麗寶福容'} 查房進度：</span>
          <span class="summary-stat">已查房 <b>${checkedCount}</b> / ${totalCount} 間 (${pct}%)</span>
          <div class="summary-progress-bg">
            <div class="summary-progress-fill" style="width: ${pct}%;"></div>
          </div>
        </div>
        <div class="summary-actions">
          <button class="patrol-quick-clear-btn" onclick="openClearPatrolModal('${currentSheetClass}', ${hotelNum})" title="清除查房點名紀錄">
            🧹 清除點名
          </button>
          <button class="patrol-quick-jump-btn" onclick="setSheetViewMode('sheet')" title="切換至實體雙欄座位表">
            📋 雙欄名冊
          </button>
        </div>
      </div>

      <!-- 房間卡片內容區塊 -->
      ${bodyHtml}
    `;
  } catch (err) {
    console.error("renderGroupCardsView error:", err);
  }
}

function renderSingleRoomCardHtml(r, hotelNum, hotelChecks, defaultColor, icon) {
  const itemState = hotelChecks[r.id] || hotelChecks[r.legacyId] || { status: "pending", note: "" };
  const statusClass = itemState.status === "checked" ? "checked" : (itemState.status === "absent" ? "absent" : "");
  const statusText = itemState.status === "checked" ? "✅ 已查房 (已就寢)" : (itemState.status === "absent" ? "⚠️ 待確認 (缺席/未歸)" : "⏳ 待查房 (點此標記)");

  const { room1Map, room2Map } = getClassColorMaps(r.class);
  const col = (hotelNum === 1 ? (room1Map[`${r.gender}_${r.room}`] || room1Map[r.room]) : (room2Map[`${r.gender}_${r.room}`] || room2Map[r.room])) || defaultColor;

  return `
    <div class="group-card ${statusClass}" style="border-top: 6px solid ${col.border}; background: #ffffff;">
      <div class="group-card-header" style="background: ${col.bg};">
        <div style="display:flex; align-items:center; gap:5px; flex-wrap:wrap; min-width:0;">
          <span style="font-size:1.05rem;">${icon}</span>
          <span style="font-size:1.05rem; font-weight:800; color:${col.text};">${r.room} 房</span>
          <span class="room-gender-badge ${r.genderClass}">${r.genderBadge}</span>
          <span style="font-size:0.75rem; background:${col.badgeBg}; color:${col.text}; border:1px solid ${col.border}; padding:1px 6px; border-radius:4px; font-weight:700;">🏷️ ${col.name}</span>
        </div>
        <div style="display:flex; align-items:center; gap:5px; flex-shrink:0;">
          <span style="font-size:0.75rem; color:#64748b; font-weight:700;">${r.class}班</span>
          <span style="font-size:0.8rem; font-weight:700; color:${col.text}; background:white; padding:2px 8px; border-radius:12px; border:1px solid ${col.border};">
            ${r.students.length} 人
          </span>
        </div>
      </div>
      <div class="group-card-body">
        <div class="group-student-tags">
          ${r.students.map(s => `
            <span class="group-student-tag" title="第 ${s.no} 號 ${r.genderText}生">
              <span class="gender-dot ${s.genderClass}"></span>
              <span style="color:#64748b; font-size:0.75rem;">${s.no}.</span>
              <span>${s.name}</span>
            </span>
          `).join("")}
        </div>

        <div style="margin-top:10px;">
          <input type="text" class="room-note-field" data-room-id="${r.id}" placeholder="點此輸入查房備註（如：已吃藥）" value="${itemState.note || ''}" onchange="saveRoomNotePage('${r.id}', this.value, ${hotelNum})">
        </div>

        <div class="room-action-row">
          <button class="room-status-btn ${statusClass}" onclick="toggleRoomStatusPage('${r.id}', ${hotelNum})">
            ${statusText}
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderTableCardsHtml(groups, defaultColor) {
  return groups.map(g => {
    const col = g.color || defaultColor;
    return `
      <div class="group-card" style="border-top: 6px solid ${col.border}; background: #ffffff;">
        <div class="group-card-header" style="background: ${col.bg};">
          <div style="display:flex; align-items:center; gap:6px;">
            <span style="font-size:1.1rem;">🍽️</span>
            <span style="font-size:1rem; font-weight:800; color:${col.text};">${g.key}</span>
            <span style="font-size:0.75rem; background:${col.badgeBg}; color:${col.text}; border:1px solid ${col.border}; padding:1px 6px; border-radius:4px; font-weight:700;">🏷️ ${col.name}</span>
          </div>
          <span style="font-size:0.8rem; font-weight:700; color:${col.text}; background:white; padding:2px 8px; border-radius:12px; border:1px solid ${col.border};">
            ${g.badgeText}
          </span>
        </div>
        <div class="group-card-body">
          <div class="group-student-tags">
            ${g.students.map(s => `
              <span class="group-student-tag" title="第 ${s.no} 號 ${s.genderText || ''}生">
                <span class="gender-dot ${s.gender === 'boys' ? 'boy' : 'girl'}"></span>
                <span style="color:#64748b; font-size:0.75rem;">${s.no}.</span>
                <span>${maskPersonName(s.name)}</span>
              </span>
            `).join("")}
          </div>
        </div>
      </div>
    `;
  }).join("");
}

window.updateStudentFieldPage = function(className, gender, idx, field, value) {
  if (!sheetData[className]) return;
  let finalVal = value.trim();
  // 姓名欄位自動去識別化替換為「Ｏ」
  if (field === "name" && finalVal) {
    finalVal = maskPersonName(finalVal);
  }
  sheetData[className][gender][idx][field] = finalVal;
  saveSheetDataPage();
  renderRoomSheetTablePage();
};

window.updateSheetMeta = function(field, value) {
  if (!sheetData[currentSheetClass]) return;
  let finalVal = value.trim();
  // 導師欄位自動去識別化替換為「Ｏ」
  if (field === "teacher" && finalVal) {
    finalVal = maskPersonName(finalVal);
  }
  sheetData[currentSheetClass][field] = finalVal;
  saveSheetDataPage();
  renderRoomSheetTablePage();
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
   夜間查房點名系統 (支援全校與各班篩選，米色色塊聯動，男女分宿標記，一鍵清除點名)
   -------------------------------------------------------------------------- */
window.setPatrolClassFilterPage = function(filterVal) {
  activePatrolClassFilter = filterVal;
  const sel = document.getElementById("patrolClassSelect");
  if (sel) sel.value = filterVal;
  renderPatrolGridPage();
};

function getPatrolRoomsForPage(hotelNum, classFilter = activePatrolClassFilter) {
  const roomMap = {};
  const roomField = hotelNum === 1 ? "room1" : "room2";

  Object.keys(sheetData).forEach(cKey => {
    if (classFilter !== "all" && cKey !== classFilter) return;
    const cObj = sheetData[cKey];
    if (!cObj) return;

    // 分別處理男生與女生，確保男女分開歸類且標示明確
    const processGenderList = (list, gender, genderText) => {
      (list || []).forEach(st => {
        const rm = st[roomField] ? st[roomField].trim() : "";
        if (rm && st.name) {
          // 鍵值包含班級、性別與房號，徹底解決 608/609 班第二晚 A、B 同名問題
          const mapKey = `${cKey}_${gender}_${rm}`;
          if (!roomMap[mapKey]) {
            roomMap[mapKey] = {
              id: `h${hotelNum}_${cKey}_${gender}_${rm.replace(/[^a-zA-Z0-9_-]/g, "_")}`,
              legacyId: `h${hotelNum}_${cKey}_${rm.replace(/[^a-zA-Z0-9_-]/g, "_")}`, // 相容舊版打勾紀錄
              room: rm,
              hotelNum: hotelNum,
              class: cKey,
              gender: gender,
              genderText: genderText,
              genderBadge: gender === "boys" ? "👦 男生房" : "👧 女生房",
              genderClass: gender === "boys" ? "boy" : "girl",
              students: [],
              note: ""
            };
          }
          roomMap[mapKey].students.push({
            no: st.no,
            name: maskPersonName(st.name),
            gender: gender,
            genderClass: gender === "boys" ? "boy" : "girl"
          });
        }
      });
    };

    processGenderList(cObj.boys, "boys", "男");
    processGenderList(cObj.girls, "girls", "女");
  });

  const list = Object.values(roomMap);
  return list.sort((a, b) => {
    if (a.class !== b.class) return a.class.localeCompare(b.class);
    // 同班內，男生房優先排列於女生房之前
    if (a.gender !== b.gender) return a.gender === "boys" ? -1 : 1;
    return a.room.localeCompare(b.room, undefined, { numeric: true });
  });
}

window.switchHotelPage = function(hotelId) {
  currentHotelId = hotelId;
  setSheetViewMode(hotelId === 1 ? "rooms1" : "rooms2");
};

function renderPatrolGridPage() {
  if (sheetActiveView === "rooms1" || sheetActiveView === "rooms2") {
    renderRoomSheetTablePage();
  }
}

window.toggleRoomStatusPage = function(roomId, hotelId = currentHotelId) {
  if (!checkState[hotelId]) checkState[hotelId] = {};
  const current = checkState[hotelId][roomId] || { status: "pending", note: "" };

  let nextStatus = "checked";
  if (current.status === "checked") nextStatus = "absent";
  else if (current.status === "absent") nextStatus = "pending";

  if (window.AppleFeedback) {
    if (nextStatus === "checked") window.AppleFeedback.success();
    else if (nextStatus === "absent") window.AppleFeedback.warning();
    else window.AppleFeedback.lightTap();
  }

  checkState[hotelId][roomId] = {
    ...current,
    status: nextStatus
  };

  localStorage.setItem(hotelInfo[hotelId].storageKey, JSON.stringify(checkState[hotelId]));
  renderPatrolGridPage();
  if (sheetActiveView === "rooms1" || sheetActiveView === "rooms2") {
    renderRoomSheetTablePage();
  }
};

window.saveRoomNotePage = function(roomId, noteVal, hotelId = currentHotelId) {
  if (!checkState[hotelId]) checkState[hotelId] = {};
  const current = checkState[hotelId][roomId] || { status: "pending", note: "" };

  checkState[hotelId][roomId] = {
    ...current,
    note: noteVal.trim()
  };

  localStorage.setItem(hotelInfo[hotelId].storageKey, JSON.stringify(checkState[hotelId]));

  // 同步所有匹配 data-room-id 的輸入框內容（無須重新渲染以保持游標輸入順暢）
  const allNoteInputs = document.querySelectorAll(`input[data-room-id="${roomId}"]`);
  allNoteInputs.forEach(inp => {
    if (inp !== document.activeElement && inp.value !== noteVal.trim()) {
      inp.value = noteVal.trim();
    }
  });
};

// 專屬清除查房點名彈窗控制與執行
function openClearPatrolModal(targetClass = null, hotelId = currentHotelId) {
  const cls = targetClass || (activePatrolClassFilter !== "all" ? activePatrolClassFilter : currentSheetClass);
  const targetHotelNum = hotelId || currentHotelId;
  const hotelName = (hotelInfo[targetHotelNum] && hotelInfo[targetHotelNum].name) || `第 ${targetHotelNum} 晚`;

  const modal = document.getElementById("clearPatrolModal");
  const backdrop = document.getElementById("clearPatrolModalBackdrop");
  const hotelNameEl = document.getElementById("clearModalHotelName");
  const classTextEl = document.getElementById("clearModalClassText");
  const btnClassEl = document.getElementById("btnClearClassConfirm");
  const btnAllEl = document.getElementById("btnClearAllConfirm");

  if (hotelNameEl) hotelNameEl.textContent = `【${hotelName}】查房點名紀錄`;
  if (classTextEl) classTextEl.textContent = `${cls} 班`;

  if (btnClassEl) {
    btnClassEl.onclick = () => executeClearPatrol("class", cls, targetHotelNum);
  }

  if (btnAllEl) {
    btnAllEl.onclick = () => executeClearPatrol("all", null, targetHotelNum);
  }

  if (modal) modal.classList.add("active");
  if (backdrop) backdrop.classList.add("active");
}
window.openClearPatrolModal = openClearPatrolModal;

function closeClearPatrolModal() {
  const modal = document.getElementById("clearPatrolModal");
  const backdrop = document.getElementById("clearPatrolModalBackdrop");
  if (modal) modal.classList.remove("active");
  if (backdrop) backdrop.classList.remove("active");
}
window.closeClearPatrolModal = closeClearPatrolModal;

function executeClearPatrol(scope, targetClass, hotelId = currentHotelId) {
  closeClearPatrolModal();
  if (window.AppleFeedback) {
    window.AppleFeedback.warning();
  }

  if (!checkState[hotelId]) checkState[hotelId] = {};
  const hotelName = (hotelInfo[hotelId] && hotelInfo[hotelId].name) || `第 ${hotelId} 晚`;

  if (scope === "class") {
    // 依班級清除打勾紀錄與備註（比對 h{hotelId}_{targetClass}_ 開頭的所有鍵）
    const prefix = `h${hotelId}_${targetClass}_`;
    let count = 0;
    Object.keys(checkState[hotelId]).forEach(k => {
      if (k.startsWith(prefix)) {
        delete checkState[hotelId][k];
        count++;
      }
    });
    localStorage.setItem(hotelInfo[hotelId].storageKey, JSON.stringify(checkState[hotelId]));
    showPatrolToast(`✨ 已成功清除【${targetClass}班】在 ${hotelName} 的查房紀錄！`);
  } else if (scope === "all") {
    checkState[hotelId] = {};
    localStorage.removeItem(hotelInfo[hotelId].storageKey);
    showPatrolToast(`✨ 已成功重置【全校六年級】在 ${hotelName} 的所有查房紀錄！`);
  }

  // 立即刷新介面
  renderPatrolGridPage();
  if (sheetActiveView === "rooms1" || sheetActiveView === "rooms2") {
    renderRoomSheetTablePage();
  }
}
window.executeClearPatrol = executeClearPatrol;

window.resetCurrentHotelChecksPage = function() {
  openClearPatrolModal(activePatrolClassFilter, currentHotelId);
};

function showPatrolToast(msg) {
  let toast = document.getElementById("patrolToast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "patrolToast";
    toast.className = "patrol-toast-notice";
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(window._patrolToastTimer);
  window._patrolToastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2600);
}
window.showPatrolToast = showPatrolToast;
