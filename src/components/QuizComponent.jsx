/*
  QuizComponent — 歴史検定対応の問題コンポーネント
  対応形式: FOUR_CHOICE / CHRONOLOGICAL / PERSON_INPUT / YEAR_INPUT
*/

import { useState, useCallback } from "react";
import { Check, X, ChevronRight, RefreshCw, Award, Clock } from "lucide-react";

// ============================================================
// スタイル
// ============================================================

const S = {
  wrap: { display: "flex", flexDirection: "column", gap: 12 },

  header: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    marginBottom: 4,
  },

  progress: (pct) => ({
    height: 6, borderRadius: 999,
    background: "var(--color-border)", overflow: "hidden", marginBottom: 12,
  }),

  progressFill: (pct) => ({
    height: "100%", width: `${pct}%`, borderRadius: 999,
    background: "var(--color-primary)", transition: "width 0.4s ease",
  }),

  question: {
    background: "#fff",
    borderRadius: 16,
    border: "1px solid var(--color-border)",
    padding: "16px",
    boxShadow: "var(--shadow-sm)",
  },

  qLabel: {
    fontSize: 19, fontWeight: 700,
    color: "var(--color-primary)",
    background: "var(--color-primary)18",
    padding: "2px 10px",
    borderRadius: 999, display: "inline-block", marginBottom: 10,
  },

  qText: { fontSize: 19, fontWeight: 600, lineHeight: 1.7, color: "var(--color-text)" },

  choiceBtn: (state) => ({
    width: "100%", textAlign: "left",
    padding: "12px 14px",
    borderRadius: 10,
    border: `2px solid ${
      state === "correct" ? "var(--color-accent)" :
      state === "wrong"   ? "var(--color-warning)" :
      state === "reveal"  ? "var(--color-border)" :
      "var(--color-border)"
    }`,
    background:
      state === "correct" ? "#8FBC8F22" :
      state === "wrong"   ? "#FF8FAB22" :
      state === "reveal"  ? "#F8F9FD" :
      "#fff",
    cursor: state ? "default" : "pointer",
    fontFamily: "var(--font-family)",
    fontSize: 20, fontWeight: 600,
    color: "var(--color-text)",
    display: "flex", alignItems: "center", gap: 10,
    transition: "background 0.15s, border-color 0.15s",
    marginBottom: 8,
  }),

  iconCircle: (correct) => ({
    width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
    display: "flex", alignItems: "center", justifyContent: "center",
    background: correct ? "var(--color-accent)" : "var(--color-warning)",
    color: "#fff",
  }),

  explanation: (correct) => ({
    marginTop: 12,
    padding: "12px 14px",
    borderRadius: 10,
    background: correct ? "#8FBC8F15" : "#FF8FAB15",
    border: `1px solid ${correct ? "var(--color-accent)" : "var(--color-warning)"}`,
    fontSize: 19, lineHeight: 1.7,
    color: "var(--color-text)",
  }),

  nextBtn: {
    display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
    width: "100%", padding: "12px",
    borderRadius: 12, border: "none",
    background: "var(--color-primary)", color: "#fff",
    fontFamily: "var(--font-family)", fontSize: 20, fontWeight: 700,
    cursor: "pointer", marginTop: 4,
    transition: "opacity 0.2s",
  },

  resultCard: {
    background: "#fff", borderRadius: 16,
    border: "1px solid var(--color-border)",
    padding: "24px 20px", textAlign: "center",
    boxShadow: "var(--shadow-md)",
  },

  // 年代順問題
  chronoItem: (dragging) => ({
    display: "flex", alignItems: "center", gap: 10,
    padding: "10px 12px", borderRadius: 10,
    border: "1px solid var(--color-border)",
    background: "#fff", marginBottom: 8,
    cursor: "grab", fontSize: 19, fontWeight: 600,
    boxShadow: "var(--shadow-sm)",
  }),

  chronoNum: {
    width: 24, height: 24, borderRadius: "50%",
    background: "var(--color-primary)22",
    color: "var(--color-primary)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 20, fontWeight: 700, flexShrink: 0,
  },
};

