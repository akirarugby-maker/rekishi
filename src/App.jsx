/*
========================================
📜 歴史検定アプリ - ビルド進捗
========================================
フェーズ1:  基盤・デザインシステム    [✅]
フェーズ2:  日本史データ（古代〜中世） [✅]
フェーズ3:  日本史データ（近世〜現代） [✅]
フェーズ4:  世界史・テーマ史データ    [✅]
フェーズ5:  共通コンポーネント        [ ]
フェーズ6:  ホーム画面               [ ]
フェーズ7:  ①基礎知識タブ            [ ]
フェーズ8:  ②日本史タブ 前半         [ ]
フェーズ9:  ②日本史タブ 後半         [ ]
フェーズ10: ③世界史タブ              [ ]
フェーズ11: ④テーマ史タブ            [ ]
フェーズ12: ⑤論述対策タブ            [ ]
フェーズ13: ⑥苦手分析タブ            [ ]
フェーズ14: AI機能（モック）統合      [ ]
フェーズ15: 仕上げ・模擬試験・結合    [ ]
========================================

📍 CHECKPOINT: フェーズ4 完了
実装済み: グローバル状態・デザイントークン・タブ構造・ナビゲーション
         src/data/nihonshiData.js: 旧石器〜室町（10時代）・理解度テスト22問
         src/data/nihonshiDataLate.js: 戦国〜現代（7時代）・人物データ19名・理解度テスト15問
         src/data/sekaishiData.js: 世界史8地域×時代・地域マトリクス・各種テスト問題
         src/data/temashiData.js: テーマ史6分野（文化・宗教・経済・外交・社会・科学）
         src/data/ronshutsuData.js: 論述ガイド・模範解答7題（日本史4題・世界史3題）
次フェーズ: フェーズ5「共通コンポーネント」
*/

import { useState, useEffect, useCallback } from "react";
import {
  Search, BookOpen, Clock, BarChart2, Home,
  Globe, Calendar, ChevronRight, ChevronLeft,
  Check, RefreshCw, Brain, Award, TrendingUp,
  Filter, Scroll, Sword, Crown, Building, Map
} from "lucide-react";

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
// 進捗計算ユーティリティ
// ============================================================

