import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import {
  GRID_LAYOUT,
  calculateDayNumber,
  calculateMonthCycle,
  getCellDisplay,
} from "../utils/numerology";

const GREEN_HEADER = "#2E8B57";
const BORDER_COLOR = "#c8a96e";
const CELL_BG = "#ffffff";
const BASIC_COLOR = "#dc2626";
const DESTINY_COLOR = "#16a34a";
const NATAL_COLOR = "#000000";
const DASA_COLOR = "#2563eb";
const YEAR_COLOR_TEXT = "#ffffff";
const YEAR_BG = "rgba(22,163,74,0.88)";
const MONTH_COLOR = "#7c3aed";
const DAY_COLOR = "#ec4899";

interface DownloadChartDialogProps {
  open: boolean;
  onClose: () => void;
  yearIter: number;
  day: number;
  month: number;
  birthYear: number;
  basicNumber: number;
  destinyNumber: number;
  natalCellCounts: Record<number, number>;
  dasaNumber: number;
  yearNumber: number;
}

function formatDate(date: Date): string {
  const d = date.getDate().toString().padStart(2, "0");
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
}

function enumerateDates(startDate: Date, endDate: Date): Date[] {
  const dates: Date[] = [];
  const current = new Date(startDate);
  while (current <= endDate) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

function drawMiniChart(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  cellCounts: Record<number, number>,
  basicNumber: number,
  destinyNumber: number,
  dasaNumber: number | undefined,
  yearNumber: number | undefined,
  monthNumber: number | undefined,
  dayNumber: number | undefined,
  headerLabel: string,
) {
  const headerH = 24;
  const gridH = h - headerH;
  const cellW = w / 3;
  const cellH = gridH / 3;

  // Header
  ctx.fillStyle = GREEN_HEADER;
  ctx.fillRect(x, y, w, headerH);
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 11px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(headerLabel, x + w / 2, y + headerH / 2);

  // Cells
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      const cellNum = GRID_LAYOUT[row][col];
      const cx = x + col * cellW;
      const cy = y + headerH + row * cellH;

      // Cell background
      ctx.fillStyle = CELL_BG;
      ctx.fillRect(cx, cy, cellW, cellH);

      // Watermark
      ctx.save();
      ctx.translate(cx + cellW / 2, cy + cellH / 2);
      ctx.rotate(-0.49);
      ctx.fillStyle = "rgba(150,120,60,0.12)";
      ctx.font = "7px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("Viku Kharb", 0, 0);
      ctx.restore();

      // Cell borders
      ctx.strokeStyle = BORDER_COLOR;
      ctx.lineWidth = 0.5;
      if (col < 2) {
        ctx.beginPath();
        ctx.moveTo(cx + cellW, cy);
        ctx.lineTo(cx + cellW, cy + cellH);
        ctx.stroke();
      }
      if (row < 2) {
        ctx.beginPath();
        ctx.moveTo(cx, cy + cellH);
        ctx.lineTo(cx + cellW, cy + cellH);
        ctx.stroke();
      }

      // Numbers
      const count = cellCounts[cellNum] ?? 0;
      const display = getCellDisplay(cellNum, cellCounts);
      const isBasic = cellNum === basicNumber;
      const isDestiny = cellNum === destinyNumber;
      const isDasa = dasaNumber !== undefined && cellNum === dasaNumber;
      const isYear = yearNumber !== undefined && cellNum === yearNumber;
      const isMonth = monthNumber !== undefined && cellNum === monthNumber;
      const isDay = dayNumber !== undefined && cellNum === dayNumber;

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const midX = cx + cellW / 2;
      let midY = cy + cellH / 2;

      const parts: Array<{
        text: string;
        color: string;
        bold?: boolean;
        italic?: boolean;
        bgColor?: string;
        isYear?: boolean;
        isDasa?: boolean;
      }> = [];

      if (count > 0) {
        parts.push({
          text: String(display),
          color: isBasic
            ? BASIC_COLOR
            : isDestiny
              ? DESTINY_COLOR
              : NATAL_COLOR,
          bold: true,
        });
      }
      if (isDasa) {
        parts.push({
          text: String(dasaNumber),
          color: DASA_COLOR,
          bold: true,
          isDasa: true,
        });
      }
      if (isYear) {
        parts.push({
          text: String(yearNumber),
          color: YEAR_COLOR_TEXT,
          bold: true,
          bgColor: YEAR_BG,
          isYear: true,
        });
      }
      if (isMonth) {
        parts.push({
          text: String(monthNumber),
          color: MONTH_COLOR,
          bold: true,
        });
      }
      if (isDay) {
        parts.push({
          text: String(dayNumber),
          color: DAY_COLOR,
          bold: true,
          italic: true,
        });
      }

      // Variable line heights — year biggest, dasa next, others normal
      const getLineH = (part: (typeof parts)[0]) =>
        part.isYear ? 18 : part.isDasa ? 16 : 14;
      const totalH = parts.reduce((sum, p) => sum + getLineH(p), 0);
      midY = cy + cellH / 2;
      let startY = midY - totalH / 2;

      for (const part of parts) {
        const lh = getLineH(part);
        const fontSize = part.isYear ? 16 : part.isDasa ? 14 : 12;
        ctx.font = `${part.italic ? "italic " : ""}${part.bold ? "bold " : ""}${fontSize}px Arial`;
        const drawY = startY + lh / 2;
        if (part.bgColor) {
          const tw = ctx.measureText(part.text).width + 6;
          ctx.fillStyle = part.bgColor;
          ctx.fillRect(midX - tw / 2, startY, tw, lh);
        }
        ctx.fillStyle = part.color;
        ctx.fillText(part.text, midX, drawY);
        startY += lh;
      }
    }
  }

  // Outer border
  ctx.strokeStyle = BORDER_COLOR;
  ctx.lineWidth = 1;
  ctx.strokeRect(x, y + headerH, w, gridH);
}