// ============================================================
// 四択問題
// ============================================================

function FourChoice({ quiz, onAnswer }) {
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);

  const handleSelect = useCallback((i) => {
    if (answered) return;
    setSelected(i);
    setAnswered(true);
    onAnswer(i === quiz.answer);
  }, [answered, quiz.answer, onAnswer]);

  const getState = (i) => {
    if (!answered) return null;
    if (i === quiz.answer) return "correct";
    if (i === selected) return "wrong";
    return "reveal";
  };

  const correct = selected === quiz.answer;

  return (
    <div>
      <div style={{ marginTop: 14 }}>
        {quiz.choices.map((c, i) => (
          <button
            key={i}
            style={S.choiceBtn(getState(i))}
            onClick={() => handleSelect(i)}
            disabled={answered}
          >
            {answered && (i === quiz.answer || i === selected) && (
              <div style={S.iconCircle(i === quiz.answer)}>
                {i === quiz.answer
                  ? <Check size={13} />
                  : <X size={13} />
                }
              </div>
            )}
            <span>{c}</span>
          </button>
        ))}
      </div>

      {answered && (
        <div style={S.explanation(correct)} className="fade-in">
          <div style={{ fontWeight: 700, marginBottom: 4, color: correct ? "var(--color-accent)" : "var(--color-warning)" }}>
            {correct ? "✓ 正解！" : "✗ 不正解"}
          </div>
          {quiz.explanation}
        </div>
      )}
    </div>
  );
}

// ============================================================
// 年代順並べ替え問題
// ============================================================

function ChronologicalQuiz({ quiz, onAnswer }) {
  const [order, setOrder] = useState(() => quiz.items.map((_, i) => i));
  const [answered, setAnswered] = useState(false);
  const [dragIdx, setDragIdx] = useState(null);

  const moveUp = (i) => {
    if (i === 0 || answered) return;
    const next = [...order];
    [next[i - 1], next[i]] = [next[i], next[i - 1]];
    setOrder(next);
  };
  const moveDown = (i) => {
    if (i === order.length - 1 || answered) return;
    const next = [...order];
    [next[i], next[i + 1]] = [next[i + 1], next[i]];
    setOrder(next);
  };

  const handleCheck = () => {
    const correct = order.every((v, i) => v === quiz.answer[i]);
    setAnswered(true);
    onAnswer(correct);
  };

  const isCorrect = answered && order.every((v, i) => v === quiz.answer[i]);

  return (
    <div style={{ marginTop: 14 }}>
      <div style={{ fontSize: 20, color: "var(--color-text-light)", marginBottom: 10 }}>
        ▲▼ を押して並び替えてください
      </div>

      {order.map((itemIdx, pos) => (
        <div key={itemIdx} style={S.chronoItem()}>
          <div style={S.chronoNum}>{pos + 1}</div>
          <span style={{ flex: 1 }}>{quiz.items[itemIdx]}</span>
          {!answered && (
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <button
                onClick={() => moveUp(pos)}
                disabled={pos === 0}
                style={{ background: "none", border: "none", cursor: pos === 0 ? "default" : "pointer", opacity: pos === 0 ? 0.3 : 1, fontSize: 20, padding: "2px 6px" }}
              >▲</button>
              <button
                onClick={() => moveDown(pos)}
                disabled={pos === order.length - 1}
                style={{ background: "none", border: "none", cursor: pos === order.length - 1 ? "default" : "pointer", opacity: pos === order.length - 1 ? 0.3 : 1, fontSize: 20, padding: "2px 6px" }}
              >▼</button>
            </div>
          )}
          {answered && (
            <div style={S.iconCircle(order[pos] === quiz.answer[pos])}>
              {order[pos] === quiz.answer[pos] ? <Check size={13} /> : <X size={13} />}
            </div>
          )}
        </div>
      ))}

      {!answered && (
        <button style={S.nextBtn} onClick={handleCheck}>
          並び替え完了・確認する
        </button>
      )}

      {answered && (
        <div style={S.explanation(isCorrect)} className="fade-in">
          <div style={{ fontWeight: 700, marginBottom: 4, color: isCorrect ? "var(--color-accent)" : "var(--color-warning)" }}>
            {isCorrect ? "✓ 正解！" : "✗ 不正解"}
          </div>
          {quiz.explanation}
        </div>
      )}
    </div>
  );
}

