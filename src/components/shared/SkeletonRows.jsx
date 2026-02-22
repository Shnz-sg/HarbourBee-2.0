import React from "react";

export default function SkeletonRows({ rows = 5, cols = 4 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 items-center">
          {Array.from({ length: cols }).map((_, j) => (
            <div
              key={j}
              className="hb-skeleton h-4"
              style={{ width: `${60 + Math.random() * 80}px` }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}