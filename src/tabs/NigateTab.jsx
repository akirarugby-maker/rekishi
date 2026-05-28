/*
  📍 フェーズ13: ⑥苦手分析タブ
  - レーダーチャート（5タブ平均正解率）
  - 棒グラフ（タブ別セクション詳細）
  - 苦手ランキング（正解率60%未満）
  - 最近のテスト履歴
*/

import { useState, useMemo } from "react";
import { BarChart2, TrendingUp, AlertCircle, Clock, ChevronDown, ChevronUp } from "lucide-react";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Tooltip as ReTooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell,
} from "recharts";
import TabNav from "../components/TabNav.jsx";
import { nihonshiDataAll } from "../data/nihonshiDataLate.js";
import { sekaishiData } from "../data/sekaishiData.js";
import { temashiData } from "../data/temashiData.js";

// ============================================================
// ラベルマッピング
// ============================================================

const TAB_META = {
  kisochishiki: { label: "基礎知識", color: "var(--color-secondary)", shortLabel: "基礎" },
  nihonshi:     { label: "日本史",   color: "var(--color-accent)",    shortLabel: "日本史" },
  sekaishi:     { label: "世界史",   color: "var(--color-highlight)", shortLabel: "世界史" },
  temashi:      { label: "テーマ史", color: "var(--color-warning)",   shortLabel: "テーマ" },
  ronshutsu:    { label: "論述",     color: "#A0C4FF",                shortLabel: "論述" },
};

const KISO_SECTION_LABELS = {
  A: "試験の概要", B: "時代の流れ",
  C: "記述・用語", D: "論述・テーマ",
};

function getSectionLabel(tab, key) {
  if (tab === "nihonshi") return nihonshiDataAll[key]?.name || key;
  if (tab === "sekaishi") return sekaishiData[key]?.era || key;
  if (tab === "temashi")  return temashiData[key]?.label || key;
  if (tab === "kisochishiki") return KISO_SECTION_LABELS[key] || `セクション${key}`;
  return key;
}

// ============================================================
// データ集計ユーティリティ
// ============================================================

function aggregateHistory(history) {
  // tab → { total, scoreSum, count } の平均
  const byTab = {};
  // tab+key → { total, scoreSum, count }
  const bySection = {};

  history.forEach(h => {
    const tabKey = h.tab;
    const secKey = h.era ?? h.section ?? h.themeId ?? "unknown";

    if (!byTab[tabKey]) byTab[tabKey] = { sum: 0, count: 0 };
    byTab[tabKey].sum += h.pct;
    byTab[tabKey].count += 1;

    const fullKey = `${tabKey}::${secKey}`;
    if (!bySection[fullKey]) bySection[fullKey] = { tab: tabKey, key: secKey, sum: 0, count: 0, lastPct: 0 };
    bySection[fullKey].sum += h.pct;
    bySection[fullKey].count += 1;
    bySection[fullKey].lastPct = h.pct;
  });

  // 平均値を算出
  const tabAvg = {};
  Object.entries(byTab).forEach(([k, v]) => { tabAvg[k] = Math.round(v.sum / v.count); });

  const sectionAvg = Object.values(bySection).map(v => ({
    tab: v.tab, key: v.key,
    label: getSectionLabel(v.tab, v.key),
    tabLabel: TAB_META[v.tab]?.shortLabel || v.tab,
    color: TAB_META[v.tab]?.color || "var(--color-primary)",
    avg: Math.round(v.sum / v.count),
    count: v.count,
  }));

  return { tabAvg, sectionAvg };
}

// ============================================================
// サマリーカード
// ============================================================

function SummaryCards({ history }) {
  const total = history.length;
  const avgPct = total > 0 ? Math.round(history.reduce((s, h) => s + h.pct, 0) / total) : 0;
  const lastDate = total > 0 ? history[history.length - 1].date : "—";
  const weakCount = total > 0
    ? new Set(history.filter(h => h.pct < 60).map(h => `${h.tab}::${h.era ?? h.section ?? h.themeId}`)).size
    : 0;

  const cards = [
    { label: "総受験回数", value: `${total}回`, color: "var(--color-primary)" },
    { label: "平均正解率", value: total > 0 ? `${avgPct}%` : "—", color: avgPct >= 80 ? "var(--color-accent)" : avgPct >= 60 ? "var(--color-secondary)" : "var(--color-warning)" },
    { label: "要復習分野", value: `${weakCount}`, color: weakCount > 0 ? "var(--color-warning)" : "var(--color-accent)" },
    { label: "最終学習日", value: lastDate, color: "var(--color-text-light)" },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
      {cards.map(({ label, value, color }) => (
        <div key={label} style={{
          background: "#fff", borderRadius: 12,
          border: "1px solid var(--color-border)",
          padding: "12px 14px",
          boxShadow: "var(--shadow-sm)",
        }}>
          <div style={{ fontSize: 10, color: "var(--color-text-light)", marginBottom: 4 }}>{label}</div>
          <div style={{ fontSize: 18, fontWeight: 700, color }}>{value}</div>
        </div>
      ))}
    </div>
  );
}

