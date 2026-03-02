export const ALL_COLORS = [
  { label: "Black",     value: "black",     hex: "#000000" },
  { label: "White",     value: "white",     hex: "#FFFFFF" },
  { label: "Cream",     value: "cream",     hex: "#F5F0E8" },
  { label: "Wood",      value: "wood",      hex: "#A0785A" },
  { label: "Red",       value: "red",       hex: "#C0392B" },
  { label: "Dark Blue", value: "dark-blue", hex: "#1B2A4A" },
  { label: "Navy",      value: "navy",      hex: "#0A192F" },
  { label: "Olive",     value: "olive",     hex: "#6B7C4D" },
  { label: "Stone",     value: "stone",     hex: "#A8A090" },
  { label: "Beige",     value: "beige",     hex: "#D4C5A9" },
  { label: "Charcoal",  value: "charcoal",  hex: "#36454F" },
  { label: "Sage",      value: "sage",      hex: "#87A878" },
];

export function colorHex(value) {
  return ALL_COLORS.find((c) => c.value === value)?.hex ?? value;
}

export function colorLabel(value) {
  return ALL_COLORS.find((c) => c.value === value)?.label ?? value;
}