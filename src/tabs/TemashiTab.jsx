/*
  📍 フェーズ11: ④テーマ史タブ
  - 6テーマ（文化・宗教・経済・外交・社会・科学技術）グリッド表示
  - テーマ詳細: 複数セクション（時代→内容テーブル）・試験のコツ・理解度テスト
  - 進捗管理（6テーマ）
*/

import { useState } from "react";
import {
  Crown, BookOpen, TrendingUp, Globe, Users, Brain,
  ChevronLeft, ChevronRight, Clock, CheckCircle,
} from "lucide-react";
import TabNav from "../components/TabNav.jsx";
import QuizComponent from "../components/QuizComponent.jsx";
import { SectionCard, TipCard } from "../components/Cards.jsx";
import { temashiData, temashiOrder } from "../data/temashiData.js";

// ============================================================
// アイコンマッピング
// ============================================================

const ICON_MAP = { Crown, BookOpen, TrendingUp, Globe, Users, Brain };

// ============================================================
// 進捗サマリー
// ============================================================

function ProgressSummary({ progress }) {
  const total = temashiOrder.length;
  const done = temashiOrder.filter(id => progress?.[id]).length;
  const pct = Math.round((done / total) * 100);
  return (
    <div style={{
      background: "#fff", borderRadius: 12,
      border: "1px solid var(--color-border)",
      padding: "10px 14px", marginBottom: 14,
      display: "flex", alignItems: "center", gap: 12,
    }}>
      <Crown size={16} color="var(--color-warning)" />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 11, color: "var(--color-text-light)", marginBottom: 3 }}>
          テーマ史 進捗: {done}/{total} テーマ
        </div>
        <div style={{ height: 6, borderRadius: 999, background: "var(--color-border)", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${pct}%`, background: "var(--color-warning)", borderRadius: 999, transition: "width 0.5s" }} />
        </div>
      </div>
      <span style={{ fontSize: 12, fontWeight: 700, color: "var(--color-warning)" }}>{pct}%</span>
    </div>
  );
}

// ============================================================
// テーマグリッドカード
// ============================================================

function ThemeGrid({ progress, onSelect }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
      {temashiOrder.map(id => {
        const theme = temashiData[id];
        if (!theme) return null;
        const Icon = ICON_MAP[theme.icon] || Crown;
        const done = progress?.[id];
        const quizCount = theme.quizzes?.length || 0;
        return (
          <button
            key={id}
            onClick={() => onSelect(id)}
            style={{
              display: "flex", flexDirection: "column",
              padding: "14px 12px", borderRadius: 14,
              border: `1px solid ${done ? theme.color + "80" : "var(--color-border)"}`,
              background: done ? theme.color + "12" : "#fff",
              cursor: "pointer", fontFamily: "var(--font-family)",
              textAlign: "left", boxShadow: "var(--shadow-sm)",
              transition: "all 0.15s", position: "relative",
            }}
          >
            {/* 完了チェック */}
            {done && (
              <div style={{ position: "absolute", top: 8, right: 8 }}>
                <CheckCircle size={14} color="var(--color-accent)" />
              </div>
            )}

            {/* アイコン */}
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: theme.color + "25",
              display: "flex", alignItems: "center", justifyContent: "center",
              marginBottom: 10,
            }}>
              <Icon size={18} color={theme.color} />
            </div>

            {/* ラベル */}
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4, color: "var(--color-text)" }}>
              {theme.label}
            </div>
            <div style={{
              fontSize: 10, color: "var(--color-text-light)",
              lineHeight: 1.5, marginBottom: 10, flex: 1,
            }}>
              {theme.description}
            </div>

            {/* バッジ */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{
                fontSize: 10, fontWeight: 600,
                color: theme.color,
                background: theme.color + "20",
                padding: "2px 8px", borderRadius: 999,
              }}>
                {theme.sections?.length || 0} セクション
              </span>
              <span style={{ fontSize: 10, color: "var(--color-text-light)" }}>
                {quizCount}問
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}

// ============================================================
// セクション内容レンダラー（era → features テーブル）
// ============================================================

function SectionContent({ content, color }) {
  return (
    <div>
      {content.map(({ era, features }, i) => (
        <div
          key={i}
          style={{
            padding: "10px 0",
            borderBottom: i < content.length - 1 ? "1px solid var(--color-border)" : "none",
          }}
        >
          <div style={{
            fontSize: 12, fontWeight: 700,
            color, marginBottom: 4,
            display: "flex", alignItems: "center", gap: 6,
          }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: color, flexShrink: 0 }} />
            {era}
          </div>
          <div style={{ fontSize: 12, color: "var(--color-text)", lineHeight: 1.7, paddingLeft: 12 }}>
            {features}
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================================
// テーマ詳細ページ
// ============================================================

function ThemeDetail({ themeId, appData, onUpdateData, onBack }) {
  const [showQuiz, setShowQuiz] = useState(false);
  const theme = temashiData[themeId];
  const Icon = ICON_MAP[theme.icon] || Crown;
  const done = appData.progress.temashi?.[themeId];
  const quizzes = theme.quizzes || [];

  // テスト履歴
  const history = (appData.testHistory || []).filter(
    h => h.tab === "temashi" && h.themeId === themeId
  );

  const handleQuizComplete = ({ score, total, pct }) => {
    if (pct >= 60) {
      onUpdateData({
        progress: {
          ...appData.progress,
          temashi: { ...appData.progress.temashi, [themeId]: true },
        },
      });
    }
    const today = new Date().toISOString().slice(0, 10);
    onUpdateData({
      testHistory: [
        ...(appData.testHistory || []),
        { date: today, tab: "temashi", themeId, score, total, pct },
      ],
    });
    setShowQuiz(false);
  };

  if (showQuiz) {
    return (
      <div className="fade-in">
        <button
          onClick={() => setShowQuiz(false)}
          style={{ background: "none", border: "none", cursor: "pointer", color: theme.color, fontFamily: "var(--font-family)", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 5, marginBottom: 16, padding: 0 }}
        >
          <ChevronLeft size={16} />{theme.label}に戻る
        </button>
        <QuizComponent quizzes={quizzes} sectionKey={themeId} onComplete={handleQuizComplete} />
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
        <ChevronLeft size={16} />テーマ一覧に戻る
      </button>

      {/* ヘッダー */}
      <div style={{
        background: `linear-gradient(135deg, ${theme.color}30 0%, ${theme.color}10 100%)`,
        borderRadius: 16, border: `1px solid ${theme.color}50`,
        padding: "16px", marginBottom: 14,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: theme.color + "30",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <Icon size={22} color={theme.color} />
            </div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 2 }}>{theme.label}</div>
              <div style={{ fontSize: 12, color: "var(--color-text-light)" }}>{theme.description}</div>
            </div>
          </div>
          {done && (
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--color-accent)", flexShrink: 0 }}>
              ✓ 完了
            </div>
          )}
        </div>
      </div>

      {/* セクションコンテンツ */}
      {theme.sections?.map((sec, i) => (
        <SectionCard key={i} title={sec.title} color={theme.color} defaultOpen={i === 0}>
          <SectionContent content={sec.content} color={theme.color} />
        </SectionCard>
      ))}

      {/* 試験のコツ */}
      {theme.examTips?.length > 0 && (
        <SectionCard title="試験に出るポイント" color={theme.color}>
          <TipCard tips={theme.examTips} color={theme.color} />
        </SectionCard>
      )}

      {/* テスト履歴 */}
      {history.length > 0 && (
        <SectionCard title="テスト履歴" color={theme.color} defaultOpen={false}>
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
                  <span style={{ fontSize: 12, color: "var(--color-text-light)" }}>{h.date}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{h.score}/{h.total}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: gradeColor, background: gradeColor + "20", padding: "2px 8px", borderRadius: 999 }}>{grade}</span>
                </div>
              </div>
            );
          })}
        </SectionCard>
      )}

      {/* 理解度テスト */}
      <div style={{
        background: "#fff", borderRadius: 14,
        border: "1px solid var(--color-border)",
        padding: "16px", textAlign: "center", marginTop: 4,
      }}>
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>
          {theme.label} 理解度テスト
        </div>
        <div style={{ fontSize: 12, color: "var(--color-text-light)", marginBottom: 12 }}>
          {quizzes.length > 0 ? `${quizzes.length}問 / 60%以上で完了チェック` : "テスト問題を準備中です"}
        </div>
        <button
          onClick={() => setShowQuiz(true)}
          disabled={quizzes.length === 0}
          style={{
            width: "100%", padding: "12px",
            borderRadius: 12, border: "none",
            background: quizzes.length > 0 ? theme.color : "var(--color-border)",
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
// テーマページャー（詳細ページ内の前後ナビ）
// ============================================================

function ThemePager({ themeId, onSelect }) {
  const idx = temashiOrder.indexOf(themeId);
  const prevId = idx > 0 ? temashiOrder[idx - 1] : null;
  const nextId = idx < temashiOrder.length - 1 ? temashiOrder[idx + 1] : null;
  if (!prevId && !nextId) return null;
  return (
    <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
      {prevId ? (
        <button
          onClick={() => onSelect(prevId)}
          style={{ flex: 1, display: "flex", alignItems: "center", gap: 6, padding: "10px 12px", borderRadius: 10, border: "1px solid var(--color-border)", background: "#fff", cursor: "pointer", fontFamily: "var(--font-family)", fontSize: 12, fontWeight: 600, color: "var(--color-text)" }}
        >
          <ChevronLeft size={14} />
          <span>{temashiData[prevId]?.label}</span>
        </button>
      ) : <div style={{ flex: 1 }} />}
      {nextId && (
        <button
          onClick={() => onSelect(nextId)}
          style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 6, padding: "10px 12px", borderRadius: 10, border: "1px solid var(--color-border)", background: "#fff", cursor: "pointer", fontFamily: "var(--font-family)", fontSize: 12, fontWeight: 600, color: "var(--color-text)" }}
        >
          <span>{temashiData[nextId]?.label}</span>
          <ChevronRight size={14} />
        </button>
      )}
    </div>
  );
}

// ============================================================
// メインコンポーネント
// ============================================================

export default function TemashiTab({ appData, onUpdateData, onNavigate }) {
  const [selectedId, setSelectedId] = useState(null);
  const progress = appData.progress.temashi || {};

  // テーマ詳細ビュー
  if (selectedId) {
    return (
      <div className="fade-in">
        <TabNav current="temashi" onNavigate={onNavigate} />
        <ThemeDetail
          themeId={selectedId}
          appData={appData}
          onUpdateData={onUpdateData}
          onBack={() => setSelectedId(null)}
        />
        <ThemePager themeId={selectedId} onSelect={setSelectedId} />
      </div>
    );
  }

  return (
    <div className="fade-in">
      <TabNav current="temashi" onNavigate={onNavigate} />

      {/* ヘッダー */}
      <div style={{
        background: "linear-gradient(135deg, #FFF8E1 0%, #FCE4EC 100%)",
        borderRadius: 16, border: "1px solid var(--color-border)",
        padding: "14px 16px", marginBottom: 14,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <Crown size={18} color="var(--color-warning)" />
          <span style={{ fontSize: 15, fontWeight: 700 }}>テーマ史タブ</span>
        </div>
        <div style={{ fontSize: 12, color: "var(--color-text-light)", lineHeight: 1.7 }}>
          文化・宗教・経済・外交・社会・科学技術の6テーマで、時代を横断して学べます。
        </div>
      </div>

      {/* 進捗 */}
      <ProgressSummary progress={progress} />

      {/* テーマグリッド */}
      <ThemeGrid progress={progress} onSelect={setSelectedId} />
    </div>
  );
}
