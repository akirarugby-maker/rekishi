/*
  📍 フェーズ9: ②日本史タブ 後半
  - 人物図鑑ビュー（全19名・時代グループフィルタ付き）
  - 単語帳（フラッシュカード）学習モード
  - テスト履歴表示（時代詳細内）
  - モード切替ナビ（時代別 / 人物図鑑 / 単語帳）
*/

import { useState } from "react";
import {
  ChevronLeft, ChevronRight, Scroll, User, BookOpen,
  RotateCcw, CheckCircle, Clock,
} from "lucide-react";
import TabNav from "../components/TabNav.jsx";
import QuizComponent from "../components/QuizComponent.jsx";
import {
  SectionCard, KeywordList, EventTimeline, TipCard, FigureCard, YouTubeSearchButton,
} from "../components/Cards.jsx";
import { nihonshiDataAll, nihonshiOrderAll, nihonshiFigures } from "../data/nihonshiDataLate.js";
import { nihonshiQuizEarly } from "../data/nihonshiData.js";
import { nihonshiQuizLate } from "../data/nihonshiDataLate.js";
import { PowerFlowDiagram, EraDiagram, hasDiagram } from "../components/Diagrams.jsx";
import { EraPersonDiagram, hasPersonDiagram } from "../components/PersonDiagrams.jsx";

// ============================================================
// 定数
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

const ERA_GROUPS = [
  { label: "原始", ids: ["kyusekki", "jomon", "yayoi"] },
  { label: "古代", ids: ["kofun", "asuka", "nara", "heian"] },
  { label: "中世", ids: ["kamakura", "nanbokucho", "muromachi"] },
  { label: "近世", ids: ["sengoku", "azuchimomoyama", "edo"] },
  { label: "近代", ids: ["meiji", "taisho", "showa", "gendai"] },
];

// era id → group label
const ERA_TO_GROUP = {};
ERA_GROUPS.forEach(g => g.ids.forEach(id => { ERA_TO_GROUP[id] = g.label; }));

const QUIZ_BY_ERA = {};
[...nihonshiQuizEarly, ...nihonshiQuizLate].forEach(q => {
  if (!QUIZ_BY_ERA[q.era]) QUIZ_BY_ERA[q.era] = [];
  QUIZ_BY_ERA[q.era].push(q);
});

// ============================================================
// 共通: フィルターチップ
// ============================================================

function FilterChip({ label, active, onClick, color }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "5px 12px", borderRadius: 999, border: "1.5px solid",
        borderColor: active ? (color || "var(--color-accent)") : "var(--color-border)",
        background: active ? (color || "var(--color-accent)") + "20" : "#fff",
        color: active ? (color || "var(--color-accent)") : "var(--color-text-light)",
        fontFamily: "var(--font-family)", fontSize: 12, fontWeight: active ? 700 : 500,
        cursor: "pointer", flexShrink: 0, transition: "all 0.15s",
      }}
    >
      {label}
    </button>
  );
}

// ============================================================
// 内部モード切替バー
// ============================================================

