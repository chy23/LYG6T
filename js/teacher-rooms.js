// 麗園國小 115學年度六年級戶外教育 - 教師專用學生房間表與查房點名系統 (全9班 601~609 官方正式分房表)
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
    "teacher": "詹景文",
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
    "teacher": "胡博鈞",
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
    "teacher": "唐鶯倫",
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
    "teacher": "黃玉芬",
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
    "teacher": "楊家驊",
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
    "teacher": "王儷潔",
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
    "teacher": "林憲宏",
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
    "teacher": "廖建超",
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
    "teacher": "劉惠綾",
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

let sheetColorMode = "column"; // "column" | "room1" | "room2" | "table" | "none"
let sheetActiveView = "sheet"; // "sheet" | "tables" | "rooms1" | "rooms2"
let activeHighlight = null;    // { type: "room1"|"room2"|"table", val: string } | null

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

// 資料版本控管：確保更新官方資料與色塊功能時，使用者端自動升級至最新版本
const OFFICIAL_DATA_VERSION = "20261025_v3_beige_color_blocks";

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

// 獲取班級專屬房桌號色塊映射表
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
      <div class="page-title" style="margin-bottom:6px;">📋 麗園國小學生校外教學活動房桌號表</div>
      <div style="font-size:0.82rem; color:#64748b; margin-bottom:10px; font-weight:700;">
        🍎 教師專用頁面 · 第一晚：今埔里渡假大酒店 ｜ 第二晚：麗寶福容大飯店
      </div>

      <!-- 個資保護與色塊提示 -->
      <div style="background:#eff6ff; border:1px solid #bfdbfe; border-radius:6px; padding:6px 10px; margin-bottom:10px; font-size:0.78rem; color:#1e40af; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:6px;">
        <div style="display:flex; align-items:center; gap:6px;">
          <span>🔒</span>
          <span><b>個資保護規範：</b>學生姓名已全數去中字以全形「Ｏ」代替（如：潘Ｏ達）。</span>
        </div>
        <div style="font-size:0.75rem; color:#0369a1; font-weight:600;">
          🎨 同班同房、同桌已自動套用米黃、米紅、米藍、米綠等柔和米色色塊呈現
        </div>
      </div>

      <!-- 切換班級工具列 -->
      <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px; margin-bottom:12px; background:#f1f5f9; padding:8px 12px; border-radius:8px; border:1px solid #e2e8f0;">
        <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
          <span style="font-size:0.82rem; font-weight:800; color:#334155;">選擇班級：</span>
          <div class="class-filter-chips" id="sheetClassTabsPage" style="display:inline-flex; flex-wrap:wrap; gap:4px;"></div>
        </div>
        <div style="display:flex; align-items:center; gap:8px;">
          <span id="sheetSaveNoticePage" style="font-size:0.75rem; color:#059669; font-weight:700; opacity:0; transition:opacity 0.3s ease;">💾 已自動儲存</span>
          <button onclick="window.print()" style="background:#2563eb; color:white; border:none; padding:6px 14px; border-radius:6px; font-weight:700; font-size:0.8rem; cursor:pointer; box-shadow:0 2px 4px rgba(37,99,235,0.2);">🖨️ 列印此表</button>
        </div>
      </div>

      <!-- 色塊呈現模式與分組檢視工具列 -->
      <div class="sheet-color-toolbar">
        <div class="sheet-view-group">
          <span style="font-size:0.8rem; font-weight:800; color:#44403c;">👁️ 檢視方式：</span>
          <button class="sheet-view-btn ${sheetActiveView === "sheet" ? "active" : ""}" id="viewBtn_sheet" onclick="setSheetViewMode('sheet')">📋 實體座位表 (1~25號)</button>
          <button class="sheet-view-btn ${sheetActiveView === "tables" ? "active" : ""}" id="viewBtn_tables" onclick="setSheetViewMode('tables')">🍽️ 用餐桌號分組一覽</button>
          <button class="sheet-view-btn ${sheetActiveView === "rooms1" ? "active" : ""}" id="viewBtn_rooms1" onclick="setSheetViewMode('rooms1')">🏨 第一晚房間分組</button>
          <button class="sheet-view-btn ${sheetActiveView === "rooms2" ? "active" : ""}" id="viewBtn_rooms2" onclick="setSheetViewMode('rooms2')">🏰 第二晚房間分組</button>
        </div>

        <div class="color-mode-group" id="colorModeSelectorGroup" style="${sheetActiveView === 'sheet' ? '' : 'display:none;'}">
          <span style="font-size:0.8rem; font-weight:800; color:#44403c;">🎨 色塊呈現：</span>
          <button class="color-mode-btn ${sheetColorMode === "column" ? "active" : ""}" id="colorBtn_column" onclick="setSheetColorMode('column')" title="各欄位依其所屬房間/桌號獨立呈現米色色塊">📌 各欄獨立色塊</button>
          <button class="color-mode-btn ${sheetColorMode === "room1" ? "active" : ""}" id="colorBtn_room1" onclick="setSheetColorMode('room1')" title="第一晚同房間學生整行以同款米色著色">🏨 依第一晚房號整行著色</button>
          <button class="color-mode-btn ${sheetColorMode === "room2" ? "active" : ""}" id="colorBtn_room2" onclick="setSheetColorMode('room2')" title="第二晚同房間學生整行以同款米色著色">🏰 依第二晚房號整行著色</button>
          <button class="color-mode-btn ${sheetColorMode === "table" ? "active" : ""}" id="colorBtn_table" onclick="setSheetColorMode('table')" title="同用餐桌號學生整行以同款米色著色">🍽️ 依用餐桌號整行著色</button>
          <button class="color-mode-btn ${sheetColorMode === "none" ? "active" : ""}" id="colorBtn_none" onclick="setSheetColorMode('none')" title="純黑白無色塊">純白</button>
        </div>
      </div>

      <!-- 動態色塊圖例與點選快速高亮列 -->
      <div id="sheetColorLegendContainer"></div>

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

        <!-- 內容呈現區：可切換「實體男女雙欄表格」或「分組卡片檢視」 -->
        <div id="sheetMainContentArea">
          <!-- 雙大欄表格：左男生 (1~25)、右女生 (1~25) -->
          <div class="sheet-tables-wrap" id="sheetDualTablesWrap">
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

          <!-- 分組卡片展示區塊 (當切換到用餐桌號或房間分組檢視時呈現) -->
          <div id="sheetGroupCardsWrap" style="display:none;"></div>
        </div>

      </div>

      <!-- 夜間查房快速點名區塊 -->
      <div style="padding:16px; background:#fffbeb; border:2px solid #fde68a; border-radius:12px; margin-top:16px;">
        <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:10px; margin-bottom:12px;">
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-size:1.3rem;">🏨</span>
            <div>
              <b style="color:#92400e; font-size:0.95rem;">夜間查房點名系統（依房號即時勾選）</b>
              <p style="margin:2px 0 0; font-size:0.75rem; color:#b45309;">由上方房桌號表自動彙整房號並標註班級米色色塊，老師晚間巡房時可單手輕按標記已就寢。</p>
            </div>
          </div>
          <div class="hotel-tab-bar" style="background:#fef3c7; border:1px solid #fcd34d;">
            <button class="hotel-tab-btn active" id="tabHotel1Page" onclick="switchHotelPage(1)">第一晚：今埔里</button>
            <button class="hotel-tab-btn" id="tabHotel2Page" onclick="switchHotelPage(2)">第二晚：麗寶福容</button>
          </div>
        </div>

        <!-- 查房班級快速篩選列 -->
        <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap; margin-bottom:12px; background:#fff; padding:8px 12px; border-radius:8px; border:1px solid #fde68a;">
          <span style="font-size:0.78rem; font-weight:800; color:#92400e;">班級篩選：</span>
          <div id="patrolClassFilterChipsPage" style="display:inline-flex; flex-wrap:wrap; gap:4px;"></div>
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
        <div class="rooms-grid-scroll" id="roomsGridPage" style="max-height:520px; padding:4px 0 10px;"></div>
      </div>

    </div>
  `;
}

// 掛載動態元件
window.initSheetPageComponents = function() {
  renderSheetClassSelectorPage();
  renderRoomSheetTablePage();
  renderPatrolClassFilterChipsPage();
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
   第 22 頁房桌號表互動與色塊控制
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
  activeHighlight = null; // 切換班級時清除高亮過濾
  renderSheetClassSelectorPage();
  renderRoomSheetTablePage();
  renderPatrolGridPage();
};

window.setSheetColorMode = function(mode) {
  sheetColorMode = mode;
  ["column", "room1", "room2", "table", "none"].forEach(m => {
    const btn = document.getElementById(`colorBtn_${m}`);
    if (btn) btn.classList.toggle("active", m === mode);
  });
  renderRoomSheetTablePage();
};

window.setSheetViewMode = function(vMode) {
  sheetActiveView = vMode;
  ["sheet", "tables", "rooms1", "rooms2"].forEach(m => {
    const btn = document.getElementById(`viewBtn_${m}`);
    if (btn) btn.classList.toggle("active", m === vMode);
  });
  const modeGroup = document.getElementById("colorModeSelectorGroup");
  if (modeGroup) {
    modeGroup.style.display = vMode === "sheet" ? "flex" : "none";
  }
  renderRoomSheetTablePage();
};

window.toggleHighlightTarget = function(type, val) {
  if (activeHighlight && activeHighlight.type === type && activeHighlight.val === val) {
    activeHighlight = null;
  } else {
    activeHighlight = { type, val };
  }
  renderRoomSheetTablePage();
};

// 渲染色塊圖例與快速高亮按鈕
function renderSheetColorLegend() {
  const legendBox = document.getElementById("sheetColorLegendContainer");
  if (!legendBox) return;

  const { room1Map, room2Map, tableMap, r1List, r2List, tbList, allSt } = getClassColorMaps(currentSheetClass);

  legendBox.innerHTML = `
    <div class="sheet-color-legend">
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:6px;">
        <span style="font-size:0.82rem; font-weight:800; color:#57534e;">🎨 【${currentSheetClass}班】專屬米色色塊對照表（點擊色塊可連動高亮同學）：</span>
        ${activeHighlight ? `<button onclick="toggleHighlightTarget('', '')" style="background:#e2e8f0; border:none; padding:2px 8px; border-radius:4px; font-size:0.75rem; color:#475569; cursor:pointer; font-weight:700;">✕ 清除高亮</button>` : ''}
      </div>

      <!-- 第一晚房間圖例 -->
      <div class="legend-section">
        <span class="legend-title">🏨 第一晚房號：</span>
        <div class="legend-chips">
          ${r1List.map(r => {
            const col = room1Map[r];
            const cnt = allSt.filter(s => s.room1 === r && s.name).length;
            const isMatch = activeHighlight && activeHighlight.type === "room1" && activeHighlight.val === r;
            return `
              <span class="color-legend-pill ${isMatch ? "active" : ""}" style="background:${col.bg}; border:1px solid ${col.border}; color:${col.text};" onclick="toggleHighlightTarget('room1', '${r}')" title="點擊連動高亮 ${r} 房學生">
                ${r} 房 (${cnt}人) · ${col.name}
              </span>
            `;
          }).join("")}
        </div>
      </div>

      <!-- 第二晚房間圖例 -->
      <div class="legend-section">
        <span class="legend-title">🏰 第二晚房號：</span>
        <div class="legend-chips">
          ${r2List.map(r => {
            const col = room2Map[r];
            const cnt = allSt.filter(s => s.room2 === r && s.name).length;
            const isMatch = activeHighlight && activeHighlight.type === "room2" && activeHighlight.val === r;
            return `
              <span class="color-legend-pill ${isMatch ? "active" : ""}" style="background:${col.bg}; border:1px solid ${col.border}; color:${col.text};" onclick="toggleHighlightTarget('room2', '${r}')" title="點擊連動高亮 ${r} 房學生">
                ${r} 房 (${cnt}人) · ${col.name}
              </span>
            `;
          }).join("")}
        </div>
      </div>

      <!-- 用餐桌號圖例 -->
      <div class="legend-section">
        <span class="legend-title">🍽️ 用餐桌號：</span>
        <div class="legend-chips">
          ${tbList.map(t => {
            const col = tableMap[t];
            const cnt = allSt.filter(s => s.table === t && s.name).length;
            const isMatch = activeHighlight && activeHighlight.type === "table" && activeHighlight.val === t;
            return `
              <span class="color-legend-pill ${isMatch ? "active" : ""}" style="background:${col.bg}; border:1px solid ${col.border}; color:${col.text};" onclick="toggleHighlightTarget('table', '${t}')" title="點擊連動高亮第 ${t} 桌學生">
                第 ${t} 桌 (${cnt}人) · ${col.name}
              </span>
            `;
          }).join("")}
        </div>
      </div>
    </div>
  `;
}

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

  const classNum = parseInt(currentSheetClass.replace(/^60?/, ""), 10) || currentSheetClass;
  if (classDisplay) classDisplay.textContent = `6年${classNum}班 (${currentSheetClass}班)`;
  if (totalInput) totalInput.value = cData.totalCount || "";
  if (teacherInput) teacherInput.value = cData.teacher || "";

  // 渲染色塊圖例
  renderSheetColorLegend();

  const dualWrap = document.getElementById("sheetDualTablesWrap");
  const groupWrap = document.getElementById("sheetGroupCardsWrap");

  // 判斷是否呈現分組卡片檢視
  if (sheetActiveView !== "sheet") {
    if (dualWrap) dualWrap.style.display = "none";
    if (groupWrap) {
      groupWrap.style.display = "block";
      renderGroupCardsView(groupWrap, cData);
    }
    return;
  }

  // 實體座位表 (1~25號雙欄) 檢視
  if (dualWrap) dualWrap.style.display = "grid";
  if (groupWrap) groupWrap.style.display = "none";

  const { room1Map, room2Map, tableMap } = getClassColorMaps(currentSheetClass);

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

    // 各欄單元格底色（在 column 模式或整行未著色時套用）
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
        <td class="col-name"><input type="text" value="${maskStudentName(st.name) || ""}" placeholder="姓名" onchange="updateStudentFieldPage('${currentSheetClass}', '${gender}', ${idx}, 'name', this.value)"></td>
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

  // 渲染男生 (1~25)
  const boysTbody = document.getElementById("sheetBoysTbodyPage");
  if (boysTbody) {
    boysTbody.innerHTML = cData.boys.map((b, idx) => renderStudentRow(b, "boys", idx)).join("");
  }

  // 渲染女生 (1~25)
  const girlsTbody = document.getElementById("sheetGirlsTbodyPage");
  if (girlsTbody) {
    girlsTbody.innerHTML = cData.girls.map((g, idx) => renderStudentRow(g, "girls", idx)).join("");
  }
}

// 渲染「分組卡片檢視」（用餐桌號分組 / 第一晚房間分組 / 第二晚房間分組）
function renderGroupCardsView(container, cData) {
  const { room1Map, room2Map, tableMap, r1List, r2List, tbList, allSt } = getClassColorMaps(currentSheetClass);

  let title = "";
  let icon = "";
  let groups = [];

  if (sheetActiveView === "tables") {
    title = `🍽️ 【${currentSheetClass}班】用餐桌號分組一覽（同桌同米色色塊）`;
    icon = "🍽️";
    groups = tbList.map(t => {
      const col = tableMap[t] || BEIGE_PALETTE[0];
      const students = allSt.filter(s => s.table === t && s.name);
      return {
        key: `第 ${t} 桌`,
        color: col,
        badgeText: `${students.length} 人`,
        students
      };
    });
  } else if (sheetActiveView === "rooms1") {
    title = `🏨 【${currentSheetClass}班】第一晚房間分組一覽（今埔里渡假大酒店）`;
    icon = "🏨";
    groups = r1List.map(r => {
      const col = room1Map[r] || BEIGE_PALETTE[0];
      const students = allSt.filter(s => s.room1 === r && s.name);
      return {
        key: `${r} 房`,
        color: col,
        badgeText: `${students.length} 人`,
        students
      };
    });
  } else if (sheetActiveView === "rooms2") {
    title = `🏰 【${currentSheetClass}班】第二晚房間分組一覽（麗寶福容大飯店）`;
    icon = "🏰";
    groups = r2List.map(r => {
      const col = room2Map[r] || BEIGE_PALETTE[0];
      const students = allSt.filter(s => s.room2 === r && s.name);
      return {
        key: `${r} 房`,
        color: col,
        badgeText: `${students.length} 人`,
        students
      };
    });
  }

  container.innerHTML = `
    <div style="margin-bottom:12px; font-weight:800; color:#334155; font-size:1rem; display:flex; align-items:center; justify-content:space-between;">
      <span>${title}</span>
      <span style="font-size:0.8rem; color:#64748b; font-weight:600;">共 ${groups.length} 組</span>
    </div>

    <div class="group-cards-grid">
      ${groups.map(g => `
        <div class="group-card" style="border-top: 6px solid ${g.color.border}; background: #ffffff;">
          <div class="group-card-header" style="background: ${g.color.bg};">
            <div style="display:flex; align-items:center; gap:6px;">
              <span style="font-size:1.1rem;">${icon}</span>
              <span style="font-size:1.05rem; font-weight:800; color:${g.color.text};">${g.key}</span>
              <span style="font-size:0.75rem; background:${g.color.badgeBg}; color:${g.color.text}; border:1px solid ${g.color.border}; padding:1px 6px; border-radius:4px; font-weight:700;">${g.color.name}</span>
            </div>
            <span style="font-size:0.82rem; font-weight:700; color:${g.color.text}; background:white; padding:2px 8px; border-radius:12px; border:1px solid ${g.color.border};">
              ${g.badgeText}
            </span>
          </div>
          <div class="group-card-body">
            <div class="group-student-tags">
              ${g.students.map(s => `
                <span class="group-student-tag" title="第 ${s.no} 號 ${s.genderText}生">
                  <span class="gender-dot ${s.gender === 'boys' ? 'boy' : 'girl'}"></span>
                  <span style="color:#64748b; font-size:0.75rem;">${s.no}.</span>
                  <span>${maskStudentName(s.name)}</span>
                </span>
              `).join("")}
            </div>
          </div>
        </div>
      `).join("")}
    </div>
  `;
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
   夜間查房點名系統 (可切換各班或全校查房，支援米色色塊聯動)
   -------------------------------------------------------------------------- */
function renderPatrolClassFilterChipsPage() {
  const container = document.getElementById("patrolClassFilterChipsPage");
  if (!container) return;

  const chips = ["all", ...initialClasses];
  container.innerHTML = chips.map(c => `
    <button class="class-chip ${activePatrolClassFilter === c ? "active" : ""}" style="padding:3px 8px; font-size:0.75rem;" onclick="setPatrolClassFilterPage('${c}')">
      ${c === "all" ? "全部班級" : c + "班"}
    </button>
  `).join("");
}

window.setPatrolClassFilterPage = function(filterVal) {
  activePatrolClassFilter = filterVal;
  renderPatrolClassFilterChipsPage();
  renderPatrolGridPage();
};

function getPatrolRoomsForPage(hotelNum, classFilter = activePatrolClassFilter) {
  const roomMap = {};
  const roomField = hotelNum === 1 ? "room1" : "room2";

  Object.keys(sheetData).forEach(cKey => {
    if (classFilter !== "all" && cKey !== classFilter) return;
    const cObj = sheetData[cKey];
    if (!cObj) return;
    [...(cObj.boys || []), ...(cObj.girls || [])].forEach(st => {
      const rm = st[roomField] ? st[roomField].trim() : "";
      if (rm && st.name) {
        // 依班級及房號彙整，確保第二晚英文字母代號 (A, B, C...) 跨班不衝突
        const mapKey = `${cKey}_${rm}`;
        if (!roomMap[mapKey]) {
          roomMap[mapKey] = {
            id: `h${hotelNum}_${cKey}_${rm.replace(/[^a-zA-Z0-9_-]/g, "_")}`,
            room: rm,
            class: cKey,
            students: [],
            note: ""
          };
        }
        roomMap[mapKey].students.push(maskStudentName(st.name));
      }
    });
  });

  const list = Object.values(roomMap);
  return list.sort((a, b) => {
    if (a.class !== b.class) return a.class.localeCompare(b.class);
    return a.room.localeCompare(b.room, undefined, { numeric: true });
  });
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

  const allRooms = getPatrolRoomsForPage(currentHotelId, activePatrolClassFilter);
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

  if (allRooms.length === 0) {
    grid.innerHTML = `
      <div style="grid-column:1 / -1; text-align:center; padding:30px; color:#94a3b8; font-size:0.9rem;">
        查無符合條件的房間資料
      </div>
    `;
    return;
  }

  grid.innerHTML = allRooms.map(r => {
    const itemState = hotelChecks[r.id] || { status: "pending", note: "" };
    const statusClass = itemState.status === "checked" ? "checked" : (itemState.status === "absent" ? "absent" : "");
    const statusText = itemState.status === "checked" ? "✅ 已查房 (已就寢)" : (itemState.status === "absent" ? "⚠️ 待確認 (缺席/未歸)" : "⏳ 待查房 (點此標記)");

    // 取得該班級與房間的專屬米色色塊
    const { room1Map, room2Map } = getClassColorMaps(r.class);
    const roomCol = (currentHotelId === 1 ? room1Map[r.room] : room2Map[r.room]) || BEIGE_PALETTE[0];

    return `
      <div class="room-card ${statusClass}" id="card_${r.id}" style="border-top: 5px solid ${roomCol.border};">
        <div class="room-card-header">
          <div style="display:flex; align-items:center; gap:6px;">
            <span class="room-num-badge" style="background:${roomCol.badgeBg}; border:1px solid ${roomCol.border}; color:${roomCol.text}; padding:2px 8px; border-radius:6px;">
              ${r.room} 房
            </span>
            <span style="font-size:0.75rem; color:#64748b;">(${r.students.length}人)</span>
            <span style="background:${roomCol.bg}; border:1px solid ${roomCol.border}; color:${roomCol.text}; font-size:0.7rem; padding:1px 5px; border-radius:4px; font-weight:700;">
              🏷️ ${roomCol.name}
            </span>
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
