/*
  📍 フェーズ7: ①基礎知識タブ
  セクションA: 歴史検定とは
  セクションB: 年号・時代区分の整理（横スクロールタイムライン）
  セクションC: 記述問題の解き方
  セクションD: 論述問題の解き方（1級専用）
*/

import { useState } from "react";
import { BookOpen, Clock, FileText, PenTool, ChevronRight, ChevronLeft } from "lucide-react";
import TabNav from "../components/TabNav.jsx";
import QuizComponent from "../components/QuizComponent.jsx";
import { SectionCard, TipCard, InfoTable, ProgressSection } from "../components/Cards.jsx";

// ============================================================
// セクションA クイズ（5問）
// ============================================================

const quizA = [
  {
    id: "kiso_a_01", era: "kisochishiki", type: "FOUR_CHOICE",
    question: "歴史能力検定を主催している団体はどれか？",
    choices: ["文部科学省", "歴史能力検定協会", "日本歴史学会", "日本ユネスコ協会連盟"],
    answer: 1,
    explanation: "歴史能力検定は「歴史能力検定協会」が1996年に設立し主催する民間の検定試験。",
  },
  {
    id: "kiso_a_02", era: "kisochishiki", type: "FOUR_CHOICE",
    question: "歴史能力検定1級の試験形式として正しいのはどれか？",
    choices: [
      "四択50問 / 60分",
      "四択40問＋記述10問 / 50分",
      "四択25問＋記述10問＋論述1問 / 50分",
      "記述30問＋論述2問 / 60分",
    ],
    answer: 2,
    explanation: "1級は四択25問・記述10問・論述1問（400〜600字）の計36問で50分。準1級は四択40問・記述10問の計50問で50分。",
  },
  {
    id: "kiso_a_03", era: "kisochishiki", type: "FOUR_CHOICE",
    question: "歴史能力検定準1級の合格率として最も適切なのはどれか？",
    choices: ["約5〜10%", "約15〜20%", "約30〜40%", "約50〜60%"],
    answer: 1,
    explanation: "準1級の合格率は約15〜20%。1級はさらに難しく約5〜10%。高校卒業〜大学専門課程レベルの知識が必要。",
  },
  {
    id: "kiso_a_04", era: "kisochishiki", type: "FOUR_CHOICE",
    question: "歴史能力検定の試験は年に何回実施されるか？",
    choices: ["年2回（5月・11月）", "年1回（11月）", "年3回（3月・7月・11月）", "年4回（各四半期）"],
    answer: 1,
    explanation: "歴史能力検定は年1回（11月）開催。試験日は毎年11月の第3日曜日が多い。",
  },
  {
    id: "kiso_a_05", era: "kisochishiki", type: "FOUR_CHOICE",
    question: "歴史能力検定の合格ラインは何%以上か？",
    choices: ["50%以上", "60%以上", "70%以上", "80%以上"],
    answer: 1,
    explanation: "合格ラインは60%以上（満点の6割）。1級・準1級ともに共通。",
  },
];

// ============================================================
// セクションB クイズ（8問）
// ============================================================