// ============================================================
// レーダーチャート
// ============================================================

function RadarSection({ tabAvg }) {
  const data = Object.keys(TAB_META).map(k => ({
    subject: TAB_META[k].shortLabel,
    pct: tabAvg[k] ?? 0,
    fullMark: 100,
  }));
  const hasData = data.some(d => d.pct > 0);

  return (
    <div style={{
      background: "#fff", borderRadius: 14,
      border: "1px solid var(--color-border)",
      padding: "14px", marginBottom: 12,
      boxShadow: "var(--shadow-sm)",
    }}>
      <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
        <TrendingUp size={15} color="var(--color-primary)" />
        タブ別 平均正解率
      </div>
      {!hasData ? (
        <div style={{ textAlign: "center", padding: "24px", color: "var(--color-text-light)", fontSize: 12 }}>
          各タブのテストを受けるとレーダーチャートが表示されます
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={240}>
          <RadarChart data={data}>
            <PolarGrid stroke="var(--color-border)" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fontSize: 11, fontFamily: "var(--font-family)", fill: "var(--color-text)" }}
            />
            <PolarRadiusAxis
              domain={[0, 100]} tick={{ fontSize: 9, fill: "var(--color-text-light)" }}
              tickCount={4}
            />
            <Radar
              name="正解率" dataKey="pct"
              stroke="var(--color-primary)" fill="var(--color-primary)" fillOpacity={0.3}
            />
            <ReTooltip
              formatter={(v) => [`${v}%`, "平均正解率"]}
              contentStyle={{ fontFamily: "var(--font-family)", fontSize: 12, borderRadius: 8 }}
            />
          </RadarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

// ============================================================
// タブ別棒グラフ
// ============================================================

function BarSection({ sectionAvg }) {
  const [selectedTab, setSelectedTab] = useState("nihonshi");
  const tabsWithData = [...new Set(sectionAvg.map(s => s.tab))];
  const data = sectionAvg
    .filter(s => s.tab === selectedTab)
    .map(s => ({ name: s.label.length > 6 ? s.label.slice(0, 6) + "…" : s.label, pct: s.avg, color: s.color }));

  const selectedColor = TAB_META[selectedTab]?.color || "var(--color-primary)";

  if (tabsWithData.length === 0) return null;

  return (
    <div style={{
      background: "#fff", borderRadius: 14,
      border: "1px solid var(--color-border)",
      padding: "14px", marginBottom: 12,
      boxShadow: "var(--shadow-sm)",
    }}>
      <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
        <BarChart2 size={15} color="var(--color-secondary)" />
        セクション別 正解率
      </div>

      {/* タブ選択チップ */}
      <div style={{ display: "flex", gap: 5, overflowX: "auto", scrollbarWidth: "none", marginBottom: 12 }}>
        {Object.keys(TAB_META).filter(k => tabsWithData.includes(k)).map(k => (
          <button
            key={k}
            onClick={() => setSelectedTab(k)}
            style={{
              padding: "4px 10px", borderRadius: 999,
              border: `1.5px solid ${selectedTab === k ? TAB_META[k].color : "var(--color-border)"}`,
              background: selectedTab === k ? TAB_META[k].color + "20" : "#fff",
              color: selectedTab === k ? TAB_META[k].color : "var(--color-text-light)",
              fontFamily: "var(--font-family)", fontSize: 11, fontWeight: selectedTab === k ? 700 : 500,
              cursor: "pointer", flexShrink: 0, transition: "all 0.15s",
            }}
          >
            {TAB_META[k].shortLabel}
          </button>
        ))}
      </div>

      {/* 棒グラフ */}
      {data.length === 0 ? (
        <div style={{ textAlign: "center", padding: "20px", color: "var(--color-text-light)", fontSize: 12 }}>
          このタブのテスト履歴がありません
        </div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={Math.max(180, data.length * 36)}>
            <BarChart data={data} layout="vertical" margin={{ left: 4, right: 24, top: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: "var(--color-text-light)" }} tickFormatter={v => `${v}%`} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fontFamily: "var(--font-family)", fill: "var(--color-text)" }} width={70} />
              <ReTooltip
                formatter={(v) => [`${v}%`, "平均正解率"]}
                contentStyle={{ fontFamily: "var(--font-family)", fontSize: 12, borderRadius: 8 }}
              />
              <Bar dataKey="pct" radius={[0, 4, 4, 0]}>
                {data.map((entry, i) => (
                  <Cell key={i} fill={
                    entry.pct >= 80 ? "var(--color-accent)" :
                    entry.pct >= 60 ? selectedColor :
                    "var(--color-warning)"
                  } />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          {/* 凡例 */}
          <div style={{ display: "flex", gap: 12, marginTop: 8, justifyContent: "center" }}>
            {[
              { label: "得意（80%+）", color: "var(--color-accent)" },
              { label: "合格（60%+）", color: selectedColor },
              { label: "要復習（〜60%）", color: "var(--color-warning)" },
            ].map(({ label, color }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: "var(--color-text-light)" }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: color }} />
                {label}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ============================================================
// 苦手ランキング
// ============================================================

function WeakList({ sectionAvg }) {
  const [showAll, setShowAll] = useState(false);
  const weak = sectionAvg.filter(s => s.avg < 60).sort((a, b) => a.avg - b.avg);
  const shown = showAll ? weak : weak.slice(0, 5);

  if (weak.length === 0) {
    return (
      <div style={{
        background: "var(--color-accent)10", borderRadius: 12,
        border: "1px solid var(--color-accent)40",
        padding: "16px", textAlign: "center", marginBottom: 12,
      }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "var(--color-accent)", marginBottom: 4 }}>
          苦手分野なし！
        </div>
        <div style={{ fontSize: 12, color: "var(--color-text-light)" }}>
          受験済みのすべてのセクションで60%以上を達成しています
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: "#fff", borderRadius: 14,
      border: "1px solid var(--color-border)",
      padding: "14px", marginBottom: 12,
      boxShadow: "var(--shadow-sm)",
    }}>
      <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
        <AlertCircle size={15} color="var(--color-warning)" />
        要復習ランキング（正解率60%未満）
      </div>
      {shown.map((s, i) => (
        <div key={`${s.tab}::${s.key}`} style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "8px 0",
          borderBottom: i < shown.length - 1 ? "1px solid var(--color-border)" : "none",
        }}>
          <div style={{
            width: 22, height: 22, borderRadius: "50%",
            background: i === 0 ? "var(--color-warning)30" : "var(--color-border)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 11, fontWeight: 700, color: i === 0 ? "var(--color-warning)" : "var(--color-text-light)",
            flexShrink: 0,
          }}>
            {i + 1}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--color-text)", marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {s.label}
            </div>
            <div style={{ fontSize: 10, color: s.color }}>
              {s.tabLabel} ・ {s.count}回受験
            </div>
          </div>
          <div style={{ flexShrink: 0 }}>
            <span style={{
              fontSize: 14, fontWeight: 700,
              color: s.avg < 40 ? "var(--color-warning)" : "var(--color-secondary)",
            }}>
              {s.avg}%
            </span>
          </div>
          {/* ミニバー */}
          <div style={{ width: 40, height: 6, borderRadius: 999, background: "var(--color-border)", overflow: "hidden", flexShrink: 0 }}>
            <div style={{ height: "100%", width: `${s.avg}%`, background: s.avg < 40 ? "var(--color-warning)" : "var(--color-secondary)", borderRadius: 999 }} />
          </div>
        </div>
      ))}
      {weak.length > 5 && (
        <button
          onClick={() => setShowAll(f => !f)}
          style={{ width: "100%", padding: "8px", background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-family)", fontSize: 12, color: "var(--color-text-light)", display: "flex", alignItems: "center", justifyContent: "center", gap: 4, marginTop: 4 }}
        >
          {showAll ? <><ChevronUp size={14} />閉じる</> : <><ChevronDown size={14} />残り{weak.length - 5}件を表示</>}
        </button>
      )}
    </div>
  );
}

// ============================================================
// テスト履歴リスト
// ============================================================

function HistoryList({ history }) {
  const [showAll, setShowAll] = useState(false);
  const recent = [...history].reverse();
  const shown = showAll ? recent : recent.slice(0, 8);

  return (
    <div style={{
      background: "#fff", borderRadius: 14,
      border: "1px solid var(--color-border)",
      padding: "14px", marginBottom: 12,
      boxShadow: "var(--shadow-sm)",
    }}>
      <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
        <Clock size={15} color="var(--color-text-light)" />
        テスト履歴（全{history.length}件）
      </div>
      {shown.map((h, i) => {
        const secKey = h.era ?? h.section ?? h.themeId ?? "";
        const label = getSectionLabel(h.tab, secKey);
        const grade = h.pct >= 80 ? "優秀" : h.pct >= 60 ? "合格" : "要復習";
        const gradeColor = h.pct >= 80 ? "var(--color-accent)" : h.pct >= 60 ? "var(--color-secondary)" : "var(--color-warning)";
        const tabColor = TAB_META[h.tab]?.color || "var(--color-primary)";
        return (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "8px 0",
            borderBottom: i < shown.length - 1 ? "1px solid var(--color-border)" : "none",
          }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {label}
              </div>
              <div style={{ display: "flex", gap: 6, marginTop: 2 }}>
                <span style={{ fontSize: 10, color: tabColor, fontWeight: 600 }}>
                  {TAB_META[h.tab]?.shortLabel || h.tab}
                </span>
                <span style={{ fontSize: 10, color: "var(--color-text-light)" }}>{h.date}</span>
              </div>
            </div>
            <div style={{ flexShrink: 0, textAlign: "right" }}>
              <span style={{ fontSize: 13, fontWeight: 700 }}>{h.score}/{h.total}</span>
              <span style={{
                display: "block", fontSize: 10, fontWeight: 700,
                color: gradeColor,
              }}>{grade}</span>
            </div>
          </div>
        );
      })}
      {history.length > 8 && (
        <button
          onClick={() => setShowAll(f => !f)}
          style={{ width: "100%", padding: "8px", background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-family)", fontSize: 12, color: "var(--color-text-light)", display: "flex", alignItems: "center", justifyContent: "center", gap: 4, marginTop: 4 }}
        >
          {showAll ? <><ChevronUp size={14} />閉じる</> : <><ChevronDown size={14} />もっと見る</>}
        </button>
      )}
    </div>
  );
}

// ============================================================
// 空状態
// ============================================================

function EmptyState({ onNavigate }) {
  return (
    <div style={{
      background: "#fff", borderRadius: 16,
      border: "1px solid var(--color-border)",
      padding: "40px 24px", textAlign: "center",
    }}>
      <BarChart2 size={52} color="var(--color-border)" style={{ marginBottom: 16 }} />
      <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>テスト結果がまだありません</div>
      <div style={{ fontSize: 13, color: "var(--color-text-light)", lineHeight: 1.8, marginBottom: 20 }}>
        各タブで理解度テストを受けると<br />
        ここに苦手分析が表示されます。
      </div>
      <button
        onClick={() => onNavigate("nihonshi")}
        style={{
          padding: "12px 24px", borderRadius: 12,
          border: "none", background: "var(--color-accent)",
          color: "#fff", fontFamily: "var(--font-family)",
          fontSize: 13, fontWeight: 700, cursor: "pointer",
        }}
      >
        日本史タブでテストを受ける
      </button>
    </div>
  );
}

// ============================================================
// メインコンポーネント
// ============================================================

export default function NigateTab({ appData, onUpdateData, onNavigate }) {
  const history = appData.testHistory || [];

  // 分析済みフラグを保存
  const markAnalyzed = () => {
    if (appData.progress.nigatebunseki?.analyzed) return;
    onUpdateData({
      progress: {
        ...appData.progress,
        nigatebunseki: { analyzed: true },
      },
    });
  };

  const { tabAvg, sectionAvg } = useMemo(() => {
    markAnalyzed();
    return aggregateHistory(history);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history.length]);

  return (
    <div className="fade-in">
      <TabNav current="nigate" onNavigate={onNavigate} />

      {/* ヘッダー */}
      <div style={{
        background: "linear-gradient(135deg, #E8F5E9 0%, #F3E5F5 100%)",
        borderRadius: 16, border: "1px solid var(--color-border)",
        padding: "14px 16px", marginBottom: 14,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <BarChart2 size={18} color="#B5EAD7" />
          <span style={{ fontSize: 15, fontWeight: 700 }}>苦手分析タブ</span>
        </div>
        <div style={{ fontSize: 12, color: "var(--color-text-light)", lineHeight: 1.7 }}>
          テスト結果を自動集計し、苦手分野を可視化します。
        </div>
      </div>

      {history.length === 0 ? (
        <EmptyState onNavigate={onNavigate} />
      ) : (
        <>
          <SummaryCards history={history} />
          <RadarSection tabAvg={tabAvg} />
          <WeakList sectionAvg={sectionAvg} />
          <BarSection sectionAvg={sectionAvg} />
          <HistoryList history={history} />
        </>
      )}
    </div>
  );
}