function generateMonthChartPNG(
  yearIter: number,
  day: number,
  month: number,
  basicNumber: number,
  destinyNumber: number,
  natalCellCounts: Record<number, number>,
  dasaNumber: number,
  yearNumber: number,
): string {
  const periods = calculateMonthCycle(day, month, yearIter, yearNumber);

  const cols = 4;
  const rows = Math.ceil(periods.length / cols);
  const chartW = 200;
  const chartH = 170;
  const padding = 12;
  const titleH = 36;

  const logicalW = cols * chartW + (cols + 1) * padding;
  const logicalH = titleH + rows * chartH + (rows + 1) * padding;

  const scale = Math.max(window.devicePixelRatio || 2, 2);
  const canvas = document.createElement("canvas");
  canvas.width = logicalW * scale;
  canvas.height = logicalH * scale;
  const ctx = canvas.getContext("2d")!;
  ctx.scale(scale, scale);

  ctx.fillStyle = "#f9f6f0";
  ctx.fillRect(0, 0, logicalW, logicalH);

  // Title
  ctx.fillStyle = GREEN_HEADER;
  ctx.fillRect(0, 0, logicalW, titleH);
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 16px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(
    `Year ${yearIter}\u2013${yearIter + 1} \u2014 Month Charts`,
    logicalW / 2,
    titleH / 2,
  );

  periods.forEach((period, idx) => {
    const col = idx % cols;
    const row = Math.floor(idx / cols);
    const x = padding + col * (chartW + padding);
    const y = titleH + padding + row * (chartH + padding);
    const label = `${formatDate(period.startDate)}\u2013${formatDate(period.endDate)}`;
    drawMiniChart(
      ctx,
      x,
      y,
      chartW,
      chartH,
      natalCellCounts,
      basicNumber,
      destinyNumber,
      dasaNumber,
      yearNumber,
      period.monthNumber,
      undefined,
      label,
    );
  });

  return canvas.toDataURL("image/png");
}

