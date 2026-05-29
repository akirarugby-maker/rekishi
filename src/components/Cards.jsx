/*
  Cards — 歴史検定アプリ共通カードコンポーネント群
  - SectionCard     : セクション見出し＋内容カード
  - KeywordList     : キーワードバッジ一覧
  - EventTimeline   : 年表（年号・出来事・重要度）
  - TipCard         : 試験のコツ一覧
  - FigureCard      : 人物カード
  - ProgressSection : セクション完了チェック付きラッパー
  - InfoTable       : シンプルな2列表
  - EraCard         : 時代概要カード
*/

import { useState } from "react";
import { Check, ChevronDown, ChevronUp, Star, User } from "lucide-react";

// ============================================================
// 共通スタイル
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

  sectionTitle: {
    fontSize: 15, fontWeight: 700,
    display: "flex", alignItems: "center", gap: 8,
    marginBottom: 12, color: "var(--color-text)",
  },

  badge: (color) => ({
    display: "inline-block",
    padding: "2px 10px",
    borderRadius: 999,
    fontSize: 11, fontWeight: 600,
    background: (color || "var(--color-primary)") + "20",
    color: color || "var(--color-primary)",
    margin: "3px",
    cursor: "default",
  }),

  importanceDot: (level) => ({
    width: 8, height: 8, borderRadius: "50%", flexShrink: 0,
    background:
      level === "高" ? "var(--color-warning)" :
      level === "中" ? "var(--color-secondary)" :
      "var(--color-border)",
    marginTop: 6,
  }),

  tipItem: {
    display: "flex", alignItems: "flex-start", gap: 8,
    padding: "8px 0",
    borderBottom: "1px solid var(--color-border)",
    fontSize: 13, lineHeight: 1.7,
  },
};

// ============================================================
// SectionCard — 折りたたみ可能なセクションカード
// ============================================================

export function SectionCard({ title, color, icon: Icon, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div style={S.card}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: "100%", display: "flex",
          alignItems: "center", justifyContent: "space-between",
          background: "none", border: "none",
          cursor: "pointer", padding: 0,
          fontFamily: "var(--font-family)",
        }}
      >
        <div style={{ ...S.sectionTitle, marginBottom: 0 }}>
          {Icon && <Icon size={17} color={color || "var(--color-primary)"} />}
          <span>{title}</span>
        </div>
        {open
          ? <ChevronUp size={16} color="var(--color-text-light)" />
          : <ChevronDown size={16} color="var(--color-text-light)" />
        }
      </button>

      {open && (
        <div style={{ marginTop: 12 }} className="fade-in">
          {children}
        </div>
      )}
    </div>
  );
}

// ============================================================
// KeywordList — キーワードバッジ
// ============================================================

export function KeywordList({ keywords, color }) {
  return (
    <div style={{ marginBottom: 4 }}>
      {keywords.map(kw => (
        <span key={kw} style={S.badge(color)}>{kw}</span>
      ))}
    </div>
  );
}

// ============================================================
// EventTimeline — 年表
// ============================================================

