/*
  📍 フェーズ15: 模擬試験モード
  - 準1級モード（20問・25分）/ 1級モード（25問・30分）/ 練習モード（10問・制限なし）
  - 全タブのクイズをシャッフルして出題
  - タイマー・問題ナビゲーション（後から見直し可）
  - 結果画面: タブ別正解率・間違い一覧
*/

import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight, Clock, CheckCircle, XCircle, Award } from "lucide-react";
import { nihonshiQuizAll } from "../data/nihonshiDataLate.js";
import { sekaishiData } from "../data/sekaishiData.js";
import { temashiData } from "../data/temashiData.js";

// ============================================================
// 全クイズプール構築
// ============================================================

const ALL_QUIZZES = [
  ...nihonshiQuizAll.map(q => ({ ...q, sourceTab: "nihonshi", sourceLabel: "日本史" })),
  ...Object.values(sekaishiData).flatMap(s =>
    (s.quizzes || []).map(q => ({ ...q, sourceTab: "sekaishi", sourceLabel: "世界史" }))
  ),
  ...Object.values(temashiData).flatMap(t =>
    (t.quizzes || []).map(q => ({ ...q, sourceTab: "temashi", sourceLabel: "テーマ史" }))
  ),
].filter(q => q.type === "FOUR_CHOICE");

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ============================================================
// モード設定
// ============================================================

const EXAM_MODES = [
  { id: "junkyu",   label: "準1級モード", questionCount: 20, timeLimit: 25 * 60, desc: "20問 / 25分" },
  { id: "ikkyu",    label: "1級モード",   questionCount: 25, timeLimit: 30 * 60, desc: "25問 / 30分" },
  { id: "practice", label: "練習モード",  questionCount: 10, timeLimit: null,    desc: "10問 / 時間制限なし" },
];

const TAB_COLOR = {
  nihonshi: "var(--color-accent)",
  sekaishi: "var(--color-highlight)",
  temashi:  "var(--color-warning)",
};

// ============================================================
// タイマー表示
// ============================================================

function TimerDisplay({ timeLeft, limit }) {
  if (limit === null) return null;
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const pct = timeLeft / limit;
  const color = pct > 0.5 ? "var(--color-accent)" : pct > 0.2 ? "var(--color-secondary)" : "var(--color-warning)";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <Clock size={14} color={color} />
      <span style={{ fontSize: 20, fontWeight: 700, color, fontVariantNumeric: "tabular-nums" }}>
        {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
      </span>
    </div>
  );
}

// ============================================================
// 設定画面
// ============================================================

