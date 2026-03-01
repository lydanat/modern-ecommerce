export const ALL_TYPES = [
  { label: "Boxy",      value: "Boxy"      },
  { label: "Oversized", value: "Oversized" },
  { label: "Slim",      value: "Slim"      },
  { label: "Tank Top",  value: "tank-top"  },
];

export const TYPE_STYLES = {
  "boxy":      "bg-stone-100   text-stone-700   border-stone-200",
  "Boxy":      "bg-stone-100   text-stone-700   border-stone-200",
  "oversized": "bg-neutral-100 text-neutral-700 border-neutral-200",
  "Oversized": "bg-neutral-100 text-neutral-700 border-neutral-200",
  "slim":      "bg-zinc-100    text-zinc-700    border-zinc-200",
  "Slim":      "bg-zinc-100    text-zinc-700    border-zinc-200",
  "tank-top":  "bg-slate-100   text-slate-700   border-slate-200",
  "Tank Top":  "bg-slate-100   text-slate-700   border-slate-200",
  "tank top":  "bg-slate-100   text-slate-700   border-slate-200",
};

export function formatType(type) {
  if (!type) return "";
  return type.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}