// ============================================================
// 記述式（用語・人物・年号）
// ============================================================

function InputQuiz({ quiz, onAnswer }) {
  const [value, setValue] = useState("");
  const [answered, setAnswered] = useState(false);

  const handleCheck = () => {
    if (!value.trim()) return;
    const correct = value.trim() === quiz.answer || (Array.isArray(quiz.answer) && quiz.answer.includes(value.trim()));
    setAnswered(true);
    onAnswer(correct);
  };

  const isCorrect = answered && (value.trim() === quiz.answer || (Array.isArray(quiz.answer) && quiz.answer.includes(value.trim())));

  return (
    <div style={{ marginTop: 14 }}>
      <input
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={e => { if (e.key === "Enter") handleCheck(); }}
        disabled={answered}
        placeholder="答えを入力..."
        style={{
          width: "100%", padding: "12px 14px",
          borderRadius: 10,
          border: answered
            ? `2px solid ${isCorrect ? "var(--color-accent)" : "var(--color-warning)"}`
            : "1px solid var(--color-border)",
          fontFamily: "var(--font-family)", fontSize: 19,
          outline: "none", background: "#fff",
          color: "var(--color-text)",
          marginBottom: 10,
        }}
      />
      {!answered && (
        <button style={S.nextBtn} onClick={handleCheck}>
          解答する
        </button>
      )}
      {answered && (
        <div style={S.explanation(isCorrect)} className="fade-in">
          <div style={{ fontWeight: 700, marginBottom: 4, color: isCorrect ? "var(--color-accent)" : "var(--color-warning)" }}>
            {isCorrect ? "✓ 正解！" : `✗ 正解は「${Array.isArray(quiz.answer) ? quiz.answer[0] : quiz.answer}」`}
          </div>
          {quiz.explanation}
        </div>
      )}
    </div>
  );
}

// ============================================================
// 結果画面
// ============================================================

