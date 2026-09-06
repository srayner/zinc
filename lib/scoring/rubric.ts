/**
 * Fixed, editable scoring rubric shown in the UI when setting a manual Area
 * score. Wording stays neutral and factual regardless of score.
 */
export type RubricEntry = { range: string; label: string };

export const SCORING_RUBRIC: RubricEntry[] = [
  { range: "9–10", label: "Fully done, nothing needed" },
  { range: "7–8", label: "Minor upkeep only" },
  { range: "5–6", label: "Needs attention but not urgent" },
  { range: "3–4", label: "Overdue, visibly needs work" },
  { range: "1–2", label: "Significant issue (unusable / broken / safety-relevant)" },
];
