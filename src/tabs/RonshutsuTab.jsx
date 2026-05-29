/*
  📍 フェーズ12: ⑤論述対策タブ
  - 論述の書き方ガイド（構成・キーワード活用・採点基準）
  - 模範解答ライブラリ（7題・日本史4題・世界史3題）
  - 練習テーマ一覧（カテゴリ別キーワード付き）
  - 進捗管理（ガイド/模範解答/練習テーマ）
*/

import { useState } from "react";
import { Brain, BookOpen, ChevronLeft, ChevronRight, Star, CheckCircle } from "lucide-react";
import TabNav from "../components/TabNav.jsx";
import { SectionCard, TipCard } from "../components/Cards.jsx";
import { ronshutsuGuide, ronshutsuExamples, ronshutsuThemes } from "../data/ronshutsuData.js";

// ============================================================
// ビューモード切替バー
// ============================================================

function ViewModeTabs({ mode, onChange }) {
  const tabs = [
    { id: "guide",    label: "書き方ガイド" },
    { id: "models",   label: "模範解答" },
    { id: "practice", label: "練習テーマ" },
  ];
  return (
    <div style={{ display: "flex", gap: 4, marginBottom: 14, background: "#F0F4FA", borderRadius: 12, padding: 4 }}>
      {tabs.map(({ id, label }) => {
        const active = mode === id;
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            style={{
              flex: 1, padding: "8px 4px", borderRadius: 9, border: "none",
              background: active ? "#fff" : "transparent",
              color: active ? "#A0C4FF" : "var(--color-text-light)",
              fontFamily: "var(--font-family)", fontSize: 19, fontWeight: active ? 700 : 500,
              cursor: "pointer",
              boxShadow: active ? "0 1px 6px rgba(0,0,0,0.10)" : "none",
              transition: "all 0.15s",
            }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

// ============================================================
// 進捗サマリー
// ============================================================

function ProgressSummary({ progress }) {
  const items = [
    { key: "method",   label: "ガイド" },
    { key: "model",    label: "模範解答" },
    { key: "practice", label: "練習テーマ" },
  ];
  const done = items.filter(i => progress?.[i.key]).length;
  const pct = Math.round((done / items.length) * 100);
  return (
    <div style={{
      background: "#fff", borderRadius: 12,
      border: "1px solid var(--color-border)",
      padding: "10px 14px", marginBottom: 14,
      display: "flex", alignItems: "center", gap: 12,
    }}>
      <Brain size={16} color="#A0C4FF" />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 19, color: "var(--color-text-light)", marginBottom: 3 }}>
          論述対策 進捗: {done}/{items.length} セクション
        </div>
        <div style={{ height: 6, borderRadius: 999, background: "var(--color-border)", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${pct}%`, background: "#A0C4FF", borderRadius: 999, transition: "width 0.5s" }} />
        </div>
      </div>
      <span style={{ fontSize: 20, fontWeight: 700, color: "#A0C4FF" }}>{pct}%</span>
    </div>
  );
}

// ============================================================
// ガイドビュー
// ============================================================

function GuideView({ progress, onUpdateData, appData }) {
  const markDone = () => {
    if (progress?.method) return;
    onUpdateData({
      progress: { ...appData.progress, ronshutsu: { ...appData.progress.ronshutsu, method: true } },
    });
  };

  return (
    <div className="fade-in">
      {/* 論述の基本構成 */}
      <SectionCard title={ronshutsuGuide.structure.title} color="#A0C4FF" defaultOpen>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {ronshutsuGuide.structure.items.map(({ part, chars, points }) => (
            <div key={part} style={{
              borderRadius: 10, border: "1px solid #A0C4FF40",
              background: "#A0C4FF08", padding: "12px 14px",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ fontSize: 19, fontWeight: 700, color: "#A0C4FF" }}>{part}</span>
                <span style={{
                  fontSize: 20, fontWeight: 600,
                  background: "#A0C4FF25", color: "#A0C4FF",
                  padding: "2px 8px", borderRadius: 999,
                }}>{chars}</span>
              </div>
              {points.map((pt, i) => (
                <div key={i} style={{ display: "flex", gap: 6, fontSize: 20, color: "var(--color-text)", marginBottom: 3, alignItems: "flex-start" }}>
                  <span style={{ color: "#A0C4FF", marginTop: 1 }}>•</span>
                  <span>{pt}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </SectionCard>

      {/* キーワード活用のコツ */}
      <SectionCard title={ronshutsuGuide.keywords.title} color="#A0C4FF">
        <TipCard tips={ronshutsuGuide.keywords.tips} color="#A0C4FF" />
      </SectionCard>

      {/* 採点基準 */}
      <SectionCard title={ronshutsuGuide.scoring.title} color="#A0C4FF">
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 20 }}>
          <thead>
            <tr style={{ borderBottom: "2px solid var(--color-border)" }}>
              <td style={{ padding: "6px 8px 6px 0", fontWeight: 700, color: "var(--color-text-light)", width: "28%" }}>項目</td>
              <td style={{ padding: "6px 4px", fontWeight: 700, color: "var(--color-text-light)", width: "16%", textAlign: "center" }}>比重</td>
              <td style={{ padding: "6px 0 6px 4px", fontWeight: 700, color: "var(--color-text-light)" }}>内容</td>
            </tr>
          </thead>
          <tbody>
            {ronshutsuGuide.scoring.criteria.map(({ item, weight, note }, i) => (
              <tr key={i} style={{ borderBottom: i < ronshutsuGuide.scoring.criteria.length - 1 ? "1px solid var(--color-border)" : "none" }}>
                <td style={{ padding: "8px 8px 8px 0", fontWeight: 600, color: "var(--color-text)" }}>{item}</td>
                <td style={{ padding: "8px 4px", textAlign: "center" }}>
                  <span style={{ fontSize: 19, fontWeight: 700, color: "#A0C4FF", background: "#A0C4FF20", padding: "2px 6px", borderRadius: 999 }}>
                    {weight}
                  </span>
                </td>
                <td style={{ padding: "8px 0 8px 4px", color: "var(--color-text-light)", lineHeight: 1.5 }}>{note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionCard>

      {/* 完了ボタン */}
      <button
        onClick={markDone}
        style={{
          width: "100%", padding: "13px",
          borderRadius: 12, border: `2px solid ${progress?.method ? "var(--color-accent)" : "#A0C4FF"}`,
          background: progress?.method ? "var(--color-accent)15" : "#A0C4FF15",
          color: progress?.method ? "var(--color-accent)" : "#A0C4FF",
          fontFamily: "var(--font-family)", fontSize: 19, fontWeight: 700,
          cursor: progress?.method ? "default" : "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          marginTop: 4,
        }}
      >
        <CheckCircle size={16} />
        {progress?.method ? "ガイドを習得済み" : "ガイドを習得した"}
      </button>
    </div>
  );
}

// ============================================================
// 模範解答カード（一覧）
// ============================================================

function ModelCard({ example, onSelect }) {
  const diffColor = example.difficulty === "1級" ? "var(--color-warning)" : "var(--color-secondary)";
  const catColor = example.category.startsWith("日本史") ? "var(--color-accent)" : "var(--color-highlight)";
  return (
    <button
      onClick={() => onSelect(example)}
      style={{
        width: "100%", textAlign: "left",
        padding: "14px 14px", borderRadius: 12,
        border: "1px solid var(--color-border)",
        background: "#fff", cursor: "pointer",
        fontFamily: "var(--font-family)",
        marginBottom: 8, boxShadow: "var(--shadow-sm)",
        transition: "all 0.15s",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <div style={{ flex: 1, paddingRight: 8 }}>
          <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 4, color: "var(--color-text)" }}>
            {example.theme}
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <span style={{ fontSize: 20, fontWeight: 600, color: catColor, background: catColor + "20", padding: "2px 8px", borderRadius: 999 }}>
              {example.category}
            </span>
            <span style={{ fontSize: 20, fontWeight: 600, color: diffColor, background: diffColor + "20", padding: "2px 8px", borderRadius: 999 }}>
              {example.difficulty}
            </span>
            <span style={{ fontSize: 20, color: "var(--color-text-light)", background: "var(--color-card-bg)", padding: "2px 8px", borderRadius: 999, border: "1px solid var(--color-border)" }}>
              {example.wordCount}字
            </span>
          </div>
        </div>
        <ChevronRight size={16} color="var(--color-text-light)" style={{ flexShrink: 0, marginTop: 2 }} />
      </div>
      {/* キーワードプレビュー */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
        {example.keyPoints.slice(0, 4).map(kw => (
          <span key={kw} style={{ fontSize: 20, color: "#A0C4FF", background: "#A0C4FF15", padding: "2px 7px", borderRadius: 999 }}>
            {kw}
          </span>
        ))}
        {example.keyPoints.length > 4 && (
          <span style={{ fontSize: 20, color: "var(--color-text-light)" }}>+{example.keyPoints.length - 4}</span>
        )}
      </div>
    </button>
  );
}

// ============================================================
// 模範解答詳細ビュー
// ============================================================

function ModelDetail({ example, onBack, examples, onSelect }) {
  const idx = examples.findIndex(e => e.id === example.id);
  const prevEx = idx > 0 ? examples[idx - 1] : null;
  const nextEx = idx < examples.length - 1 ? examples[idx + 1] : null;

  return (
    <div className="fade-in">
      <button
        onClick={onBack}
        style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-family)", fontSize: 19, fontWeight: 600, color: "var(--color-text-light)", display: "flex", alignItems: "center", gap: 5, marginBottom: 14, padding: 0 }}
      >
        <ChevronLeft size={16} />模範解答一覧に戻る
      </button>

      {/* ヘッダー */}
      <div style={{
        background: "linear-gradient(135deg, #A0C4FF25, #A0C4FF08)",
        borderRadius: 16, border: "1px solid #A0C4FF40",
        padding: "16px", marginBottom: 14,
      }}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
          <span style={{ fontSize: 19, fontWeight: 700, color: "#A0C4FF", background: "#A0C4FF20", padding: "2px 8px", borderRadius: 999 }}>
            {example.category}
          </span>
          <span style={{ fontSize: 19, fontWeight: 700, color: "var(--color-warning)", background: "var(--color-warning)20", padding: "2px 8px", borderRadius: 999 }}>
            {example.difficulty}
          </span>
          <span style={{ fontSize: 19, color: "var(--color-text-light)", background: "var(--color-card-bg)", padding: "2px 8px", borderRadius: 999, border: "1px solid var(--color-border)" }}>
            {example.wordCount}字
          </span>
        </div>
        <div style={{ fontSize: 19, fontWeight: 700 }}>{example.theme}</div>
      </div>

      {/* 設問 */}
      <SectionCard title="設問" color="#A0C4FF" defaultOpen>
        <div style={{ fontSize: 19, lineHeight: 1.8, color: "var(--color-text)", fontWeight: 600 }}>
          {example.question}
        </div>
      </SectionCard>

      {/* 重要キーワード */}
      <SectionCard title="重要キーワード" color="#A0C4FF" defaultOpen>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {example.keyPoints.map(kw => (
            <span key={kw} style={{
              fontSize: 20, fontWeight: 600,
              color: "#A0C4FF", background: "#A0C4FF20",
              padding: "4px 12px", borderRadius: 999,
              border: "1px solid #A0C4FF40",
            }}>
              {kw}
            </span>
          ))}
        </div>
      </SectionCard>

      {/* 模範解答 */}
      <SectionCard title="模範解答" color="#A0C4FF" defaultOpen>
        <div style={{
          fontSize: 19, lineHeight: 2, color: "var(--color-text)",
          background: "#FAFBFF", borderRadius: 10,
          padding: "12px 14px",
          border: "1px solid var(--color-border)",
        }}>
          {example.modelAnswer}
        </div>
        <div style={{ marginTop: 8, fontSize: 19, color: "var(--color-text-light)", textAlign: "right" }}>
          {example.modelAnswer.length}字
        </div>
      </SectionCard>

      {/* 試験のポイント */}
      {example.examTips?.length > 0 && (
        <SectionCard title="採点ポイント" color="#A0C4FF">
          <TipCard tips={example.examTips} color="#A0C4FF" />
        </SectionCard>
      )}

      {/* 前後ナビ */}
      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        {prevEx ? (
          <button
            onClick={() => onSelect(prevEx)}
            style={{ flex: 1, display: "flex", alignItems: "center", gap: 6, padding: "10px 12px", borderRadius: 10, border: "1px solid var(--color-border)", background: "#fff", cursor: "pointer", fontFamily: "var(--font-family)", fontSize: 19, fontWeight: 600, color: "var(--color-text)" }}
          >
            <ChevronLeft size={14} />
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{prevEx.theme}</span>
          </button>
        ) : <div style={{ flex: 1 }} />}
        {nextEx && (
          <button
            onClick={() => onSelect(nextEx)}
            style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 6, padding: "10px 12px", borderRadius: 10, border: "1px solid var(--color-border)", background: "#fff", cursor: "pointer", fontFamily: "var(--font-family)", fontSize: 19, fontWeight: 600, color: "var(--color-text)" }}
          >
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{nextEx.theme}</span>
            <ChevronRight size={14} />
          </button>
        )}
      </div>
    </div>
  );
}

// ============================================================
// 模範解答一覧ビュー
// ============================================================

function ModelsView({ progress, onUpdateData, appData }) {
  const [selected, setSelected] = useState(null);

  const handleSelect = (ex) => {
    setSelected(ex);
    if (!progress?.model) {
      onUpdateData({
        progress: { ...appData.progress, ronshutsu: { ...appData.progress.ronshutsu, model: true } },
      });
    }
  };

  if (selected) {
    return (
      <ModelDetail
        example={selected}
        examples={ronshutsuExamples}
        onBack={() => setSelected(null)}
        onSelect={handleSelect}
      />
    );
  }

  const nihonshi = ronshutsuExamples.filter(e => e.category.startsWith("日本史"));
  const sekaishi = ronshutsuExamples.filter(e => e.category.startsWith("世界史"));

  return (
    <div className="fade-in">
      <div style={{ fontSize: 20, color: "var(--color-text-light)", marginBottom: 12, lineHeight: 1.7 }}>
        全{ronshutsuExamples.length}題の模範解答を収録しています。キーワードと構成を参考にしましょう。
      </div>

      <div style={{ fontSize: 19, fontWeight: 700, color: "var(--color-text-light)", marginBottom: 8, letterSpacing: "0.04em" }}>
        ── 日本史（{nihonshi.length}題）
      </div>
      {nihonshi.map(ex => <ModelCard key={ex.id} example={ex} onSelect={handleSelect} />)}

      <div style={{ fontSize: 19, fontWeight: 700, color: "var(--color-text-light)", marginBottom: 8, marginTop: 8, letterSpacing: "0.04em" }}>
        ── 世界史（{sekaishi.length}題）
      </div>
      {sekaishi.map(ex => <ModelCard key={ex.id} example={ex} onSelect={handleSelect} />)}
    </div>
  );
}

// ============================================================
// 練習テーマビュー
// ============================================================

const CATEGORY_LABELS = {
  nihonshi_kodai:  "日本史・古代",
  nihonshi_chusei: "日本史・中世",
  nihonshi_kinsei: "日本史・近世",
  nihonshi_kindai: "日本史・近代",
  sekaishi:        "世界史",
};

const CATEGORY_COLORS = {
  nihonshi_kodai:  "var(--color-secondary)",
  nihonshi_chusei: "var(--color-accent)",
  nihonshi_kinsei: "var(--color-highlight)",
  nihonshi_kindai: "var(--color-warning)",
  sekaishi:        "#90CAF9",
};

function PracticeView({ progress, onUpdateData, appData }) {
  const [practiced, setPracticed] = useState({});

  const togglePracticed = (themeId) => {
    const next = { ...practiced, [themeId]: !practiced[themeId] };
    setPracticed(next);
    const anyDone = Object.values(next).some(Boolean);
    if (anyDone && !progress?.practice) {
      onUpdateData({
        progress: { ...appData.progress, ronshutsu: { ...appData.progress.ronshutsu, practice: true } },
      });
    }
  };

  const totalThemes = Object.values(ronshutsuThemes).flat().length;
  const doneCount = Object.values(practiced).filter(Boolean).length;

  return (
    <div className="fade-in">
      <div style={{ fontSize: 20, color: "var(--color-text-light)", marginBottom: 12, lineHeight: 1.7 }}>
        各テーマでキーワードを使いながら論述を書く練習をしましょう。完了したらチェックを入れてください。
      </div>

      {/* 練習進捗 */}
      <div style={{ background: "#fff", borderRadius: 10, border: "1px solid var(--color-border)", padding: "10px 14px", marginBottom: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
          <span style={{ fontSize: 20, color: "var(--color-text-light)" }}>練習済みテーマ</span>
          <span style={{ fontSize: 20, fontWeight: 700, color: "#A0C4FF" }}>{doneCount}/{totalThemes}</span>
        </div>
        <div style={{ height: 5, borderRadius: 999, background: "var(--color-border)", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${(doneCount / totalThemes) * 100}%`, background: "#A0C4FF", borderRadius: 999, transition: "width 0.3s" }} />
        </div>
      </div>

      {/* カテゴリ別テーマ */}
      {Object.entries(ronshutsuThemes).map(([catKey, themes]) => {
        const color = CATEGORY_COLORS[catKey] || "var(--color-primary)";
        return (
          <div key={catKey} style={{ marginBottom: 14 }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "7px 12px", borderRadius: 8,
              background: color + "15", marginBottom: 8,
            }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: color }} />
              <span style={{ fontSize: 20, fontWeight: 700 }}>{CATEGORY_LABELS[catKey]}</span>
            </div>
            {themes.map(theme => (
              <div
                key={theme.id}
                style={{
                  padding: "12px 14px", borderRadius: 11,
                  border: `1px solid ${practiced[theme.id] ? color + "60" : "var(--color-border)"}`,
                  background: practiced[theme.id] ? color + "08" : "#fff",
                  marginBottom: 8,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <span style={{ fontSize: 19, fontWeight: 700, color: "var(--color-text)", flex: 1, paddingRight: 8 }}>
                    {theme.title}
                  </span>
                  <button
                    onClick={() => togglePracticed(theme.id)}
                    style={{
                      display: "flex", alignItems: "center", gap: 4,
                      padding: "4px 10px", borderRadius: 999,
                      border: `1.5px solid ${practiced[theme.id] ? "var(--color-accent)" : "var(--color-border)"}`,
                      background: practiced[theme.id] ? "var(--color-accent)15" : "#fff",
                      color: practiced[theme.id] ? "var(--color-accent)" : "var(--color-text-light)",
                      fontFamily: "var(--font-family)", fontSize: 19, fontWeight: 600,
                      cursor: "pointer", flexShrink: 0,
                    }}
                  >
                    <CheckCircle size={11} />
                    {practiced[theme.id] ? "練習済み" : "練習した"}
                  </button>
                </div>
                {/* キーワード */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                  {theme.keywords.map(kw => (
                    <span key={kw} style={{
                      fontSize: 19, fontWeight: 600,
                      color, background: color + "20",
                      padding: "2px 8px", borderRadius: 999,
                    }}>
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

// ============================================================
// メインコンポーネント
// ============================================================

export default function RonshutsuTab({ appData, onUpdateData, onNavigate }) {
  const [viewMode, setViewMode] = useState("guide");
  const progress = appData.progress.ronshutsu || {};

  return (
    <div className="fade-in">
      <TabNav current="ronshutsu" onNavigate={onNavigate} />

      {/* ヘッダー */}
      <div style={{
        background: "linear-gradient(135deg, #E8EAF6 0%, #E1F5FE 100%)",
        borderRadius: 16, border: "1px solid var(--color-border)",
        padding: "14px 16px", marginBottom: 14,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <Brain size={18} color="#A0C4FF" />
          <span style={{ fontSize: 19, fontWeight: 700 }}>論述対策タブ</span>
          <span style={{
            fontSize: 20, fontWeight: 700, color: "var(--color-warning)",
            background: "var(--color-warning)20", padding: "2px 8px", borderRadius: 999,
          }}>1級専用</span>
        </div>
        <div style={{ fontSize: 20, color: "var(--color-text-light)", lineHeight: 1.7 }}>
          論述の書き方・採点基準・模範解答（7題）・練習テーマで記述力を鍛えましょう。
        </div>
      </div>

      {/* 進捗 */}
      <ProgressSummary progress={progress} />

      {/* モード切替 */}
      <ViewModeTabs mode={viewMode} onChange={setViewMode} />

      {/* コンテンツ */}
      {viewMode === "guide"    && <GuideView progress={progress} onUpdateData={onUpdateData} appData={appData} />}
      {viewMode === "models"   && <ModelsView progress={progress} onUpdateData={onUpdateData} appData={appData} />}
      {viewMode === "practice" && <PracticeView progress={progress} onUpdateData={onUpdateData} appData={appData} />}
    </div>
  );
}
