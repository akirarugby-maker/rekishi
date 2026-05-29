/*
  📍 フェーズ6: ホーム画面（完成版）
  - 全タブ横断検索
  - 試験概要カード
  - 受験日カウントダウン
  - 学習進捗表（全セクション）
  - リセットボタン（確認ダイアログ）
*/

import { useState, useMemo, useRef, useEffect } from "react";
import {
  Search, Award, Calendar, TrendingUp, ChevronRight,
  RefreshCw, Home, BookOpen, Globe, Brain, BarChart2,
  Scroll, Crown, Check, X, Sword,
} from "lucide-react";
import TabNav from "../components/TabNav.jsx";
import { StudyPlanCard } from "../components/AIAdvisor.jsx";
import { nihonshiDataAll, nihonshiOrderAll } from "../data/nihonshiDataLate.js";
import { sekaishiData } from "../data/sekaishiData.js";
import { temashiData, temashiOrder } from "../data/temashiData.js";

// ============================================================
// 検索インデックス構築
// ============================================================

function buildSearchIndex() {
  const index = [];

  // 日本史
  for (const id of nihonshiOrderAll) {
    const era = nihonshiDataAll[id];
    if (!era) continue;
    index.push({ label: era.name, sub: era.period, tab: "nihonshi", section: id, type: "日本史" });
    era.keywords?.forEach(kw =>
      index.push({ label: kw, sub: era.name, tab: "nihonshi", section: id, type: "日本史キーワード" })
    );
    era.figures?.forEach(fig =>
      index.push({ label: fig, sub: era.name, tab: "nihonshi", section: id, type: "人物" })
    );
    era.events?.forEach(ev =>
      index.push({ label: ev.event, sub: era.year, tab: "nihonshi", section: id, type: "出来事" })
    );
  }

  // 世界史
  Object.values(sekaishiData).forEach(sec => {
    index.push({ label: sec.region + "（" + sec.era + "）", sub: sec.topics?.join("・"), tab: "sekaishi", section: sec.id, type: "世界史" });
    sec.topics?.forEach(t =>
      index.push({ label: t, sub: sec.region, tab: "sekaishi", section: sec.id, type: "世界史トピック" })
    );
    sec.keyEvents?.forEach(ev =>
      index.push({ label: ev.event, sub: ev.year, tab: "sekaishi", section: sec.id, type: "世界史出来事" })
    );
  });

  // テーマ史
  Object.values(temashiData).forEach(t => {
    index.push({ label: t.label, sub: t.description, tab: "temashi", section: t.id, type: "テーマ史" });
  });

  // 論述（キーワード）
  const ronshutsuThemes = [
    "律令国家の成立", "幕藩体制の構造", "明治維新の意義",
    "戦後民主化と経済復興", "産業革命の意義", "フランス革命", "冷戦の構造",
  ];
  ronshutsuThemes.forEach(t =>
    index.push({ label: t, sub: "論述テーマ", tab: "ronshutsu", section: null, type: "論述" })
  );

  return index;
}

const SEARCH_INDEX = buildSearchIndex();

// ============================================================
// 進捗セクション定義
// ============================================================

const PROGRESS_SECTIONS = [
  {
    tab: "kisochishiki", label: "基礎知識", color: "var(--color-secondary)", icon: BookOpen,
    items: [
      { key: "A", label: "歴史検定とは" },
      { key: "B", label: "年号・時代区分" },
      { key: "C", label: "記述問題の解き方" },
      { key: "D", label: "論述問題の解き方" },
    ],
  },
  {
    tab: "nihonshi", label: "日本史", color: "var(--color-accent)", icon: Scroll,
    items: nihonshiOrderAll.map(id => ({
      key: id,
      label: nihonshiDataAll[id]?.name || id,
    })),
  },
  {
    tab: "sekaishi", label: "世界史", color: "var(--color-highlight)", icon: Globe,
    items: [
      { key: "ancient",         label: "東アジア（古代〜中世）" },
      { key: "eastAsia",        label: "東アジア（中世〜近世）" },
      { key: "middleEast",      label: "中東・イスラム世界" },
      { key: "europe_medieval", label: "ヨーロッパ（中世）" },
      { key: "europe_modern",   label: "ヨーロッパ（近世〜近代）" },
      { key: "industrial",      label: "産業革命" },
      { key: "worldWar",        label: "世界大戦" },
      { key: "coldWar",         label: "冷戦・現代" },
    ],
  },
  {
    tab: "temashi", label: "テーマ史", color: "var(--color-warning)", icon: Crown,
    items: temashiOrder.map(id => ({
      key: id,
      label: temashiData[id]?.label || id,
    })),
  },
  {
    tab: "ronshutsu", label: "論述対策", color: "#A0C4FF", icon: Brain,
    items: [
      { key: "method",   label: "論述の書き方マスター" },
      { key: "practice", label: "頻出テーマ別解答例" },
      { key: "model",    label: "論述練習モード" },
    ],
  },
];