const quizB = [
  {
    id: "kiso_b_01", era: "kisochishiki", type: "FOUR_CHOICE",
    question: "弥生時代と縄文時代を区別する最大の特徴はどれか？",
    choices: ["土器の使用", "金属器の使用", "稲作（水田農耕）の開始", "定住生活の開始"],
    answer: 2,
    explanation: "縄文→弥生の最大の変化は稲作（水田農耕）の伝来（前4世紀頃・北九州）。土器や定住は縄文時代からある。",
  },
  {
    id: "kiso_b_02", era: "kisochishiki", type: "FOUR_CHOICE",
    question: "平安時代が始まったのはいつか？",
    choices: ["710年（平城京遷都）", "784年（長岡京遷都）", "794年（平安京遷都）", "800年（桓武天皇即位）"],
    answer: 2,
    explanation: "794年に桓武天皇が平安京（現在の京都）に遷都したことが平安時代の始まり。奈良時代は710〜794年。",
  },
  {
    id: "kiso_b_03", era: "kisochishiki", type: "FOUR_CHOICE",
    question: "鎌倉時代の終わりはいつか？",
    choices: ["1185年", "1221年（承久の乱）", "1333年（鎌倉幕府滅亡）", "1336年（室町幕府成立）"],
    answer: 2,
    explanation: "鎌倉時代は1333年（新田義貞の鎌倉攻め・後醍醐天皇の建武の新政）に終わる。1185年は幕府の実質的成立。",
  },
  {
    id: "kiso_b_04", era: "kisochishiki", type: "FOUR_CHOICE",
    question: "江戸時代が始まった年はいつか？",
    choices: ["1600年（関ヶ原の戦い）", "1603年（家康が将軍就任）", "1615年（大坂の陣）", "1635年（参勤交代制度化）"],
    answer: 1,
    explanation: "江戸時代は1603年に徳川家康が征夷大将軍に就任して江戸幕府を開いた年を始まりとする。",
  },
  {
    id: "kiso_b_05", era: "kisochishiki", type: "FOUR_CHOICE",
    question: "世界史の「中世」はおおよそどの時期か？",
    choices: [
      "前5世紀〜後5世紀",
      "5世紀〜15世紀（西ローマ帝国滅亡〜東ローマ帝国滅亡）",
      "15世紀〜18世紀",
      "18世紀〜20世紀",
    ],
    answer: 1,
    explanation: "世界史の中世は5世紀（西ローマ帝国滅亡476年）〜15世紀（東ローマ帝国滅亡1453年）が一般的な区分。",
  },
  {
    id: "kiso_b_06", era: "kisochishiki", type: "CHRONOLOGICAL",
    question: "次の時代を古い順に並べよ。",
    items: ["江戸時代", "室町時代", "飛鳥時代", "明治時代"],
    answer: [2, 1, 0, 3],
    explanation: "飛鳥（6世紀末〜710）→室町（1336〜1573）→江戸（1603〜1868）→明治（1868〜1912）の順。",
  },
  {
    id: "kiso_b_07", era: "kisochishiki", type: "FOUR_CHOICE",
    question: "「南北朝時代」は何時代と何時代の間に位置するか？",
    choices: [
      "鎌倉時代と室町時代の間",
      "平安時代と鎌倉時代の間",
      "室町時代と戦国時代の間",
      "戦国時代と安土桃山時代の間",
    ],
    answer: 0,
    explanation: "南北朝時代（1336〜1392年）は鎌倉幕府滅亡（1333年）の後、室町幕府（1336年〜）の初期と重なる。",
  },
  {
    id: "kiso_b_08", era: "kisochishiki", type: "FOUR_CHOICE",
    question: "明治時代・大正時代・昭和時代の順序として正しいのはどれか？",
    choices: [
      "明治（1868〜1912）→大正（1912〜1926）→昭和（1926〜1989）",
      "明治（1868〜1900）→大正（1900〜1926）→昭和（1926〜1989）",
      "明治（1858〜1912）→大正（1912〜1926）→昭和（1926〜1989）",
      "明治（1868〜1912）→昭和（1912〜1926）→大正（1926〜1989）",
    ],
    answer: 0,
    explanation: "明治（1868〜1912）→大正（1912〜1926）→昭和（1926〜1989）→平成（1989〜2019）→令和（2019〜）が正確な順序と年代。",
  },
];

// ============================================================
// セクションC クイズ（5問）
// ============================================================

