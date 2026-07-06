import React from "react";

const FILTERS = [
  { key: "all", label: "All Items" },
  { key: "image", label: "Images" },
  { key: "video", label: "Videos" },
];

export default function FilterTabs({ active, onChange }) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1">
      {FILTERS.map((f) => (
        <button
          key={f.key}
          onClick={() => onChange(f.key)}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
            active === f.key
              ? "bg-foreground text-background"
              : "bg-secondary text-foreground hover:bg-secondary/70"
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}