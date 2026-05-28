/*
========================================
📜 歴史検定アプリ - ビルド進捗
========================================
フェーズ1:  基盤・デザインシステム    [✅]
フェーズ2:  日本史データ（古代〜中世） [✅]
フェーズ3:  日本史データ（近世〜現代） [✅]
フェーズ4:  世界史・テーマ史データ    [✅]
フェーズ5:  共通コンポーネント        [✅]
フェーズ6:  ホーム画面               [✅]
フェーズ7:  ①基礎知識タブ            [✅]
フェーズ8:  ②日本史タブ 前半         [✅]
フェーズ9:  ②日本史タブ 後半         [✅]
フェーズ10: ③世界史タブ              [✅]
フェーズ11: ④テーマ史タブ            [ ]
フェーズ12: ⑤論述対策タブ            [ ]
フェーズ13: ⑥苦手分析タブ            [ ]
フェーズ14: AI機能（モック）統合      [ ]
フェーズ15: 仕上げ・模擬試験・結合    [ ]
========================================

📍 CHECKPOINT: フェーズ10 完了
実装済み: グローバル状態・デザイントークン・タブ構造・ナビゲーション
         src/data/nihonshiData.js: 旧石器〜室町（10時代）・理解度テスト22問
         src/data/nihonshiDataLate.js: 戦国〜現代（7時代）・人物データ19名・理解度テスト15問
         src/data/sekaishiData.js: 世界史8地域×時代・地域マトリクス・各種テスト問題
         src/data/temashiData.js: テーマ史6分野（文化・宗教・経済・外交・社会・科学）
         src/data/ronshutsuData.js: 論述ガイド・模範解答7題（日本史4題・世界史3題）
         src/components/QuizComponent.jsx: 四択・年代順・記述式・結果画面
         src/components/TabNav.jsx: タブ間ナビゲーションバー
         src/components/Cards.jsx: SectionCard・KeywordList・EventTimeline・TipCard・FigureCard・EraCard他
         src/tabs/HomeTab.jsx: 全タブ横断検索・試験概要・カウントダウン・進捗チェックリスト・リセット確認
         src/tabs/KisochishikiTab.jsx: セクションA〜D・横スクロールタイムライン・23問のテスト・進捗連動
         src/tabs/NihonshiTab.jsx: 17時代グループ表示・時代詳細・理解度テスト・進捗連動
                                   人物図鑑（19名・時代フィルタ）・単語帳（フラッシュカード）・テスト履歴
         src/tabs/SekaishiTab.jsx: 8セクション地域別/時代順表示・詳細・理解度テスト・進捗連動
次フェーズ: フェーズ11「④テーマ史タブ」
*/

import { useState, useEffect, useCallback } from "react";
import {
  BookOpen, BarChart2, Home,
  Globe, ChevronLeft,
  Brain, Scroll, Crown,
} from "lucide-react";
import HomeTab from "./tabs/HomeTab.jsx";
import KisochishikiTab from "./tabs/KisochishikiTab.jsx";
import NihonshiTab from "./tabs/NihonshiTab.jsx";
import SekaishiTab from "./tabs/SekaishiTab.jsx";

// ============================================================
// 定数
// ============================================================

const STORAGE_KEY = "rekishi-kentei-app-data";

const TABS = [
  { id: "home",         label: "ホーム",    icon: Home,     color: "var(--color-primary)" },
  { id: "kisochishiki", label: "基礎知識",  icon: BookOpen, color: "var(--color-secondary)" },
  { id: "nihonshi",     label: "日本史",    icon: Scroll,   color: "var(--color-accent)" },
  { id: "sekaishi",     label: "世界史",    icon: Globe,    color: "var(--color-highlight)" },
  { id: "temashi",      label: "テーマ史",  icon: Crown,    color: "var(--color-warning)" },
  { id: "ronshutsu",    label: "論述対策",  icon: Brain,    color: "#A0C4FF" },
  { id: "nigate",       label: "苦手分析",  icon: BarChart2,color: "#B5EAD7" },
];

// ============================================================
// 初期グローバル状態
// ============================================================

