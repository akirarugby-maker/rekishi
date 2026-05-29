import { useRef, useCallback } from "react";
import { CalendarDays } from "lucide-react";
import {
  JP_EVENTS, WD_EVENTS,
  NIHONSHI_ERAS_TL, SEKAISHI_ERAS_TL,
  YEAR_MARKERS, ERA_JUMPS,
  yearToX, TL_TOTAL_W,
} from "../data/nenpyoData.js";

// ─── Layout (px from top of inner content div) ──────────────
const C_H        = 360;
const JP_ERA_TOP = 0;
const JP_ERA_H   = 16;
const JP_L_TOP   = [108, 66, 24];   // lane[0]=near axis, lane[1]=mid, lane[2]=far
const CARD_H     = 36;
const AXIS_TOP   = 152;
const AXIS_H     = 10;
const AXIS_CY    = AXIS_TOP + AXIS_H / 2;
const WD_L_TOP   = [170, 212, 254]; // lane[0]=near axis
const WD_ERA_TOP = 298;
const WD_ERA_H   = 16;

// Card colors by side
const JP_COLOR   = "#B5451B";
const JP_BG_3    = "#FFF0EB";
const JP_BG_2    = "#FDF8F6";
const WD_COLOR   = "#1B5B9C";
const WD_BG_3    = "#EBF3FF";
const WD_BG_2    = "#F5F9FD";

// ─── Sub-components ─────────────────────────────────────────

function ErasBand({ eras, top, height }) {
  return eras.map(era => {
    const x0 = yearToX(era.start);
    const x1 = yearToX(era.end);
    const w  = x1 - x0;
    return (
      <div
        key={era.name}
        style={{
          position: "absolute",
          left: x0,
          top,
          width: w,
          height,
          background: era.color,
          borderRight: "1px solid rgba(255,255,255,0.8)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {w > 30 && (
          <span style={{
            fontSize: 9,
            fontWeight: 600,
            whiteSpace: "nowrap",
            color: "#555",
            padding: "0 2px",
          }}>
            {era.name}
          </span>
        )}
      </div>
    );
  });
}

function AxisAndMarkers() {
  return (
    <>
      {/* Axis line */}
      <div style={{
        position: "absolute",
        left: 0,
        top: AXIS_TOP,
        width: TL_TOTAL_W,
        height: AXIS_H,
        background: "linear-gradient(90deg, #ccc, #999)",
      }} />

      {/* Year markers */}
      {YEAR_MARKERS.map(y => {
        const x = yearToX(y);
        const isCentury = y % 100 === 0;
        const label = y === 0 ? "AD/BC" : y < 0 ? `BC${-y}` : `${y}`;
        return (
          <g key={y}>
            {/* Tick */}
            <div style={{
              position: "absolute",
              left: x,
              top: AXIS_TOP - 4,
              width: 1,
              height: AXIS_H + 8,
              background: "#999",
            }} />
            {/* Label */}
            <div style={{
              position: "absolute",
              left: x,
              top: AXIS_TOP + AXIS_H + 2,
              transform: "translateX(-50%)",
              fontSize: 9,
              color: "#777",
              whiteSpace: "nowrap",
              fontWeight: isCentury ? 700 : 400,
              background: "rgba(255,255,255,0.7)",
              padding: "0 1px",
              borderRadius: 2,
            }}>
              {label}
            </div>
          </g>
        );
      })}
    </>
  );
}

function EventCard({ ev, side, onNavigate }) {
  const isJp  = side === "jp";
  const laneY = isJp ? JP_L_TOP[ev.lane] : WD_L_TOP[ev.lane];
  const cx    = ev.cx;
  const left  = cx - ev.w / 2;
  const color = isJp ? JP_COLOR : WD_COLOR;
  const bg    = isJp
    ? (ev.imp >= 3 ? JP_BG_3 : JP_BG_2)
    : (ev.imp >= 3 ? WD_BG_3 : WD_BG_2);

  const handleClick = (e) => {
    e.stopPropagation();
    if (isJp && ev.eraId) {
      onNavigate("nihonshi", { eraId: ev.eraId });
    } else if (!isJp && ev.sectionId) {
      onNavigate("sekaishi", { sectionId: ev.sectionId });
    }
  };

  // Connecting line
  const lineX = cx - 0.5;
  const lineTop    = isJp ? laneY + CARD_H : AXIS_TOP + AXIS_H;
  const lineBottom = isJp ? AXIS_TOP        : laneY;
  const lineH      = lineBottom - lineTop;

  return (
    <>
      {/* Connecting line */}
      {lineH > 0 && (
        <div style={{
          position: "absolute",
          left: lineX,
          top: lineTop,
          width: 1,
          height: lineH,
          background: `${color}50`,
          pointerEvents: "none",
        }} />
      )}
      {/* Dot on axis */}
      <div style={{
        position: "absolute",
        left: cx - 3,
        top: isJp ? AXIS_TOP - 2 : AXIS_TOP + AXIS_H - 3,
        width: 6,
        height: 6,
        borderRadius: "50%",
        background: ev.imp >= 3 ? color : `${color}99`,
        pointerEvents: "none",
        zIndex: 2,
      }} />
      {/* Card — clickable */}
      <div
        onClick={handleClick}
        style={{
          position: "absolute",
          left,
          top: laneY,
          width: ev.w,
          height: CARD_H,
          background: bg,
          border: `1.5px solid ${color}40`,
          borderLeft: `3px solid ${ev.imp >= 3 ? color : color + "80"}`,
          borderRadius: "0 6px 6px 0",
          padding: "0 5px 0 4px",
          fontSize: ev.imp >= 3 ? 10 : 9.5,
          fontWeight: ev.imp >= 3 ? 700 : 500,
          color: "#333",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          lineHeight: 1.25,
          overflow: "hidden",
          boxShadow: ev.imp >= 3 ? `0 1px 4px ${color}20` : "none",
          zIndex: 3,
          cursor: "pointer",
        }}
        title={`${ev.label} — タップして詳細へ`}
      >
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
          {ev.label}
        </span>
        <span style={{ fontSize: 8, color: `${color}cc`, flexShrink: 0, marginLeft: 2 }}>▶</span>
      </div>
    </>
  );
}

