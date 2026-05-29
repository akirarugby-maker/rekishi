/*
  フェーズC-2: テーマ史 因果図・フロー図コンポーネント群
  対象テーマ: 文化史・宗教史・経済史・外交史・社会史・科学技術史
*/

// ============================================================
// 共通ユーティリティ
// ============================================================

function DiagramWrapper({ title, color, note, children }) {
  return (
    <div style={{
      background: color + "08",
      border: `1px solid ${color}30`,
      borderRadius: 12,
      padding: "12px 14px",
      marginTop: 4,
    }}>
      {title && (
        <div style={{ fontSize: 11, fontWeight: 700, color, marginBottom: 10, letterSpacing: "0.04em" }}>
          {title}
        </div>
      )}
      {children}
      {note && (
        <div style={{
          fontSize: 10, color: "var(--color-text-light)",
          marginTop: 8, paddingTop: 6,
          borderTop: `1px solid ${color}20`,
          lineHeight: 1.6,
        }}>
          💡 {note}
        </div>
      )}
    </div>
  );
}

function PhaseRow({ label, years, content, color, highlight = false }) {
  return (
    <div style={{
      display: "flex", gap: 8, alignItems: "flex-start",
      background: highlight ? color + "20" : color + "0C",
      border: `${highlight ? "1.5px" : "1px"} solid ${color}${highlight ? "55" : "25"}`,
      borderRadius: 8, padding: "6px 10px", marginBottom: 3,
    }}>
      <div style={{ flexShrink: 0, minWidth: 56, textAlign: "center" }}>
        <div style={{ fontSize: 11, fontWeight: 700 }}>{label}</div>
        {years && <div style={{ fontSize: 9, color: "var(--color-text-light)", lineHeight: 1.2 }}>{years}</div>}
      </div>
      <div style={{ flex: 1, fontSize: 11, lineHeight: 1.5, color: "var(--color-text)" }}>{content}</div>
    </div>
  );
}

function FlowConnector({ color, label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, margin: "1px 0 1px 20px" }}>
      <div style={{ width: 2, height: 8, background: color + "50" }} />
      {label && <span style={{ fontSize: 9, color: "var(--color-text-light)" }}>▼ {label}</span>}
    </div>
  );
}

// ============================================================
// 文化史: 日本文化の系譜フロー
// ============================================================

export function CultureFlowDiagram({ color = "#DDA0DD" }) {
  const phases = [
    {
      label: "飛鳥・天平",
      years: "6〜8C",
      content: "大陸（中国・朝鮮）の影響大 ▶ 法隆寺・正倉院・東大寺大仏",
      key: "大陸文化",
    },
    {
      label: "国風文化",
      years: "9〜11C",
      content: "仮名文字誕生・王朝文学 ▶ 源氏物語（紫式部）・枕草子（清少納言）・平等院鳳凰堂",
      key: "日本独自化",
    },
    {
      label: "鎌倉文化",
      years: "12〜14C",
      content: "武家・禅・写実主義 ▶ 金剛力士像（運慶・快慶）・平家物語・新仏教（法然・道元）",
      key: "武家文化",
    },
    {
      label: "室町文化",
      years: "14〜16C",
      content: "北山（金閣・能楽・世阿弥）→ 東山（銀閣・書院造・水墨画・雪舟・侘び茶）",
      key: "禅・侘び",
    },
    {
      label: "桃山文化",
      years: "16C後半",
      content: "豪華絢爛 ▶ 姫路城・障壁画（狩野永徳）・茶道（千利休）・南蛮文化",
      key: "豪壮華麗",
    },
    {
      label: "元禄文化",
      years: "17C後半",
      content: "上方（大坂・京都）中心・商人文化 ▶ 俳諧（松尾芭蕉）・歌舞伎・浮世絵（菱川師宣）",
      key: "上方中心",
    },
    {
      label: "化政文化",
      years: "19C前半",
      content: "江戸中心・大衆化 ▶ 富嶽三十六景（葛飾北斎）・東海道五十三次（歌川広重）・読本・滑稽本",
      key: "江戸中心",
    },
  ];

  return (
    <DiagramWrapper
      title="📊 日本文化の系譜フロー"
      color={color}
      note="元禄文化（上方・町人・17C後半）と化政文化（江戸・大衆・19C前半）の違いは試験頻出。文化名と代表作品をセットで覚える"
    >
      {phases.map((p, i) => (
        <div key={i}>
          <div style={{
            display: "flex", gap: 8, alignItems: "flex-start",
            background: color + (i % 2 === 0 ? "14" : "08"),
            border: `1px solid ${color}30`,
            borderRadius: 8, padding: "6px 10px",
          }}>
            <div style={{ flexShrink: 0, textAlign: "center", minWidth: 52 }}>
              <div style={{ fontSize: 11, fontWeight: 700 }}>{p.label}</div>
              <div style={{ fontSize: 9, color: "var(--color-text-light)" }}>{p.years}</div>
              <div style={{
                fontSize: 9, marginTop: 2, fontWeight: 600,
                background: color + "30", border: `1px solid ${color}50`,
                borderRadius: 4, padding: "1px 4px", color,
              }}>
                {p.key}
              </div>
            </div>
            <div style={{ flex: 1, fontSize: 11, lineHeight: 1.6, color: "var(--color-text)" }}>{p.content}</div>
          </div>
          {i < phases.length - 1 && (
            <div style={{ marginLeft: 14, margin: "2px 0 2px 14px" }}>
              <div style={{ width: 2, height: 5, background: color + "40" }} />
            </div>
          )}
        </div>
      ))}
    </DiagramWrapper>
  );
}