const quizC = [
  {
    id: "kiso_c_01", era: "kisochishiki", type: "FOUR_CHOICE",
    question: "記述問題で「固有名詞の正確な記述」が重要な理由はどれか？",
    choices: [
      "字数を稼げるから",
      "漢字の書き間違いや送り仮名の間違いが減点対象になるから",
      "採点者が読みやすいから",
      "四択問題との差をつけるため",
    ],
    answer: 1,
    explanation: "歴史検定の記述問題では固有名詞（人名・地名・法令名等）の漢字ミスや送り仮名の誤りが減点対象。正確な漢字で書くことが必須。",
  },
  {
    id: "kiso_c_02", era: "kisochishiki", type: "FOUR_CHOICE",
    question: "記述問題を解く際の「因果関係の意識」とはどういう意味か？",
    choices: [
      "複数の答えを列挙する",
      "「〜のため」「〜の結果」という原因と結果の関係を意識して答える",
      "年号を必ず記述する",
      "人物名と年号をセットで覚える",
    ],
    answer: 1,
    explanation: "「なぜその出来事が起きたか・その後どうなったか」という因果関係を意識すると記述の精度が上がり、論述にも応用できる。",
  },
  {
    id: "kiso_c_03", era: "kisochishiki", type: "FOUR_CHOICE",
    question: "準1級の記述問題では主にどのような形式が出題されるか？",
    choices: [
      "400〜600字の論述",
      "人物・事件・政策の名称を答える問題",
      "選択式の問題",
      "図や地図を見て答える問題のみ",
    ],
    answer: 1,
    explanation: "準1級の記述問題（10問）は主に人物名・事件名・政策名・用語を答える問題。1級は論述（400〜600字）が加わる。",
  },
  {
    id: "kiso_c_04", era: "kisochishiki", type: "FOUR_CHOICE",
    question: "年号の覚え方として最も効果的とされるのはどれか？",
    choices: [
      "和暦（元号）を主に覚える",
      "西暦で覚え、元号は補助として確認する",
      "年号は覚えなくて良い",
      "5年単位で大まかに覚える",
    ],
    answer: 1,
    explanation: "歴史検定では西暦での出題が主流。西暦を基本に覚え、元号（大化・享保など）は補助として覚えると混乱しにくい。",
  },
  {
    id: "kiso_c_05", era: "kisochishiki", type: "FOUR_CHOICE",
    question: "「承久の乱後に設置された幕府の出先機関」は何か？",
    choices: ["六波羅探題", "問注所", "侍所", "政所"],
    answer: 0,
    explanation: "承久の乱（1221年）後、朝廷監視のため京都に六波羅探題を設置。これは記述問題の典型的な問題形式（機関名を答える）。",
  },
];

// ============================================================
// セクションD クイズ（5問・1級専用）
// ============================================================

const quizD = [
  {
    id: "kiso_d_01", era: "kisochishiki", type: "FOUR_CHOICE",
    question: "1級の論述問題の標準的な字数はどれか？",
    choices: ["100〜200字", "200〜300字", "400〜600字", "800〜1000字"],
    answer: 2,
    explanation: "1級の論述問題は400〜600字程度。序論（約100字）・本論（約300字）・結論（約100字）の構成が基本。",
  },
  {
    id: "kiso_d_02", era: "kisochishiki", type: "FOUR_CHOICE",
    question: "論述問題の採点で最も重視されるのはどれか？",
    choices: [
      "文字の綺麗さ",
      "字数の多さ",
      "指定キーワードの使用と事実の正確さ",
      "難しい言葉の使用",
    ],
    answer: 2,
    explanation: "論述採点では①指定キーワードの使用②事実の正確さ（年号・人物）③論理的構成が重視される。キーワード活用が最重要。",
  },
  {
    id: "kiso_d_03", era: "kisochishiki", type: "FOUR_CHOICE",
    question: "論述の「序論」で書くべき内容はどれか？",
    choices: [
      "具体的な事実・人物・年号の詳細",
      "自分の意見と感想",
      "時代・背景の説明と問いへの導入",
      "参考文献の列挙",
    ],
    answer: 2,
    explanation: "序論（約100字）では時代・背景を簡潔に説明し、論述の導入をする。具体的な事実は本論で展開する。",
  },
  {
    id: "kiso_d_04", era: "kisochishiki", type: "FOUR_CHOICE",
    question: "1級の論述頻出テーマ（日本史）として最も出題されやすいのはどれか？",
    choices: [
      "縄文土器の種類と特徴",
      "律令制度の成立と幕藩体制・明治維新などの政治史テーマ",
      "江戸時代の文化人の一覧",
      "元禄文化の代表的作品",
    ],
    answer: 1,
    explanation: "1級論述の頻出テーマは律令国家・幕藩体制・明治維新などの政治・制度史。「成立過程」「特質」「意義」を問う形式が多い。",
  },
  {
    id: "kiso_d_05", era: "kisochishiki", type: "FOUR_CHOICE",
    question: "論述に使う接続詞・表現として最も適切なのはどれか？",
    choices: [
      "「なんか」「みたいな」などの話し言葉",
      "「〜のため」「〜の結果」「これにより」などの因果関係を示す表現",
      "「すごく」「とても」などの形容詞",
      "「個人的には」「私が思うに」などの主観的表現",
    ],
    answer: 1,
    explanation: "歴史論述は「〜のため（原因）」「〜の結果（結果）」「これにより（展開）」などの因果関係を示す接続詞を使い客観的に記述する。",
  },
];

// ============================================================
// 横スクロール タイムライン（セクションB用）
// ============================================================