// ─── Main component ──────────────────────────────────────────
export default function NenpyoTab({ onNavigate }) {
  const scrollRef   = useRef(null);
  const isDragging  = useRef(false);
  const didDrag     = useRef(false); // true if mouse moved enough to be a drag (not a click)
  const startX      = useRef(0);
  const scrollLeft  = useRef(0);

  const handleMouseDown = useCallback((e) => {
    if (e.button !== 0) return;
    isDragging.current = true;
    didDrag.current    = false;
    startX.current     = e.clientX;
    scrollLeft.current = scrollRef.current.scrollLeft;
    scrollRef.current.style.cursor = "grabbing";
    e.preventDefault();
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging.current) return;
    const dx = e.clientX - startX.current;
    if (Math.abs(dx) > 4) didDrag.current = true;
    scrollRef.current.scrollLeft = scrollLeft.current - dx;
  }, []);

  const stopDrag = useCallback(() => {
    isDragging.current = false;
    if (scrollRef.current) scrollRef.current.style.cursor = "grab";
  }, []);

  // Suppress card click when drag just ended
  const handleContainerClick = useCallback((e) => {
    if (didDrag.current) { didDrag.current = false; e.stopPropagation(); }
  }, []);

  const jumpToYear = useCallback((year) => {
    if (!scrollRef.current) return;
    const x = yearToX(year);
    const viewW = scrollRef.current.clientWidth;
    scrollRef.current.scrollLeft = Math.max(0, x - viewW * 0.2);
  }, []);

  return (
    <div style={{ padding: "12px 0 20px", fontFamily: "var(--font-family)" }}>
      {/* Header */}
      <div style={{ padding: "0 16px 12px", display: "flex", alignItems: "center", gap: 8 }}>
        <CalendarDays size={20} color="var(--color-primary)" />
        <div>
          <div style={{ fontSize: 17, fontWeight: 800, color: "var(--color-text)" }}>
            日本史・世界史 対照年表
          </div>
          <div style={{ fontSize: 11, color: "var(--color-text-light)", marginTop: 2 }}>
            上段：日本史　下段：世界史　　★ = 試験頻出
          </div>
        </div>
      </div>

      {/* Era jump buttons */}
      <div style={{
        display: "flex",
        gap: 6,
        padding: "0 16px 12px",
        overflowX: "auto",
        WebkitOverflowScrolling: "touch",
      }}>
        {ERA_JUMPS.map(era => (
          <button
            key={era.label}
            onClick={() => jumpToYear(era.year)}
            style={{
              flexShrink: 0,
              padding: "5px 10px",
              fontSize: 11,
              fontWeight: 700,
              background: era.color,
              border: "1px solid rgba(0,0,0,0.12)",
              borderRadius: 20,
              cursor: "pointer",
              color: "#444",
              whiteSpace: "nowrap",
              fontFamily: "var(--font-family)",
            }}
          >
            {era.label}
          </button>
        ))}
      </div>

      {/* Legend */}
      <div style={{
        display: "flex",
        gap: 16,
        padding: "0 16px 10px",
        fontSize: 11,
        color: "var(--color-text-light)",
      }}>
        <span>
          <span style={{ color: JP_COLOR, fontWeight: 700 }}>■</span> 日本史
        </span>
        <span>
          <span style={{ color: WD_COLOR, fontWeight: 700 }}>■</span> 世界史
        </span>
        <span style={{ color: "#888" }}>← ドラッグ/スワイプで横スクロール　▶ カードをタップで詳細へ</span>
      </div>

      {/* Timeline scroll area */}
      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={stopDrag}
        onMouseLeave={stopDrag}
        onClick={handleContainerClick}
        style={{
          overflowX: "auto",
          overflowY: "hidden",
          WebkitOverflowScrolling: "touch",
          cursor: "grab",
          userSelect: "none",
          borderTop: "1px solid var(--color-border)",
          borderBottom: "1px solid var(--color-border)",
          background: "#fafafa",
        }}
      >
        <div style={{
          position: "relative",
          width: TL_TOTAL_W,
          height: C_H,
        }}>
          {/* JP era bands (top) */}
          <ErasBand eras={NIHONSHI_ERAS_TL} top={JP_ERA_TOP} height={JP_ERA_H} />

          {/* WD era bands (bottom) */}
          <ErasBand eras={SEKAISHI_ERAS_TL} top={WD_ERA_TOP} height={WD_ERA_H} />

          {/* Axis + year markers */}
          <AxisAndMarkers />

          {/* Japanese events */}
          {JP_EVENTS.map((ev, i) => (
            <EventCard key={`jp-${i}`} ev={ev} side="jp" onNavigate={onNavigate} />
          ))}

          {/* World events */}
          {WD_EVENTS.map((ev, i) => (
            <EventCard key={`wd-${i}`} ev={ev} side="wd" onNavigate={onNavigate} />
          ))}
        </div>
      </div>

      {/* Footer note */}
      <div style={{
        padding: "10px 16px 0",
        fontSize: 10.5,
        color: "var(--color-text-light)",
        lineHeight: 1.6,
      }}>
        ※ 時代によって横スケールが異なります（現代に近いほど拡大表示）。
        ★ のついたイベントは歴史検定頻出事項です。
      </div>
    </div>
  );
}
