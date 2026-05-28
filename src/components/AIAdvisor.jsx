/*
  📍 フェーズ14: AI機能（モック）
  - generateAdvice(): appData からルールベースでアドバイスを生成
  - StudyPlanCard: HomeTab 用「今日の学習プラン」カード
  - AIChatSection: NigateTab 用 AIチャット（プリセットQ&A）
*/

import { useState, useEffect, useRef } from "react";
import { Brain, ChevronRight, Sparkles, RefreshCw } from "lucide-react";
import { nihonshiDataAll, nihonshiOrderAll } from "../data/nihonshiDataLate.js";
import { sekaishiData } from "../data/sekaishiData.js";
import { temashiData } from "../data/temashiData.js";

// ============================================================
// セクションラベル取得
// ============================================================

const KISO_LABELS = { A: "試験の概要", B: "時代の流れ", C: "記述・用語", D: "論述・テーマ" };

function getLabel(tab, key) {
  if (tab === "nihonshi") return nihonshiDataAll[key]?.name || key;
  if (tab === "sekaishi") return sekaishiData[key]?.era || key;
  if (tab === "temashi")  return temashiData[key]?.label || key;
  if (tab === "kisochishiki") return KISO_LABELS[key] || `セクション${key}`;
  return key;
}

const TAB_LABELS = {
  kisochishiki: "基礎知識", nihonshi: "日本史",
  sekaishi: "世界史", temashi: "テーマ史", ronshutsu: "論述対策",
};
const TAB_COLORS = {
  kisochishiki: "var(--color-secondary)", nihonshi: "var(--color-accent)",
  sekaishi: "var(--color-highlight)", temashi: "var(--color-warning)", ronshutsu: "#A0C4FF",
};

// ============================================================
// アドバイス生成ロジック
// ============================================================

function calcSectionAvg(history) {
  const map = {};
  history.forEach(h => {
    const key = `${h.tab}::${h.era ?? h.section ?? h.themeId ?? ""}`;
    if (!map[key]) map[key] = { tab: h.tab, secKey: h.era ?? h.section ?? h.themeId, sum: 0, count: 0 };
    map[key].sum += h.pct;
    map[key].count += 1;
  });
  return Object.values(map).map(v => ({ ...v, avg: Math.round(v.sum / v.count) }));
}

export function generateStudyPlan(appData) {
  const history = appData.testHistory || [];
  const progress = appData.progress || {};
  const sectionAvgs = calcSectionAvg(history);
  const items = [];

  // 1. 苦手セクション（過去最低正解率）を最優先
  const weakSecs = sectionAvgs.filter(s => s.avg < 60).sort((a, b) => a.avg - b.avg);
  if (weakSecs.length > 0) {
    const w = weakSecs[0];
    items.push({
      type: "weak",
      tab: w.tab,
      label: getLabel(w.tab, w.secKey),
      tabLabel: TAB_LABELS[w.tab],
      color: TAB_COLORS[w.tab] || "var(--color-warning)",
      reason: `正解率 ${w.avg}% — 重点復習が必要です`,
    });
  }

  // 2. 未着手のタブ（進捗0%かつ未受験）
  const tabOrder = ["kisochishiki", "nihonshi", "sekaishi", "temashi", "ronshutsu"];
  for (const tab of tabOrder) {
    if (items.length >= 3) break;
    const prog = progress[tab] || {};
    const allDone = Object.values(prog).every(Boolean);
    const hasTested = history.some(h => h.tab === tab);
    if (!allDone && !hasTested) {
      items.push({
        type: "new",
        tab,
        label: `${TAB_LABELS[tab]}タブを始めましょう`,
        tabLabel: TAB_LABELS[tab],
        color: TAB_COLORS[tab] || "var(--color-primary)",
        reason: "まだ学習記録がありません",
      });
    }
  }

  // 3. 進捗途中のセクション（checkedが一部）
  const progressOrder = [
    { tab: "nihonshi",     keys: nihonshiOrderAll },
    { tab: "sekaishi",     keys: Object.keys(sekaishiData) },
    { tab: "temashi",      keys: Object.keys(temashiData) },
    { tab: "kisochishiki", keys: ["A", "B", "C", "D"] },
  ];
  for (const { tab, keys } of progressOrder) {
    if (items.length >= 3) break;
    const prog = progress[tab] || {};
    const undone = keys.find(k => !prog[k]);
    if (undone) {
      const already = items.some(it => it.tab === tab);
      if (!already) {
        items.push({
          type: "next",
          tab,
          label: getLabel(tab, undone),
          tabLabel: TAB_LABELS[tab],
          color: TAB_COLORS[tab] || "var(--color-primary)",
          reason: "次の未学習セクションです",
        });
      }
    }
  }

  // フォールバック: 全完了 or データ不足
  if (items.length === 0) {
    items.push({
      type: "done",
      tab: "nigate",
      label: "苦手分析で弱点を確認",
      tabLabel: "苦手分析",
      color: "#B5EAD7",
      reason: "全セクション完了！継続して復習しましょう",
    });
  }

  return items.slice(0, 3);
}

