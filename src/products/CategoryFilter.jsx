import React from "react";

export default function CategoryFilter({ categories, selected, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange("all")}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
          selected === "all"
            ? "bg-sky-600 text-white"
            : "bg-white border border-slate-200 text-slate-700 hover:border-slate-300"
        }`}
      >
        All Products
      </button>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onChange(category)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selected === category
              ? "bg-sky-600 text-white"
              : "bg-white border border-slate-200 text-slate-700 hover:border-slate-300"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}