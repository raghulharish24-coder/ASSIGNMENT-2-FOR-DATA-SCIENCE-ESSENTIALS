import { CATEGORIES } from "./questions.js";

export function evaluateAssessment(answers, questions, durationSeconds) {
  const categoryStats = Object.fromEntries(
    CATEGORIES.map(({ name }) => [name, { total: 0, correct: 0, incorrect: 0, unanswered: 0, percentage: 0 }]),
  );

  let correct = 0;
  let incorrect = 0;
  let unanswered = 0;

  questions.forEach((question, index) => {
    const response = answers[index];
    const stats = categoryStats[question.category];
    stats.total += 1;

    if (response === null || response === undefined) {
      unanswered += 1;
      stats.unanswered += 1;
    } else if (response === question.answerIndex) {
      correct += 1;
      stats.correct += 1;
    } else {
      incorrect += 1;
      stats.incorrect += 1;
    }
  });

  for (const stats of Object.values(categoryStats)) {
    stats.percentage = stats.total ? Math.round((stats.correct / stats.total) * 100) : 0;
  }

  const attempted = correct + incorrect;
  const percentages = CATEGORIES.map(({ name }) => categoryStats[name].percentage);
  const high = Math.max(...percentages);
  const low = Math.min(...percentages);

  return {
    total: questions.length,
    score: correct,
    percentage: questions.length ? Math.round((correct / questions.length) * 100) : 0,
    accuracy: attempted ? Math.round((correct / attempted) * 100) : 0,
    attempted,
    correct,
    incorrect,
    unanswered,
    durationSeconds: Math.max(0, Math.floor(durationSeconds)),
    categoryStats,
    strongestAreas: attempted ? CATEGORIES.filter(({ name }) => categoryStats[name].percentage === high).map(({ name }) => name) : [],
    weakestAreas: attempted ? CATEGORIES.filter(({ name }) => categoryStats[name].percentage === low).map(({ name }) => name) : [],
  };
}

export function formatDuration(totalSeconds) {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}
