/*
  📍 フェーズ10: ③世界史タブ
  - 地域別グループ表示（東アジア / 中東 / ヨーロッパ / 産業革命〜現代）
  - 時代順フラット表示の切替
  - セクション詳細: トピック・年表・試験のコツ・理解度テスト
  - 進捗管理（8セクション）
*/

import { useState, useEffect } from "react";
import { Globe, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import TabNav from "../components/TabNav.jsx";
import QuizComponent from "../components/QuizComponent.jsx";
import {
  SectionCard, KeywordList, EventTimeline, TipCard, YouTubeSearchButton,
} from "../components/Cards.jsx";
import { sekaishiData } from "../data/sekaishiData.js";
import { WorldParallelDiagram, SekaishiSectionDiagram, hasSekaishiDiagram } from "../components/SekaishiDiagrams.jsx";

// ============================================================
// 定数
// ============================================================

const REGION_GROUPS = [
  {
    region: "東アジア",
    color: "#FF8FAB",
    ids: ["eastAsia_ancient", "eastAsia_medieval"],
  },
  {
    region: "中東・イスラム世界",
    color: "#FFD54F",
    ids: ["middleEast"],
  },
  {
    region: "ヨーロッパ",
    color: "#90CAF9",
    ids: ["europe_medieval", "europe_modern"],
  },
  {
    region: "産業革命〜現代",
    color: "#B39DDB",
    ids: ["industrial", "worldWar", "coldWar"],
  },
];

const SEKAISHI_ORDER = [
  "eastAsia_ancient", "eastAsia_medieval",
  "middleEast",
  "europe_medieval", "europe_modern", "industrial",
  "worldWar", "coldWar",
];

// section id → region color
const SECTION_COLOR = {};
REGION_GROUPS.forEach(g => g.ids.forEach(id => { SECTION_COLOR[id] = g.color; }));

const TOTAL = SEKAISHI_ORDER.length;

// ============================================================
// 進捗サマリー
// ============================================================

function ProgressSummary({ progress }) {
  const done = SEKAISHI_ORDER.filter(id => progress?.[id]).length;
  const pct = Math.round((done / TOTAL) * 100);
  return (
    <div style={{
      background: "#fff", borderRadius: 12,
      border: "1px solid var(--color-border)",
      padding: "10px 14px", marginBottom: 14,
      display: "flex", alignItems: "center", gap: 12,
    }}>
      <Globe size={16} color="var(--color-highlight)" />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 19, color: "var(--color-text-light)", marginBottom: 3 }}>
          世界史 進捗: {done}/{TOTAL} セクション
        </div>
        <div style={{ height: 6, borderRadius: 999, background: "var(--color-border)", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${pct}%`, background: "var(--color-highlight)", borderRadius: 999, transition: "width 0.5s" }} />
        </div>
      </div>
      <span style={{ fontSize: 20, fontWeight: 700, color: "var(--color-highlight)" }}>{pct}%</span>
    </div>
  );
}

// ============================================================
// セクションカードボタン
// ============================================================

function SectionButton({ sectionId, progress, onSelect }) {
  const sec = sekaishiData[sectionId];
  if (!sec) return null;
  const color = SECTION_COLOR[sectionId] || "var(--color-highlight)";
  const done = progress?.[sectionId];
  const quizCount = sec.quizzes?.length || 0;

  return (
    <button
      onClick={() => onSelect(sectionId)}
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
      {/* カラーアイコン */}
      <div style={{
        width: 36, height: 36, borderRadius: 10, flexShrink: 0,
        background: color + "30",
        border: `1px solid ${color}60`,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <Globe size={16} color={color} />
      </div>

      {/* テキスト */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 19, fontWeight: 700, marginBottom: 2, color: "var(--color-text)" }}>
          {sec.era}
        </div>
        <div style={{
          fontSize: 19, color: "var(--color-text-light)",
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        }}>
          {sec.topics.slice(0, 3).join("・")}
        </div>
      </div>

      {/* バッジ */}
      <div style={{ flexShrink: 0, textAlign: "right" }}>
        <div style={{ fontSize: 20, color: "var(--color-text-light)" }}>{quizCount}問</div>
        {done && <div style={{ fontSize: 19, color: "var(--color-accent)", fontWeight: 700, marginTop: 2 }}>✓</div>}
      </div>

      <ChevronRight size={14} color="var(--color-text-light)" style={{ flexShrink: 0 }} />
    </button>
  );
}

// ============================================================
// 地域別一覧ビュー
// ============================================================

function RegionListView({ progress, onSelect }) {
  return (
    <>
      <WorldParallelDiagram />
      {REGION_GROUPS.map(group => (
        <div key={group.region} style={{ marginBottom: 14 }}>
          {/* 地域ヘッダー */}
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "8px 12px", borderRadius: 8,
            background: group.color + "18",
            marginBottom: 8,
          }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: group.color, flexShrink: 0 }} />
            <span style={{ fontSize: 19, fontWeight: 700, color: "var(--color-text)" }}>{group.region}</span>
            <span style={{ fontSize: 19, color: "var(--color-text-light)", marginLeft: "auto" }}>
              {group.ids.filter(id => progress?.[id]).length}/{group.ids.length} 完了
            </span>
          </div>

          {/* セクション */}
          {group.ids.map(id => (
            <SectionButton key={id} sectionId={id} progress={progress} onSelect={onSelect} />
          ))}
        </div>
      ))}
    </>
  );
}

// ============================================================
// 時代順一覧ビュー
// ============================================================

function ChronologicalView({ progress, onSelect }) {
  return (
    <>
      {SEKAISHI_ORDER.map((id, idx) => {
        const sec = sekaishiData[id];
        const color = SECTION_COLOR[id];
        return (
          <div key={id} style={{ display: "flex", gap: 10, marginBottom: 10 }}>
            {/* タイムラインライン */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 14 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: color, border: "2px solid #fff", boxShadow: `0 0 0 2px ${color}`, flexShrink: 0 }} />
              {idx < SEKAISHI_ORDER.length - 1 && (
                <div style={{ width: 2, flex: 1, background: "var(--color-border)", marginTop: 4 }} />
              )}
            </div>
            {/* カード */}
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 20, color: "var(--color-text-light)", marginBottom: 4, fontWeight: 600 }}>
                {sec?.region}
              </div>
              <SectionButton sectionId={id} progress={progress} onSelect={onSelect} />
            </div>
          </div>
        );
      })}
    </>
  );
}

// ============================================================
// セクション詳細ページ
// ============================================================

function SectionDetail({ sectionId, appData, onUpdateData, onBack }) {
  const [showQuiz, setShowQuiz] = useState(false);
  const sec = sekaishiData[sectionId];
  const color = SECTION_COLOR[sectionId] || "var(--color-highlight)";
  const done = appData.progress.sekaishi?.[sectionId];
  const quizzes = sec?.quizzes || [];

  // この セクションのテスト履歴
  const history = (appData.testHistory || []).filter(
    h => h.tab === "sekaishi" && h.section === sectionId
  );

  const handleQuizComplete = ({ score, total, pct }) => {
    if (pct >= 60) {
      onUpdateData({
        progress: {
          ...appData.progress,
          sekaishi: { ...appData.progress.sekaishi, [sectionId]: true },
        },
      });
    }
    const today = new Date().toISOString().slice(0, 10);
    onUpdateData({
      testHistory: [
        ...(appData.testHistory || []),
        { date: today, tab: "sekaishi", section: sectionId, score, total, pct },
      ],
    });
    setShowQuiz(false);
  };

  if (showQuiz) {
    return (
      <div className="fade-in">
        <button
          onClick={() => setShowQuiz(false)}
          style={{ background: "none", border: "none", cursor: "pointer", color, fontFamily: "var(--font-family)", fontSize: 19, fontWeight: 600, display: "flex", alignItems: "center", gap: 5, marginBottom: 16, padding: 0 }}
        >
          <ChevronLeft size={16} />{sec.era}に戻る
        </button>
        <QuizComponent quizzes={quizzes} sectionKey={sectionId} onComplete={handleQuizComplete} />
      </div>
    );
  }

  return (
    <div className="fade-in">
      {/* 戻るボタン */}
      <button
        onClick={onBack}
        style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-light)", fontFamily: "var(--font-family)", fontSize: 19, fontWeight: 600, display: "flex", alignItems: "center", gap: 5, marginBottom: 14, padding: 0 }}
      >
        <ChevronLeft size={16} />セクション一覧に戻る
      </button>

      {/* ヘッダー */}
      <div style={{
        background: `linear-gradient(135deg, ${color}30 0%, ${color}10 100%)`,
        borderRadius: 16, border: `1px solid ${color}50`,
        padding: "16px", marginBottom: 14,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{
              fontSize: 19, fontWeight: 700, color,
              marginBottom: 4, letterSpacing: "0.06em",
            }}>
              {sec.region}
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.4 }}>{sec.era}</div>
          </div>
          {done && (
            <div style={{ fontSize: 19, fontWeight: 700, color: "var(--color-accent)", flexShrink: 0 }}>
              ✓ 完了済み
            </div>
          )}
        </div>
      </div>

      {/* 構造・交流図 */}
      {hasSekaishiDiagram(sectionId) && (
        <SectionCard title="📊 構造・交流図" color={color} defaultOpen>
          <SekaishiSectionDiagram sectionId={sectionId} color={color} />
        </SectionCard>
      )}

      {/* トピック一覧 */}
      <SectionCard title="学習トピック" color={color} defaultOpen>
        <KeywordList keywords={sec.topics} color={color} />
      </SectionCard>

      {/* 主要年表 */}
      {sec.keyEvents?.length > 0 && (
        <SectionCard title="主要年表" color={color}>
          <EventTimeline events={sec.keyEvents} />
        </SectionCard>
      )}

      {/* 試験のコツ */}
      {sec.examTips?.length > 0 && (
        <SectionCard title="試験に出るポイント" color={color}>
          <TipCard tips={sec.examTips} color={color} />
        </SectionCard>
      )}

      {/* テスト履歴 */}
      {history.length > 0 && (
        <SectionCard title="テスト履歴" color={color} defaultOpen={false}>
          {history.slice(-5).reverse().map((h, i) => {
            const grade = h.pct >= 80 ? "優秀" : h.pct >= 60 ? "合格" : "要復習";
            const gradeColor = h.pct >= 80 ? "var(--color-accent)" : h.pct >= 60 ? "var(--color-secondary)" : "var(--color-warning)";
            return (
              <div key={i} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "8px 0",
                borderBottom: i < Math.min(history.length, 5) - 1 ? "1px solid var(--color-border)" : "none",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Clock size={12} color="var(--color-text-light)" />
                  <span style={{ fontSize: 20, color: "var(--color-text-light)" }}>{h.date}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 19, fontWeight: 600 }}>{h.score}/{h.total}</span>
                  <span style={{
                    fontSize: 19, fontWeight: 700, color: gradeColor,
                    background: gradeColor + "20", padding: "2px 8px", borderRadius: 999,
                  }}>{grade}</span>
                </div>
              </div>
            );
          })}
        </SectionCard>
      )}

      {/* YouTube検索ボタン */}
      {sec.topics?.length > 0 && (
        <YouTubeSearchButton query={`${sec.region} ${sec.era}`} />
      )}

      {/* 隣接セクションナビゲーション */}
      <SectionPager sectionId={sectionId} />

      {/* 理解度テスト */}
      <div style={{
        background: "#fff", borderRadius: 14,
        border: "1px solid var(--color-border)",
        padding: "16px", textAlign: "center", marginTop: 4,
      }}>
        <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>
          {sec.era} 理解度テスト
        </div>
        <div style={{ fontSize: 20, color: "var(--color-text-light)", marginBottom: 12 }}>
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
            fontFamily: "var(--font-family)", fontSize: 20, fontWeight: 700,
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
// 前後セクションナビゲーション
// ============================================================

function SectionPager({ sectionId }) {
  const idx = SEKAISHI_ORDER.indexOf(sectionId);
  const prevId = idx > 0 ? SEKAISHI_ORDER[idx - 1] : null;
  const nextId = idx < SEKAISHI_ORDER.length - 1 ? SEKAISHI_ORDER[idx + 1] : null;
  if (!prevId && !nextId) return null;

  return null; // ページャーはメインコンポーネントで外部から制御
}

// ============================================================
// ビューモード切替バー
// ============================================================

function ViewModeTabs({ mode, onChange }) {
  const tabs = [
    { id: "region", label: "地域別" },
    { id: "chrono", label: "時代順" },
  ];
  return (
    <div style={{
      display: "flex", gap: 6, marginBottom: 14,
      background: "#F0F4FA", borderRadius: 10, padding: 4,
    }}>
      {tabs.map(({ id, label }) => {
        const active = mode === id;
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            style={{
              flex: 1, padding: "8px 0", borderRadius: 7, border: "none",
              background: active ? "#fff" : "transparent",
              color: active ? "var(--color-highlight)" : "var(--color-text-light)",
              fontFamily: "var(--font-family)", fontSize: 20, fontWeight: active ? 700 : 500,
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
// メインコンポーネント
// ============================================================

export default function SekaishiTab({ appData, onUpdateData, onNavigate, navTarget }) {
  const [viewMode, setViewMode] = useState("region");
  const [selectedId, setSelectedId] = useState(null);
  const progress = appData.progress.sekaishi || {};

  useEffect(() => {
    if (navTarget?.sectionId) {
      setSelectedId(navTarget.sectionId);
    }
  }, [navTarget]);

  // セクション詳細ビュー
  if (selectedId) {
    const idx = SEKAISHI_ORDER.indexOf(selectedId);
    const prevId = idx > 0 ? SEKAISHI_ORDER[idx - 1] : null;
    const nextId = idx < SEKAISHI_ORDER.length - 1 ? SEKAISHI_ORDER[idx + 1] : null;

    return (
      <div className="fade-in">
        <TabNav current="sekaishi" onNavigate={onNavigate} />
        <SectionDetail
          sectionId={selectedId}
          appData={appData}
          onUpdateData={onUpdateData}
          onBack={() => setSelectedId(null)}
        />

        {/* 前後ナビゲーション */}
        {(prevId || nextId) && (
          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            {prevId ? (
              <button
                onClick={() => setSelectedId(prevId)}
                style={{ flex: 1, display: "flex", alignItems: "center", gap: 6, padding: "10px 12px", borderRadius: 10, border: "1px solid var(--color-border)", background: "#fff", cursor: "pointer", fontFamily: "var(--font-family)", fontSize: 20, fontWeight: 600, color: "var(--color-text)" }}
              >
                <ChevronLeft size={14} />
                <span style={{ fontSize: 19 }}>{sekaishiData[prevId]?.era}</span>
              </button>
            ) : <div style={{ flex: 1 }} />}
            {nextId && (
              <button
                onClick={() => setSelectedId(nextId)}
                style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 6, padding: "10px 12px", borderRadius: 10, border: "1px solid var(--color-border)", background: "#fff", cursor: "pointer", fontFamily: "var(--font-family)", fontSize: 20, fontWeight: 600, color: "var(--color-text)" }}
              >
                <span style={{ fontSize: 19 }}>{sekaishiData[nextId]?.era}</span>
                <ChevronRight size={14} />
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="fade-in">
      <TabNav current="sekaishi" onNavigate={onNavigate} />

      {/* ヘッダー */}
      <div style={{
        background: "linear-gradient(135deg, #EDE7F6 0%, #E3F2FD 100%)",
        borderRadius: 16, border: "1px solid var(--color-border)",
        padding: "14px 16px", marginBottom: 14,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <Globe size={18} color="var(--color-highlight)" />
          <span style={{ fontSize: 19, fontWeight: 700 }}>世界史タブ</span>
        </div>
        <div style={{ fontSize: 20, color: "var(--color-text-light)", lineHeight: 1.7 }}>
          東アジア・中東・ヨーロッパ・産業革命〜現代まで8セクションを収録。地域別・時代順で学べます。
        </div>
      </div>

      {/* 進捗 */}
      <ProgressSummary progress={progress} />

      {/* ビューモード切替 */}
      <ViewModeTabs mode={viewMode} onChange={setViewMode} />

      {/* セクション一覧 */}
      {viewMode === "region" && (
        <RegionListView progress={progress} onSelect={setSelectedId} />
      )}
      {viewMode === "chrono" && (
        <ChronologicalView progress={progress} onSelect={setSelectedId} />
      )}
    </div>
  );
}
