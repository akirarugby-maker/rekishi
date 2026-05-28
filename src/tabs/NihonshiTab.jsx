/*
  📍 フェーズ8: ②日本史タブ 前半
  - 横スクロール時代選択バー（全17時代）
  - 古代〜中世の詳細表示（旧石器〜室町）
  - 各時代: キーワード・年表・試験のコツ・人物・理解度テスト
  フェーズ9で近世〜現代・人物詳細を追加
*/

import { useState } from "react";
import { ChevronLeft, ChevronRight, Scroll, User } from "lucide-react";
import TabNav from "../components/TabNav.jsx";
import QuizComponent from "../components/QuizComponent.jsx";
import {
  SectionCard, KeywordList, EventTimeline, TipCard, FigureCard, EraCard
} from "../components/Cards.jsx";
import { nihonshiDataAll, nihonshiOrderAll } from "../data/nihonshiDataLate.js";
import { nihonshiFigures } from "../data/nihonshiDataLate.js";
import { nihonshiQuizEarly } from "../data/nihonshiData.js";
import { nihonshiQuizLate } from "../data/nihonshiDataLate.js";

// ============================================================
// 時代テーマカラー
// ============================================================

const ERA_COLORS = {
  kyusekki:       "#B0BEC5",
  jomon:          "#A5D6A7",
  yayoi:          "#80CBC4",
  kofun:          "#FFD54F",
  asuka:          "#FFAB91",
  nara:           "#CE93D8",
  heian:          "#90CAF9",
  kamakura:       "#A5D6A7",
  nanbokucho:     "#FFCC80",
  muromachi:      "#B39DDB",
  sengoku:        "#EF9A9A",
  azuchimomoyama: "#FFCC02",
  edo:            "#80DEEA",
  meiji:          "#F48FB1",
  taisho:         "#C8E6C9",
  showa:          "#FFD54F",
  gendai:         "#90CAF9",
};

// 時代グループ（スクロールバー用）
const ERA_GROUPS = [
  { label: "原始", ids: ["kyusekki", "jomon", "yayoi"] },
  { label: "古代", ids: ["kofun", "asuka", "nara", "heian"] },
  { label: "中世", ids: ["kamakura", "nanbokucho", "muromachi"] },
  { label: "近世", ids: ["sengoku", "azuchimomoyama", "edo"] },
  { label: "近代", ids: ["meiji", "taisho", "showa", "gendai"] },
];

// 時代別クイズデータ（eraのidをキーに）
const QUIZ_BY_ERA = {};
[...nihonshiQuizEarly, ...nihonshiQuizLate].forEach(q => {
  const key = q.era;
  if (!QUIZ_BY_ERA[key]) QUIZ_BY_ERA[key] = [];
  QUIZ_BY_ERA[key].push(q);
});

// ============================================================
// 横スクロール時代選択バー
// ============================================================

