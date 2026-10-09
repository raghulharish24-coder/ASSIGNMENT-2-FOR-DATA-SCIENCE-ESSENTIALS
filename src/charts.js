import { CATEGORIES } from "./questions.js";

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[character]);
}

export function renderScoreRing(percentage) {
  const radius = 47;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - Math.max(0, Math.min(100, percentage)) / 100);
  return `<svg class="score-ring" viewBox="0 0 120 120" role="img" aria-label="Overall score ${percentage} percent">
    <circle class="score-ring-track" cx="60" cy="60" r="${radius}" />
    <circle class="score-ring-value" cx="60" cy="60" r="${radius}" style="stroke-dasharray:${circumference.toFixed(2)};stroke-dashoffset:${offset.toFixed(2)}" />
    <text class="score-ring-number" x="60" y="57" text-anchor="middle">${percentage}<tspan class="score-ring-percent">%</tspan></text>
    <text class="score-ring-caption" x="60" y="76" text-anchor="middle">OVERALL</text>
  </svg>`;
}

export function renderCategoryChart(result, selectedCategory = "All") {
  const rows = CATEGORIES.map(({ name, short }) => {
    const stats = result.categoryStats[name];
    const denominator = stats.total || 1;
    const correctWidth = (stats.correct / denominator) * 100;
    const incorrectWidth = (stats.incorrect / denominator) * 100;
    const unansweredWidth = (stats.unanswered / denominator) * 100;
    const selected = selectedCategory === name;
    const label = `${name}: ${stats.correct} correct, ${stats.incorrect} incorrect, ${stats.unanswered} unanswered out of ${stats.total}`;

    return `<button class="performance-row${selected ? " is-selected" : ""}" type="button" data-action="filter-category" data-category="${escapeHTML(name)}" aria-label="${escapeHTML(label)}" aria-pressed="${selected}">
      <span class="performance-row-top"><span class="performance-name">${escapeHTML(short)}</span><span class="performance-count">${stats.correct} <span>/ ${stats.total} correct</span></span></span>
      <span class="stacked-track" aria-hidden="true"><span class="stacked-segment segment-correct" style="width:${correctWidth}%"></span><span class="stacked-segment segment-incorrect" style="width:${incorrectWidth}%"></span><span class="stacked-segment segment-unanswered" style="width:${unansweredWidth}%"></span></span>
      <span class="performance-row-bottom"><span>${stats.percentage}% score</span><span>${selected ? "Showing review" : "View questions"}<span aria-hidden="true"> ↗</span></span></span>
    </button>`;
  }).join("");

  return `<div class="performance-chart" aria-label="Interactive category performance chart">${rows}</div>`;
}