function generateDayChartPNG(
  yearIter: number,
  day: number,
  month: number,
  basicNumber: number,
  destinyNumber: number,
  natalCellCounts: Record<number, number>,
  dasaNumber: number,
  yearNumber: number,
): string {
  const periods = calculateMonthCycle(day, month, yearIter, yearNumber);

  type DayEntry = { date: Date; monthNumber: number; dayNumber: number };
  const allDays: DayEntry[] = [];
  for (const period of periods) {
    const dates = enumerateDates(period.startDate, period.endDate);
    for (const date of dates) {
      allDays.push({
        date,
        monthNumber: period.monthNumber,
        dayNumber: calculateDayNumber(date, period.monthNumber),
      });
    }
  }

  const cols = 4;
  const rows = Math.ceil(allDays.length / cols);
  const chartW = 170;
  const chartH = 150;
  const padding = 10;
  const titleH = 36;

  const logicalW = cols * chartW + (cols + 1) * padding;
  const logicalH = titleH + rows * chartH + (rows + 1) * padding;

  const scale = Math.max(window.devicePixelRatio || 2, 2);
  const canvas = document.createElement("canvas");
  canvas.width = logicalW * scale;
  canvas.height = logicalH * scale;
  const ctx = canvas.getContext("2d")!;
  ctx.scale(scale, scale);

  ctx.fillStyle = "#f9f6f0";
  ctx.fillRect(0, 0, logicalW, logicalH);

  ctx.fillStyle = GREEN_HEADER;
  ctx.fillRect(0, 0, logicalW, titleH);
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 16px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(
    `Year ${yearIter}\u2013${yearIter + 1} \u2014 Day Charts`,
    logicalW / 2,
    titleH / 2,
  );

  allDays.forEach((entry, idx) => {
    const col = idx % cols;
    const row = Math.floor(idx / cols);
    const x = padding + col * (chartW + padding);
    const y = titleH + padding + row * (chartH + padding);
    const label = formatDate(entry.date);
    drawMiniChart(
      ctx,
      x,
      y,
      chartW,
      chartH,
      natalCellCounts,
      basicNumber,
      destinyNumber,
      dasaNumber,
      yearNumber,
      entry.monthNumber,
      entry.dayNumber,
      label,
    );
  });

  return canvas.toDataURL("image/png");
}

function generateNatalChartPNG(
  natalCellCounts: Record<number, number>,
  basicNumber: number,
  destinyNumber: number,
  dasaNumber: number,
  yearNumber: number,
): string {
  const logicalSize = 450;
  const scale = Math.max(window.devicePixelRatio || 2, 2);
  const canvas = document.createElement("canvas");
  canvas.width = logicalSize * scale;
  canvas.height = logicalSize * scale;
  const ctx = canvas.getContext("2d")!;
  ctx.scale(scale, scale);

  ctx.fillStyle = "#f9f6f0";
  ctx.fillRect(0, 0, logicalSize, logicalSize);

  drawMiniChart(
    ctx,
    0,
    0,
    logicalSize,
    logicalSize,
    natalCellCounts,
    basicNumber,
    destinyNumber,
    dasaNumber,
    yearNumber,
    undefined,
    undefined,
    "NATAL CHART",
  );

  return canvas.toDataURL("image/png");
}