// ============================================================
// 宗教史: 仏教伝来ルート＋鎌倉新仏教系譜
// ============================================================

export function BuddhismRouteDiagram({ color = "#F4A460" }) {
  return (
    <DiagramWrapper
      title="📊 仏教伝来ルート＋鎌倉新仏教の系譜"
      color={color}
      note="鎌倉新仏教の特徴：①易行（念仏・題目など簡単な修行）②在家（農民・武士でも信仰可能）③個人救済（武士の死生観と合致）"
    >
      {/* 伝来ルート */}
      <div style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "var(--color-text-light)", marginBottom: 5 }}>仏教の東漸（伝来ルート）</div>
        <div style={{ display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap" }}>
          {[
            { place: "インド", detail: "釈迦\n前5世紀" },
            { place: "中国", detail: "漢〜唐\n1〜9世紀" },
            { place: "朝鮮半島", detail: "百済\n前後" },
            { place: "日本", detail: "538年\n飛鳥時代" },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              {i > 0 && (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                  <div style={{ height: 2, width: 16, background: color + "60" }} />
                  <span style={{ fontSize: 12, color }}>▶</span>
                  <div style={{ fontSize: 8, color: "var(--color-text-light)" }}>
                    {i === 1 ? "シルクロード" : i === 2 ? "〜6C" : "伝来"}
                  </div>
                </div>
              )}
              <div style={{
                background: color + "25", border: `1.5px solid ${color}60`,
                borderRadius: 8, padding: "5px 8px", textAlign: "center",
              }}>
                <div style={{ fontSize: 12, fontWeight: 700 }}>{item.place}</div>
                <div style={{ fontSize: 9, color: "var(--color-text-light)", whiteSpace: "pre-line", lineHeight: 1.2 }}>{item.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 鎌倉新仏教 系譜 */}
      <div style={{ borderTop: `1px dashed ${color}30`, paddingTop: 8 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "var(--color-text-light)", marginBottom: 5 }}>鎌倉新仏教の系譜（比叡山から生まれた）</div>

        {/* 比叡山から */}
        <div style={{ textAlign: "center", marginBottom: 4 }}>
          <div style={{
            display: "inline-block",
            background: color + "30", border: `2px solid ${color}70`,
            borderRadius: 8, padding: "5px 14px",
          }}>
            <span style={{ fontSize: 12, fontWeight: 700 }}>比叡山延暦寺（天台宗・最澄）</span>
            <div style={{ fontSize: 9, color: "var(--color-text-light)" }}>平安時代・多くの僧がここで学ぶ</div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: 4, marginBottom: 5 }}>
          {["↙", "↓", "↘", "↙", "↓", "↘"].map((a, i) => (
            <span key={i} style={{ fontSize: 16, color: color + "90", lineHeight: 1 }}>{a}</span>
          ))}
        </div>

        {/* 6宗派 */}
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {[
            { name: "浄土宗", founder: "法然", mantra: "南無阿弥陀仏", note: "念仏・専修念仏" },
            { name: "浄土真宗", founder: "親鸞", mantra: "南無阿弥陀仏", note: "悪人正機・他力本願" },
            { name: "時宗", founder: "一遍", mantra: "南無阿弥陀仏", note: "踊り念仏・遊行" },
            { name: "臨済宗", founder: "栄西", mantra: "坐禅・公案", note: "武士・問答形式" },
            { name: "曹洞宗", founder: "道元", mantra: "只管打坐", note: "「正法眼蔵」著述" },
            { name: "日蓮宗", founder: "日蓮", mantra: "南無妙法蓮華経", note: "法華経・他宗批判" },
          ].map(s => (
            <div key={s.name} style={{
              background: color + "12", border: `1px solid ${color}35`,
              borderRadius: 8, padding: "5px 8px",
              flex: "1 0 130px",
            }}>
              <div style={{ fontSize: 11, fontWeight: 700 }}>{s.name}</div>
              <div style={{ fontSize: 9, color, fontWeight: 600 }}>開祖：{s.founder}</div>
              <div style={{ fontSize: 9, color: "var(--color-text-light)", lineHeight: 1.3 }}>
                {s.mantra}
              </div>
              <div style={{ fontSize: 9, color: "var(--color-text-light)" }}>{s.note}</div>
            </div>
          ))}
        </div>
      </div>
    </DiagramWrapper>
  );
}