function EraSelector({ selectedId, onSelect }) {
  return (
    <div style={{ marginBottom: 14 }}>
      {ERA_GROUPS.map(group => (
        <div key={group.label} style={{ marginBottom: 6 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "var(--color-text-light)", marginBottom: 4 }}>
            {group.label}
          </div>
          <div style={{
            display: "flex", gap: 5,
            overflowX: "auto", scrollbarWidth: "none",
          }}>
            {group.ids.map(id => {
              const era = nihonshiDataAll[id];
              if (!era) return null;
              const active = selectedId === id;
              const color = ERA_COLORS[id] || "var(--color-primary)";
              return (
                <button
                  key={id}
                  onClick={() => onSelect(id)}
                  style={{
                    display: "flex", flexDirection: "column",
                    alignItems: "center",
                    padding: "7px 10px",
                    borderRadius: 10,
                    border: `2px solid ${active ? color : "transparent"}`,
                    background: active ? color + "30" : "#F8F9FD",
                    cursor: "pointer",
                    fontFamily: "var(--font-family)",
                    flexShrink: 0,
                    minWidth: 58,
                    transition: "all 0.15s",
                  }}
                >
                  <span style={{ fontSize: 12, fontWeight: active ? 700 : 500, color: active ? "var(--color-text)" : "var(--color-text-light)" }}>
                    {era.name.replace("時代", "")}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================================
// 時代詳細ページ
// ============================================================

function EraDetail({ eraId, appData, onUpdateData, onBack }) {
  const [showQuiz, setShowQuiz] = useState(false);
  const era = nihonshiDataAll[eraId];
  const color = ERA_COLORS[eraId] || "var(--color-primary)";
  const quizzes = QUIZ_BY_ERA[eraId] || [];
  const progress = appData.progress.nihonshi;
  const done = progress?.[eraId];

  // 人物フィルタ
  const relatedFigures = Object.entries(nihonshiFigures).filter(
    ([, fig]) => fig.era === eraId
  );

  const handleQuizComplete = ({ score, total, pct }) => {
    if (pct >= 60) {
      onUpdateData({
        progress: {
          ...appData.progress,
          nihonshi: { ...appData.progress.nihonshi, [eraId]: true },
        },
      });
    }
    const today = new Date().toISOString().slice(0, 10);
    onUpdateData({
      testHistory: [
        ...(appData.testHistory || []),
        { date: today, tab: "nihonshi", era: eraId, score, total, pct },
      ],
    });
    setShowQuiz(false);
  };

  if (showQuiz) {
    if (quizzes.length === 0) {
      return (
        <div>
          <button onClick={() => setShowQuiz(false)} style={{ background: "none", border: "none", cursor: "pointer", color, fontFamily: "var(--font-family)", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 5, marginBottom: 16 }}>
            <ChevronLeft size={16} />戻る
          </button>
          <div style={{ padding: "32px", textAlign: "center", color: "var(--color-text-light)" }}>
            この時代のテスト問題は準備中です
          </div>
        </div>
      );
    }
    return (
      <div className="fade-in">
        <button
          onClick={() => setShowQuiz(false)}
          style={{ background: "none", border: "none", cursor: "pointer", color, fontFamily: "var(--font-family)", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 5, marginBottom: 16, padding: 0 }}
        >
          <ChevronLeft size={16} />{era.name}に戻る
        </button>
        <QuizComponent
          quizzes={quizzes}
          sectionKey={eraId}
          onComplete={handleQuizComplete}
        />
      </div>
    );
  }

  return (
    <div className="fade-in">
      {/* 戻るボタン */}
      <button
        onClick={onBack}
        style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-light)", fontFamily: "var(--font-family)", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 5, marginBottom: 14, padding: 0 }}
      >
        <ChevronLeft size={16} />時代一覧に戻る
      </button>

      {/* 時代ヘッダー */}
      <div style={{
        background: `linear-gradient(135deg, ${color}30 0%, ${color}10 100%)`,
        borderRadius: 16, border: `1px solid ${color}50`,
        padding: "16px", marginBottom: 14,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>{era.name}</div>
            <div style={{ fontSize: 13, color: "var(--color-text-light)" }}>{era.period}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            {done && <div style={{ fontSize: 13, fontWeight: 700, color: "var(--color-accent)" }}>✓ 完了済み</div>}
            <div style={{ fontSize: 11, color: "var(--color-text-light)", marginTop: 4, fontStyle: "italic" }}>
              {era.culture}
            </div>
          </div>
        </div>
      </div>

      {/* キーワード */}
      <SectionCard title="重要キーワード" color={color} defaultOpen>
        <KeywordList keywords={era.keywords} color={color} />
      </SectionCard>

      {/* 年表 */}
      {era.events?.length > 0 && (
        <SectionCard title="主要年表" color={color}>
          <EventTimeline events={era.events} />
        </SectionCard>
      )}

      {/* 試験のコツ */}
      {era.examTips?.length > 0 && (
        <SectionCard title="試験に出るポイント" color={color}>
          <TipCard tips={era.examTips} color={color} />
        </SectionCard>
      )}

      {/* 関連人物 */}
      {relatedFigures.length > 0 && (
        <SectionCard title="関連人物" color={color}>
          {relatedFigures.map(([name, fig]) => (
            <FigureCard key={name} name={name} figure={fig} />
          ))}
        </SectionCard>
      )}

      {/* 理解度テスト */}
      <div style={{
        background: "#fff", borderRadius: 14,
        border: "1px solid var(--color-border)",
        padding: "16px", textAlign: "center", marginTop: 4,
      }}>
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>
          {era.name} 理解度テスト
        </div>
        <div style={{ fontSize: 12, color: "var(--color-text-light)", marginBottom: 12 }}>
          {quizzes.length > 0
            ? `${quizzes.length}問 / 60%以上で完了チェック`
            : "テスト問題を準備中です"
          }
        </div>
        <button
          onClick={() => setShowQuiz(true)}
          disabled={quizzes.length === 0}
          style={{
            width: "100%", padding: "12px",
            borderRadius: 12, border: "none",
            background: quizzes.length > 0 ? color : "var(--color-border)",
            color: "#fff",
            fontFamily: "var(--font-family)",
            fontSize: 14, fontWeight: 700,
            cursor: quizzes.length > 0 ? "pointer" : "default",
            opacity: quizzes.length > 0 ? 1 : 0.6,
          }}
        >
          {quizzes.length > 0 ? `テストを受ける（${quizzes.length}問）` : "準備中"}
        </button>
      </div>
    </div>
  );
}

// ============================================================
// 前後ナビゲーションボタン
// ============================================================

function EraPager({ currentId, onSelect }) {
  const idx = nihonshiOrderAll.indexOf(currentId);
  const prevId = idx > 0 ? nihonshiOrderAll[idx - 1] : null;
  const nextId = idx < nihonshiOrderAll.length - 1 ? nihonshiOrderAll[idx + 1] : null;

  if (!prevId && !nextId) return null;

  return (
    <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
      {prevId ? (
        <button
          onClick={() => onSelect(prevId)}
          style={{
            flex: 1, display: "flex", alignItems: "center", gap: 6,
            padding: "10px 12px", borderRadius: 10,
            border: "1px solid var(--color-border)",
            background: "#fff", cursor: "pointer",
            fontFamily: "var(--font-family)", fontSize: 12, fontWeight: 600,
            color: "var(--color-text)",
          }}
        >
          <ChevronLeft size={14} />
          <span>{nihonshiDataAll[prevId]?.name}</span>
        </button>
      ) : <div style={{ flex: 1 }} />}

      {nextId && (
        <button
          onClick={() => onSelect(nextId)}
          style={{
            flex: 1, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 6,
            padding: "10px 12px", borderRadius: 10,
            border: "1px solid var(--color-border)",
            background: "#fff", cursor: "pointer",
            fontFamily: "var(--font-family)", fontSize: 12, fontWeight: 600,
            color: "var(--color-text)",
          }}
        >
          <span>{nihonshiDataAll[nextId]?.name}</span>
          <ChevronRight size={14} />
        </button>
      )}
    </div>
  );
}

// ============================================================
// 進捗サマリー
// ============================================================

function ProgressSummary({ progress }) {
  const total = nihonshiOrderAll.length;
  const done = nihonshiOrderAll.filter(id => progress?.[id]).length;
  const pct = Math.round((done / total) * 100);

  return (
    <div style={{
      background: "#fff", borderRadius: 12,
      border: "1px solid var(--color-border)",
      padding: "10px 14px", marginBottom: 14,
      display: "flex", alignItems: "center", gap: 12,
    }}>
      <Scroll size={16} color="var(--color-accent)" />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 11, color: "var(--color-text-light)", marginBottom: 3 }}>
          日本史 進捗: {done}/{total} 時代
        </div>
        <div style={{ height: 6, borderRadius: 999, background: "var(--color-border)", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${pct}%`, background: "var(--color-accent)", borderRadius: 999, transition: "width 0.5s" }} />
        </div>
      </div>
      <span style={{
        fontSize: 12, fontWeight: 700,
        color: "var(--color-accent)",
      }}>
        {pct}%
      </span>
    </div>
  );
}

// ============================================================
// メインコンポーネント
// ============================================================

export default function NihonshiTab({ appData, onUpdateData, onNavigate }) {
  const [selectedEraId, setSelectedEraId] = useState(null);
  const progress = appData.progress.nihonshi || {};

  if (selectedEraId) {
    return (
      <div className="fade-in">
        <TabNav current="nihonshi" onNavigate={onNavigate} />
        <EraDetail
          eraId={selectedEraId}
          appData={appData}
          onUpdateData={onUpdateData}
          onBack={() => setSelectedEraId(null)}
        />
        <EraPager
          currentId={selectedEraId}
          onSelect={setSelectedEraId}
        />
      </div>
    );
  }

  return (
    <div className="fade-in">
      <TabNav current="nihonshi" onNavigate={onNavigate} />

      {/* ヘッダー */}
      <div style={{
        background: "linear-gradient(135deg, #E8F5E9 0%, #E3F2FD 100%)",
        borderRadius: 16, border: "1px solid var(--color-border)",
        padding: "14px 16px", marginBottom: 14,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <Scroll size={18} color="var(--color-accent)" />
          <span style={{ fontSize: 15, fontWeight: 700 }}>日本史タブ</span>
        </div>
        <div style={{ fontSize: 12, color: "var(--color-text-light)", lineHeight: 1.7 }}>
          旧石器時代から現代まで全17時代を収録。時代を選んでキーワード・年表・試験のコツを学びましょう。
        </div>
      </div>

      {/* 進捗 */}
      <ProgressSummary progress={progress} />

      {/* 時代選択バー */}
      <EraSelector selectedId={selectedEraId} onSelect={setSelectedEraId} />

      {/* カード一覧 */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {ERA_GROUPS.map(group => (
          <div key={group.label}>
            <div style={{
              fontSize: 11, fontWeight: 700, color: "var(--color-text-light)",
              letterSpacing: "0.05em", marginBottom: 6, marginTop: 4,
            }}>
              ── {group.label}
            </div>
            {group.ids.map(id => {
              const era = nihonshiDataAll[id];
              if (!era) return null;
              const color = ERA_COLORS[id];
              const done = progress[id];
              const quizCount = (QUIZ_BY_ERA[id] || []).length;
              return (
                <button
                  key={id}
                  onClick={() => setSelectedEraId(id)}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", gap: 12,
                    padding: "12px 14px", borderRadius: 12,
                    border: `1px solid ${done ? color + "60" : "var(--color-border)"}`,
                    background: done ? color + "10" : "#fff",
                    cursor: "pointer", fontFamily: "var(--font-family)",
                    textAlign: "left", marginBottom: 6,
                    boxShadow: "var(--shadow-sm)",
                    transition: "all 0.15s",
                  }}
                >
                  {/* カラードット */}
                  <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: color + "40",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                    border: `1px solid ${color}60`,
                  }}>
                    <Scroll size={16} color={color.replace("40", "").replace("30", "") || "#666"} />
                  </div>

                  {/* テキスト */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 2 }}>
                      {era.name}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--color-text-light)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {era.period}
                    </div>
                  </div>

                  {/* 難易度 */}
                  <div style={{ flexShrink: 0, textAlign: "right" }}>
                    <div style={{ fontSize: 10, color: "var(--color-text-light)" }}>
                      {"★".repeat(era.difficulty || 1)}
                    </div>
                    <div style={{ fontSize: 10, color: "var(--color-text-light)", marginTop: 2 }}>
                      {quizCount}問
                    </div>
                  </div>

                  {done
                    ? <span style={{ fontSize: 13, color: "var(--color-accent)", fontWeight: 700, flexShrink: 0 }}>✓</span>
                    : <ChevronRight size={14} color="var(--color-text-light)" style={{ flexShrink: 0 }} />
                  }
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