function ViewModeTabs({ mode, onChange }) {
  const tabs = [
    { id: "list",      label: "時代別",   icon: Scroll },
    { id: "figures",   label: "人物図鑑", icon: User },
    { id: "flashcard", label: "単語帳",   icon: BookOpen },
  ];
  return (
    <div style={{
      display: "flex", gap: 6, marginBottom: 14,
      background: "#F0F4FA", borderRadius: 12, padding: 4,
    }}>
      {tabs.map(({ id, label, icon: Icon }) => {
        const active = mode === id;
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
              padding: "8px 0", borderRadius: 9, border: "none",
              background: active ? "#fff" : "transparent",
              color: active ? "var(--color-accent)" : "var(--color-text-light)",
              fontFamily: "var(--font-family)", fontSize: 12, fontWeight: active ? 700 : 500,
              cursor: "pointer",
              boxShadow: active ? "0 1px 6px rgba(0,0,0,0.10)" : "none",
              transition: "all 0.15s",
            }}
          >
            <Icon size={13} />{label}
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
      <span style={{ fontSize: 12, fontWeight: 700, color: "var(--color-accent)" }}>{pct}%</span>
    </div>
  );
}

// ============================================================
// 時代選択バー
// ============================================================

function EraSelector({ selectedId, onSelect }) {
  return (
    <div style={{ marginBottom: 14 }}>
      {ERA_GROUPS.map(group => (
        <div key={group.label} style={{ marginBottom: 6 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "var(--color-text-light)", marginBottom: 4 }}>
            {group.label}
          </div>
          <div style={{ display: "flex", gap: 5, overflowX: "auto", scrollbarWidth: "none" }}>
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
                    display: "flex", flexDirection: "column", alignItems: "center",
                    padding: "7px 10px", borderRadius: 10,
                    border: `2px solid ${active ? color : "transparent"}`,
                    background: active ? color + "30" : "#F8F9FD",
                    cursor: "pointer", fontFamily: "var(--font-family)",
                    flexShrink: 0, minWidth: 58, transition: "all 0.15s",
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
// 時代一覧ビュー
// ============================================================

function EraListView({ progress, onSelect }) {
  return (
    <>
      <ProgressSummary progress={progress} />
      <PowerFlowDiagram />
      <EraSelector selectedId={null} onSelect={onSelect} />
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
                  onClick={() => onSelect(id)}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", gap: 12,
                    padding: "12px 14px", borderRadius: 12,
                    border: `1px solid ${done ? color + "60" : "var(--color-border)"}`,
                    background: done ? color + "10" : "#fff",
                    cursor: "pointer", fontFamily: "var(--font-family)",
                    textAlign: "left", marginBottom: 6,
                    boxShadow: "var(--shadow-sm)", transition: "all 0.15s",
                  }}
                >
                  <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: color + "40",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, border: `1px solid ${color}60`,
                  }}>
                    <Scroll size={16} color={color || "#666"} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 2 }}>{era.name}</div>
                    <div style={{ fontSize: 11, color: "var(--color-text-light)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {era.period}
                    </div>
                  </div>
                  <div style={{ flexShrink: 0, textAlign: "right" }}>
                    <div style={{ fontSize: 10, color: "var(--color-text-light)" }}>{"★".repeat(era.difficulty || 1)}</div>
                    <div style={{ fontSize: 10, color: "var(--color-text-light)", marginTop: 2 }}>{quizCount}問</div>
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
    </>
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
  const done = appData.progress.nihonshi?.[eraId];

  // 関連人物
  const relatedFigures = Object.entries(nihonshiFigures).filter(([, f]) => f.era === eraId);

  // この時代のテスト履歴
  const eraHistory = (appData.testHistory || []).filter(h => h.tab === "nihonshi" && h.era === eraId);

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
          <div style={{ padding: "32px", textAlign: "center", color: "var(--color-text-light)" }}>この時代のテスト問題は準備中です</div>
        </div>
      );
    }
    return (
      <div className="fade-in">
        <button onClick={() => setShowQuiz(false)} style={{ background: "none", border: "none", cursor: "pointer", color, fontFamily: "var(--font-family)", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 5, marginBottom: 16, padding: 0 }}>
          <ChevronLeft size={16} />{era.name}に戻る
        </button>
        <QuizComponent quizzes={quizzes} sectionKey={eraId} onComplete={handleQuizComplete} />
      </div>
    );
  }

  return (
    <div className="fade-in">
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

      {/* 構造・組織図 */}
      {hasDiagram(eraId) && (
        <SectionCard title="📊 構造・組織図" color={color} defaultOpen>
          <EraDiagram eraId={eraId} color={color} />
        </SectionCard>
      )}

      {/* 人物関係図 */}
      {hasPersonDiagram(eraId) && (
        <SectionCard title="👥 人物関係図" color={color} defaultOpen>
          <EraPersonDiagram eraId={eraId} color={color} />
        </SectionCard>
      )}

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

      {/* テスト履歴 */}
      {eraHistory.length > 0 && (
        <SectionCard title="テスト履歴" color={color} defaultOpen={false}>
          {eraHistory.slice(-5).reverse().map((h, i) => {
            const grade = h.pct >= 80 ? "優秀" : h.pct >= 60 ? "合格" : "要復習";
            const gradeColor = h.pct >= 80 ? "var(--color-accent)" : h.pct >= 60 ? "var(--color-secondary)" : "var(--color-warning)";
            return (
              <div key={i} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "8px 0",
                borderBottom: i < Math.min(eraHistory.length, 5) - 1 ? "1px solid var(--color-border)" : "none",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Clock size={12} color="var(--color-text-light)" />
                  <span style={{ fontSize: 12, color: "var(--color-text-light)" }}>{h.date}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{h.score}/{h.total}</span>
                  <span style={{
                    fontSize: 11, fontWeight: 700,
                    color: gradeColor,
                    background: gradeColor + "20",
                    padding: "2px 8px", borderRadius: 999,
                  }}>{grade}</span>
                </div>
              </div>
            );
          })}
        </SectionCard>
      )}

      {/* YouTube検索ボタン */}
      {era.keywords?.length > 0 && (
        <YouTubeSearchButton query={era.name} />
      )}

      {/* 理解度テスト */}
      <div style={{
        background: "#fff", borderRadius: 14,
        border: "1px solid var(--color-border)",
        padding: "16px", textAlign: "center", marginTop: 8,
      }}>
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>{era.name} 理解度テスト</div>
        <div style={{ fontSize: 12, color: "var(--color-text-light)", marginBottom: 12 }}>
          {quizzes.length > 0 ? `${quizzes.length}問 / 60%以上で完了チェック` : "テスト問題を準備中です"}
        </div>
        <button
          onClick={() => setShowQuiz(true)}
          disabled={quizzes.length === 0}
          style={{
            width: "100%", padding: "12px",
            borderRadius: 12, border: "none",
            background: quizzes.length > 0 ? color : "var(--color-border)",
            color: "#fff",
            fontFamily: "var(--font-family)", fontSize: 14, fontWeight: 700,
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
// 前後ナビゲーション
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
          style={{ flex: 1, display: "flex", alignItems: "center", gap: 6, padding: "10px 12px", borderRadius: 10, border: "1px solid var(--color-border)", background: "#fff", cursor: "pointer", fontFamily: "var(--font-family)", fontSize: 12, fontWeight: 600, color: "var(--color-text)" }}
        >
          <ChevronLeft size={14} />
          <span>{nihonshiDataAll[prevId]?.name}</span>
        </button>
      ) : <div style={{ flex: 1 }} />}
      {nextId && (
        <button
          onClick={() => onSelect(nextId)}
          style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 6, padding: "10px 12px", borderRadius: 10, border: "1px solid var(--color-border)", background: "#fff", cursor: "pointer", fontFamily: "var(--font-family)", fontSize: 12, fontWeight: 600, color: "var(--color-text)" }}
        >
          <span>{nihonshiDataAll[nextId]?.name}</span>
          <ChevronRight size={14} />
        </button>
      )}
    </div>
  );
}