// ============================================================
// スタイル
// ============================================================

const S = {
  card: {
    background: "#fff",
    borderRadius: 16,
    border: "1px solid var(--color-border)",
    padding: "14px 16px",
    marginBottom: 12,
    boxShadow: "var(--shadow-sm)",
  },
  cardTitle: {
    fontSize: 20, fontWeight: 700,
    display: "flex", alignItems: "center", gap: 6,
    marginBottom: 10,
  },
  badge: (color) => ({
    display: "inline-block", padding: "2px 10px",
    borderRadius: 999, fontSize: 19, fontWeight: 600,
    background: color + "22", color,
  }),
  progressWrap: {
    height: 7, borderRadius: 999,
    background: "var(--color-border)", overflow: "hidden",
  },
  progressFill: (pct, color) => ({
    height: "100%", width: `${pct}%`, borderRadius: 999,
    background: color || "var(--color-primary)",
    transition: "width 0.5s ease",
  }),
  checkRow: (checked) => ({
    display: "flex", alignItems: "center", gap: 8,
    padding: "5px 0",
    cursor: "pointer",
    borderBottom: "none",
  }),
  checkBox: (checked, color) => ({
    width: 18, height: 18, borderRadius: 5,
    border: `2px solid ${checked ? color : "var(--color-border)"}`,
    background: checked ? color : "#fff",
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0, transition: "all 0.15s",
  }),
};

// ============================================================
// 検索バー
// ============================================================