export function EventTimeline({ events }) {
  return (
    <div style={{ position: "relative", paddingLeft: 16 }}>
      {/* 縦ライン */}
      <div style={{
        position: "absolute", left: 3, top: 8, bottom: 8,
        width: 2, background: "var(--color-border)",
        borderRadius: 1,
      }} />

      {events.map((ev, i) => (
        <div key={i} style={{ display: "flex", gap: 12, marginBottom: 12, position: "relative" }}>
          {/* ドット */}
          <div style={{
            position: "absolute", left: -17, top: 5,
            width: 10, height: 10, borderRadius: "50%",
            background: ev.importance === "高"
              ? "var(--color-warning)"
              : ev.importance === "中"
              ? "var(--color-secondary)"
              : "var(--color-border)",
            border: "2px solid #fff",
            flexShrink: 0,
          }} />
          <div>
            <div style={{ fontSize: 11, color: "var(--color-text-light)", fontWeight: 600, marginBottom: 2 }}>
              {ev.year}
            </div>
            <div style={{ fontSize: 13, lineHeight: 1.6, color: "var(--color-text)" }}>
              {ev.event}
            </div>
          </div>
        </div>
      ))}

      {/* 凡例 */}
      <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
        {[
          { level: "高", label: "重要度：高", color: "var(--color-warning)" },
          { level: "中", label: "重要度：中", color: "var(--color-secondary)" },
        ].map(({ label, color }) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "var(--color-text-light)" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// TipCard — 試験のコツリスト
// ============================================================

export function TipCard({ tips, color }) {
  return (
    <div>
      {tips.map((tip, i) => (
        <div key={i} style={{ ...S.tipItem, borderBottom: i < tips.length - 1 ? "1px solid var(--color-border)" : "none" }}>
          <Star size={14} color={color || "var(--color-secondary)"} style={{ marginTop: 3, flexShrink: 0 }} />
          <span>{tip}</span>
        </div>
      ))}
    </div>
  );
}

// ============================================================
// FigureCard — 人物カード
// ============================================================

export function FigureCard({ name, figure }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      style={{
        borderRadius: 12, border: "1px solid var(--color-border)",
        overflow: "hidden", marginBottom: 8,
        background: "#fff",
      }}
    >
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: "100%", display: "flex",
          alignItems: "center", gap: 12,
          padding: "12px 14px", background: "none",
          border: "none", cursor: "pointer",
          fontFamily: "var(--font-family)",
          textAlign: "left",
        }}
      >
        <div style={{
          width: 36, height: 36, borderRadius: "50%",
          background: "var(--color-primary)20",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>
          <User size={18} color="var(--color-primary)" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 700 }}>{name}</div>
          {figure.born && (
            <div style={{ fontSize: 11, color: "var(--color-text-light)" }}>
              {figure.born}〜{figure.died || ""}
            </div>
          )}
        </div>
        {open ? <ChevronUp size={15} color="var(--color-text-light)" /> : <ChevronDown size={15} color="var(--color-text-light)" />}
      </button>

      {open && (
        <div style={{ padding: "0 14px 12px", borderTop: "1px solid var(--color-border)" }} className="fade-in">
          <div style={{ marginTop: 10 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--color-primary)", marginBottom: 6 }}>主な業績</div>
            {figure.achievements?.map((a, i) => (
              <div key={i} style={{ display: "flex", gap: 6, fontSize: 13, marginBottom: 4, alignItems: "flex-start" }}>
                <span style={{ color: "var(--color-accent)", marginTop: 2 }}>•</span>
                <span>{a}</span>
              </div>
            ))}
          </div>
          {figure.examTips?.length > 0 && (
            <div style={{ marginTop: 10 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--color-secondary)", marginBottom: 6 }}>試験のポイント</div>
              {figure.examTips.map((t, i) => (
                <div key={i} style={{ display: "flex", gap: 6, fontSize: 12, marginBottom: 4, color: "var(--color-text-light)" }}>
                  <span style={{ color: "var(--color-secondary)" }}>★</span>
                  <span>{t}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================
// ProgressSection — 進捗チェック付きセクションラッパー
// ============================================================

export function ProgressSection({ sectionKey, progressKey, label, checked, onCheck, children }) {
  return (
    <div style={{ marginBottom: 4 }}>
      {/* セクションヘッダー（完了チェック） */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: 8,
      }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--color-text-light)" }}>
          {label}
        </div>
        <button
          onClick={onCheck}
          style={{
            display: "flex", alignItems: "center", gap: 5,
            padding: "4px 12px", borderRadius: 999,
            border: "1.5px solid",
            borderColor: checked ? "var(--color-accent)" : "var(--color-border)",
            background: checked ? "var(--color-accent)18" : "#fff",
            color: checked ? "var(--color-accent)" : "var(--color-text-light)",
            fontFamily: "var(--font-family)",
            fontSize: 12, fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s",
          }}
        >
          <Check size={13} />
          {checked ? "完了済み" : "完了にする"}
        </button>
      </div>

      {children}
    </div>
  );
}

// ============================================================
// InfoTable — 2列の情報テーブル
// ============================================================

export function InfoTable({ rows }) {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, lineHeight: 1.8 }}>
      <tbody>
        {rows.map(([k, v], i) => (
          <tr key={i} style={{ borderBottom: i < rows.length - 1 ? "1px solid var(--color-border)" : "none" }}>
            <td style={{ color: "var(--color-text-light)", paddingRight: 10, width: "38%", paddingTop: 4, paddingBottom: 4, verticalAlign: "top" }}>
              {k}
            </td>
            <td style={{ fontWeight: 500, paddingTop: 4, paddingBottom: 4 }}>{v}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// ============================================================
// EraCard — 時代概要カード（日本史横スクロール年表のタップ先）
// ============================================================

export function EraCard({ era, color, onStartQuiz }) {
  const difficultyLabel = ["", "★", "★★", "★★★"][era.difficulty] || "";
  const difficultyColor = ["", "var(--color-accent)", "var(--color-secondary)", "var(--color-warning)"][era.difficulty];

  return (
    <div style={{ ...S.card, borderLeft: `4px solid ${color || "var(--color-primary)"}` }} className="fade-in">
      {/* ヘッダー */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 8 }}>
        <div>
          <div style={{ fontSize: 17, fontWeight: 700 }}>{era.name}</div>
          <div style={{ fontSize: 12, color: "var(--color-text-light)", marginTop: 2 }}>{era.period}</div>
        </div>
        <div style={{ fontSize: 13, color: difficultyColor, fontWeight: 700, flexShrink: 0 }}>
          {difficultyLabel}
        </div>
      </div>

      {/* 文化 */}
      <div style={{ fontSize: 12, color: "var(--color-text-light)", marginBottom: 10, fontStyle: "italic" }}>
        {era.culture}
      </div>

      {/* キーワード */}
      <KeywordList keywords={era.keywords.slice(0, 8)} color={color} />

      {/* クイズ開始ボタン */}
      {onStartQuiz && (
        <button
          onClick={onStartQuiz}
          style={{
            marginTop: 12,
            width: "100%", padding: "10px",
            borderRadius: 10, border: "none",
            background: (color || "var(--color-primary)") + "18",
            color: color || "var(--color-primary)",
            fontFamily: "var(--font-family)",
            fontSize: 13, fontWeight: 700,
            cursor: "pointer",
          }}
        >
          理解度テストを受ける
        </button>
      )}
    </div>
  );
}

// ============================================================
// DifficultyBadge — 難易度バッジ
// ============================================================

export function DifficultyBadge({ level }) {
  const labels = ["", "基礎", "標準", "難問"];
  const colors = ["", "var(--color-accent)", "var(--color-secondary)", "var(--color-warning)"];
  return (
    <span style={{
      ...S.badge(colors[level]),
      fontSize: 10,
    }}>
      {labels[level]}
    </span>
  );
}

// ============================================================
// YouTubeSearchButton — YouTube検索リンクボタン
// ============================================================

export function YouTubeSearchButton({ query }) {
  if (!query) return null;
  const searchQuery = encodeURIComponent(query + " 歴史 解説");
  const url = `https://www.youtube.com/results?search_query=${searchQuery}`;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        padding: "11px 16px",
        background: "#FF000010",
        border: "1.5px solid #FF000035",
        borderRadius: 10,
        color: "#CC0000",
        fontSize: 13,
        fontWeight: 700,
        textDecoration: "none",
        fontFamily: "var(--font-family)",
        marginTop: 8,
        cursor: "pointer",
      }}
    >
      <svg width="22" height="16" viewBox="0 0 22 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="22" height="16" rx="3.5" fill="#FF0000"/>
        <polygon points="9,4 9,12 16.5,8" fill="white"/>
      </svg>
      「{query}」をYouTubeで検索
    </a>
  );
}