const NIHONSHI_TIMELINE = [
  { id: "kyusekki",      name: "旧石器",    period: "〜前14000",  color: "#B0BEC5" },
  { id: "jomon",         name: "縄文",      period: "前14000〜前4C", color: "#A5D6A7" },
  { id: "yayoi",         name: "弥生",      period: "前4C〜3C",  color: "#80CBC4" },
  { id: "kofun",         name: "古墳",      period: "3C後半〜7C", color: "#FFD54F" },
  { id: "asuka",         name: "飛鳥",      period: "6C末〜710", color: "#FFAB91" },
  { id: "nara",          name: "奈良",      period: "710〜794",  color: "#CE93D8" },
  { id: "heian",         name: "平安",      period: "794〜1185", color: "#90CAF9" },
  { id: "kamakura",      name: "鎌倉",      period: "1185〜1333", color: "#A5D6A7" },
  { id: "nanbokucho",    name: "南北朝",    period: "1336〜1392", color: "#FFCC80" },
  { id: "muromachi",     name: "室町",      period: "1336〜1573", color: "#B39DDB" },
  { id: "sengoku",       name: "戦国",      period: "1467〜1573", color: "#EF9A9A" },
  { id: "azuchimomoyama",name: "安土桃山",  period: "1573〜1603", color: "#FFCC02" },
  { id: "edo",           name: "江戸",      period: "1603〜1868", color: "#80DEEA" },
  { id: "meiji",         name: "明治",      period: "1868〜1912", color: "#F48FB1" },
  { id: "taisho",        name: "大正",      period: "1912〜1926", color: "#A5D6A7" },
  { id: "showa",         name: "昭和",      period: "1926〜1989", color: "#FFD54F" },
  { id: "gendai",        name: "現代",      period: "1989〜",   color: "#90CAF9" },
];

const SEKAISHI_TIMELINE = [
  { id: "ancient",    name: "古代文明",   period: "〜前5C",   color: "#FFCC80" },
  { id: "classical",  name: "古典古代",   period: "前5C〜5C", color: "#A5D6A7" },
  { id: "medieval",   name: "中世",       period: "5〜15C",   color: "#90CAF9" },
  { id: "earlymod",   name: "近世",       period: "15〜18C",  color: "#CE93D8" },
  { id: "modern",     name: "近代",       period: "18〜20C初", color: "#EF9A9A" },
  { id: "contemporary","name": "現代",    period: "20C〜",    color: "#B0BEC5" },
];

function Timeline({ items, label }) {
  const [selected, setSelected] = useState(null);
  return (
    <div>
      <div style={{ fontSize: 12, fontWeight: 700, color: "var(--color-text-light)", marginBottom: 8 }}>{label}</div>
      <div style={{
        display: "flex", overflowX: "auto",
        gap: 6, paddingBottom: 10,
        scrollbarWidth: "none",
      }}>
        {items.map(item => (
          <button
            key={item.id}
            onClick={() => setSelected(selected?.id === item.id ? null : item)}
            style={{
              display: "flex", flexDirection: "column",
              alignItems: "center", padding: "8px 10px",
              borderRadius: 10, border: `2px solid ${selected?.id === item.id ? item.color : "transparent"}`,
              background: item.color + "30",
              cursor: "pointer", flexShrink: 0,
              fontFamily: "var(--font-family)",
              transition: "border-color 0.15s",
              minWidth: 64,
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 700, color: "var(--color-text)" }}>{item.name}</span>
            <span style={{ fontSize: 10, color: "var(--color-text-light)", marginTop: 2 }}>{item.period}</span>
          </button>
        ))}
      </div>
      {selected && (
        <div style={{
          padding: "10px 12px",
          borderRadius: 10,
          background: selected.color + "25",
          border: `1px solid ${selected.color}60`,
          fontSize: 13, marginTop: 4,
        }} className="fade-in">
          <span style={{ fontWeight: 700 }}>{selected.name}時代</span>（{selected.period}）
        </div>
      )}
    </div>
  );
}

// ============================================================
// メインコンポーネント
// ============================================================