export function generateYearRangeChartPNG(
  fromYear: number,
  toYear: number,
  day: number,
  month: number,
  basicNumber: number,
  destinyNumber: number,
  natalCellCounts: Record<number, number>,
  dasaNumber: number,
): string {
  const years: number[] = [];
  for (let y = fromYear; y <= toYear; y++) years.push(y);

  const cols = 4;
  const rows = Math.ceil(years.length / cols);
  const chartW = 200;
  const chartH = 170;
  const padding = 12;
  const titleH = 36;

  const logicalW = cols * chartW + (cols + 1) * padding;
  const logicalH = titleH + rows * chartH + (rows + 1) * padding;

  const scale = Math.max(window.devicePixelRatio || 2, 2);
  const canvas = document.createElement("canvas");
  canvas.width = logicalW * scale;
  canvas.height = logicalH * scale;
  const ctx = canvas.getContext("2d")!;
  ctx.scale(scale, scale);

  ctx.fillStyle = "#f9f6f0";
  ctx.fillRect(0, 0, logicalW, logicalH);

  ctx.fillStyle = GREEN_HEADER;
  ctx.fillRect(0, 0, logicalW, titleH);
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 16px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(
    `Year Range ${fromYear}\u2013${toYear}`,
    logicalW / 2,
    titleH / 2,
  );

  function reduceToSingle(input: number): number {
    let n = input;
    while (n > 9) {
      n = String(n)
        .split("")
        .reduce((s, d) => s + Number(d), 0);
    }
    return n;
  }

  years.forEach((yr, idx) => {
    const col = idx % cols;
    const row = Math.floor(idx / cols);
    const x = padding + col * (chartW + padding);
    const y = titleH + padding + row * (chartH + padding);
    const rawSum = day + month + yr;
    const yearNumber = reduceToSingle(rawSum);
    drawMiniChart(
      ctx,
      x,
      y,
      chartW,
      chartH,
      natalCellCounts,
      basicNumber,
      destinyNumber,
      dasaNumber,
      yearNumber,
      undefined,
      undefined,
      String(yr),
    );
  });

  return canvas.toDataURL("image/png");
}

