"use client";

import { useState } from "react";

import {
  formatPriceAxisValue,
  formatPriceHistoryDate,
  type PriceHistoryPoint,
} from "@/lib/price-history";

interface PriceAnalysisSectionProps {
  points: PriceHistoryPoint[];
  gradeLabel: string;
  daysLabel: string;
  isLoading: boolean;
  errorMessage?: string;
  selectedGrade: string;
  onGradeChange: (grade: string) => void;
  selectedPeriod: string;
  onPeriodChange: (period: string) => void;
}

const CHART_WIDTH = 720;
const CHART_HEIGHT = 280;
const PADDING = { top: 20, right: 20, bottom: 42, left: 64 };

function buildPath(points: Array<{ x: number; y: number }>) {
  return points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
}

function buildAreaPath(points: Array<{ x: number; y: number }>, baseline: number) {
  if (points.length === 0) {
    return "";
  }

  const first = points[0];
  const last = points[points.length - 1];
  return `${buildPath(points)} L ${last.x} ${baseline} L ${first.x} ${baseline} Z`;
}

export function PriceAnalysisSection({
  points,
  gradeLabel,
  daysLabel,
  isLoading,
  errorMessage,
  selectedGrade,
  onGradeChange,
  selectedPeriod,
  onPeriodChange,
}: PriceAnalysisSectionProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const innerWidth = CHART_WIDTH - PADDING.left - PADDING.right;
  const innerHeight = CHART_HEIGHT - PADDING.top - PADDING.bottom;
  const hasSinglePoint = points.length === 1;

  const prices = points.map((point) => point.price);
  const lowestPrice = prices.length ? Math.min(...prices) : 0;
  const highestPrice = prices.length ? Math.max(...prices) : 0;
  const priceRange = highestPrice - lowestPrice;
  const yPadding = priceRange === 0 ? Math.max(highestPrice * 0.1, 1) : priceRange * 0.18;
  const yMin = Math.max(0, lowestPrice - yPadding);
  const yMax = highestPrice + yPadding;
  const safeRange = Math.max(yMax - yMin, 1);

  const chartPoints = points.map((point, index) => {
    const x =
      PADDING.left +
      (points.length === 1 ? innerWidth / 2 : (index / (points.length - 1)) * innerWidth);
    const y =
      PADDING.top + innerHeight - ((point.price - yMin) / safeRange) * innerHeight;

    return { x, y, raw: point };
  });

  const linePath = buildPath(chartPoints);
  const areaPath = buildAreaPath(chartPoints, PADDING.top + innerHeight);
  const tickCount = 4;
  const yTicks = Array.from({ length: tickCount + 1 }, (_, index) => {
    const ratio = index / tickCount;
    const value = yMax - ratio * safeRange;
    const y = PADDING.top + ratio * innerHeight;

    return { value, y };
  });
  const xTickIndexes = Array.from(
    new Set(
      [0, 0.33, 0.66, 1]
        .map((ratio) => Math.round((points.length - 1) * ratio))
        .filter((index) => index >= 0 && index < points.length),
    ),
  );
  const hoveredPoint =
    hoveredIndex != null && hoveredIndex >= 0 && hoveredIndex < chartPoints.length
      ? chartPoints[hoveredIndex]
      : null;
  const tooltipWidth = 168;
  const tooltipHeight = 52;
  const tooltipX = hoveredPoint
    ? Math.max(
        PADDING.left,
        Math.min(
          hoveredPoint.x - tooltipWidth / 2,
          CHART_WIDTH - PADDING.right - tooltipWidth,
        ),
      )
    : 0;
  const tooltipY = hoveredPoint
    ? Math.max(PADDING.top, hoveredPoint.y - tooltipHeight - 14)
    : 0;

  return (
    <section className="rounded-[1.75rem] border border-current/12 bg-foreground/3 p-4 text-foreground sm:rounded-[2.25rem] sm:p-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-foreground/58">
            Price Analysis
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-[-0.05em] sm:text-3xl">
            {gradeLabel} trend over the last {daysLabel}
          </h2>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {["Raw", "PSA 10", "PSA 9"].map((grade) => {
            const isActive = selectedGrade === grade;

            return (
              <button
                key={grade}
                type="button"
                onClick={() => onGradeChange(grade)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                  isActive
                    ? "border-foreground bg-foreground text-background"
                    : "border-current/12 bg-background/70 text-foreground/70 hover:border-current/25 hover:text-foreground"
                }`}
              >
                {grade}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-2">
          {[
            { label: "30 days", value: "-30" },
            { label: "6 months", value: "-180" },
            { label: "1 year", value: "-365" },
            { label: "2 year", value: "-730" },
          ].map((period) => {
            const isActive = selectedPeriod === period.value;

            return (
              <button
                key={period.value}
                type="button"
                onClick={() => onPeriodChange(period.value)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                  isActive
                    ? "border-foreground bg-foreground text-background"
                    : "border-current/12 bg-background/70 text-foreground/70 hover:border-current/25 hover:text-foreground"
                }`}
              >
                {period.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 rounded-3xl border border-current/10 bg-background/80 p-4 sm:p-5">
        {isLoading ? (
          <div className="flex h-72 items-center justify-center text-sm text-foreground/55">
            Loading price history...
          </div>
        ) : errorMessage ? (
          <div className="flex h-72 items-center justify-center text-center text-sm text-foreground/60">
            {errorMessage}
          </div>
        ) : points.length === 0 ? (
          <div className="flex h-72 items-center justify-center text-center text-sm text-foreground/60">
            No price history points were returned for this card.
          </div>
        ) : (
          <div className="overflow-x-auto text-foreground">
            <svg
              viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
              className="h-auto min-w-160 w-full"
              role="img"
              aria-label={`Price history line chart for ${gradeLabel} over ${daysLabel}`}
            >
              <defs>
                <linearGradient id="price-analysis-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="currentColor" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="currentColor" stopOpacity="0.02" />
                </linearGradient>
              </defs>

              {yTicks.map((tick) => (
                <g key={`y-${tick.y}`}>
                  <line
                    x1={PADDING.left}
                    y1={tick.y}
                    x2={CHART_WIDTH - PADDING.right}
                    y2={tick.y}
                    stroke="currentColor"
                    opacity="0.1"
                  />
                  <text
                    x={PADDING.left - 12}
                    y={tick.y + 4}
                    textAnchor="end"
                    fill="currentColor"
                    opacity="0.5"
                    fontSize="11"
                  >
                    {formatPriceAxisValue(tick.value)}
                  </text>
                </g>
              ))}

              {xTickIndexes.map((index) => {
                const point = chartPoints[index];

                return (
                  <g key={`x-${index}`}>
                    <line
                      x1={point.x}
                      y1={PADDING.top}
                      x2={point.x}
                      y2={PADDING.top + innerHeight}
                      stroke="currentColor"
                      opacity="0.06"
                    />
                    <text
                      x={point.x}
                      y={CHART_HEIGHT - 12}
                      textAnchor="middle"
                      fill="currentColor"
                      opacity="0.5"
                      fontSize="11"
                    >
                      {formatPriceHistoryDate(point.raw.date)}
                    </text>
                  </g>
                );
              })}

              <path d={areaPath} fill="url(#price-analysis-fill)" />
              {hasSinglePoint ? (
                <line
                  x1={PADDING.left}
                  y1={chartPoints[0]?.y ?? PADDING.top + innerHeight / 2}
                  x2={CHART_WIDTH - PADDING.right}
                  y2={chartPoints[0]?.y ?? PADDING.top + innerHeight / 2}
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray="6 6"
                  opacity="0.35"
                />
              ) : (
                <path
                  d={linePath}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {hoveredPoint ? (
                <g pointerEvents="none">
                  <line
                    x1={hoveredPoint.x}
                    y1={PADDING.top}
                    x2={hoveredPoint.x}
                    y2={PADDING.top + innerHeight}
                    stroke="currentColor"
                    opacity="0.16"
                    strokeDasharray="4 6"
                  />
                  <rect
                    x={tooltipX}
                    y={tooltipY}
                    width={tooltipWidth}
                    height={tooltipHeight}
                    rx="12"
                    fill="rgba(15, 23, 42, 0.92)"
                  />
                  <text
                    x={tooltipX + 12}
                    y={tooltipY + 21}
                    fill="white"
                    fontSize="12"
                    fontWeight="600"
                  >
                    {formatPriceHistoryDate(hoveredPoint.raw.date)}
                  </text>
                  <text
                    x={tooltipX + 12}
                    y={tooltipY + 38}
                    fill="white"
                    fontSize="14"
                    fontWeight="700"
                  >
                    {formatPriceAxisValue(hoveredPoint.raw.price)}
                  </text>
                </g>
              ) : null}

              {chartPoints.map((point, index) => (
                <g
                  key={`${point.raw.timestamp}-${index}`}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex((current) => (current === index ? null : current))}
                >
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r={hasSinglePoint ? "6" : "4"}
                    fill="white"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r="16"
                    fill="transparent"
                    onFocus={() => setHoveredIndex(index)}
                    onBlur={() => setHoveredIndex((current) => (current === index ? null : current))}
                  />
                  <title>
                    {`${formatPriceHistoryDate(point.raw.date)}: ${formatPriceAxisValue(point.raw.price)}`}
                  </title>
                </g>
              ))}
            </svg>
          </div>
        )}
      </div>
    </section>
  );
}