const INITIAL_STATE = {
  examDate: "",
  progress: {
    kisochishiki: { A: false, B: false, C: false, D: false },
    nihonshi: {
      genshi: false, kofun: false, asuka: false, nara: false,
      heian: false, kamakura: false, nanbokucho: false, muromachi: false,
      sengoku: false, azuchimomoyama: false, edo: false,
      meiji: false, taisho: false, showa: false, gendai: false,
    },
    sekaishi: {
      ancient: false, eastAsia: false, southAsia: false,
      middleEast: false, europe_medieval: false, europe_modern: false,
      industrial: false, worldWar: false, coldWar: false, contemporary: false,
    },
    temashi: {
      culture: false, religion: false, economy: false,
      diplomacy: false, science: false, women: false,
    },
    ronshutsu: { method: false, practice: false, model: false },
    nigatebunseki: { analyzed: false },
  },
  testHistory: [],
  reviewStatus: {},
};

// ============================================================
// localStorage ユーティリティ
// ============================================================

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_STATE;
    const parsed = JSON.parse(raw);
    return {
      ...INITIAL_STATE,
      ...parsed,
      progress: {
        ...INITIAL_STATE.progress,
        ...(parsed.progress || {}),
        kisochishiki:  { ...INITIAL_STATE.progress.kisochishiki,  ...(parsed.progress?.kisochishiki  || {}) },
        nihonshi:      { ...INITIAL_STATE.progress.nihonshi,      ...(parsed.progress?.nihonshi      || {}) },
        sekaishi:      { ...INITIAL_STATE.progress.sekaishi,      ...(parsed.progress?.sekaishi      || {}) },
        temashi:       { ...INITIAL_STATE.progress.temashi,       ...(parsed.progress?.temashi       || {}) },
        ronshutsu:     { ...INITIAL_STATE.progress.ronshutsu,     ...(parsed.progress?.ronshutsu     || {}) },
        nigatebunseki: { ...INITIAL_STATE.progress.nigatebunseki, ...(parsed.progress?.nigatebunseki || {}) },
      },
    };
  } catch {
    return INITIAL_STATE;
  }
}

function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

// ============================================================
// スタイル定数
// ============================================================

const S = {
  app: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100%",
    maxWidth: 480,
    margin: "0 auto",
    background: "var(--color-bg)",
    boxShadow: "0 0 32px rgba(107,159,212,0.12)",
  },

  header: {
    background: "linear-gradient(135deg, var(--color-primary) 0%, #8BB8E8 100%)",
    padding: "14px 16px 10px",
    color: "#fff",
    flexShrink: 0,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: 700,
    letterSpacing: "0.04em",
  },

  headerSub: {
    fontSize: 11,
    opacity: 0.85,
    marginTop: 2,
  },

  tabBar: {
    display: "flex",
    overflowX: "auto",
    background: "#fff",
    borderBottom: "2px solid var(--color-border)",
    flexShrink: 0,
    msOverflowStyle: "none",
    scrollbarWidth: "none",
  },

  tabBtn: (active, color) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 3,
    padding: "9px 13px",
    border: "none",
    background: "none",
    cursor: "pointer",
    whiteSpace: "nowrap",
    fontSize: 11,
    fontFamily: "var(--font-family)",
    fontWeight: active ? 700 : 400,
    color: active ? color : "var(--color-text-light)",
    borderBottom: active ? `2.5px solid ${color}` : "2.5px solid transparent",
    marginBottom: -2,
    transition: "color 0.2s, border-color 0.2s",
    flexShrink: 0,
  }),

  content: {
    flex: 1,
    overflowY: "auto",
    padding: "16px 14px 32px",
  },

  card: {
    background: "#fff",
    borderRadius: 16,
    border: "1px solid var(--color-border)",
    padding: "14px 16px",
    marginBottom: 12,
    boxShadow: "var(--shadow-sm)",
  },

  cardTitle: {
    fontSize: 14,
    fontWeight: 700,
    marginBottom: 10,
    display: "flex",
    alignItems: "center",
    gap: 6,
  },

  badge: (color) => ({
    display: "inline-block",
    padding: "2px 10px",
    borderRadius: 999,
    fontSize: 11,
    fontWeight: 600,
    background: color + "22",
    color: color,
  }),

  progressBarWrap: {
    height: 8,
    borderRadius: 999,
    background: "var(--color-border)",
    overflow: "hidden",
    marginTop: 6,
  },

  progressFill: (pct, color) => ({
    height: "100%",
    width: `${pct}%`,
    borderRadius: 999,
    background: color || "var(--color-primary)",
    transition: "width 0.5s ease",
  }),

  placeholderCard: {
    background: "var(--color-card-bg)",
    borderRadius: 16,
    border: "1px solid var(--color-border)",
    padding: "48px 24px",
    textAlign: "center",
  },
};