// ============================================================
// 経済史: 経済制度の変遷フロー
// ============================================================

export function EconomyFlowDiagram({ color = "#A5D6A7" }) {
  const phases = [
    {
      era: "古代（租庸調）",
      years: "7〜12C",
      content: "租（稲を国衙へ）・庸（都で労役）・調（特産品）",
      sub: "律令国家の税制 ← 中国の唐制度を模倣",
    },
    {
      era: "中世（荘園経済）",
      years: "12〜16C",
      content: "不輸不入の権で荘園が増加。農民は荘園領主（貴族・寺社）に年貢を納める",
      sub: "守護・地頭が荘園の実質的支配権を強化",
    },
    {
      era: "近世（石高制）",
      years: "16〜19C",
      content: "太閤検地（1582〜）で全国の土地を石高（米の生産力）で統一評価。参勤交代・知行制",
      sub: "江戸：農工商の身分制 / 五人組・検地帳で農民管理",
    },
    {
      era: "近代（貨幣経済）",
      years: "1868〜",
      content: "地租改正（1873年）：米→現金で地租3%。富国強兵・殖産興業。株式会社制度",
      sub: "資本主義の発展 → 産業革命 → 労働問題・社会主義運動",
    },
    {
      era: "戦後（混合経済）",
      years: "1945〜",
      content: "農地改革（小作農→自作農）・財閥解体・労働組合法。高度経済成長（年率10%超）",
      sub: "石油危機（1973）→安定成長→バブル→「失われた30年」",
    },
  ];

  return (
    <DiagramWrapper
      title="📊 経済制度の変遷フロー"
      color={color}
      note="「地租改正」は米による現物税を現金納付に変更した近代税制の出発点。農民の負担は変わらず反発も起きた（地租改正反対一揆）"
    >
      {phases.map((p, i) => (
        <div key={i}>
          <div style={{
            background: color + (i % 2 === 0 ? "15" : "08"),
            border: `1px solid ${color}30`,
            borderRadius: 8, padding: "7px 10px",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 3 }}>
              <span style={{ fontSize: 12, fontWeight: 700 }}>{p.era}</span>
              <span style={{ fontSize: 9, color: "var(--color-text-light)" }}>{p.years}</span>
            </div>
            <div style={{ fontSize: 11, lineHeight: 1.5, marginBottom: 2 }}>{p.content}</div>
            <div style={{ fontSize: 10, color: "var(--color-text-light)", lineHeight: 1.4 }}>{p.sub}</div>
          </div>
          {i < phases.length - 1 && (
            <FlowConnector color={color} />
          )}
        </div>
      ))}
    </DiagramWrapper>
  );
}

// ============================================================
// 外交史: 日本の外交変遷フロー
// ============================================================