// ============================================================
// 人物図鑑ビュー
// ============================================================

function FigureGallery() {
  const [filterGroup, setFilterGroup] = useState(null);
  const figures = Object.entries(nihonshiFigures);
  const filtered = filterGroup
    ? figures.filter(([, f]) => ERA_TO_GROUP[f.era] === filterGroup)
    : figures;

  return (
    <div className="fade-in">
      {/* フィルターチップ */}
      <div style={{ display: "flex", gap: 6, overflowX: "auto", scrollbarWidth: "none", marginBottom: 14 }}>
        <FilterChip label="すべて" active={!filterGroup} onClick={() => setFilterGroup(null)} />
        {ERA_GROUPS.map(g => (
          <FilterChip key={g.label} label={g.label} active={filterGroup === g.label} onClick={() => setFilterGroup(g.label)} />
        ))}
      </div>

      {/* 人数バッジ */}
      <div style={{ fontSize: 12, color: "var(--color-text-light)", marginBottom: 10 }}>
        {filtered.length}名
      </div>

      {/* 人物カード一覧 */}
      {filtered.length === 0 ? (
        <div style={{ padding: "32px", textAlign: "center", color: "var(--color-text-light)" }}>
          対象の人物がいません
        </div>
      ) : (
        filtered.map(([name, fig]) => {
          const eraName = nihonshiDataAll[fig.era]?.name || "";
          const color = ERA_COLORS[fig.era] || "var(--color-primary)";
          return (
            <div key={name}>
              <div style={{
                fontSize: 10, fontWeight: 700, color, marginBottom: 4, marginTop: 4,
                display: "flex", alignItems: "center", gap: 4,
              }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: color }} />
                {eraName}
              </div>
              <FigureCard name={name} figure={fig} />
            </div>
          );
        })
      )}
    </div>
  );
}

// ============================================================
// 単語帳（フラッシュカード）学習モード
// ============================================================