function SetupScreen({ onStart, onBack }) {
  const [selectedMode, setSelectedMode] = useState("junkyu");
  const mode = EXAM_MODES.find(m => m.id === selectedMode);

  return (
    <div className="fade-in">
      <button
        onClick={onBack}
        style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-family)", fontSize: 19, fontWeight: 600, color: "var(--color-text-light)", display: "flex", alignItems: "center", gap: 5, marginBottom: 16, padding: 0 }}
      >
        <ChevronLeft size={16} />ホームに戻る
      </button>

      {/* ヘッダー */}
      <div style={{
        background: "linear-gradient(135deg, #E8EAF6, #E3F2FD)",
        borderRadius: 16, padding: "20px", marginBottom: 20, textAlign: "center",
      }}>
        <Award size={36} color="var(--color-primary)" style={{ marginBottom: 10 }} />
        <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>模擬試験モード</div>
        <div style={{ fontSize: 20, color: "var(--color-text-light)", lineHeight: 1.7 }}>
          日本史・世界史・テーマ史の問題をミックスして<br />本番形式で解答します
        </div>
      </div>

      {/* モード選択 */}
      <div style={{ fontSize: 20, fontWeight: 700, color: "var(--color-text-light)", marginBottom: 10 }}>
        受験モードを選択
      </div>
      {EXAM_MODES.map(m => (
        <button
          key={m.id}
          onClick={() => setSelectedMode(m.id)}
          style={{
            width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "14px 16px", borderRadius: 12, marginBottom: 8,
            border: `2px solid ${selectedMode === m.id ? "var(--color-primary)" : "var(--color-border)"}`,
            background: selectedMode === m.id ? "var(--color-primary)10" : "#fff",
            cursor: "pointer", fontFamily: "var(--font-family)", textAlign: "left",
            transition: "all 0.15s",
          }}
        >
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, color: selectedMode === m.id ? "var(--color-primary)" : "var(--color-text)" }}>
              {m.label}
            </div>
            <div style={{ fontSize: 20, color: "var(--color-text-light)", marginTop: 2 }}>{m.desc}</div>
          </div>
          <div style={{
            width: 20, height: 20, borderRadius: "50%",
            border: `2px solid ${selectedMode === m.id ? "var(--color-primary)" : "var(--color-border)"}`,
            background: selectedMode === m.id ? "var(--color-primary)" : "#fff",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            {selectedMode === m.id && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#fff" }} />}
          </div>
        </button>
      ))}

      {/* 出題範囲 */}
      <div style={{
        background: "#F8F9FD", borderRadius: 10,
        border: "1px solid var(--color-border)",
        padding: "12px 14px", marginBottom: 20, marginTop: 4,
      }}>
        <div style={{ fontSize: 19, fontWeight: 700, color: "var(--color-text-light)", marginBottom: 8 }}>出題範囲（全 {ALL_QUIZZES.length} 問からランダム選択）</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {[
            { label: "日本史", count: nihonshiQuizAll.filter(q => q.type === "FOUR_CHOICE").length, color: "var(--color-accent)" },
            { label: "世界史", count: Object.values(sekaishiData).flatMap(s => s.quizzes || []).length, color: "var(--color-highlight)" },
            { label: "テーマ史", count: Object.values(temashiData).flatMap(t => t.quizzes || []).length, color: "var(--color-warning)" },
          ].map(({ label, count, color }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 19 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />
              <span style={{ color: "var(--color-text-light)" }}>{label} {count}問</span>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => onStart(mode)}
        style={{
          width: "100%", padding: "14px",
          borderRadius: 12, border: "none",
          background: "var(--color-primary)", color: "#fff",
          fontFamily: "var(--font-family)", fontSize: 19, fontWeight: 700,
          cursor: "pointer", boxShadow: "var(--shadow-md)",
        }}
      >
        試験開始
      </button>
    </div>
  );
}

// ============================================================
// 試験画面
// ============================================================

function ExamScreen({ questions, mode, onComplete }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({}); // idx → selected choice
  const [timeLeft, setTimeLeft] = useState(mode.timeLimit);
  const timerRef = useRef(null);

  const submitExam = useCallback(() => {
    clearInterval(timerRef.current);
    onComplete(answers);
  }, [answers, onComplete]);

  useEffect(() => {
    if (mode.timeLimit === null) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); onComplete(answers); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const q = questions[currentIdx];
  const selected = answers[currentIdx];
  const answered = Object.keys(answers).length;

  return (
    <div className="fade-in">
      {/* ヘッダー */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: 14,
      }}>
        <div style={{ fontSize: 19, fontWeight: 700, color: "var(--color-text-light)" }}>
          {currentIdx + 1} / {questions.length}問
        </div>
        <TimerDisplay timeLeft={timeLeft} limit={mode.timeLimit} />
        <span style={{
          fontSize: 19, fontWeight: 600,
          color: "var(--color-accent)", background: "var(--color-accent)15",
          padding: "3px 10px", borderRadius: 999,
        }}>
          解答済 {answered}/{questions.length}
        </span>
      </div>

      {/* プログレスバー */}
      <div style={{ height: 5, borderRadius: 999, background: "var(--color-border)", overflow: "hidden", marginBottom: 16 }}>
        <div style={{ height: "100%", width: `${((currentIdx + 1) / questions.length) * 100}%`, background: "var(--color-primary)", borderRadius: 999, transition: "width 0.3s" }} />
      </div>

      {/* 出典バッジ */}
      <div style={{ marginBottom: 10 }}>
        <span style={{
          fontSize: 20, fontWeight: 700,
          color: TAB_COLOR[q.sourceTab] || "var(--color-primary)",
          background: (TAB_COLOR[q.sourceTab] || "var(--color-primary)") + "20",
          padding: "2px 8px", borderRadius: 999,
        }}>
          {q.sourceLabel}
        </span>
      </div>

      {/* 問題文 */}
      <div style={{
        background: "#fff", borderRadius: 14,
        border: "1px solid var(--color-border)",
        padding: "16px", marginBottom: 14,
        fontSize: 20, lineHeight: 1.8, fontWeight: 600,
        boxShadow: "var(--shadow-sm)",
      }}>
        {q.question}
      </div>

      {/* 選択肢 */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
        {q.choices.map((choice, i) => {
          const isSelected = selected === i;
          return (
            <button
              key={i}
              onClick={() => setAnswers(a => ({ ...a, [currentIdx]: i }))}
              style={{
                width: "100%", padding: "13px 16px",
                borderRadius: 12, border: `2px solid ${isSelected ? "var(--color-primary)" : "var(--color-border)"}`,
                background: isSelected ? "var(--color-primary)12" : "#fff",
                cursor: "pointer", fontFamily: "var(--font-family)",
                fontSize: 19, fontWeight: isSelected ? 700 : 500,
                color: isSelected ? "var(--color-primary)" : "var(--color-text)",
                textAlign: "left",
                display: "flex", alignItems: "center", gap: 12,
                transition: "all 0.15s",
              }}
            >
              <span style={{
                width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                border: `2px solid ${isSelected ? "var(--color-primary)" : "var(--color-border)"}`,
                background: isSelected ? "var(--color-primary)" : "#fff",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 19, fontWeight: 700,
                color: isSelected ? "#fff" : "var(--color-text-light)",
              }}>
                {["A", "B", "C", "D"][i]}
              </span>
              {choice}
            </button>
          );
        })}
      </div>

      {/* 問題ナビゲーション（ドット） */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 5, justifyContent: "center", marginBottom: 16 }}>
        {questions.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIdx(i)}
            style={{
              width: 22, height: 22, borderRadius: "50%", border: "none",
              background: i === currentIdx ? "var(--color-primary)" : answers[i] !== undefined ? "var(--color-accent)60" : "var(--color-border)",
              cursor: "pointer", transition: "all 0.15s",
            }}
          />
        ))}
      </div>

      {/* 前後ボタン */}
      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={() => setCurrentIdx(i => Math.max(0, i - 1))}
          disabled={currentIdx === 0}
          style={{ flex: 1, padding: "12px", borderRadius: 12, border: "1px solid var(--color-border)", background: "#fff", cursor: currentIdx === 0 ? "default" : "pointer", fontFamily: "var(--font-family)", fontSize: 19, fontWeight: 600, color: "var(--color-text-light)", opacity: currentIdx === 0 ? 0.4 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
        >
          <ChevronLeft size={15} />前へ
        </button>
        {currentIdx < questions.length - 1 ? (
          <button
            onClick={() => setCurrentIdx(i => i + 1)}
            style={{ flex: 2, padding: "12px", borderRadius: 12, border: "none", background: "var(--color-primary)", color: "#fff", fontFamily: "var(--font-family)", fontSize: 19, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
          >
            次へ<ChevronRight size={15} />
          </button>
        ) : (
          <button
            onClick={submitExam}
            style={{ flex: 2, padding: "12px", borderRadius: 12, border: "none", background: answered === questions.length ? "var(--color-accent)" : "var(--color-secondary)", color: "#fff", fontFamily: "var(--font-family)", fontSize: 19, fontWeight: 700, cursor: "pointer" }}
          >
            {answered === questions.length ? "採点する" : `採点する（未解答${questions.length - answered}問）`}
          </button>
        )}
      </div>
    </div>
  );
}

// ============================================================
// 結果画面
// ============================================================

function ResultScreen({ questions, answers, mode, onUpdateData, appData, onRetry, onHome }) {
  const [showReview, setShowReview] = useState(false);

  const score = questions.filter((q, i) => answers[i] === q.answer).length;
  const total = questions.length;
  const pct = Math.round((score / total) * 100);
  const passed = pct >= 60;

  // タブ別集計
  const tabStats = {};
  questions.forEach((q, i) => {
    const t = q.sourceTab;
    if (!tabStats[t]) tabStats[t] = { label: q.sourceLabel, color: TAB_COLOR[t], correct: 0, total: 0 };
    tabStats[t].total++;
    if (answers[i] === q.answer) tabStats[t].correct++;
  });

  // testHistory に保存
  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    onUpdateData({
      testHistory: [
        ...(appData.testHistory || []),
        { date: today, tab: "mockexam", section: mode.id, score, total, pct },
      ],
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="fade-in">
      {/* スコア */}
      <div style={{
        background: passed
          ? "linear-gradient(135deg, var(--color-accent)20, var(--color-accent)08)"
          : "linear-gradient(135deg, var(--color-warning)20, var(--color-warning)08)",
        borderRadius: 20, padding: "28px 24px", textAlign: "center", marginBottom: 16,
        border: `1px solid ${passed ? "var(--color-accent)40" : "var(--color-warning)40"}`,
      }}>
        <div style={{ fontSize: 19, fontWeight: 700, color: "var(--color-text-light)", marginBottom: 8 }}>
          {mode.label} 結果
        </div>
        <div style={{ fontSize: 52, fontWeight: 700, color: passed ? "var(--color-accent)" : "var(--color-warning)", lineHeight: 1.1, marginBottom: 4 }}>
          {pct}<span style={{ fontSize: 24 }}>%</span>
        </div>
        <div style={{ fontSize: 19, fontWeight: 700, marginBottom: 12 }}>
          {score} / {total} 問正解
        </div>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          padding: "6px 20px", borderRadius: 999,
          background: passed ? "var(--color-accent)" : "var(--color-warning)",
          color: "#fff", fontSize: 20, fontWeight: 700,
        }}>
          {passed ? <CheckCircle size={16} /> : <XCircle size={16} />}
          {passed ? "合格ライン達成！" : "要復習（60%未満）"}
        </div>
      </div>

      {/* タブ別内訳 */}
      <div style={{ background: "#fff", borderRadius: 14, border: "1px solid var(--color-border)", padding: "14px", marginBottom: 12, boxShadow: "var(--shadow-sm)" }}>
        <div style={{ fontSize: 19, fontWeight: 700, marginBottom: 12 }}>分野別 正解率</div>
        {Object.values(tabStats).map(({ label, color, correct, total: t }) => {
          const p = Math.round((correct / t) * 100);
          return (
            <div key={label} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 20, fontWeight: 600, color }}>{label}</span>
                <span style={{ fontSize: 20, fontWeight: 700 }}>{correct}/{t}（{p}%）</span>
              </div>
              <div style={{ height: 7, borderRadius: 999, background: "var(--color-border)", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${p}%`, background: color, borderRadius: 999, transition: "width 0.8s" }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* 間違い一覧 */}
      <button
        onClick={() => setShowReview(r => !r)}
        style={{
          width: "100%", padding: "12px", borderRadius: 12,
          border: "1px solid var(--color-border)", background: "#fff",
          fontFamily: "var(--font-family)", fontSize: 19, fontWeight: 600,
          color: "var(--color-text)", cursor: "pointer", marginBottom: 8,
          display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
        }}
      >
        {showReview ? "間違い一覧を閉じる" : `間違い一覧を確認（${total - score}問）`}
      </button>

      {showReview && (
        <div className="fade-in" style={{ marginBottom: 12 }}>
          {questions.map((q, i) => {
            const userAns = answers[i];
            const correct = userAns === q.answer;
            if (correct) return null;
            return (
              <div key={i} style={{
                background: "#fff", borderRadius: 12,
                border: "1px solid var(--color-warning)40",
                padding: "12px 14px", marginBottom: 8,
              }}>
                <div style={{ fontSize: 19, color: TAB_COLOR[q.sourceTab] || "var(--color-primary)", fontWeight: 700, marginBottom: 6 }}>
                  Q{i + 1}. {q.sourceLabel}
                </div>
                <div style={{ fontSize: 20, fontWeight: 600, marginBottom: 8, lineHeight: 1.6 }}>{q.question}</div>
                <div style={{ fontSize: 19, color: "var(--color-warning)", marginBottom: 4 }}>
                  あなたの答え: {userAns !== undefined ? q.choices[userAns] : "未解答"}
                </div>
                <div style={{ fontSize: 19, color: "var(--color-accent)", fontWeight: 700, marginBottom: 6 }}>
                  正解: {q.choices[q.answer]}
                </div>
                {q.explanation && (
                  <div style={{ fontSize: 19, color: "var(--color-text-light)", lineHeight: 1.6, background: "var(--color-card-bg)", borderRadius: 8, padding: "8px" }}>
                    {q.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* アクションボタン */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <button
          onClick={onRetry}
          style={{ width: "100%", padding: "13px", borderRadius: 12, border: "none", background: "var(--color-primary)", color: "#fff", fontFamily: "var(--font-family)", fontSize: 19, fontWeight: 700, cursor: "pointer" }}
        >
          もう一度受ける
        </button>
        <button
          onClick={onHome}
          style={{ width: "100%", padding: "13px", borderRadius: 12, border: "1px solid var(--color-border)", background: "#fff", fontFamily: "var(--font-family)", fontSize: 19, fontWeight: 600, cursor: "pointer", color: "var(--color-text-light)" }}
        >
          ホームに戻る
        </button>
      </div>
    </div>
  );
}

// ============================================================
// メインコンポーネント
// ============================================================

export default function MockExamTab({ appData, onUpdateData, onNavigate }) {
  const [phase, setPhase] = useState("setup"); // "setup" | "exam" | "result"
  const [mode, setMode] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});

  const handleStart = (selectedMode) => {
    const shuffled = shuffle(ALL_QUIZZES).slice(0, selectedMode.questionCount);
    setMode(selectedMode);
    setQuestions(shuffled);
    setAnswers({});
    setPhase("exam");
  };

  const handleComplete = (finalAnswers) => {
    setAnswers(finalAnswers);
    setPhase("result");
  };

  const handleRetry = () => {
    setPhase("setup");
    setMode(null);
    setQuestions([]);
    setAnswers({});
  };

  return (
    <div className="fade-in" style={{ paddingBottom: 24 }}>
      {phase === "setup" && (
        <SetupScreen onStart={handleStart} onBack={() => onNavigate("home")} />
      )}
      {phase === "exam" && mode && (
        <ExamScreen questions={questions} mode={mode} onComplete={handleComplete} />
      )}
      {phase === "result" && mode && (
        <ResultScreen
          questions={questions}
          answers={answers}
          mode={mode}
          onUpdateData={onUpdateData}
          appData={appData}
          onRetry={handleRetry}
          onHome={() => onNavigate("home")}
        />
      )}
    </div>
  );
}
