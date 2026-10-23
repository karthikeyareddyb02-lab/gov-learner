"use client";

import { useEffect } from "react";

const stars = [
  [8, 14],
  [16, 7],
  [24, 18],
  [33, 9],
  [41, 22],
  [52, 11],
  [61, 19],
  [70, 8],
  [78, 16],
  [88, 10],
  [93, 21],
];

function smoothstep(value: number) {
  const t = Math.min(1, Math.max(0, value));
  return t * t * (3 - 2 * t);
}

function rise(minute: number, start: number, end: number) {
  return smoothstep((minute - start) / (end - start));
}

export function skyWeights(date: Date) {
  const minute = date.getHours() * 60 + date.getMinutes();
  const morning = rise(minute, 4 * 60, 6.5 * 60) * (1 - rise(minute, 10.5 * 60, 13 * 60));
  const afternoon = rise(minute, 10.5 * 60, 13 * 60) * (1 - rise(minute, 15.5 * 60, 19 * 60));
  const nightRise = minute >= 15.5 * 60 ? rise(minute, 15.5 * 60, 19 * 60) : 1;
  const night = nightRise * (1 - rise(minute, 4 * 60, 6.5 * 60));
  const total = morning + afternoon + night || 1;
  return {
    morning: morning / total,
    afternoon: afternoon / total,
    night: night / total,
  };
}

export function DaySky() {
  useEffect(() => {
    const root = document.documentElement;
    const layers = Array.from(root.querySelectorAll<HTMLElement>("[data-sky]"));

    const apply = () => {
      const weights = skyWeights(new Date());
      const daypart = (Object.keys(weights) as Array<keyof typeof weights>).reduce((best, key) =>
        weights[key] > weights[best] ? key : best,
      );
      root.dataset.daypart = daypart;
      for (const layer of layers) {
        const key = layer.dataset.sky as keyof typeof weights;
        layer.style.opacity = String(weights[key]);
      }
    };

    apply();
    const frame = window.requestAnimationFrame(() => {
      root.dataset.skyReady = "true";
    });
    const timer = window.setInterval(apply, 20_000);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearInterval(timer);
    };
  }, []);

  return (
    <div className="sky" aria-hidden="true">
      <div className="sky-layer sky-morning" data-sky="morning">
        <div className="sky-sun" />
        <div className="sky-rays" />
        <div className="sky-hill" />
      </div>
      <div className="sky-layer sky-afternoon" data-sky="afternoon">
        <div className="sky-sun sky-sun-high" />
        <div className="sky-cloud sky-cloud-a" />
        <div className="sky-cloud sky-cloud-b" />
        <div className="sky-hill" />
      </div>
      <div className="sky-layer sky-night" data-sky="night">
        <div className="sky-moon" />
        <div className="sky-stars">
          {stars.map(([x, y]) => (
            <span key={`${x}-${y}`} style={{ left: `${x}%`, top: `${y}%` }} />
          ))}
        </div>
        <div className="sky-hill" />
      </div>
    </div>
  );
}