export function DiplomacyFlowDiagram({ color = "#80DEEA" }) {
  return (
    <DiagramWrapper
      title="📊 日本の外交変遷フロー"
      color={color}
      note="遣唐使廃止（894年・菅原道真の建言）後は国風文化が花開く。鎖国から開国へ転換し、不平等条約改正には約40年かかった"
    >
      {[
        {
          era: "遣隋使・遣唐使", years: "7〜9C",
          content: "小野妹子ら→中国の政治制度・文化を積極導入",
          key: "「894年廃止」菅原道真の建言", highlight: true,
        },
        {
          era: "日宋貿易・勘合貿易", years: "11〜16C",
          content: "平清盛が日宋貿易を推進。足利義満が勘合貿易（明との正式貿易）を開始",
          key: "勘合符で正規貿易と倭寇を区別",
        },
        {
          era: "南蛮貿易", years: "16C",
          content: "ポルトガル・スペインと貿易。鉄砲（1543年）・キリスト教伝来（フランシスコ・ザビエル1549年）",
          key: "キリスト教の普及→禁教（1612年）",
        },
        {
          era: "鎖国", years: "17〜19C",
          content: "長崎（オランダ・中国）・対馬（朝鮮）・薩摩（琉球）・松前（アイヌ）の4つの口のみ開放",
          key: "「完全な鎖国」ではなく限定的開放", highlight: true,
        },
        {
          era: "開国・不平等条約", years: "1853〜",
          content: "ペリー来航→日米和親条約（1854）→日米修好通商条約（1858・安政五カ国条約）",
          key: "関税自主権なし・領事裁判権あり",
        },
        {
          era: "条約改正の達成", years: "1894〜1911",
          content: "陸奥宗光が領事裁判権撤廃（1894）、小村寿太郎が関税自主権回復（1911）",
          key: "約40年越しの悲願達成", highlight: true,
        },
        {
          era: "戦後の外交", years: "1945〜",
          content: "サンフランシスコ平和条約（1951）独立回復→日米安保体制→日中国交正常化（1972）",
          key: "「専守防衛」・安保条約の枠組みが現在も継続",
        },
      ].map((item, i, arr) => (
        <div key={i}>
          <div style={{
            background: item.highlight ? color + "22" : color + "0C",
            border: `${item.highlight ? "1.5px" : "1px"} solid ${color}${item.highlight ? "50" : "25"}`,
            borderRadius: 8, padding: "6px 10px",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 2 }}>
              <span style={{ fontSize: 11, fontWeight: 700 }}>{item.era}</span>
              <span style={{ fontSize: 9, color: "var(--color-text-light)", flexShrink: 0 }}>{item.years}</span>
            </div>
            <div style={{ fontSize: 11, lineHeight: 1.5, marginBottom: 2 }}>{item.content}</div>
            <div style={{
              fontSize: 10, fontWeight: 600, color,
              display: "inline-block",
              background: color + "18", borderRadius: 4, padding: "1px 6px",
            }}>
              ⭐ {item.key}
            </div>
          </div>
          {i < arr.length - 1 && <FlowConnector color={color} />}
        </div>
      ))}
    </DiagramWrapper>
  );
}

// ============================================================
// 社会史: 社会制度・女性の地位の変遷
// ============================================================

export function SocialHistoryDiagram({ color = "#B5EAD7" }) {
  return (
    <DiagramWrapper
      title="📊 社会制度・女性の地位の変遷"
      color={color}
      note="日本国憲法（1946公布・1947施行）で初めて法的に男女平等が保障。1945年衆院選から女性が参政権を行使（39名が当選）"
    >
      {/* 身分制度の変遷 */}
      <div style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "var(--color-text-light)", marginBottom: 5 }}>身分制度の変遷</div>
        {[
          { era: "古代", content: "良民（自由民）と賤民（奴婢など）の区別。女帝が多数（推古・持統・元明・孝謙天皇）" },
          { era: "中世", content: "武士・農民・商工業者の区別が始まる。女性の相続権が縮小（武家社会化）" },
          { era: "近世（江戸）", content: "士農工商の身分制度。農民が最多数（80%）。女性は「三従（父・夫・子に従う）」" },
          { era: "近代（明治〜）", content: "四民平等（1869年）。解放令（1871年）で賤民制度廃止。しかし実態は差別が継続" },
          { era: "戦後", content: "日本国憲法で法的平等。部落差別撤廃運動・障害者権利・外国人居住権の拡大" },
        ].map((item, i) => (
          <PhaseRow key={i} label={item.era} content={item.content} color={color} />
        ))}
      </div>

      {/* 女性の地位 */}
      <div style={{ borderTop: `1px dashed ${color}30`, paddingTop: 8 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "var(--color-text-light)", marginBottom: 5 }}>女性の地位・権利の変化</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {[
            { year: "古代", event: "女性天皇が多数・女性の財産相続権あり" },
            { year: "中世", event: "武家社会で財産相続権縮小・「家」制度の確立" },
            { year: "江戸", event: "貝原益軒「女大学」→良妻賢母思想の浸透" },
            { year: "1900年", event: "津田梅子が女子英学塾設立（現：津田塾大）" },
            { year: "1911年", event: "平塚らいてうが青鞜社設立「元始、女性は太陽であった」" },
            { year: "1920年", event: "市川房枝らが新婦人協会を設立・婦人参政権運動" },
            { year: "1945年", event: "婦人参政権獲得・衆院選で39名の女性議員誕生" },
            { year: "1985年", event: "男女雇用機会均等法・1999年男女共同参画社会基本法" },
          ].map((item, i) => (
            <div key={i} style={{
              display: "flex", gap: 8, alignItems: "baseline",
              background: color + (i % 2 === 0 ? "12" : "06"),
              border: `1px solid ${color}25`,
              borderRadius: 7, padding: "4px 10px",
            }}>
              <span style={{ flexShrink: 0, fontSize: 10, fontWeight: 700, color, minWidth: 42 }}>{item.year}</span>
              <span style={{ fontSize: 10, color: "var(--color-text-light)", lineHeight: 1.4 }}>{item.event}</span>
            </div>
          ))}
        </div>
      </div>
    </DiagramWrapper>
  );
}

