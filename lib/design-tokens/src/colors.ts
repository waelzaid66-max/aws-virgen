/** BANCO brand palette — shared across web surfaces (W0.5). */
export const bancoBrand = {
  red: "#E8002D",
  black: "#000000",
  white: "#FFFFFF",
  muted: "#888888",
  card: "#111111",
  border: "#222222",
} as const;

export const bancoCssVariables = `
:root {
  --banco-primary: ${bancoBrand.red};
  --banco-bg: ${bancoBrand.black};
  --banco-fg: ${bancoBrand.white};
  --banco-muted: ${bancoBrand.muted};
  --banco-card: ${bancoBrand.card};
  --banco-border: ${bancoBrand.border};
  --banco-radius: 12px;
}
`.trim();