export default function KisochishikiTab({ appData, onUpdateData, onNavigate }) {
  const [activeSection, setActiveSection] = useState(null); // "A"|"B"|"C"|"D"|null
  const [quizSection, setQuizSection] = useState(null);

  const progress = appData.progress.kisochishiki;

  const markDone = (key) => {
    onUpdateData({
      progress: {
        ...appData.progress,
        kisochishiki: { ...progress, [key]: true },
      },
    });
  };

  const handleQuizComplete = ({ sectionKey, score, total, pct }) => {
    if (pct >= 60) markDone(sectionKey);
    const today = new Date().toISOString().slice(0, 10);
    onUpdateData({
      testHistory: [
        ...(appData.testHistory || []),
        { date: today, tab: "kisochishiki", era: sectionKey, score, total, pct },
      ],
    });
    setQuizSection(null);
  };

  const sections = [
    {
      key: "A",
      label: "A. 歴史検定とは",
      icon: BookOpen,
      color: "var(--color-secondary)",
      quizzes: quizA,
    },
    {
      key: "B",
      label: "B. 年号・時代区分の整理",
      icon: Clock,
      color: "var(--color-accent)",
      quizzes: quizB,
    },
    {
      key: "C",
      label: "C. 記述問題の解き方",
      icon: FileText,
      color: "var(--color-highlight)",
      quizzes: quizC,
    },
    {
      key: "D",
      label: "D. 論述問題の解き方（1級）",
      icon: PenTool,
      color: "var(--color-warning)",
      quizzes: quizD,
    },
  ];

  // クイズ表示中
  if (quizSection) {
    const sec = sections.find(s => s.key === quizSection);
    return (
      <div className="fade-in">
        <button
          onClick={() => setQuizSection(null)}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "none", border: "none",
            color: "var(--color-primary)", cursor: "pointer",
            fontFamily: "var(--font-family)", fontSize: 13,
            fontWeight: 600, marginBottom: 16, padding: 0,
          }}
        >
          <ChevronLeft size={16} />
          セクション{sec.key}に戻る
        </button>
        <QuizComponent
          quizzes={sec.quizzes}
          sectionKey={sec.key}
          onComplete={handleQuizComplete}
        />
      </div>
    );
  }

  // セクション詳細表示中
  if (activeSection) {
    const sec = sections.find(s => s.key === activeSection);
    const Icon = sec.icon;
    const done = progress[sec.key];
    return (
      <div className="fade-in">
        <button
          onClick={() => setActiveSection(null)}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "none", border: "none",
            color: sec.color, cursor: "pointer",
            fontFamily: "var(--font-family)", fontSize: 13,
            fontWeight: 600, marginBottom: 14, padding: 0,
          }}
        >
          <ChevronLeft size={16} />
          基礎知識 トップへ
        </button>

        {/* セクション A */}
        {activeSection === "A" && (
          <SectionAContent />
        )}
        {/* セクション B */}
        {activeSection === "B" && (
          <SectionBContent />
        )}
        {/* セクション C */}
        {activeSection === "C" && (
          <SectionCContent />
        )}
        {/* セクション D */}
        {activeSection === "D" && (
          <SectionDContent />
        )}

        {/* テスト開始ボタン */}
        <div style={{
          background: "#fff", borderRadius: 14,
          border: "1px solid var(--color-border)",
          padding: "16px", textAlign: "center",
          marginTop: 8,
        }}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>
            セクション {sec.key} 理解度テスト
          </div>
          <div style={{ fontSize: 12, color: "var(--color-text-light)", marginBottom: 12 }}>
            {sec.quizzes.length}問 / 60%以上で完了チェック
          </div>
          {done && (
            <div style={{
              fontSize: 12, fontWeight: 600, color: "var(--color-accent)",
              marginBottom: 10,
            }}>
              ✓ このセクションは完了済みです
            </div>
          )}
          <button
            onClick={() => setQuizSection(sec.key)}
            style={{
              width: "100%", padding: "12px",
              borderRadius: 12, border: "none",
              background: sec.color, color: "#fff",
              fontFamily: "var(--font-family)",
              fontSize: 14, fontWeight: 700,
              cursor: "pointer",
            }}
          >
            テストを受ける ({sec.quizzes.length}問)
          </button>
        </div>
      </div>
    );
  }

  // セクション一覧（トップ）
  return (
    <div className="fade-in">
      <TabNav current="kisochishiki" onNavigate={onNavigate} />

      <div style={{
        background: "linear-gradient(135deg, #FDF6EE 0%, #EEF4FB 100%)",
        borderRadius: 16, border: "1px solid var(--color-border)",
        padding: "16px", marginBottom: 14,
      }}>
        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>
          📚 基礎知識タブ
        </div>
        <div style={{ fontSize: 12, color: "var(--color-text-light)", lineHeight: 1.7 }}>
          歴史能力検定の制度・出題傾向・学習法を4セクションで学びます。
          まずここから始めましょう！
        </div>
      </div>

      {/* 全体進捗 */}
      <div style={{
        background: "#fff", borderRadius: 14,
        border: "1px solid var(--color-border)",
        padding: "12px 14px", marginBottom: 14,
        boxShadow: "var(--shadow-sm)",
      }}>
        <div style={{ fontSize: 12, color: "var(--color-text-light)", marginBottom: 6 }}>
          進捗: {Object.values(progress).filter(Boolean).length} / {Object.values(progress).length} セクション
        </div>
        <div style={{ height: 7, borderRadius: 999, background: "var(--color-border)", overflow: "hidden" }}>
          <div style={{
            height: "100%",
            width: `${Math.round(Object.values(progress).filter(Boolean).length / Object.values(progress).length * 100)}%`,
            background: "var(--color-secondary)", borderRadius: 999,
            transition: "width 0.5s",
          }} />
        </div>
      </div>

      {/* セクションボタン一覧 */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {sections.map(sec => {
          const Icon = sec.icon;
          const done = progress[sec.key];
          return (
            <button
              key={sec.key}
              onClick={() => setActiveSection(sec.key)}
              style={{
                display: "flex", alignItems: "center", gap: 14,
                padding: "14px 16px", borderRadius: 14,
                border: `1px solid ${done ? sec.color + "60" : "var(--color-border)"}`,
                background: done ? sec.color + "10" : "#fff",
                cursor: "pointer", fontFamily: "var(--font-family)",
                textAlign: "left", boxShadow: "var(--shadow-sm)",
                transition: "all 0.2s",
              }}
              onMouseOver={e => e.currentTarget.style.background = sec.color + "14"}
              onMouseOut={e => e.currentTarget.style.background = done ? sec.color + "10" : "#fff"}
            >
              <div style={{
                width: 40, height: 40, borderRadius: 12,
                background: sec.color + "20",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <Icon size={20} color={sec.color} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{sec.label}</div>
                <div style={{ fontSize: 11, color: "var(--color-text-light)", marginTop: 2 }}>
                  {sec.quizzes.length}問のテスト付き
                </div>
              </div>
              {done
                ? <span style={{ fontSize: 12, fontWeight: 700, color: sec.color }}>✓ 完了</span>
                : <ChevronRight size={16} color="var(--color-text-light)" />
              }
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================
// セクションA: 歴史検定とは
// ============================================================

function SectionAContent() {
  return (
    <>
      <SectionCard title="歴史能力検定の仕組み" color="var(--color-secondary)" defaultOpen>
        <InfoTable rows={[
          ["主催",     "歴史能力検定協会（1996年設立）"],
          ["級の種類", "5級〜1級 + 歴検歴史（日本史・世界史）"],
          ["準1級",    "高校卒業程度 / 記述式10問あり / 合格率15〜20%"],
          ["1級",      "大学専門課程 / 論述400〜600字 / 合格率5〜10%"],
          ["合格ライン","60%以上"],
          ["試験回数", "年1回（11月）"],
        ]} />
      </SectionCard>

      <SectionCard title="1級と準1級の違い" color="var(--color-secondary)">
        <InfoTable rows={[
          ["準1級 形式", "四択40問＋記述10問 / 50分"],
          ["1級 形式",   "四択25問＋記述10問＋論述1問 / 50分"],
          ["準1級 内容", "高校卒業程度（教科書の発展的内容まで）"],
          ["1級 内容",   "大学専門課程レベル・論述問題あり"],
          ["共通点",     "合格ライン60%以上・日本史または世界史選択"],
        ]} />
      </SectionCard>

      <SectionCard title="頻出出題ジャンル（準1・1級）" color="var(--color-secondary)">
        {[
          { label: "政治史", pct: 30, color: "var(--color-primary)" },
          { label: "文化史", pct: 25, color: "var(--color-highlight)" },
          { label: "外交・経済史", pct: 20, color: "var(--color-accent)" },
          { label: "社会史", pct: 15, color: "var(--color-secondary)" },
          { label: "その他", pct: 10, color: "var(--color-border)" },
        ].map(item => (
          <div key={item.label} style={{ marginBottom: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 3 }}>
              <span>{item.label}</span>
              <span style={{ fontWeight: 700, color: item.color }}>約{item.pct}%</span>
            </div>
            <div style={{ height: 8, borderRadius: 999, background: "var(--color-border)", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${item.pct * 2}%`, borderRadius: 999, background: item.color }} />
            </div>
          </div>
        ))}
      </SectionCard>
    </>
  );
}

// ============================================================
// セクションB: 年号・時代区分
// ============================================================

function SectionBContent() {
  return (
    <>
      <SectionCard title="日本史 時代区分タイムライン" color="var(--color-accent)" defaultOpen>
        <Timeline items={NIHONSHI_TIMELINE} label="タップすると年代を表示" />
      </SectionCard>

      <SectionCard title="世界史 時代区分タイムライン" color="var(--color-accent)">
        <Timeline items={SEKAISHI_TIMELINE} label="タップすると年代を表示" />
      </SectionCard>

      <SectionCard title="試験によく出る年号・区切り" color="var(--color-accent)">
        <TipCard
          color="var(--color-accent)"
          tips={[
            "645年 大化改新 → 律令国家への転換点",
            "794年 平安京遷都 → 平安時代の始まり",
            "1185年 守護・地頭設置 → 鎌倉幕府の実質的成立",
            "1603年 江戸幕府開府 → 江戸時代の始まり",
            "1868年 明治維新 → 近代日本の始まり",
            "1945年 終戦 → 現代日本の始まり",
          ]}
        />
      </SectionCard>
    </>
  );
}

// ============================================================
// セクションC: 記述問題の解き方
// ============================================================

function SectionCContent() {
  return (
    <>
      <SectionCard title="記述問題の頻出パターン" color="var(--color-highlight)" defaultOpen>
        <InfoTable rows={[
          ["人物問題",   "「〇〇を行った人物は誰か」→ 人名を正確に記述"],
          ["事件問題",   "「〇〇年に起きた出来事を答えよ」→ 事件名を記述"],
          ["用語問題",   "「〇〇政策の名称を答えよ」→ 正式名称で記述"],
          ["説明問題",   "「〇〇について30字以内で説明せよ」→ 簡潔に記述"],
        ]} />
      </SectionCard>

      <SectionCard title="記述のコツ" color="var(--color-highlight)">
        <TipCard
          color="var(--color-highlight)"
          tips={[
            "固有名詞は正確に（漢字・送り仮名）→ 誤字は減点対象",
            "年号は西暦で覚える（和暦は補助として確認）",
            "因果関係を意識する（〜のため、〜の結果）",
            "頻出「ひっかけ」に注意：1185年（幕府実質成立）≠ 1192年（頼朝将軍就任）",
            "御成敗式目は北条泰時（義時ではない）",
            "参勤交代の制度化は徳川家光（家康ではない）",
          ]}
        />
      </SectionCard>
    </>
  );
}

// ============================================================
// セクションD: 論述問題の解き方
// ============================================================

function SectionDContent() {
  return (
    <>
      <SectionCard title="論述問題の構成" color="var(--color-warning)" defaultOpen>
        <InfoTable rows={[
          ["序論（約100字）", "背景・文脈の説明・問いへの導入"],
          ["本論（約300字）", "具体的な事実・人物・年号・因果関係"],
          ["結論（約100字）", "歴史的意義のまとめ・問いへの回答"],
          ["合計",            "400〜600字（試験により指定字数が異なる）"],
        ]} />
      </SectionCard>

      <SectionCard title="頻出論述テーマ（日本史）" color="var(--color-warning)">
        <TipCard
          color="var(--color-warning)"
          tips={[
            "律令制度の成立と崩壊（大宝律令・荘園制）",
            "幕藩体制の特徴（参勤交代・鎖国・石高制）",
            "明治維新の性格（廃藩置県・地租改正・徴兵令）",
            "戦後日本の民主化（GHQ改革・日本国憲法・農地改革）",
          ]}
        />
      </SectionCard>

      <SectionCard title="頻出論述テーマ（世界史）" color="var(--color-warning)">
        <TipCard
          color="var(--color-warning)"
          tips={[
            "ローマ帝国の拡大と衰退（共和政→帝政→分裂）",
            "ルネサンスの意義（人文主義・科学革命の萌芽）",
            "産業革命の影響（資本主義・社会問題・帝国主義）",
            "冷戦の構造（米ソ対立・核抑止・デタント）",
          ]}
        />
      </SectionCard>
    </>
  );
}