// ============================================================
// 科学技術史: 技術の伝播と発展フロー
// ============================================================

export function ScienceFlowDiagram({ color = "#90CAF9" }) {
  return (
    <DiagramWrapper
      title="📊 科学技術の伝播と発展フロー"
      color={color}
      note="日本は「輸入→吸収→改良」のサイクルで技術発展。蘭学は西洋医学・天文学・兵学に影響し、明治の近代化を準備した"
    >
      {[
        {
          era: "古代〜中世",
          label: "大陸からの技術",
          items: ["農業技術（稲作・養蚕）", "金属加工（鉄器・銅器）", "暦法・天文学（中国）", "木造建築技術（法隆寺五重塔）"],
          color: "#A5D6A7",
        },
        {
          era: "安土桃山",
          label: "南蛮・西洋技術の流入",
          items: ["鉄砲伝来（1543年・種子島）", "活版印刷（キリシタン版）", "西洋医学（アルメイダら）", "望遠鏡・時計"],
          color: "#FFCC80",
        },
        {
          era: "江戸時代",
          label: "蘭学の発展",
          items: ["解体新書（1774年・杉田玄白・前野良沢）", "「ターヘル・アナトミア」翻訳", "平賀源内（エレキテル）", "伊能忠敬（日本地図作製）", "高野長英・渡辺崋山（海外事情研究）"],
          color: "#90CAF9",
          highlight: true,
        },
        {
          era: "明治時代",
          label: "欧米技術の大量導入",
          items: ["お雇い外国人（コンドル・モース・ベルツ）", "帝国大学設立（1886年）", "北里柴三郎（破傷風血清療法・ペスト菌）", "高峰譲吉（アドレナリン抽出）", "鉄道・電信・電話の整備"],
          color: "#F48FB1",
          highlight: true,
        },
        {
          era: "戦後〜現代",
          label: "日本独自の技術力",
          items: ["家電革命（トランジスタラジオ・ウォークマン）", "自動車産業（トヨタ・ホンダ）", "半導体・液晶技術", "ノーベル賞受賞（湯川秀樹〜現代まで多数）", "iPS細胞（山中伸弥・2012年）"],
          color: "#B39DDB",
        },
      ].map((phase, i, arr) => (
        <div key={i}>
          <div style={{
            background: phase.color + (phase.highlight ? "20" : "12"),
            border: `${phase.highlight ? "1.5px" : "1px"} solid ${phase.color}${phase.highlight ? "55" : "35"}`,
            borderRadius: 8, padding: "7px 10px",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
              <span style={{ fontSize: 12, fontWeight: 700 }}>{phase.era}</span>
              <span style={{
                fontSize: 10, color: phase.color, fontWeight: 600,
                background: phase.color + "20", borderRadius: 5, padding: "1px 6px",
              }}>{phase.label}</span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              {phase.items.map(item => (
                <div key={item} style={{
                  fontSize: 10, padding: "2px 8px",
                  background: phase.color + "15", border: `1px solid ${phase.color}35`,
                  borderRadius: 99, lineHeight: 1.4,
                }}>
                  {item}
                </div>
              ))}
            </div>
          </div>
          {i < arr.length - 1 && <FlowConnector color={color} />}
        </div>
      ))}
    </DiagramWrapper>
  );
}

// ============================================================
// theme ID → diagram マッピング
// ============================================================

export function TemashiThemeDiagram({ themeId, color }) {
  switch (themeId) {
    case "culture":   return <CultureFlowDiagram color={color} />;
    case "religion":  return <BuddhismRouteDiagram color={color} />;
    case "economy":   return <EconomyFlowDiagram color={color} />;
    case "diplomacy": return <DiplomacyFlowDiagram color={color} />;
    case "women":     return <SocialHistoryDiagram color={color} />;
    case "science":   return <ScienceFlowDiagram color={color} />;
    default:          return null;
  }
}