// ============================================================
// プレースホルダータブ
// ============================================================

function PlaceholderTab({ tab, phaseNum }) {
  const Icon = tab.icon;
  return (
    <div className="fade-in">
      <div style={S.placeholderCard}>
        <div style={{ color: tab.color, opacity: 0.5, marginBottom: 14 }}>
          <Icon size={52} />
        </div>
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{tab.label}</div>
        <div style={{ fontSize: 13, color: "var(--color-text-light)", lineHeight: 1.7 }}>
          フェーズ {phaseNum} で実装予定
          <br />
          現在はフェーズ1（基盤構築）完了済みです。
        </div>
      </div>
    </div>
  );
}

// ============================================================
// メインアプリ
// ============================================================

export default function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [appData, setAppData] = useState(loadData);
  const [navStack, setNavStack] = useState([]);

  const updateData = useCallback((partial) => {
    setAppData(prev => {
      const next = { ...prev, ...partial };
      saveData(next);
      return next;
    });
  }, []);

  const navigate = useCallback((tabId) => {
    setNavStack(prev => [...prev, activeTab]);
    setActiveTab(tabId);
  }, [activeTab]);

  const goBack = useCallback(() => {
    if (navStack.length === 0) return;
    const prev = navStack[navStack.length - 1];
    setNavStack(s => s.slice(0, -1));
    setActiveTab(prev);
  }, [navStack]);

  const renderContent = () => {
    switch (activeTab) {
      case "home":        return <HomeTab appData={appData} onUpdateData={updateData} onNavigate={navigate} />;
      case "kisochishiki":return <KisochishikiTab appData={appData} onUpdateData={updateData} onNavigate={navigate} />;
      case "nihonshi":    return <NihonshiTab appData={appData} onUpdateData={updateData} onNavigate={navigate} />;
      case "sekaishi":    return <SekaishiTab appData={appData} onUpdateData={updateData} onNavigate={navigate} />;
      case "temashi":     return <PlaceholderTab tab={TABS[4]} phaseNum={11} />;
      case "ronshutsu":   return <PlaceholderTab tab={TABS[5]} phaseNum={12} />;
      case "nigate":      return <PlaceholderTab tab={TABS[6]} phaseNum={13} />;
      default:            return null;
    }
  };

  return (
    <div style={S.app}>
      {/* ヘッダー */}
      <header style={S.header}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {navStack.length > 0 && (
            <button
              onClick={goBack}
              style={{
                background: "rgba(255,255,255,0.25)",
                border: "none",
                borderRadius: 8,
                padding: "4px 8px",
                cursor: "pointer",
                color: "#fff",
                display: "flex",
                alignItems: "center",
              }}
            >
              <ChevronLeft size={18} />
            </button>
          )}
          <div>
            <div style={S.headerTitle}>📜 歴史検定 勉強アプリ</div>
            <div style={S.headerSub}>準1級・1級 日本史・世界史対応</div>
          </div>
        </div>
      </header>

      {/* タブバー */}
      <nav style={S.tabBar}>
        {TABS.map(tab => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => { setNavStack([]); setActiveTab(tab.id); }}
              style={S.tabBtn(active, tab.color)}
            >
              <Icon size={15} />
              {tab.label}
            </button>
          );
        })}
      </nav>

      {/* コンテンツ */}
      <main style={S.content} key={activeTab}>
        {renderContent()}
      </main>
    </div>
  );
}