function calcTotalProgress(progress) {
  const allValues = Object.values(progress).flatMap(section => Object.values(section));
  const done = allValues.filter(Boolean).length;
  return { done, total: allValues.length, pct: Math.round((done / allValues.length) * 100) };
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
// ホーム画面（簡易版 / フェーズ6で完成）
// ============================================================

function HomeTab({ appData, onUpdateData, onNavigate }) {
  const { done, total, pct } = calcTotalProgress(appData.progress);

  const getDaysLeft = (dateStr) => {
    if (!dateStr) return null;
    return Math.ceil((new Date(dateStr) - new Date()) / 86400000);
  };

  const countdownColor = (days) => {
    if (days === null) return "var(--color-primary)";
    if (days <= 7)  return "var(--color-warning)";
    if (days <= 30) return "var(--color-secondary)";
    return "var(--color-primary)";
  };

  const daysLeft = getDaysLeft(appData.examDate);

  return (
    <div className="fade-in">
      {/* ウェルカムカード */}
      <div style={{ ...S.card, background: "linear-gradient(135deg, #EEF4FB 0%, #FDF6EE 100%)", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <Scroll size={22} color="var(--color-primary)" />
          <span style={{ fontSize: 16, fontWeight: 700 }}>歴史検定 勉強アプリ</span>
        </div>
        <div style={{ fontSize: 12, color: "var(--color-text-light)", lineHeight: 1.7 }}>
          歴史能力検定 準1級・1級（日本史・世界史）に対応した学習アプリです。
        </div>
      </div>

      {/* 試験概要 */}
      <div style={S.card}>
        <div style={S.cardTitle}>
          <Award size={16} color="var(--color-secondary)" />
          歴史検定 試験概要
        </div>
        <table style={{ width: "100%", fontSize: 12, lineHeight: 1.9, borderCollapse: "collapse" }}>
          <tbody>
            {[
              ["主催",       "歴史能力検定協会"],
              ["試験回数",   "年1回（11月）"],
              ["合格ライン", "60%以上"],
              ["準1級",      "四択40問＋記述10問 / 50分"],
              ["1級",        "四択25問＋記述10問＋論述1問 / 50分"],
              ["準1級レベル","高校卒業程度・合格率15〜20%"],
              ["1級レベル",  "大学専門課程・合格率5〜10%"],
            ].map(([k, v]) => (
              <tr key={k} style={{ borderBottom: "1px solid var(--color-border)" }}>
                <td style={{ color: "var(--color-text-light)", paddingRight: 8, paddingBottom: 2, paddingTop: 2, width: "40%", verticalAlign: "top" }}>{k}</td>
                <td style={{ fontWeight: 500, paddingBottom: 2, paddingTop: 2 }}>{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 受験日 & カウントダウン */}
      <div style={S.card}>
        <div style={S.cardTitle}>
          <Calendar size={16} color="var(--color-accent)" />
          受験日設定・カウントダウン
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <input
            type="date"
            value={appData.examDate}
            onChange={e => onUpdateData({ examDate: e.target.value })}
            style={{
              flex: 1,
              padding: "8px 12px",
              borderRadius: 8,
              border: "1px solid var(--color-border)",
              fontSize: 14,
              fontFamily: "var(--font-family)",
              outline: "none",
            }}
          />
          {daysLeft !== null && (
            <div style={{
              padding: "8px 14px",
              borderRadius: 8,
              background: countdownColor(daysLeft) + "1A",
              color: countdownColor(daysLeft),
              fontWeight: 700,
              fontSize: 14,
              whiteSpace: "nowrap",
            }}>
              残り {daysLeft} 日
            </div>
          )}
        </div>
      </div>

      {/* 学習進捗 */}
      <div style={S.card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <div style={S.cardTitle}>
            <TrendingUp size={16} color="var(--color-highlight)" />
            学習進捗
          </div>
          <span style={S.badge("var(--color-primary)")}>{pct}% 完了</span>
        </div>
        <div style={{ fontSize: 12, color: "var(--color-text-light)", marginBottom: 4 }}>
          {done} / {total} セクション完了
        </div>
        <div style={S.progressBarWrap}>
          <div style={S.progressFill(pct, "var(--color-primary)")} />
        </div>

        <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { label: "基礎知識", key: "kisochishiki", color: "var(--color-secondary)" },
            { label: "日本史",   key: "nihonshi",     color: "var(--color-accent)" },
            { label: "世界史",   key: "sekaishi",     color: "var(--color-highlight)" },
            { label: "テーマ史", key: "temashi",      color: "var(--color-warning)" },
            { label: "論述対策", key: "ronshutsu",    color: "#A0C4FF" },
          ].map(({ label, key, color }) => {
            const vals = Object.values(appData.progress[key]);
            const sd = vals.filter(Boolean).length;
            const st = vals.length;
            const sp = st ? Math.round((sd / st) * 100) : 0;
            return (
              <div key={key}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 3 }}>
                  <span style={{ color: "var(--color-text-light)" }}>{label}</span>
                  <span style={{ fontWeight: 600, color }}>{sd}/{st}</span>
                </div>
                <div style={S.progressBarWrap}>
                  <div style={S.progressFill(sp, color)} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 学習メニュー */}
      <div style={S.card}>
        <div style={S.cardTitle}>学習メニュー</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {TABS.filter(t => t.id !== "home").map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => onNavigate(tab.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 14px",
                  borderRadius: 10,
                  border: "1px solid var(--color-border)",
                  background: tab.color + "12",
                  cursor: "pointer",
                  fontFamily: "var(--font-family)",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "var(--color-text)",
                  textAlign: "left",
                  transition: "background 0.2s",
                }}
                onMouseOver={e => e.currentTarget.style.background = tab.color + "22"}
                onMouseOut={e => e.currentTarget.style.background = tab.color + "12"}
              >
                <Icon size={18} color={tab.color} />
                <span style={{ flex: 1 }}>{tab.label}</span>
                <ChevronRight size={16} color="var(--color-text-light)" />
              </button>
            );
          })}
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
      case "kisochishiki":return <PlaceholderTab tab={TABS[1]} phaseNum={7} />;
      case "nihonshi":    return <PlaceholderTab tab={TABS[2]} phaseNum={8} />;
      case "sekaishi":    return <PlaceholderTab tab={TABS[3]} phaseNum={10} />;
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