function QuizResult({ results, total, onRetry, onFinish }) {
  const score = results.filter(Boolean).length;
  const pct = Math.round((score / total) * 100);
  const passed = pct >= 60;

  return (
    <div style={S.resultCard} className="scale-in">
      <div style={{ fontSize: 48, marginBottom: 8 }}>
        {pct >= 80 ? "🎉" : pct >= 60 ? "✨" : "📚"}
      </div>
      <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>
        {score} / {total} 問正解
      </div>
      <div style={{
        fontSize: 32, fontWeight: 700, marginBottom: 8,
        color: pct >= 80 ? "var(--color-accent)" : pct >= 60 ? "var(--color-primary)" : "var(--color-warning)"
      }}>
        {pct}点
      </div>
      <div style={{
        display: "inline-block", padding: "4px 16px", borderRadius: 999,
        background: passed ? "var(--color-accent)20" : "var(--color-warning)20",
        color: passed ? "var(--color-accent)" : "var(--color-warning)",
        fontWeight: 700, fontSize: 20, marginBottom: 20,
      }}>
        {pct >= 80 ? "優秀！" : pct >= 60 ? "合格ライン！" : "もう少し復習しよう"}
      </div>

      {/* 問題別結果 */}
      <div style={{ display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap", marginBottom: 20 }}>
        {results.map((r, i) => (
          <div
            key={i}
            style={{
              width: 32, height: 32, borderRadius: "50%",
              background: r ? "var(--color-accent)" : "var(--color-warning)",
              color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 19, fontWeight: 700,
            }}
          >
            {i + 1}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
        <button
          onClick={onRetry}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "10px 20px", borderRadius: 10,
            border: "1px solid var(--color-border)",
            background: "#fff", cursor: "pointer",
            fontFamily: "var(--font-family)", fontSize: 20, fontWeight: 600,
            color: "var(--color-text)",
          }}
        >
          <RefreshCw size={15} />
          もう一度
        </button>
        <button
          onClick={onFinish}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "10px 20px", borderRadius: 10, border: "none",
            background: "var(--color-primary)", color: "#fff",
            cursor: "pointer", fontFamily: "var(--font-family)",
            fontSize: 20, fontWeight: 700,
          }}
        >
          完了
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}

// ============================================================
// メインの QuizComponent
// ============================================================

export default function QuizComponent({ quizzes, sectionKey, onComplete }) {
  const [current, setCurrent] = useState(0);
  const [results, setResults] = useState([]);
  const [answered, setAnswered] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const quiz = quizzes[current];
  const total = quizzes.length;

  const handleAnswer = useCallback((correct) => {
    setAnswered(true);
    setResults(prev => [...prev, correct]);
  }, []);

  const handleNext = () => {
    if (current + 1 >= total) {
      setShowResult(true);
    } else {
      setCurrent(c => c + 1);
      setAnswered(false);
    }
  };

  const handleRetry = () => {
    setCurrent(0);
    setResults([]);
    setAnswered(false);
    setShowResult(false);
  };

  const handleFinish = () => {
    const score = results.filter(Boolean).length;
    const pct = Math.round((score / total) * 100);
    onComplete?.({ sectionKey, score, total, pct, results });
  };

  if (showResult) {
    return (
      <QuizResult
        results={results}
        total={total}
        onRetry={handleRetry}
        onFinish={handleFinish}
      />
    );
  }

  const typeLabel = {
    FOUR_CHOICE: "四択問題",
    CHRONOLOGICAL: "年代順",
    PERSON_INPUT: "人物記述",
    YEAR_INPUT: "年号記述",
    CAUSE_EFFECT: "因果関係",
  }[quiz.type] || "問題";

  return (
    <div style={S.wrap} className="fade-in">
      {/* 進捗バー */}
      <div>
        <div style={S.header}>
          <span style={{ fontSize: 20, color: "var(--color-text-light)" }}>
            問 {current + 1} / {total}
          </span>
          <span style={{ fontSize: 20, color: "var(--color-text-light)" }}>
            正解 {results.filter(Boolean).length}問
          </span>
        </div>
        <div style={S.progress()}>
          <div style={S.progressFill(((current) / total) * 100)} />
        </div>
      </div>

      {/* 問題カード */}
      <div style={S.question}>
        <div style={S.qLabel}>{typeLabel}</div>
        <div style={S.qText}>{quiz.question}</div>

        {quiz.type === "FOUR_CHOICE" && (
          <FourChoice key={quiz.id} quiz={quiz} onAnswer={handleAnswer} />
        )}
        {quiz.type === "CHRONOLOGICAL" && (
          <ChronologicalQuiz key={quiz.id} quiz={quiz} onAnswer={handleAnswer} />
        )}
        {(quiz.type === "PERSON_INPUT" || quiz.type === "YEAR_INPUT") && (
          <InputQuiz key={quiz.id} quiz={quiz} onAnswer={handleAnswer} />
        )}

        {/* 次へボタン（回答後に表示） */}
        {answered && (
          <button style={{ ...S.nextBtn, marginTop: 12 }} onClick={handleNext} className="fade-in">
            {current + 1 >= total ? "結果を見る" : "次の問題へ"}
            <ChevronRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
