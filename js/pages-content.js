// 新北市林口區麗園國民小學 115學年度六年級戶外教育參觀活動 完整 24 頁手冊內容與網路輔助真實高畫質照片
const pagesContent = [
  // ==================== 第 1 頁 ====================
  {
    num: 1,
    title: "個人資料卡",
    category: "封面與證件",
    render: () => `
      <div class="page-title">🏷️ 個人資料卡</div>
      <div class="book-callout callout-orange" style="margin-bottom:14px;">
        <b>新北市麗園國小 ｜ 原民旅行社製</b><br>
        填寫個人與房號資料，旅途中妥善保管，遇緊急狀況可隨時對照！
      </div>

      <div style="background:#fff7ed; border:2px dashed #f97316; border-radius:12px; padding:16px; margin-bottom:16px;">
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(140px, 1fr)); gap:10px;">
          <div>
            <label style="font-size:0.75rem; font-weight:700; color:#9a3412;">學校名稱</label>
            <input type="text" value="新北市麗園國小" readonly style="width:100%; padding:8px 10px; border-radius:6px; border:1px solid #fed7aa; background:#ffedd5; font-weight:700; color:#9a3412; font-size:0.9rem;">
          </div>
          <div>
            <label style="font-size:0.75rem; font-weight:700; color:#9a3412;">學生姓名</label>
            <input type="text" id="pass_name" placeholder="請輸入姓名" style="width:100%; padding:8px 10px; border-radius:6px; border:1px solid #fdba74; background:white; font-weight:700; font-size:0.9rem;">
          </div>
          <div>
            <label style="font-size:0.75rem; font-weight:700; color:#9a3412;">班級</label>
            <input type="text" id="pass_class" placeholder="如：六年3班" style="width:100%; padding:8px 10px; border-radius:6px; border:1px solid #fdba74; background:white; font-size:0.9rem;">
          </div>
          <div>
            <label style="font-size:0.75rem; font-weight:700; color:#9a3412;">血型</label>
            <input type="text" id="pass_blood" placeholder="如：O型" style="width:100%; padding:8px 10px; border-radius:6px; border:1px solid #fdba74; background:white; font-size:0.9rem;">
          </div>
          <div style="grid-column:1 / -1;">
            <label style="font-size:0.75rem; font-weight:700; color:#9a3412;">通訊地址</label>
            <input type="text" id="pass_addr" placeholder="住家通訊地址" style="width:100%; padding:8px 10px; border-radius:6px; border:1px solid #fdba74; background:white; font-size:0.9rem;">
          </div>
          <div>
            <label style="font-size:0.75rem; font-weight:700; color:#9a3412;">緊急聯絡人家長電話</label>
            <input type="tel" id="pass_parent" placeholder="家長手機號碼" style="width:100%; padding:8px 10px; border-radius:6px; border:1px solid #fdba74; background:white; font-size:0.9rem;">
          </div>
          <div>
            <label style="font-size:0.75rem; font-weight:700; color:#9a3412;">導師/電話</label>
            <input type="tel" id="pass_teacher" placeholder="級任導師電話" style="width:100%; padding:8px 10px; border-radius:6px; border:1px solid #fdba74; background:white; font-size:0.9rem;">
          </div>
          <div>
            <label style="font-size:0.75rem; font-weight:700; color:#9a3412;">遊覽車車號</label>
            <input type="text" id="pass_bus" placeholder="記下車牌號碼" style="width:100%; padding:8px 10px; border-radius:6px; border:1px solid #fdba74; background:white; font-weight:700; color:#ea580c; font-size:0.9rem;">
          </div>
          <div>
            <label style="font-size:0.75rem; font-weight:700; color:#9a3412;">用餐桌號</label>
            <input type="text" id="pass_table" placeholder="如：第5桌" style="width:100%; padding:8px 10px; border-radius:6px; border:1px solid #fdba74; background:white; font-size:0.9rem;">
          </div>
          <div>
            <label style="font-size:0.75rem; font-weight:700; color:#9a3412;">第一晚房號 (今埔里)</label>
            <input type="text" id="pass_room1" placeholder="填入房號" style="width:100%; padding:8px 10px; border-radius:6px; border:1px solid #fdba74; background:white; font-weight:700; color:#0284c7; font-size:0.9rem;">
          </div>
          <div>
            <label style="font-size:0.75rem; font-weight:700; color:#9a3412;">第二晚房號 (麗寶福容)</label>
            <input type="text" id="pass_room2" placeholder="填入房號" style="width:100%; padding:8px 10px; border-radius:6px; border:1px solid #fdba74; background:white; font-weight:700; color:#0284c7; font-size:0.9rem;">
          </div>
        </div>

        <div style="display:flex; justify-content:flex-end; gap:8px; margin-top:14px;">
          <button class="nav-arrow-btn" onclick="saveStudentPass()" style="padding:8px 16px; font-size:0.85rem; height:auto; max-width:none;">💾 儲存名牌卡</button>
          <button class="header-btn" onclick="window.print()" style="padding:8px 16px; font-size:0.85rem; background:#64748b; color:white;">🖨️ 列印</button>
        </div>
      </div>
    `
  },

  // ==================== 第 2 頁 ====================
  {
    num: 2,
    title: "實施計劃與注意事項",
    category: "活動計畫",
    render: () => `
      <div class="page-title">新北市林口區麗園國民小學</div>
      <div style="font-weight:700; color:#64748b; margin-bottom:12px;">(115 學年度 6 年級戶外教育參觀活動實施計劃)</div>

      <div class="book-text">
        <p><b>一、目的：</b>為擴大學生學習領域及生活經驗，指導學生實踐生活規範並充實生活內容，以提高教學效果，特訂定本計畫。</p>
        <p><b>二、活動日期：</b>民國 115 年 11 月 25 日至 11 月 27 日（三天兩夜）。</p>
        <p><b>三、費用內容：</b>包括住宿、餐食、車資、門票、保險、過路費、停車費、司機服務費、領隊費、行政事務雜支費等，由參加學生自行負擔。</p>
        <p><b>四、集合時間：</b>第一天 <b>6:00～6:30</b> 集合，<b>7:00</b> 準時出發，逾時交通自理。</p>
        <p><b>五、參加人員：</b>六年級學生自由報名參加。</p>
      </div>

      <div class="page-section-subtitle">六、注意事項</div>
      <ol class="book-ol">
        <li>安全第一、教學為重、校譽為先。</li>
        <li>參觀各展館時不可動手、喧譁，要依序前進。</li>
        <li>活動時以小組為團體行動單位，不可擅自離隊，如有急需（如：上廁所）一定要告知導師或領隊。</li>
        <li>各景點離開前及晚會後請注意環境整潔，並恢復原狀。</li>
        <li>領隊會跟隨班級一起活動，並在前引導。</li>
        <li>返校後請各班導師確實清查人數再放學。</li>
        <li>上車前記清楚且「寫下」遊覽車外觀、顏色及車號。</li>
        <li>飯店內所有物品請同學們愛惜，如有破壞或任意帶走，飯店人員將依住宿名單追究賠償責任。</li>
        <li>請自行攜帶隨身藥品﹝如：暈車藥﹞，以備不時之需。</li>
        <li>請務必攜帶健保 IC 卡。</li>
        <li><b>環保宣達事項：</b>
          <div style="background:#ecfdf5; border:1px solid #a7f3d0; border-radius:8px; padding:10px 12px; margin-top:8px; font-size:0.9rem; color:#065f46; line-height:1.7;">
            A. 本次旅程中皆不使用/提供免洗餐具，請自備環保餐具。<br>
            B. 本次旅程中不主動提供包裝飲用水/瓶裝水，請自備環保杯。<br>
            C. 本次旅程中請落實垃圾分類及資源回收，共同愛護環境。<br>
            D. 如有連續住宿同一間房間時，請選擇不更換床單及毛巾，減少清洗過程造成的環境負擔。<br>
            E. 配合環保政策，請自備清潔盥洗用品（必帶：牙刷、牙膏；自由攜帶：毛巾、洗髮乳、沐浴乳及護髮乳…等）。
          </div>
        </li>
      </ol>
    `
  },

  // ==================== 第 3 頁 ====================
  {
    num: 3,
    title: "活動行程表",
    category: "行程時程",
    render: () => `
      <div class="page-title">三天活動行程表</div>
      <div style="font-weight:700; color:#64748b; margin-bottom:12px;">新北市林口區麗園國民小學 115學年度6年級戶外教育參觀活動</div>

      <div style="margin-bottom:14px; background:#fff7ed; border-left:4px solid #f97316; padding:12px 14px; border-radius:0 8px 8px 0;">
        <b style="color:#9a3412; font-size:1.02rem;">第一天（11 月 25 日星期三） ｜ 【著便服】</b>
        <div style="font-size:0.92rem; color:#334155; margin-top:6px; line-height:1.7;">
          06:30 學校集合完畢 ➔ 07:00 前出發 ➔ 921 地震教育園區 ➔ 享用午餐 ➔ 林班道體驗工廠 ➔ 今埔里渡假大酒店 Check in ➔ 享用晚餐 ➔ 團康活動 ➔ 21:00 晚點名
        </div>
      </div>

      <div style="margin-bottom:14px; background:#f0f9ff; border-left:4px solid #0284c7; padding:12px 14px; border-radius:0 8px 8px 0;">
        <b style="color:#0369a1; font-size:1.02rem;">第二天（11 月 26 日星期四） ｜ 【著班服】</b>
        <div style="font-size:0.92rem; color:#334155; margin-top:6px; line-height:1.7;">
          07:00 晨喚 ➔ 享用早餐 ➔ 薰衣草森林九九峰園區 ➔ 享用午餐 ➔ 芬園小憩 ➔ 鹿港老街 ➔ 享用晚餐 ➔ 青春晚會 ➔ 麗寶福容大飯店 Check in ➔ 21:30 晚點名
        </div>
      </div>

      <div style="margin-bottom:14px; background:#f0fdf4; border-left:4px solid #10b981; padding:12px 14px; border-radius:0 8px 8px 0;">
        <b style="color:#166534; font-size:1.02rem;">第三天（11 月 27 日星期五） ｜ 【著運動服】</b>
        <div style="font-size:0.92rem; color:#334155; margin-top:6px; line-height:1.7;">
          07:00 晨喚 ➔ 享用早餐 ➔ 麗寶樂園（午餐：必勝客個人套餐） ➔ 16:00 返抵學校放學
        </div>
      </div>

      <div class="book-callout callout-orange">
        ★ 以上時間僅供參考，實際以當天路況為準。
      </div>
    `
  },

  // ==================== 第 4 頁 ====================
  {
    num: 4,
    title: "出門前的叮嚀與退費規定",
    category: "生活規範",
    render: () => `
      <div class="page-title">出門前的叮嚀</div>

      <ol class="book-ol">
        <li>出遊前一晚不熬夜，睡前檢查該帶的物品。</li>
        <li>嚴格遵守集合和上車時間，不耽誤團體行動。</li>
        <li>發揮守望相助精神，集合及上車時，隨時注意同組或鄰座同學是否到齊。</li>
        <li>保持車上及園區整潔，垃圾自行妥善處理。公共場所不可大聲喧譁、吵鬧，並隨時注意和遵守應有之禮儀。</li>
        <li>參觀行程，以班群或班級團體行動，絕不可自行脫隊或嬉鬧玩笑而影響到其他的遊客參觀。全程確實遵守「所有」帶隊老師及領隊的指揮及規定。</li>
        <li>參觀時，確實遵守參觀動線及安全相關規定事項，尤其嚴禁跨越圍欄。</li>
        <li>任何 3C 產品及行動載具（如手機、平板…等）請遵守各班規定攜帶及使用；貴重物品請自行妥善保管，請勿攜帶過多金錢。</li>
        <li>依個人健康及體質狀況，自行攜帶所需物品，如：暈車藥、防蚊液…等，個人用藥請自備，校方及旅行社無法提供。</li>
        <li>行程中，若有任何突發狀況或身體不適現象，請立即知會隨隊老師、領隊或同學，以便「護理師」及時做適當的處理。</li>
      </ol>

      <div class="page-section-subtitle">10. 退費方式（交通部觀光署國內旅遊定型化契約第十二條）</div>
      <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:8px; padding:12px 14px; font-size:0.9rem; line-height:1.7;">
        根據交通部觀光署發布國內旅遊定型化契約第十二條（出發前旅客任意解除契約）甲方於旅遊活動開始前得通知乙方解除本契約，但應繳交行政規費，並應依下列基準賠償：<br>
        • <b>A.</b> 旅遊活動開始前<b>第 2 日至第 20 日以內</b>取消，需收取全額 <b>30%</b> 手續費。<br>
        • <b>B.</b> 旅遊活動開始前<b>第 1 日</b>取消，需收取全額 <b>50%</b> 手續費。<br>
        • <b>C.</b> 旅遊活動開始日或開始後取消或未通知不參加者，<b>僅退門票</b>。
      </div>
    `
  },

  // ==================== 第 5 頁 ====================
  {
    num: 5,
    title: "外出旅遊攜帶物品選取表",
    category: "行前打包",
    render: () => `
      <div class="page-title">外出旅遊攜帶物品選取表</div>
      
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; flex-wrap:wrap; gap:8px;">
        <span style="font-size:0.92rem; font-weight:800; color:#0284c7;" id="bookCheckProgress">打包進度：計算中...</span>
        <button class="header-btn" onclick="resetBookChecklist()" style="font-size:0.8rem; padding:4px 10px; color:#475569;">重設清單</button>
      </div>

      <div style="display:grid; grid-template-columns:1fr; gap:14px; margin-bottom:16px;">
        <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:14px;">
          <h4 style="font-size:1rem; font-weight:800; color:#ea580c; margin-bottom:10px;">🎒 隨身背包（裝貴重物品）</h4>
          <div id="bookBackpackList" style="display:flex; flex-direction:column; gap:8px;"></div>
        </div>

        <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:14px;">
          <h4 style="font-size:1rem; font-weight:800; color:#0284c7; margin-bottom:10px;">🧳 行李袋 / 行李箱（裝換洗衣物）</h4>
          <div id="bookLuggageList" style="display:flex; flex-direction:column; gap:8px;"></div>
        </div>
      </div>

      <div class="book-callout callout-green">
        🌱 <b>因應減塑及環保，特別提醒：</b><br>
        飯店不提供一次性用品（如：梳子、牙刷、牙膏、浴帽…等），請務必自行準備個人盥洗用品！
      </div>
    `
  },

  // ==================== 第 6 頁 ====================
  {
    num: 6,
    title: "旅遊注意事項：行動與車上安全",
    category: "安全守則",
    render: () => `
      <div class="page-title">旅遊注意事項</div>

      <div class="page-section-subtitle">【行動的安全】</div>
      <ol class="book-ol">
        <li>依班級及小組做團體行動，不可落單，與同學彼此照顧，任何時間要離隊必須告知老師及領隊，待核准後才可離去，歸隊時也應向老師及領隊回報。</li>
        <li>牢記集合時間地點並務必準時集合。</li>
        <li>不做追逐、推人等危險動作或遊戲，並遵守身體界線。</li>
        <li>每到各景點，注意自身財物保管，離開時勿留下垃圾並提防陌生人。</li>
        <li>事先詳閱遊樂設施注意事項及遵守規定，選擇適合自己身心狀況的設施。</li>
        <li>請務必遵守觀光地區、餐廳、飯店、遊樂設備等各場所的安全注意事項。</li>
        <li>不從事與本次旅遊無關及其他高危險活動或遊戲。</li>
        <li>嚴禁攜帶或購買刀子、火柴、打火機及其他危險物品。</li>
        <li>遇突發狀況時應立即通知師長或領隊；若脫隊而無法聯繫時，立即向當地服務站求助。</li>
        <li>請勿任意摘折花草樹木、亂丟垃圾及破壞公物。</li>
      </ol>

      <div class="page-section-subtitle">【車上的安全】</div>
      <ol class="book-ol">
        <li>車子行進時，繫上安全帶，不任意起立或離開座位。</li>
        <li>不要倚靠車門站立。</li>
        <li>下車時，貴重物品請隨身攜帶，不要放在遊覽車上，務必記住車輛停放位置及車號。</li>
        <li>在車上禁止飲食，垃圾請妥善處理並帶回飯店丟進垃圾桶。</li>
        <li>請發揮守望相助的精神，每次上車後注意鄰座同學是否已經上車，隨時與老師或領隊回報。</li>
      </ol>
    `
  },

  // ==================== 第 7 頁 ====================
  {
    num: 7,
    title: "住宿安全與禮儀篇",
    category: "住宿禮儀",
    render: () => `
      <div class="page-title">住宿安全與生活禮儀</div>

      <div class="page-section-subtitle">【住宿的安全】</div>
      <ol class="book-ol">
        <li>記得自己房號及用餐桌號（不隨意進入別人房間）。</li>
        <li>一定要與室友集體行動。</li>
        <li>有人來敲門時，問清楚再開門。</li>
        <li>離開房間記得攜帶房卡（鑰匙）。</li>
        <li>就寢時要檢查門窗有無關緊及上鎖。</li>
        <li>要有住宿禮儀，勿打電話惡作劇，不大聲喧譁或打擾其他住宿旅客，嚴禁在走廊及房內嬉戲、奔跑及攀爬。</li>
        <li>晚點名後，若無特殊狀況請留在自己房內休息。</li>
        <li>退房時，一定要檢查物品是否帶齊，並將房卡（鑰匙）交還給領隊。</li>
        <li>進出餐廳嚴禁喧譁並注意用餐禮儀。</li>
        <li>起床時互相提醒，以免室友睡過頭。</li>
      </ol>

      <div class="book-callout callout-red" style="font-weight:700;">
        ◆ 飯店內所有物品請愛惜使用，如果有破壞或帶走者，將依住宿名單追究賠償責任！！！
      </div>

      <div class="page-section-subtitle">【禮儀篇】</div>
      <ol class="book-ol">
        <li>注意服裝儀容，勿把公共空間當成自己家，這是非常不禮貌的行為。</li>
        <li>使用浴室時儘可能不要弄得滿地溼答答，如果浴缸邊擺有厚毛巾或止滑墊，是舖在地上踩腳使用的。</li>
        <li>勿將換洗衣物晾掛於房間陽台或窗口，以免有礙旅館景觀。</li>
        <li>離開房間時，隨手關燈，節約能源。</li>
        <li>同一旅館內任何一個人的小疏忽就可能危及全體，例如：隨手將易燃物晾在高熱的燈罩上，都是該避免的動作。</li>
      </ol>
    `
  },

  // ==================== 第 8 頁 ====================
  {
    num: 8,
    title: "護理篇與緊急救護常識",
    category: "護理急救",
    render: () => `
      <div class="page-title">護理篇與簡易急救常識</div>

      <ol class="book-ol">
        <li>會暈車者，請自備暈車藥，並於開車前半小時服用。</li>
        <li>行程出發前，如果有身體不適，請先就醫確認身體無礙並告知老師，再到校參與活動。如有：胃病、氣喘、心臟疾病等，請自備隨身藥品，以免出門在外就醫不便。</li>
        <li>曾有癲癇或氣喘、心臟疾病……等症狀者，請不要熬夜，並且避免過度興奮、激烈運動和刺激的事物，因太疲倦時易發作。</li>
        <li>早晚溫差較大，應注意保暖，避免感冒。</li>
        <li>出門在外應注意飲食衛生，不吃路邊未包裝食品。</li>
        <li>旅行期間請攜帶健保卡、緊急連絡人姓名、電話（住宅及辦公室）於身上，以備不時之需。</li>
        <li><b>簡易急救小常識：</b>
          <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:8px; padding:12px; margin-top:8px; font-size:0.92rem; line-height:1.75;">
            ☆ <b>灼燙傷時：</b>以冷水沖泡傷處至不痛為止（至少 5-15 分鐘），不可搓揉皮膚，以免表皮受損，容易受到感染。<br>
            ☆ <b>外傷流血時：</b>除了直接加壓傷口使其密合外，尚須抬高患肢 5-10 分鐘。<br>
            ☆ <b>瘀腫傷：</b>應即刻讓患肢休息，避免不必要之走動，不可搓揉，以免傷勢加重。<br>
            ☆ <b>扭傷時：</b>患肢應盡量休息，避免不必要之走動，並抬高患肢以免傷勢加重。<br>
            ☆ <b>扭傷、瘀腫傷急性期：</b>（24-36 小時內）予以局部間歇冰敷，恢復期再用熱敷。
          </div>
        </li>
      </ol>

      <div class="book-callout callout-red" style="font-weight:700;">
        ⚠️ 備註：依護理人員法第二十四條第四款規定，醫療輔助行為應在醫生之指示下行之，因此，校外教學活動時，隨隊護理師只能提供外傷急救緊急處置，無法提供口服藥品。個人用藥請務必自備！
      </div>
    `
  },

  // ==================== 第 9 頁 ====================
  {
    num: 9,
    title: "921地震教育園區：緣起與設施",
    category: "景點導覽",
    render: () => `
      <div class="page-title">921 地震教育園區</div>

      <div class="page-section-subtitle">緣起：</div>
      <div class="book-text">
        <p>1999 年 9 月 21 日凌晨 1 時 47 分，臺灣南投縣、臺中市一帶發生芮氏規模 7.3 的強烈地震，造成 2,321 人死亡及 8000 多人受傷，財物損失估計約新臺幣三千億元，是臺灣百年來最大的地震災難，為提醒政府及民眾反省重視防震及救災措施，各界有興建地震博物館、紀念館或紀念碑之議。</p>
        <p>921 地震發生後，地質學者專家前往震央地帶勘查後，於<b>臺中市霧峰區光復國中</b>斷層隆起災區現址規劃改建為「地震教育園區」，以保存地震原址，紀錄地震史實，提供社會大眾及學校有關地震教育之活教材。90 年 2 月 13 日經教育部召開跨部會協調會議，訂名為「921 地震教育園區」，以彰顯其紀念及教育意義。</p>
      </div>

      <!-- 網路精選真實照片：光復國中操場車籠埔斷層錯動真實照片 -->
      <div class="book-photo-card">
        <img src="assets/images/real/921_track.jpg" alt="光復國中操場車籠埔斷層隆起地貌" loading="lazy">
        <div class="book-photo-caption">
          <span>📸 現場紀實：光復國中操場跑道受車籠埔斷層強烈錯動隆起（高達2.5公尺落差遺址）</span>
          <span class="photo-source-badge">維基共享資源典藏真實照片</span>
        </div>
      </div>

      <div class="page-section-subtitle">園區設施平面圖：</div>
      <div class="book-photo-card">
        <img src="assets/images/921_map.jpg" alt="921地震教育園區彩色設施導覽圖" loading="lazy">
        <div class="book-photo-caption">
          <span>🗺️ 921 地震教育園區完整設施平面配置圖（原書手冊原圖）</span>
        </div>
      </div>
    `
  },

  // ==================== 第 10 頁 ====================
  {
    num: 10,
    title: "921地震教育園區：五大展館深度介紹",
    category: "景點導覽",
    render: () => `
      <div class="page-title">921 園區五大展館介紹</div>

      <!-- 網路精選真實照片：車籠埔斷層保存館特色薄膜天棚外觀 -->
      <div class="book-photo-card">
        <img src="assets/images/real/921_hall.jpg" alt="車籠埔斷層保存館特色建築外觀" loading="lazy">
        <div class="book-photo-caption">
          <span>🏛️ 車籠埔斷層保存館：特殊圓弧薄膜天棚，完整覆蓋保護原光復國中操場地表破裂斷層</span>
          <span class="photo-source-badge">現場實景照片</span>
        </div>
      </div>

      <div style="display:flex; flex-direction:column; gap:14px; margin-top:14px;">
        <div style="background:#f8fafc; border-left:4px solid #0284c7; padding:12px 14px; border-radius:0 8px 8px 0;">
          <b style="color:#0369a1; font-size:1.02rem;">☞ 車籠埔斷層保存館：</b>
          <div style="font-size:0.92rem; color:#334155; margin-top:4px; line-height:1.7;">
            「車籠埔斷層保存館」紀錄及保存 921 地震斷層遺址的景觀，連結現址與過去的共同記憶，透過真實地貌及認識地震科學的知識，讓民眾體現人與大自然之間和諧共處的關係。
          </div>
        </div>

        <div style="background:#f8fafc; border-left:4px solid #f97316; padding:12px 14px; border-radius:0 8px 8px 0;">
          <b style="color:#ea580c; font-size:1.02rem;">☞ 影像館：</b>
          <div style="font-size:0.92rem; color:#334155; margin-top:4px; line-height:1.7;">
            集結了昔日 921 地震的種種圖像以及影音資料，以人文社會與歷史紀錄的角度，真實地呈現 921 地震在人們心中所留下的記憶。透過有系統的展示，觀眾可以瀏覽 921 地震後到處斷垣殘壁、救難人員救災、各界送溫暖、重建施工、以及重建重生後等等情景。
          </div>
        </div>

        <div style="background:#f8fafc; border-left:4px solid #8b5cf6; padding:12px 14px; border-radius:0 8px 8px 0;">
          <b style="color:#7c3aed; font-size:1.02rem;">☞ 地震工程教育館：</b>
          <div style="font-size:0.92rem; color:#334155; margin-top:4px; line-height:1.7;">
            地震工程教育館，分為「展示館」與「毀壞教室保存區」兩部份；「展示館」主要以實驗室為規劃概念，利用互動式展示結合科學演示，讓參觀民眾從動手操作中，獲得地震工程相關知識。「毀壞教室保存區」則保留霧峰區光復國中震損校舍的原址，參觀民眾可見證強烈地震的破壞力，並可觀察臺灣地區中小學校舍建築典型的震損模式。
          </div>
        </div>

        <div style="background:#f8fafc; border-left:4px solid #10b981; padding:12px 14px; border-radius:0 8px 8px 0;">
          <b style="color:#059669; font-size:1.02rem;">☞ 防災教育館：</b>
          <div style="font-size:0.92rem; color:#334155; margin-top:4px; line-height:1.7;">
            防災教育館的設立，是基於「事前的預防工作做得好，遠勝過事後的補救」的理念，將相關的救災及避難知識傳達出去，期待國人能建立正確的防災觀念。
          </div>
        </div>

        <div style="background:#f8fafc; border-left:4px solid #f59e0b; padding:12px 14px; border-radius:0 8px 8px 0;">
          <b style="color:#d97706; font-size:1.02rem;">☞ 重建記錄館：</b>
          <div style="font-size:0.92rem; color:#334155; margin-top:4px; line-height:1.7;">
            本館以數字呈現出 921 地震救災、安置到重建的總體樣貌，提供重建過程的總覽，說明重建工程的費用來源與金額。瞭解集合式住宅重建、山地部落遷村，以及自然復育與居民生計之間的衝突，讓民眾進一步明白重建工作所遭遇的困難與挑戰。隨著館內展示，帶領觀眾一起關懷突然失去親人與家園的災民，看他們如何自立自強、凝聚社區意識，創造出社區產業與文化特色。
          </div>
        </div>
      </div>
    `
  },

  // ==================== 第 11 頁 ====================
  {
    num: 11,
    title: "水里車埕：林班道體驗工廠",
    category: "景點導覽",
    render: () => `
      <div class="page-title">林班道體驗工廠（水里車埕）</div>

      <div class="book-text">
        <p>最後的火車站「水里車埕」，是一個充滿文化與歷史的小山城，而現在車埕多了許多創意、年輕元素，來到位於火車站旁的林班道體驗工廠，豐富而多樣的內容、特色小店鋪、結合文化與教育的特色，讓遊客在體驗中發現木材之美。</p>
        <p>林班道商城是一棟綠色外觀的體驗園區，園區裡有體驗工廠木工教室、特色小店創意商店區、樂活倉庫生活雜貨、木茶房湖畔餐廳等規劃，讓來車埕的遊客能夠透過實際的參與、體驗，去發現車埕特有的木業文化與好玩的地方，也是一個值得一遊的休閒園地。</p>
      </div>

      <!-- 網路精選真實照片：車埕火車站日式木造站體 -->
      <div class="book-photo-card">
        <img src="assets/images/real/checheng_station.jpg" alt="水里車埕火車站日式木造建築" loading="lazy">
        <div class="book-photo-caption">
          <span>🚉 「最後的火車站」車埕車站：集集線終點站，群山環抱之美</span>
          <span class="photo-source-badge">台灣鐵道實景</span>
        </div>
      </div>

      <!-- 手冊原版林班道4張照片 -->
      <div class="book-photo-card">
        <img src="assets/images/linbando_photos.jpg" alt="林班道園區實景照片群" loading="lazy">
        <div class="book-photo-caption">
          <span>🪵 林班道體驗工廠、最後車站、樂活倉庫（手冊原圖）</span>
        </div>
      </div>
    `
  },

  // ==================== 第 12 頁 ====================
  {
    num: 12,
    title: "鹿港老街：古鎮巡禮與不見天街",
    category: "景點導覽",
    render: () => `
      <div class="page-title">鹿港老街：歷史古鎮巡禮</div>

      <div class="book-text">
        <p>鹿港為臺灣重要的歷史古鎮之一，當地保留古蹟相當完善，也是著名的文化發祥地；其中最聞名的包含三大古蹟文祠、龍山寺、天后宮、八景與十二勝，還有民俗文物陳列館保存鹿港文物，供遊客觀覽先民歷史遺蹟。</p>
        <p>鹿港與臺南、萬華為臺灣三大門戶，早期稱為<b>「一府、二鹿、三艋舺」</b>，古時鹿港最熱鬧的一條街在中山路上，就是鼎鼎大名的<b>「不見天街」</b>，它是十分特殊的建築；主要因鹿港靠海，風沙頗大，為防止風沙的直接入侵，鹿港居民在街上蓋上屋頂，於是行人仰頭是看不見天的，這就稱為「不見天街」。</p>
        <p>鹿港廟宇慶典活動中，以農曆三月二十三日的媽祖誕辰、農曆五月初七日蘇府王爺兩項活動較盛大、端午龍舟競渡活動也相當熱鬧唷。</p>
        <p>鹿港小吃和手工藝源自華南民間，承傳古老風味，而每年端午節舉辦的民俗才藝節，則表現出傳統民間藝術色彩，是一項非常有意義的活動，有興趣的民眾可到此一遊。</p>
      </div>

      <!-- 網路精選真實照片：鹿港天后宮國定古蹟 -->
      <div class="book-photo-card">
        <img src="assets/images/real/lukang_tianhou.jpg" alt="國定古蹟鹿港天后宮三川殿" loading="lazy">
        <div class="book-photo-caption">
          <span>🏮 國定古蹟【鹿港天后宮】：湄洲開基媽祖名聞遐邇，雕樑畫棟的建築瑰寶</span>
          <span class="photo-source-badge">文化部文化資產實景</span>
        </div>
      </div>

      <div class="book-photo-card">
        <img src="assets/images/lukang_gate.jpg" alt="鹿港牌樓古蹟照片" loading="lazy">
        <div class="book-photo-caption">
          <span>🏛️ 鹿港古鎮牌樓風采（手冊原圖）</span>
        </div>
      </div>
    `
  },

  // ==================== 第 13 頁 ====================
  {
    num: 13,
    title: "鹿港老街：舊街風貌與九曲巷",
    category: "景點導覽",
    render: () => `
      <div class="page-title">鹿港老街：老街風貌與建築</div>

      <div class="book-text">
        <p>由於昔日的鹿港是以貿易為主，港口附近由於地利之便，便形成船行與商家的重要據點。瑤林街、埔頭街、大有街因臨近河道，於是成為船行與碼頭的集中區。</p>
        <p>鹿港繁盛時碼頭區的主幹─舊街，即今之埔頭、瑤林、大有三條街道，曲折的紅磚巷道兩旁林立著重新整修過的舊式店屋，其奧妙的內部格局和舊式外觀耐人尋味，在此可找到若干老鹿港的風貌。</p>
        <p>走進瑤林、埔頭二街的紅磚道，便令人油然而生一股古樸之意，宛如進入時空隧道。閩南風味的古老宅第，門楣上的各式避邪古物，以及兩旁的門聯，都訴說著舊時父老們的生活步調及型態。近年來由於觀光采風盛行，一些屋主便經營起民俗藝品店，使遊客在望風懷遠之餘，亦增添不少駐足之處。</p>
        <p>街道特別彎曲，有時甚至成直角連串轉彎，所以會如此是先民智慧的展現與適應生活的艱辛，走在街上請仔細體會每一曲折所蘊含的歷史故事。經過長期歲月的沉澱，這裡氣氛由從前的熱鬧繁華轉為今日的淡泊悠閒。</p>
      </div>

      <!-- 網路精選真實照片：九曲巷紅磚巷弄與隘門、半邊井 -->
      <div class="photo-grid-2">
        <div class="book-photo-card">
          <img src="assets/images/real/lukang_nine_turns.jpg" alt="鹿港九曲巷曲折紅磚道" loading="lazy">
          <div class="book-photo-caption">
            <span>曲折防強風與盜匪的「九曲巷」</span>
          </div>
        </div>
        <div class="book-photo-card">
          <img src="assets/images/real/lukang_half_well.jpg" alt="鹿港半邊井" loading="lazy">
          <div class="book-photo-caption">
            <span>人情味敦親睦鄰的「半邊井」</span>
          </div>
        </div>
      </div>

      <div class="book-photo-card">
        <img src="assets/images/lukang_street.jpg" alt="鹿港老街紅磚巷街景照片組" loading="lazy">
        <div class="book-photo-caption">
          <span>🏮 瑤林街、埔頭街紅磚古厝與民俗藝品古街（手冊原圖）</span>
        </div>
      </div>
    `
  },

  // ==================== 第 14 頁 ====================
  {
    num: 14,
    title: "麗寶樂園渡假區介紹",
    category: "主題樂園",
    render: () => `
      <div class="page-title">麗寶樂園渡假區</div>

      <div class="book-text">
        <p>麗寶樂園前身為「月眉育樂世界」，2006 年由麗寶集團接手經營，已蛻變成為嶄新的「麗寶樂園渡假區」。</p>
        <p>麗寶樂園渡假區緊鄰高速公路交流道，交通便捷，擁有臺灣最大佔地 <b>200 公頃</b>園區，結合了探索世界、馬拉灣、飯店區、主題旅店、OUTLET MALL、休息站、國際賽車場、兒童交通安全教育館、全球前十大天空之夢摩天輪，以及東區落羽松大草原。「麗寶樂園渡假區」以一種創新市場打造多元整合新娛樂，為臺灣主題樂園與渡假區的經營模式全新樣貌。</p>
        <p>探索世界擁有許多超人氣設施。其中有全臺唯一高空接軌的斷軌式雲霄飛車<b>『搶救地心』</b>挑戰你的心臟極限以及水花四起的<b>『火山冒險、叢林泛舟』</b>讓你清涼一下，另外還有<b>『POPA 歡樂王國』</b>讓大朋友、小朋友都可以玩得不亦樂乎！！</p>
      </div>

      <!-- 網路精選真實照片：麗寶樂園渡假區壯麗全景 -->
      <div class="book-photo-card">
        <img src="assets/images/real/lihpao_overview.jpg" alt="麗寶樂園全景照片" loading="lazy">
        <div class="book-photo-caption">
          <span>🎡 麗寶樂園渡假區全景：探索世界、馬拉灣與天空之夢摩天輪</span>
          <span class="photo-source-badge">園區實拍全貌</span>
        </div>
      </div>

      <div class="book-photo-card">
        <img src="assets/images/lihpao_overview.jpg" alt="麗寶樂園手冊照片" loading="lazy">
        <div class="book-photo-caption">
          <span>🎢 探索世界歡樂迎賓（手冊原圖）</span>
        </div>
      </div>
    `
  },

  // ==================== 第 15 頁 ====================
  {
    num: 15,
    title: "麗寶探索樂園：三大分區設施導覽",
    category: "主題樂園",
    render: () => `
      <div class="page-title">探索世界三大分區設施</div>

      <!-- 網路精選真實照片：搶救地心斷軌雲霄飛車 -->
      <div class="book-photo-card">
        <img src="assets/images/real/lihpao_gravity_max.jpg" alt="搶救地心斷軌式雲霄飛車" loading="lazy">
        <div class="book-photo-caption">
          <span>⚡ 全球首座斷軌雲霄飛車「搶救地心」：13層樓高空水平斷軌90度垂直俯衝！</span>
          <span class="photo-source-badge">挑戰強心臟</span>
        </div>
      </div>

      <div style="display:flex; flex-direction:column; gap:14px; margin-top:14px;">
        <div style="background:#fef2f2; border-left:4px solid #ef4444; padding:12px 14px; border-radius:0 8px 8px 0;">
          <b style="color:#991b1b; font-size:1.02rem;">⚡ 冒險天堂（刺激設施區，挑戰「強心臟」的你）：</b>
          <div style="font-size:0.92rem; color:#334155; margin-top:4px; line-height:1.7;">
            此區設施有：<b>搶救地心（斷軌雲霄飛車）、時空飛俠、銀河炫風、異次元風暴、音速迴旋、火山冒險、碰碰車</b>。<br>
            ★ <b>搶救地心</b>：為全球首座斷軌式雲霄飛車，高度約有 <b>13 層樓高</b>，挑戰心跳極限！
          </div>
        </div>

        <div style="background:#f0fdf4; border-left:4px solid #10b981; padding:12px 14px; border-radius:0 8px 8px 0;">
          <b style="color:#166534; font-size:1.02rem;">🌲 魔法森林（較慢速之設施，同學增進感情的好去處）：</b>
          <div style="font-size:0.92rem; color:#334155; margin-top:4px; line-height:1.7;">
            設施包括：<b>摩天輪、陽光探戈、魔法風琴師（咖啡杯）、叢林泛舟、花園小舟</b>。<br>
            除了可以暢玩，還可以一起拍下值得一同回憶的歡樂合照唷！
          </div>
        </div>

        <div style="background:#eff6ff; border-left:4px solid #3b82f6; padding:12px 14px; border-radius:0 8px 8px 0;">
          <b style="color:#1e40af; font-size:1.02rem;">👑 POPA 歡樂王國（適合兒童遊玩的童趣樂園）：</b>
          <div style="font-size:0.92rem; color:#334155; margin-top:4px; line-height:1.7;">
            設施包括：<b>採礦飛車（小型雲霄飛車）、探險虎克（海盜船）、人魚木舟（迷你泛舟）、露娜與海盜、皇冠鞦韆（輻射椅）、轉轉笛諾、小蝸牛（手動車）、旋轉木馬、時光旅行（老爺車）、飛象藍天（小飛象）、青蛙跳、娃娃城堡、POPA 歡樂島</b>。
          </div>
        </div>
      </div>

      <div class="book-callout callout-orange" style="margin-top:14px;">
        🍕 <b>午餐貼心安排：</b>特別為麗園國小師生準備<b>「必勝客個人獨享披薩套餐」</b>，補充暢玩活力！
      </div>
    `
  },

  // ==================== 第 16 頁 ====================
  {
    num: 16,
    title: "學習單一：921地震教育園區",
    category: "互動學習單",
    render: () => `
      <div class="page-title">921 地震教育園區學習單</div>
      <div style="font-size:0.9rem; color:#64748b; margin-bottom:12px;">聰明的你，在體驗過地震後，一起來動動腦回答下列問題！</div>

      <div id="quiz1_container"></div>
    `
  },

  // ==================== 第 17 頁 ====================
  {
    num: 17,
    title: "學習單二：鹿港老街古蹟巡禮",
    category: "互動學習單",
    render: () => `
      <div class="page-title">鹿港老街學習單</div>

      <div class="book-photo-card" style="margin-bottom:14px;">
        <img src="assets/images/lukang_heritages.jpg" alt="鹿港五大古蹟圖照" loading="lazy">
        <div class="book-photo-caption">
          <span>考考你對這些古蹟還記得多少！【A 天后宮】｜【B 隘門】｜【C 餓鬼埕】｜【D 新祖宮】｜【E 半邊井】</span>
        </div>
      </div>

      <div id="quiz2_container"></div>
    `
  },

  // ==================== 第 18 頁 ====================
  {
    num: 18,
    title: "學習單三：麗寶探索樂園趣味知識",
    category: "互動學習單",
    render: () => `
      <div class="page-title">麗寶探索樂園學習單</div>
      <div class="book-callout callout-blue" style="margin-bottom:12px;">
        親愛的同學：你今天總共玩了多少遊樂設施呢？設施中的小知識記得把它記下來，一起來挑戰 10 題趣味知識選擇題吧！
      </div>

      <div id="quiz3_container"></div>
    `
  },

  // ==================== 第 19 頁 ====================
  {
    num: 19,
    scanPage: 22,
    title: "晚點名貼心小叮嚀",
    category: "生活規範",
    render: () => `
      <div class="page-title">晚點名貼心小叮嚀</div>

      <div style="overflow-x:auto; margin:14px 0;">
        <table class="table-evening-call">
          <thead>
            <tr>
              <th rowspan="2" style="width:20%;">時間規劃</th>
              <th colspan="2" style="color:#0284c7;">第一晚（今埔里）</th>
              <th colspan="2" style="color:#f97316;">第二晚（麗寶福容）</th>
            </tr>
            <tr>
              <th style="width:20%;">時間</th>
              <th style="width:20%;">地點</th>
              <th style="width:20%;">時間</th>
              <th style="width:20%;">地點</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><b>起床</b></td>
              <td>07:00</td>
              <td>各客房</td>
              <td>07:00</td>
              <td>各客房</td>
            </tr>
            <tr>
              <td><b>退房</b></td>
              <td>早餐後</td>
              <td>飯店大廳</td>
              <td>早餐後</td>
              <td>飯店大廳</td>
            </tr>
            <tr>
              <td><b>早餐</b></td>
              <td>07:20</td>
              <td>飯店餐廳</td>
              <td>07:20</td>
              <td>飯店餐廳</td>
            </tr>
            <tr>
              <td><b>注意事項</b></td>
              <td colspan="2" style="font-size:0.82rem; text-align:left;">21:00 準時晚點名；整理好明日行李</td>
              <td colspan="2" style="font-size:0.82rem; text-align:left;">21:30 準時晚點名；裝箱上車不遺漏</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style="margin-top:16px; font-size:0.95rem; color:#334155; line-height:1.8;">
        <p>● <b>晚上冷氣溫度建議不要低於 25 度</b>，避免感冒著涼。</p>
        <p>● <b>睡前再確認行李是否整理好</b>，證件貴重物品隨身保管。</p>
        <p>● <b>晚點名後因安全考量，請勿擅自離開房間</b>；若有任何問題可撥打至飯店櫃台，會有人員協助處理。</p>
      </div>

      <div style="text-align:center; margin-top:20px; font-weight:800; font-size:1.4rem; color:#0369a1; letter-spacing:0.05em;">
        Good Night 😴 ZZZ...
      </div>
    `
  },

  // ==================== 第 20 頁 ====================
  {
    num: 20,
    scanPage: 23,
    title: "家長聯絡單：電話與住宿一覽",
    category: "緊急聯絡",
    render: () => `
      <div class="page-title">新北市林口區麗園國民小學</div>
      <div style="font-weight:700; color:#64748b; margin-bottom:12px;">(115 學年度 6 年級戶外教育參觀活動家長聯絡單)</div>

      <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:8px; padding:12px 14px; margin-bottom:14px; font-size:0.92rem;">
        <b>日 期：</b>民國 115 年 11 月 25 日至 11 月 27 日
      </div>

      <div style="margin-bottom:14px;">
        <h4 style="font-size:0.98rem; font-weight:800; color:#0369a1; margin-bottom:6px;">🏛️ 活動地點專線：</h4>
        <div style="font-size:0.92rem; line-height:1.75; color:#334155;">
          • 921 地震教育園區：<a href="tel:0423390906" style="font-weight:700;">(04) 2339-0906</a><br>
          • 林班道體驗工廠：<a href="tel:0492777462" style="font-weight:700;">(049) 277-7462</a><br>
          • 薰衣草森林九九峰園區：<a href="tel:0496004999" style="font-weight:700;">(049) 600-4999</a><br>
          • 麗寶樂園：<a href="tel:0425582459" style="font-weight:700;">(04) 2558-2459</a>
        </div>
      </div>

      <div style="margin-bottom:14px;">
        <h4 style="font-size:0.98rem; font-weight:800; color:#ea580c; margin-bottom:6px;">🏨 住宿飯店資訊：</h4>
        <div style="background:#fff7ed; border-radius:8px; padding:12px; margin-bottom:10px; font-size:0.92rem;">
          <b>今埔里渡假大酒店（第一晚）</b><br>
          電話：<a href="tel:0492422088" style="font-weight:700;">(049) 242-2088</a><br>
          地址：南投縣埔里鎮南興街 79 號 ｜ <a href="https://maps.google.com/?q=南投縣埔里鎮南興街79號" target="_blank">🗺️ 地圖導航</a>
        </div>

        <div style="background:#f0f9ff; border-radius:8px; padding:12px; font-size:0.92rem;">
          <b>麗寶福容大飯店（第二晚）</b><br>
          電話：<a href="tel:0425592888" style="font-weight:700;">(04) 2559-2888</a><br>
          地址：台中市后里區福容路 88 號 ｜ <a href="https://maps.google.com/?q=台中市后里區福容路88號" target="_blank">🗺️ 地圖導航</a>
        </div>
      </div>

      <div>
        <h4 style="font-size:0.98rem; font-weight:800; color:#166534; margin-bottom:6px;">📞 緊急聯絡電話：</h4>
        <div style="font-size:0.92rem; line-height:1.75;">
          • 麗園國小聯絡電話：<a href="tel:0226091061" style="font-weight:700;">(02) 2609-1061</a><br>
          • 原民旅行社聯絡電話：<a href="tel:0229509096" style="font-weight:700;">(02) 2950-9096</a>
        </div>
      </div>

      <div style="margin-top:16px; text-align:center; font-size:0.85rem; color:#64748b; border-top:1px dashed #cbd5e1; padding-top:10px;">
        預祝您旅途平安快樂，並把此頁撕下交給家長存查。
      </div>
    `
  },

  // ==================== 第 21 頁 ====================
  {
    num: 21,
    scanPage: 24,
    title: "行程表 (家長存查聯)",
    category: "行程時程",
    render: () => `
      <div class="page-title">戶外教育參觀活動行程表 (存查聯)</div>
      <div style="font-weight:700; color:#64748b; margin-bottom:12px;">新北市林口區麗園國民小學 115 學年度 6 年級</div>

      <div style="font-size:0.92rem; line-height:1.8; color:#334155;">
        <p><b>第一天（11 月 25 日星期三） ｜ （著便服）</b><br>
        06:30 學校集合完畢 ➔ 07:00 前出發 ➔ 921 地震教育園區 ➔ 享用午餐 ➔ 林班道體驗工廠 ➔ 今埔里渡假大酒店 Check in ➔ 享用晚餐 ➔ 團康活動 ➔ 21:00 晚點名</p>

        <p style="margin-top:10px;"><b>第二天（11 月 26 日星期四） ｜ （著班服）</b><br>
        07:00 晨喚 ➔ 享用早餐 ➔ 薰衣草森林九九峰園區 ➔ 享用午餐 ➔ 芬園小憩 ➔ 鹿港老街 ➔ 享用晚餐 ➔ 青春晚會 ➔ 麗寶福容大飯店 Check in ➔ 21:30 晚點名</p>

        <p style="margin-top:10px;"><b>第三天（11 月 27 日星期五） ｜ （著運動服）</b><br>
        07:00 晨喚 ➔ 享用早餐 ➔ 麗寶樂園（午餐：必勝客個人套餐） ➔ 16:00 返抵學校放學</p>
      </div>

      <div class="book-callout callout-orange" style="margin-top:14px;">
        ★ 以上時間僅供參考，實際以當天路況為準。<br>
        預祝全體六年級師生旅途愉快、平安順利！
      </div>

      <div style="margin-top:14px; text-align:right;">
        <button class="nav-arrow-btn" onclick="window.print()" style="font-size:0.88rem; padding:8px 18px; height:auto; max-width:none;">🖨️ 列印存查聯</button>
      </div>
    `
  }
];
