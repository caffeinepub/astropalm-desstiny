import { motion } from "motion/react";
import type React from "react";
import { GRID_LAYOUT, getCellDisplay } from "../utils/numerology";

interface NatalChartProps {
  cellCounts: Record<number, number>;
  basicNumber: number;
  destinyNumber: number;
  animate?: boolean;
  dasaNumber?: number;
  yearNumber?: number;
  compact?: boolean;
  yearLabel?: string;
  monthNumber?: number;
  dayNumber?: number;
  hideHeader?: boolean;
}

// Color constants
const GREEN_HEADER = "#2E8B57";
const MONTH_COLOR = "#7c3aed";
const DAY_COLOR = "#ec4899";
const BASIC_COLOR = "#dc2626";
const DESTINY_COLOR = "#16a34a";
const NATAL_COLOR = "#000000";
const DASA_COLOR = "#2563eb";
const YEAR_COLOR = "#ffffff";
const YEAR_BG = "rgba(22,163,74,0.88)";
const BORDER_COLOR = "#c8a96e";
const CELL_BG = "#ffffff";

function CellWatermark({ compact }: { compact: boolean }) {
  const wStyle: React.CSSProperties = {
    fontSize: compact ? "7px" : "9px",
    color: "rgba(150,120,60,0.18)",
    fontFamily: "Outfit, sans-serif",
    fontWeight: 600,
    whiteSpace: "nowrap" as const,
    letterSpacing: "0.08em",
  };

  return (
    <span
      aria-hidden
      className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
      style={{
        transform: "rotate(-28deg)",
        userSelect: "none",
        zIndex: 0,
      }}
    >
      <span style={wStyle}>Viku Kharb</span>
    </span>
  );
}

export function NatalChart({
  cellCounts,
  basicNumber,
  destinyNumber,
  animate: shouldAnimate = true,
  dasaNumber,
  yearNumber,
  compact = false,
  yearLabel,
  monthNumber,
  dayNumber,
  hideHeader = false,
}: NatalChartProps) {
  const cellMinHeight = compact ? "44px" : "72px";

  return (
    <div
      data-ocid="natal_chart.panel"
      className="w-full"
      style={{
        background: CELL_BG,
        border: `1px solid ${BORDER_COLOR}`,
      }}
    >
      {!hideHeader &&
        (yearLabel ? (
          <div
            className="py-1.5 px-3 text-center font-display font-bold tracking-[0.12em] text-xs uppercase"
            style={{ background: GREEN_HEADER, color: "#ffffff" }}
          >
            {yearLabel}
          </div>
        ) : (
          <div
            className="py-2.5 px-4 text-center font-display font-bold tracking-[0.2em] text-sm uppercase"
            style={{ background: GREEN_HEADER, color: "#ffffff" }}
          >
            NATAL CHART
          </div>
        ))}

      <div
        className="grid grid-cols-3"
        style={{
          border: `1.5px solid ${BORDER_COLOR}`,
          borderTop: hideHeader || !yearLabel ? undefined : "none",
        }}
      >
        {GRID_LAYOUT.flat().map((cellNum, idx) => {
          const count = cellCounts[cellNum] ?? 0;
          const display = getCellDisplay(cellNum, cellCounts);

          const isBasic = cellNum === basicNumber;
          const isDestiny = cellNum === destinyNumber;
          const isDasa = dasaNumber !== undefined && cellNum === dasaNumber;
          const isYear = yearNumber !== undefined && cellNum === yearNumber;
          const isMonth = monthNumber !== undefined && cellNum === monthNumber;
          const isDay = dayNumber !== undefined && cellNum === dayNumber;

          const row = Math.floor(idx / 3);
          const col = idx % 3;

          return (
            <div
              key={cellNum}
              className="relative flex items-center justify-center overflow-hidden"
              style={{
                minHeight: cellMinHeight,
                background: CELL_BG,
                borderRight: col < 2 ? `1px solid ${BORDER_COLOR}` : "none",
                borderBottom: row < 2 ? `1px solid ${BORDER_COLOR}` : "none",
              }}
            >
              <CellWatermark compact={compact} />

              <div
                className="relative z-10 flex flex-col items-center justify-center gap-0.5"
                style={{ padding: compact ? "2px" : "4px" }}
              >
                {count > 0 && (
                  <motion.span
                    initial={shouldAnimate ? { scale: 0.5, opacity: 0 } : false}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      delay: shouldAnimate ? idx * 0.05 : 0,
                      type: "spring",
                      stiffness: 300,
                    }}
                    className="font-display font-bold leading-none"
                    style={{
                      fontSize: compact ? "14px" : "20px",
                      color: isBasic
                        ? BASIC_COLOR
                        : isDestiny
                          ? DESTINY_COLOR
                          : NATAL_COLOR,
                    }}
                  >
                    {display}
                  </motion.span>
                )}

                {isDasa && (
                  <span
                    className="font-display font-bold leading-none"
                    style={{
                      fontSize: compact ? "17px" : "25px",
                      color: DASA_COLOR,
                    }}
                  >
                    {dasaNumber}
                  </span>
                )}

                {isYear && (
                  <span
                    className="font-display font-bold leading-none rounded-sm px-0.5"
                    style={{
                      fontSize: compact ? "20px" : "30px",
                      color: YEAR_COLOR,
                      background: YEAR_BG,
                    }}
                  >
                    {yearNumber}
                  </span>
                )}

                {isMonth && (
                  <span
                    className="font-display font-bold leading-none"
                    style={{
                      fontSize: compact ? "10px" : "14px",
                      color: MONTH_COLOR,
                    }}
                  >
                    {monthNumber}
                  </span>
                )}

                {isDay && (
                  <span
                    className="font-display font-bold leading-none"
                    style={{
                      fontSize: compact ? "11px" : "15px",
                      color: DAY_COLOR,
                      fontStyle: "italic",
                    }}
                  >
                    {dayNumber}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