export function DownloadChartDialog({
  open,
  onClose,
  yearIter,
  day,
  month,
  basicNumber,
  destinyNumber,
  natalCellCounts,
  dasaNumber,
  yearNumber,
}: DownloadChartDialogProps) {
  const [generating, setGenerating] = useState(false);
  const [downloadType, setDownloadType] = useState<
    "choose" | "month" | "day" | "yearrange" | "natal"
  >("choose");
  const [yearRangeFrom, setYearRangeFrom] = useState(
    String(new Date().getFullYear()),
  );
  const [yearRangeTo, setYearRangeTo] = useState(
    String(new Date().getFullYear() + 10),
  );

  function handleClose() {
    setDownloadType("choose");
    onClose();
  }

  function triggerDownload(dataUrl: string, filename: string) {
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = filename;
    a.click();
  }

  function handleDownload(type: "month" | "day" | "natal" | "yearrange") {
    setGenerating(true);
    setTimeout(() => {
      try {
        if (type === "month") {
          const dataUrl = generateMonthChartPNG(
            yearIter,
            day,
            month,
            basicNumber,
            destinyNumber,
            natalCellCounts,
            dasaNumber,
            yearNumber,
          );
          triggerDownload(dataUrl, `year-${yearIter}-month-chart.png`);
          handleClose();
        } else if (type === "day") {
          const dataUrl = generateDayChartPNG(
            yearIter,
            day,
            month,
            basicNumber,
            destinyNumber,
            natalCellCounts,
            dasaNumber,
            yearNumber,
          );
          triggerDownload(dataUrl, `year-${yearIter}-day-chart.png`);
          handleClose();
        } else if (type === "natal") {
          const dataUrl = generateNatalChartPNG(
            natalCellCounts,
            basicNumber,
            destinyNumber,
            dasaNumber,
            yearNumber,
          );
          triggerDownload(dataUrl, "natal-chart.png");
          handleClose();
        } else if (type === "yearrange") {
          const from = Number.parseInt(yearRangeFrom, 10);
          const to = Number.parseInt(yearRangeTo, 10);
          if (!Number.isNaN(from) && !Number.isNaN(to) && from <= to) {
            const dataUrl = generateYearRangeChartPNG(
              from,
              to,
              day,
              month,
              basicNumber,
              destinyNumber,
              natalCellCounts,
              dasaNumber,
            );
            triggerDownload(dataUrl, `year-range-${from}-${to}-chart.png`);
            handleClose();
          }
        }
      } finally {
        setGenerating(false);
      }
    }, 50);
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent
        data-ocid="download_chart.dialog"
        className="max-w-sm w-full"
        style={{ background: "#ffffff", border: `1px solid ${BORDER_COLOR}` }}
      >
        <DialogHeader>
          <DialogTitle
            className="font-display font-bold text-center"
            style={{ color: GREEN_HEADER }}
          >
            Download Chart
          </DialogTitle>
        </DialogHeader>

        {downloadType === "choose" && (
          <div className="flex flex-col gap-3 mt-2">
            <p className="text-sm text-center text-muted-foreground">
              Choose the chart type to download:
            </p>
            <Button
              data-ocid="download_chart.month_button"
              onClick={() => handleDownload("month")}
              disabled={generating}
              variant="outline"
              className="w-full justify-start"
              style={{
                borderColor: BORDER_COLOR,
                color: MONTH_COLOR,
                fontWeight: 700,
              }}
            >
              Month Chart \u2014 Year {yearIter}\u2013{yearIter + 1}
            </Button>
            <Button
              data-ocid="download_chart.day_button"
              onClick={() => handleDownload("day")}
              disabled={generating}
              className="w-full justify-start"
              style={{
                background: GREEN_HEADER,
                color: "#fff",
                fontWeight: 700,
              }}
            >
              Day Chart \u2014 Year {yearIter}\u2013{yearIter + 1}
            </Button>
            <Button
              data-ocid="download_chart.yearrange_button"
              onClick={() => setDownloadType("yearrange")}
              disabled={generating}
              variant="outline"
              className="w-full justify-start"
              style={{
                borderColor: BORDER_COLOR,
                color: DASA_COLOR,
                fontWeight: 700,
              }}
            >
              Year Range Chart (custom)
            </Button>
            <Button
              data-ocid="download_chart.natal_button"
              onClick={() => handleDownload("natal")}
              disabled={generating}
              variant="outline"
              className="w-full justify-start"
              style={{
                borderColor: BORDER_COLOR,
                color: "#000",
                fontWeight: 700,
              }}
            >
              Natal Chart (single large)
            </Button>
          </div>
        )}

        {downloadType === "yearrange" && (
          <div className="flex flex-col gap-3 mt-2">
            <p className="text-sm text-center text-muted-foreground">
              Enter year range to download:
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label
                  className="text-xs font-semibold"
                  style={{ color: GREEN_HEADER }}
                >
                  From Year
                </Label>
                <Input
                  data-ocid="download_chart.yearrange_from.input"
                  type="number"
                  value={yearRangeFrom}
                  onChange={(e) => setYearRangeFrom(e.target.value)}
                  placeholder="e.g. 2020"
                />
              </div>
              <div className="space-y-1">
                <Label
                  className="text-xs font-semibold"
                  style={{ color: GREEN_HEADER }}
                >
                  To Year
                </Label>
                <Input
                  data-ocid="download_chart.yearrange_to.input"
                  type="number"
                  value={yearRangeTo}
                  onChange={(e) => setYearRangeTo(e.target.value)}
                  placeholder="e.g. 2030"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                data-ocid="download_chart.yearrange_cancel.button"
                variant="outline"
                className="flex-1"
                onClick={() => setDownloadType("choose")}
                style={{ borderColor: BORDER_COLOR }}
              >
                Back
              </Button>
              <Button
                data-ocid="download_chart.yearrange_download.button"
                className="flex-1"
                onClick={() => handleDownload("yearrange")}
                disabled={generating}
                style={{
                  background: GREEN_HEADER,
                  color: "#fff",
                  fontWeight: 700,
                }}
              >
                Download
              </Button>
            </div>
          </div>
        )}

        {generating && (
          <p
            data-ocid="download_chart.loading_state"
            className="text-xs text-center mt-3"
            style={{ color: "#888" }}
          >
            Generating chart\u2026
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