function FlashcardStudy() {
  const [studyEraId, setStudyEraId] = useState(null);
  const [cardIndex, setCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [direction, setDirection] = useState("event-to-year"); // "event-to-year" | "year-to-event"

  // 時代選択画面
  if (!studyEraId) {
    return (
      <div className="fade-in">
        <div style={{
          background: "linear-gradient(135deg, #E8F5E9, #E3F2FD)",
          borderRadius: 14, padding: "14px 16px", marginBottom: 14,
        }}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>
            <BookOpen size={15} style={{ verticalAlign: "middle", marginRight: 6 }} />
            単語帳で学習
          </div>
          <div style={{ fontSize: 12, color: "var(--color-text-light)", lineHeight: 1.7 }}>
            年表の出来事をフラッシュカードで暗記できます。<br />
            学習したい時代を選んでください。
          </div>
        </div>

        {ERA_GROUPS.map(group => (
          <div key={group.label} style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--color-text-light)", marginBottom: 6 }}>
              ── {group.label}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {group.ids.map(id => {
                const era = nihonshiDataAll[id];
                if (!era) return null;
                const events = era.events || [];
                const color = ERA_COLORS[id];
                return (
                  <button
                    key={id}
                    onClick={() => events.length > 0 ? (setStudyEraId(id), setCardIndex(0), setFlipped(false)) : null}
                    disabled={events.length === 0}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "11px 14px", borderRadius: 10,
                      border: `1px solid ${events.length > 0 ? color + "60" : "var(--color-border)"}`,
                      background: events.length > 0 ? color + "10" : "#F8F9FD",
                      cursor: events.length > 0 ? "pointer" : "default",
                      fontFamily: "var(--font-family)", opacity: events.length > 0 ? 1 : 0.5,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: color, flexShrink: 0 }} />
                      <span style={{ fontSize: 13, fontWeight: 600, color: "var(--color-text)" }}>{era.name}</span>
                    </div>
                    <span style={{ fontSize: 11, color: "var(--color-text-light)" }}>
                      {events.length > 0 ? `${events.length}枚` : "データなし"}
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

  const era = nihonshiDataAll[studyEraId];
  const color = ERA_COLORS[studyEraId] || "var(--color-primary)";
  const events = era?.events || [];

  // 完了画面
  if (cardIndex >= events.length) {
    return (
      <div className="fade-in" style={{ textAlign: "center", paddingTop: 20 }}>
        <div style={{
          background: `linear-gradient(135deg, ${color}30, ${color}10)`,
          borderRadius: 20, padding: "32px 24px", marginBottom: 20,
        }}>
          <CheckCircle size={48} color="var(--color-accent)" style={{ marginBottom: 14 }} />
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>完了！</div>
          <div style={{ fontSize: 14, color: "var(--color-text-light)", marginBottom: 4 }}>
            {era.name}の年表 {events.length}枚を学習しました
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <button
            onClick={() => { setCardIndex(0); setFlipped(false); }}
            style={{ padding: "13px", borderRadius: 12, border: "none", background: color, color: "#fff", fontFamily: "var(--font-family)", fontSize: 14, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
          >
            <RotateCcw size={16} />もう一度
          </button>
          <button
            onClick={() => setStudyEraId(null)}
            style={{ padding: "13px", borderRadius: 12, border: "1px solid var(--color-border)", background: "#fff", fontFamily: "var(--font-family)", fontSize: 13, fontWeight: 600, cursor: "pointer", color: "var(--color-text-light)" }}
          >
            時代選択に戻る
          </button>
        </div>
      </div>
    );
  }

  const card = events[cardIndex];
  const front = direction === "event-to-year" ? card.event : `${card.year}年`;
  const back  = direction === "event-to-year" ? `${card.year}年` : card.event;
  const frontLabel = direction === "event-to-year" ? "出来事" : "年号";
  const backLabel  = direction === "event-to-year" ? "年号" : "出来事";

  return (
    <div className="fade-in">
      {/* ヘッダー */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <button
          onClick={() => setStudyEraId(null)}
          style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-family)", fontSize: 12, fontWeight: 600, color: "var(--color-text-light)", display: "flex", alignItems: "center", gap: 4, padding: 0 }}
        >
          <ChevronLeft size={14} />時代選択
        </button>
        <span style={{ fontSize: 13, fontWeight: 700, color }}>{era.name}</span>
        <span style={{ fontSize: 12, color: "var(--color-text-light)" }}>
          {cardIndex + 1} / {events.length}
        </span>
      </div>

      {/* 問題方向切替 */}
      <div style={{ display: "flex", gap: 6, marginBottom: 14, background: "#F0F4FA", borderRadius: 10, padding: 4 }}>
        {[
          { id: "event-to-year", label: "出来事→年号" },
          { id: "year-to-event", label: "年号→出来事" },
        ].map(opt => (
          <button
            key={opt.id}
            onClick={() => { setDirection(opt.id); setFlipped(false); }}
            style={{
              flex: 1, padding: "7px", borderRadius: 7, border: "none",
              background: direction === opt.id ? "#fff" : "transparent",
              color: direction === opt.id ? color : "var(--color-text-light)",
              fontFamily: "var(--font-family)", fontSize: 11, fontWeight: direction === opt.id ? 700 : 500,
              cursor: "pointer",
              boxShadow: direction === opt.id ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* プログレスバー */}
      <div style={{ height: 5, borderRadius: 999, background: "var(--color-border)", overflow: "hidden", marginBottom: 20 }}>
        <div style={{ height: "100%", width: `${((cardIndex + 1) / events.length) * 100}%`, background: color, borderRadius: 999, transition: "width 0.3s" }} />
      </div>

      {/* フラッシュカード */}
      <div
        onClick={() => setFlipped(f => !f)}
        style={{
          background: flipped
            ? `linear-gradient(135deg, ${color}30, ${color}10)`
            : "#fff",
          borderRadius: 20,
          border: `2px solid ${flipped ? color + "60" : "var(--color-border)"}`,
          padding: "40px 24px",
          textAlign: "center",
          cursor: "pointer",
          minHeight: 180,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          marginBottom: 20,
          transition: "background 0.25s, border-color 0.25s",
          boxShadow: "var(--shadow-md)",
        }}
      >
        <div style={{ fontSize: 10, fontWeight: 700, color: flipped ? color : "var(--color-text-light)", marginBottom: 12, letterSpacing: "0.08em" }}>
          {flipped ? backLabel : frontLabel}
        </div>
        <div style={{ fontSize: flipped ? 22 : 15, fontWeight: 700, lineHeight: 1.6, color: "var(--color-text)" }}>
          {flipped ? back : front}
        </div>
        {!flipped && (
          <div style={{ fontSize: 11, color: "var(--color-text-light)", marginTop: 16 }}>
            タップして答えを確認
          </div>
        )}
        {flipped && card.importance === "高" && (
          <div style={{ marginTop: 12, fontSize: 11, fontWeight: 700, color: "var(--color-warning)", background: "var(--color-warning)20", padding: "3px 10px", borderRadius: 999 }}>
            ★ 重要度：高
          </div>
        )}
      </div>

      {/* ナビゲーションボタン */}
      <div style={{ display: "flex", gap: 10 }}>
        <button
          onClick={() => { setCardIndex(i => Math.max(0, i - 1)); setFlipped(false); }}
          disabled={cardIndex === 0}
          style={{
            flex: 1, padding: "13px", borderRadius: 12,
            border: "1px solid var(--color-border)", background: "#fff",
            fontFamily: "var(--font-family)", fontSize: 13, fontWeight: 600,
            cursor: cardIndex === 0 ? "default" : "pointer",
            color: "var(--color-text-light)", opacity: cardIndex === 0 ? 0.4 : 1,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          }}
        >
          <ChevronLeft size={15} />前へ
        </button>
        <button
          onClick={() => { setCardIndex(i => i + 1); setFlipped(false); }}
          style={{
            flex: 2, padding: "13px", borderRadius: 12,
            border: "none", background: color,
            fontFamily: "var(--font-family)", fontSize: 13, fontWeight: 700,
            cursor: "pointer", color: "#fff",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          }}
        >
          {cardIndex < events.length - 1 ? "次へ" : "完了"}
          {cardIndex < events.length - 1 && <ChevronRight size={15} />}
        </button>
      </div>
    </div>
  );
}

// ============================================================
// メインコンポーネント
// ============================================================

export default function NihonshiTab({ appData, onUpdateData, onNavigate }) {
  const [viewMode, setViewMode] = useState("list");
  const [selectedEraId, setSelectedEraId] = useState(null);
  const progress = appData.progress.nihonshi || {};

  // 時代詳細ページ（list モード専用）
  if (viewMode === "list" && selectedEraId) {
    return (
      <div className="fade-in">
        <TabNav current="nihonshi" onNavigate={onNavigate} />
        <EraDetail
          eraId={selectedEraId}
          appData={appData}
          onUpdateData={onUpdateData}
          onBack={() => setSelectedEraId(null)}
        />
        <EraPager currentId={selectedEraId} onSelect={setSelectedEraId} />
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
          旧石器〜現代まで全17時代を収録。時代別・人物図鑑・単語帳の3モードで学べます。
        </div>
      </div>

      {/* モード切替 */}
      <ViewModeTabs mode={viewMode} onChange={m => { setViewMode(m); setSelectedEraId(null); }} />

      {/* コンテンツ */}
      {viewMode === "list"      && <EraListView progress={progress} onSelect={setSelectedEraId} />}
      {viewMode === "figures"   && <FigureGallery />}
      {viewMode === "flashcard" && <FlashcardStudy />}
    </div>
  );
}