// ============================================================
// StudyPlanCard（HomeTab 用）
// ============================================================

export function StudyPlanCard({ appData, onNavigate }) {
  const [plan, setPlan] = useState(() => generateStudyPlan(appData));
  const [refreshCount, setRefreshCount] = useState(0);

  const refresh = () => {
    setRefreshCount(c => c + 1);
    setPlan(generateStudyPlan(appData));
  };

  const typeIcon = { weak: "⚡", new: "★", next: "→", done: "✓" };

  return (
    <div style={{
      background: "linear-gradient(135deg, #E8EAF6 0%, #EDE7F6 100%)",
      borderRadius: 16, border: "1px solid #A0C4FF40",
      padding: "14px 16px", marginBottom: 12,
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Brain size={16} color="#A0C4FF" />
          <span style={{ fontSize: 13, fontWeight: 700, color: "var(--color-text)" }}>
            AIスタディプラン
          </span>
          <span style={{
            fontSize: 9, fontWeight: 700, color: "#A0C4FF",
            background: "#A0C4FF25", padding: "2px 7px", borderRadius: 999,
          }}>AI</span>
        </div>
        <button
          onClick={refresh}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}
          title="更新"
        >
          <RefreshCw size={13} color="#A0C4FF" />
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {plan.map((item, i) => (
          <button
            key={i}
            onClick={() => onNavigate(item.tab)}
            style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "10px 12px", borderRadius: 10,
              border: `1px solid ${item.color}40`,
              background: "#fff", cursor: "pointer",
              fontFamily: "var(--font-family)", textAlign: "left",
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
              transition: "all 0.15s",
            }}
          >
            <div style={{
              width: 28, height: 28, borderRadius: 8, flexShrink: 0,
              background: item.color + "25",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13,
            }}>
              {typeIcon[item.type] || "→"}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--color-text)", marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {item.label}
              </div>
              <div style={{ fontSize: 10, color: "var(--color-text-light)" }}>
                <span style={{ color: item.color, fontWeight: 600 }}>{item.tabLabel}</span>
                {" "}・{item.reason}
              </div>
            </div>
            <ChevronRight size={13} color="var(--color-text-light)" style={{ flexShrink: 0 }} />
          </button>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// AIチャット プリセットQ&A
// ============================================================

const PRESET_QUESTIONS = [
  "今日何を勉強すべきですか？",
  "苦手な分野を教えて",
  "どのタブを優先すれば良い？",
  "論述対策のコツは？",
  "試験直前の学習法は？",
];

function generateAIResponse(question, appData) {
  const history = appData.testHistory || [];
  const progress = appData.progress || {};
  const sectionAvgs = calcSectionAvg(history);
  const weakSecs = sectionAvgs.filter(s => s.avg < 60).sort((a, b) => a.avg - b.avg);

  // 全体進捗
  const allVals = Object.values(progress).flatMap(s => Object.values(s));
  const totalPct = allVals.length ? Math.round(allVals.filter(Boolean).length / allVals.length * 100) : 0;

  // タブ別進捗
  const tabPcts = {};
  const tabKeys = { kisochishiki: 4, nihonshi: 17, sekaishi: 8, temashi: 6 };
  Object.entries(tabKeys).forEach(([tab, total]) => {
    const done = Object.values(progress[tab] || {}).filter(Boolean).length;
    tabPcts[tab] = Math.round((done / total) * 100);
  });

  if (question.includes("今日") || question.includes("勉強")) {
    const plan = generateStudyPlan(appData);
    const items = plan.map(p => `・${p.tabLabel}「${p.label}」`).join("\n");
    return `今日のおすすめ学習プランです！\n\n${items}\n\n全体進捗は${totalPct}%です。継続して学習を進めましょう。`;
  }

  if (question.includes("苦手")) {
    if (weakSecs.length === 0) {
      return `現在テスト結果から判定できる苦手分野はありません。\n各タブの理解度テストを受けると、ここで苦手分野の分析ができます。`;
    }
    const top3 = weakSecs.slice(0, 3)
      .map(s => `・${TAB_LABELS[s.tab]}「${getLabel(s.tab, s.secKey)}」(${s.avg}%)`)
      .join("\n");
    return `テスト結果から分析した要復習分野はこちらです：\n\n${top3}\n\n特に正解率の低い分野から優先的に復習しましょう。`;
  }

  if (question.includes("タブ") || question.includes("優先")) {
    const sorted = Object.entries(tabPcts).sort((a, b) => a[1] - b[1]);
    const lowest = sorted[0];
    const tabName = TAB_LABELS[lowest[0]] || lowest[0];
    return `進捗が最も低いのは「${tabName}タブ」（${lowest[1]}%完了）です。\n\nおすすめの学習順序:\n① 基礎知識で出題傾向を把握\n② 日本史・世界史の時代別学習\n③ テーマ史で横断的に整理\n④ 論述対策（1級受験者）\n\n1日1〜2セクションずつ着実に進めましょう！`;
  }

  if (question.includes("論述")) {
    return `論述対策の3つのコツです：\n\n① 構成を守る（序論100字・本論300字・結論100字）\n② キーワードを必ず使う\n   採点の30%はキーワードの有無で決まります\n③ 因果関係を明示する\n   「〜の結果」「これにより」などを使って\n   論理の流れを示しましょう\n\n論述対策タブの模範解答を繰り返し読んで、\n文体・構成を体に染み込ませることが大切です。`;
  }

  if (question.includes("試験直前") || question.includes("直前")) {
    return `試験直前（1週間前）の学習法です！\n\n① 新しい内容より復習を優先\n   まだ完了していないセクションより\n   苦手分野の総復習を優先しましょう\n\n② 年号・キーワードの確認\n   日本史タブの単語帳モードが効果的です\n\n③ 過去問演習（模擬試験モード）\n   時間を計って本番形式で解く練習を\n\n④ 睡眠と体調管理が最重要！\n   前日は新しい学習より復習+早寝を`;
  }

  return `ご質問ありがとうございます。\n現在の進捗状況：${totalPct}% 完了\n\n各タブを順番に進めながら、理解度テストを受けることで苦手分析タブに詳細なデータが蓄積されます。\n引き続き頑張ってください！`;
}

// ============================================================
// AIChatSection（NigateTab 用）
// ============================================================

export function AIChatSection({ appData }) {
  const [messages, setMessages] = useState([
    { role: "ai", text: "こんにちは！歴史検定AIアシスタントです。学習に関する質問をどうぞ。" },
  ]);
  const [thinking, setThinking] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  const handleQuestion = (q) => {
    if (thinking) return;
    setMessages(prev => [...prev, { role: "user", text: q }]);
    setThinking(true);
    setTimeout(() => {
      const response = generateAIResponse(q, appData);
      setMessages(prev => [...prev, { role: "ai", text: response }]);
      setThinking(false);
    }, 800 + Math.random() * 600);
  };

  return (
    <div style={{
      background: "#fff", borderRadius: 14,
      border: "1px solid var(--color-border)",
      padding: "14px", marginBottom: 12,
      boxShadow: "var(--shadow-sm)",
    }}>
      {/* ヘッダー */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <Brain size={15} color="#A0C4FF" />
        <span style={{ fontSize: 13, fontWeight: 700 }}>AIアシスタント</span>
        <span style={{
          fontSize: 9, fontWeight: 700, color: "#A0C4FF",
          background: "#A0C4FF25", padding: "2px 7px", borderRadius: 999,
        }}>モック</span>
      </div>

      {/* メッセージエリア */}
      <div style={{
        maxHeight: 260, overflowY: "auto",
        display: "flex", flexDirection: "column", gap: 10,
        marginBottom: 12, paddingRight: 4,
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            display: "flex",
            justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
            alignItems: "flex-end", gap: 8,
          }}>
            {msg.role === "ai" && (
              <div style={{
                width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                background: "#A0C4FF25",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Brain size={14} color="#A0C4FF" />
              </div>
            )}
            <div style={{
              maxWidth: "78%",
              padding: "9px 12px",
              borderRadius: msg.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
              background: msg.role === "user" ? "var(--color-primary)" : "var(--color-card-bg)",
              color: msg.role === "user" ? "#fff" : "var(--color-text)",
              fontSize: 12, lineHeight: 1.8,
              whiteSpace: "pre-wrap",
              border: msg.role === "ai" ? "1px solid var(--color-border)" : "none",
            }}>
              {msg.text}
            </div>
          </div>
        ))}

        {/* 思考中インジケーター */}
        {thinking && (
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#A0C4FF25", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Brain size={14} color="#A0C4FF" />
            </div>
            <div style={{ padding: "12px 16px", borderRadius: "14px 14px 14px 4px", background: "var(--color-card-bg)", border: "1px solid var(--color-border)" }}>
              <div style={{ display: "flex", gap: 4 }}>
                {[0, 1, 2].map(j => (
                  <div
                    key={j}
                    style={{
                      width: 6, height: 6, borderRadius: "50%",
                      background: "#A0C4FF",
                      animation: `pulse 1.2s ease-in-out ${j * 0.2}s infinite`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* プリセット質問チップ */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ fontSize: 10, color: "var(--color-text-light)", marginBottom: 2, fontWeight: 600 }}>
          質問を選んでください
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {PRESET_QUESTIONS.map(q => (
            <button
              key={q}
              onClick={() => handleQuestion(q)}
              disabled={thinking}
              style={{
                padding: "6px 12px", borderRadius: 999,
                border: "1.5px solid var(--color-border)",
                background: "#fff",
                color: thinking ? "var(--color-text-light)" : "var(--color-text)",
                fontFamily: "var(--font-family)", fontSize: 11, fontWeight: 500,
                cursor: thinking ? "default" : "pointer",
                opacity: thinking ? 0.5 : 1,
                transition: "all 0.15s",
              }}
            >
              {q}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