function SearchBar({ onNavigate }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return SEARCH_INDEX.filter(item =>
      item.label.toLowerCase().includes(q) ||
      (item.sub && item.sub.toLowerCase().includes(q))
    ).slice(0, 8);
  }, [query]);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (item) => {
    setQuery("");
    setOpen(false);
    onNavigate(item.tab, item.section);
  };

  const typeColor = {
    "日本史": "var(--color-accent)",
    "日本史キーワード": "var(--color-accent)",
    "人物": "var(--color-highlight)",
    "出来事": "var(--color-secondary)",
    "世界史": "var(--color-primary)",
    "世界史トピック": "var(--color-primary)",
    "世界史出来事": "var(--color-primary)",
    "テーマ史": "var(--color-warning)",
    "論述": "#A0C4FF",
  };

  return (
    <div ref={ref} style={{ position: "relative", marginBottom: 14 }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        background: "#fff", borderRadius: 14,
        border: "1.5px solid var(--color-border)",
        padding: "10px 14px",
        boxShadow: "var(--shadow-sm)",
      }}>
        <Search size={17} color="var(--color-text-light)" />
        <input
          type="text"
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder="人物・事件・年号・キーワードで検索..."
          style={{
            flex: 1, border: "none", outline: "none",
            fontFamily: "var(--font-family)", fontSize: 20,
            color: "var(--color-text)", background: "transparent",
          }}
        />
        {query && (
          <button
            onClick={() => { setQuery(""); setOpen(false); }}
            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-light)", display: "flex" }}
          >
            <X size={15} />
          </button>
        )}
      </div>

      {open && results.length > 0 && (
        <div style={{
          position: "absolute", top: "100%", left: 0, right: 0, zIndex: 100,
          background: "#fff", borderRadius: 12,
          border: "1px solid var(--color-border)",
          boxShadow: "var(--shadow-md)",
          overflow: "hidden", marginTop: 4,
        }} className="scale-in">
          {results.map((item, i) => (
            <button
              key={i}
              onClick={() => handleSelect(item)}
              style={{
                width: "100%", display: "flex",
                alignItems: "center", gap: 10,
                padding: "10px 14px", border: "none",
                background: "none", cursor: "pointer",
                textAlign: "left", fontFamily: "var(--font-family)",
                borderBottom: i < results.length - 1 ? "1px solid var(--color-border)" : "none",
              }}
              onMouseOver={e => e.currentTarget.style.background = "#F8F9FD"}
              onMouseOut={e => e.currentTarget.style.background = "none"}
            >
              <span style={S.badge(typeColor[item.type] || "var(--color-primary)")}>{item.type}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 19, fontWeight: 600 }}>{item.label}</div>
                {item.sub && <div style={{ fontSize: 19, color: "var(--color-text-light)" }}>{item.sub}</div>}
              </div>
              <ChevronRight size={13} color="var(--color-text-light)" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================
// 進捗表
// ============================================================

function ProgressTable({ appData, onToggle, onNavigate }) {
  const [expandedTab, setExpandedTab] = useState(null);

  return (
    <div>
      {PROGRESS_SECTIONS.map(section => {
        const Icon = section.icon;
        const prog = appData.progress[section.tab] || {};
        const done = section.items.filter(item => prog[item.key]).length;
        const total = section.items.length;
        const pct = total ? Math.round((done / total) * 100) : 0;
        const expanded = expandedTab === section.tab;

        return (
          <div key={section.tab} style={{ marginBottom: 10 }}>
            {/* セクションヘッダー */}
            <button
              onClick={() => setExpandedTab(expanded ? null : section.tab)}
              style={{
                width: "100%", display: "flex",
                alignItems: "center", gap: 10,
                padding: "10px 12px",
                background: expanded ? section.color + "12" : "#F8F9FD",
                borderRadius: 10,
                border: `1px solid ${expanded ? section.color + "40" : "var(--color-border)"}`,
                cursor: "pointer", fontFamily: "var(--font-family)",
                transition: "all 0.2s",
              }}
            >
              <Icon size={15} color={section.color} />
              <span style={{ flex: 1, fontSize: 19, fontWeight: 700, textAlign: "left" }}>
                {section.label}
              </span>
              <span style={{ fontSize: 20, fontWeight: 600, color: section.color }}>
                {done}/{total}
              </span>
              <div style={{ width: 50 }}>
                <div style={S.progressWrap}>
                  <div style={S.progressFill(pct, section.color)} />
                </div>
              </div>
              <span style={{ fontSize: 19, color: "var(--color-text-light)" }}>
                {expanded ? "▲" : "▼"}
              </span>
            </button>

            {/* チェックリスト */}
            {expanded && (
              <div style={{
                border: "1px solid var(--color-border)",
                borderTop: "none", borderRadius: "0 0 10px 10px",
                padding: "8px 12px",
                background: "#fff",
              }} className="fade-in">
                {section.items.map((item, idx) => {
                  const checked = !!prog[item.key];
                  return (
                    <label
                      key={item.key}
                      style={{
                        display: "flex", alignItems: "center", gap: 10,
                        padding: "7px 4px",
                        cursor: "pointer",
                        borderBottom: idx < section.items.length - 1 ? "1px solid var(--color-border)" : "none",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => onToggle(section.tab, item.key)}
                        style={{ display: "none" }}
                      />
                      <div style={S.checkBox(checked, section.color)}>
                        {checked && <Check size={11} color="#fff" />}
                      </div>
                      <span style={{ fontSize: 19, flex: 1, color: checked ? "var(--color-text-light)" : "var(--color-text)", textDecoration: checked ? "line-through" : "none" }}>
                        {item.label}
                      </span>
                      <button
                        onClick={e => { e.preventDefault(); onNavigate(section.tab, item.key); }}
                        style={{
                          background: "none", border: "none", cursor: "pointer",
                          color: section.color, padding: "2px 4px",
                          display: "flex", alignItems: "center",
                        }}
                      >
                        <ChevronRight size={13} />
                      </button>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ============================================================
// ホームタブ本体
// ============================================================

export default function HomeTab({ appData, onUpdateData, onNavigate }) {
  const [showReset, setShowReset] = useState(false);

  // 全体進捗
  const allValues = Object.values(appData.progress).flatMap(s => Object.values(s));
  const totalDone = allValues.filter(Boolean).length;
  const totalAll = allValues.length;
  const totalPct = totalAll ? Math.round((totalDone / totalAll) * 100) : 0;

  // 残り日数
  const daysLeft = appData.examDate
    ? Math.ceil((new Date(appData.examDate) - new Date()) / 86400000)
    : null;

  const countdownColor =
    daysLeft === null ? "var(--color-primary)" :
    daysLeft <= 7     ? "var(--color-warning)" :
    daysLeft <= 30    ? "var(--color-secondary)" :
    "var(--color-primary)";

  // 進捗トグル
  const handleToggle = (tab, key) => {
    onUpdateData({
      progress: {
        ...appData.progress,
        [tab]: {
          ...appData.progress[tab],
          [key]: !appData.progress[tab]?.[key],
        },
      },
    });
  };

  // リセット
  const handleReset = () => {
    const resetProgress = Object.fromEntries(
      Object.entries(appData.progress).map(([k, v]) => [
        k,
        Object.fromEntries(Object.keys(v).map(key => [key, false])),
      ])
    );
    onUpdateData({ progress: resetProgress, testHistory: [], reviewStatus: {} });
    setShowReset(false);
  };

  return (
    <div className="fade-in">
      {/* タブナビ */}
      <TabNav current="home" onNavigate={onNavigate} />

      {/* 検索窓 */}
      <SearchBar onNavigate={onNavigate} />

      {/* 試験概要カード */}
      <div style={S.card}>
        <div style={S.cardTitle}>
          <Award size={16} color="var(--color-secondary)" />
          歴史能力検定 試験概要
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 20, lineHeight: 1.9 }}>
          <tbody>
            {[
              ["主催",       "歴史能力検定協会（1996年設立）"],
              ["対象",       "準1級・1級（日本史または世界史選択）"],
              ["試験回数",   "年1回（11月）"],
              ["合格ライン", "60%以上"],
              ["準1級",      "四択40問＋記述10問 / 50分・合格率15〜20%"],
              ["1級",        "四択25問＋記述10問＋論述1問 / 50分・合格率5〜10%"],
            ].map(([k, v], i, arr) => (
              <tr key={k} style={{ borderBottom: i < arr.length - 1 ? "1px solid var(--color-border)" : "none" }}>
                <td style={{ color: "var(--color-text-light)", paddingRight: 8, width: "35%", paddingTop: 3, paddingBottom: 3, verticalAlign: "top" }}>{k}</td>
                <td style={{ fontWeight: 600, paddingTop: 3, paddingBottom: 3 }}>{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 受験日設定＆カウントダウン */}
      <div style={S.card}>
        <div style={S.cardTitle}>
          <Calendar size={16} color="var(--color-accent)" />
          受験日・カウントダウン
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <input
            type="date"
            value={appData.examDate}
            onChange={e => onUpdateData({ examDate: e.target.value })}
            style={{
              flex: 1, padding: "9px 12px",
              borderRadius: 10,
              border: "1px solid var(--color-border)",
              fontFamily: "var(--font-family)", fontSize: 19,
              outline: "none", color: "var(--color-text)",
            }}
          />
          {daysLeft !== null && (
            <div style={{
              padding: "9px 16px", borderRadius: 10,
              background: countdownColor + "18",
              color: countdownColor,
              fontWeight: 700, fontSize: 19,
              whiteSpace: "nowrap",
              border: `1px solid ${countdownColor}30`,
            }}>
              残り {daysLeft > 0 ? `${daysLeft}日` : daysLeft === 0 ? "今日！" : "終了"}
            </div>
          )}
        </div>
        {daysLeft !== null && daysLeft > 0 && (
          <div style={{
            marginTop: 10, fontSize: 20,
            color: "var(--color-text-light)",
            display: "flex", gap: 16,
          }}>
            <span>📅 {Math.ceil(daysLeft / 7)}週間後</span>
            <span>📚 1日あたり{Math.max(1, Math.round(totalAll / Math.max(1, daysLeft)))}セクション</span>
          </div>
        )}
      </div>

      {/* 全体進捗 */}
      <div style={S.card}>
        <div style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "center", marginBottom: 8,
        }}>
          <div style={S.cardTitle}>
            <TrendingUp size={16} color="var(--color-highlight)" />
            学習進捗
          </div>
          <span style={S.badge("var(--color-primary)")}>{totalPct}% 完了</span>
        </div>
        <div style={{ fontSize: 20, color: "var(--color-text-light)", marginBottom: 6 }}>
          {totalDone} / {totalAll} セクション完了
        </div>
        <div style={S.progressWrap}>
          <div style={S.progressFill(totalPct, "var(--color-primary)")} />
        </div>

        {/* タブ別ミニ進捗 */}
        <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
          {PROGRESS_SECTIONS.map(section => {
            const prog = appData.progress[section.tab] || {};
            const done = section.items.filter(item => prog[item.key]).length;
            const total = section.items.length;
            const pct = total ? Math.round((done / total) * 100) : 0;
            return (
              <div key={section.tab}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 20, marginBottom: 3 }}>
                  <span style={{ color: "var(--color-text-light)" }}>{section.label}</span>
                  <span style={{ fontWeight: 600, color: section.color }}>{done}/{total}</span>
                </div>
                <div style={S.progressWrap}>
                  <div style={S.progressFill(pct, section.color)} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AIスタディプラン */}
      <StudyPlanCard appData={appData} onNavigate={onNavigate} />

      {/* 模擬試験バナー */}
      <button
        onClick={() => onNavigate("mockexam")}
        style={{
          width: "100%", display: "flex", alignItems: "center", gap: 12,
          padding: "14px 16px", borderRadius: 14, marginBottom: 12,
          border: "1px solid var(--color-secondary)50",
          background: "linear-gradient(135deg, var(--color-secondary)15, var(--color-secondary)05)",
          cursor: "pointer", fontFamily: "var(--font-family)", textAlign: "left",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <Award size={24} color="var(--color-secondary)" style={{ flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: "var(--color-text)", marginBottom: 2 }}>
            模擬試験モード
          </div>
          <div style={{ fontSize: 19, color: "var(--color-text-light)" }}>
            準1級・1級・練習 3モード／54問からランダム出題
          </div>
        </div>
        <ChevronRight size={16} color="var(--color-secondary)" style={{ flexShrink: 0 }} />
      </button>

      {/* 進捗表（チェックリスト） */}
      <div style={S.card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={S.cardTitle}>
            <Check size={16} color="var(--color-accent)" />
            セクション チェックリスト
          </div>
          <button
            onClick={() => setShowReset(true)}
            style={{
              display: "flex", alignItems: "center", gap: 4,
              padding: "4px 10px", borderRadius: 8,
              border: "1px solid var(--color-border)",
              background: "#fff", cursor: "pointer",
              fontFamily: "var(--font-family)",
              fontSize: 19, fontWeight: 600,
              color: "var(--color-text-light)",
            }}
          >
            <RefreshCw size={11} />
            リセット
          </button>
        </div>
        <ProgressTable
          appData={appData}
          onToggle={handleToggle}
          onNavigate={onNavigate}
        />
      </div>

      {/* リセット確認ダイアログ */}
      {showReset && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 200,
          background: "rgba(0,0,0,0.4)",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: 20,
        }}>
          <div style={{
            background: "#fff", borderRadius: 20,
            padding: "24px 20px", maxWidth: 320, width: "100%",
            boxShadow: "var(--shadow-lg)",
          }} className="scale-in">
            <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
              進捗をリセットしますか？
            </div>
            <div style={{ fontSize: 19, color: "var(--color-text-light)", marginBottom: 20, lineHeight: 1.7 }}>
              すべてのチェック・テスト履歴・復習ステータスが削除されます。この操作は元に戻せません。
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setShowReset(false)}
                style={{
                  flex: 1, padding: "10px", borderRadius: 10,
                  border: "1px solid var(--color-border)",
                  background: "#fff", cursor: "pointer",
                  fontFamily: "var(--font-family)",
                  fontSize: 20, fontWeight: 600,
                  color: "var(--color-text)",
                }}
              >
                キャンセル
              </button>
              <button
                onClick={handleReset}
                style={{
                  flex: 1, padding: "10px", borderRadius: 10,
                  border: "none",
                  background: "var(--color-warning)", color: "#fff",
                  cursor: "pointer",
                  fontFamily: "var(--font-family)",
                  fontSize: 20, fontWeight: 700,
                }}
              >
                リセット
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
