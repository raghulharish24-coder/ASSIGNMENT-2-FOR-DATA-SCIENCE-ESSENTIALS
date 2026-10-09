import { ASSESSMENT_MINUTES, CATEGORIES, QUESTION_BANK } from "./questions.js";
import { evaluateAssessment, formatDuration } from "./assessment.js";
import { renderCategoryChart, renderScoreRing } from "./charts.js";

const homeScreen = document.querySelector("#homeScreen");
const testScreen = document.querySelector("#testScreen");
const resultScreen = document.querySelector("#resultScreen");
const siteFooter = document.querySelector("#siteFooter");
const modalRoot = document.querySelector("#modalRoot");
const liveRegion = document.querySelector("#liveRegion");
const TOTAL_SECONDS = ASSESSMENT_MINUTES * 60;
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const state = {
  screen: "home",
  currentIndex: 0,
  answers: [],
  startedAt: 0,
  deadline: 0,
  result: null,
  selectedCategory: "All",
  timerId: null,
};

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[character]);
}

function iconArrow() {
  return '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M3.5 10h12m-5-5 5 5-5 5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>';
}

function renderHome() {
  homeScreen.innerHTML = `
    <div class="home-wrap">
      <section class="home-hero" aria-labelledby="home-title">
        <div class="hero-copy">
          <span class="eyebrow">Aptitude assessment / 01</span>
          <h1 id="home-title">Know where you stand.<br /><span>Build what comes next.</span></h1>
          <p>Test your thinking across four core aptitude areas. Get a clear performance breakdown, review every answer, and leave with a practical next step.</p>
          <div class="hero-actions">
            <button class="button-primary" type="button" data-action="start-test">Start aptitude test ${iconArrow()}</button>
            <a class="text-link" href="#domains">Explore the four domains <span aria-hidden="true">↓</span></a>
          </div>
          <div class="hero-note"><svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m3.5 8.2 2.8 2.8 6.2-6.4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>Free sample assessment. Your answers stay in this browser.</div>
        </div>
        <div class="hero-visual" aria-label="Illustration of an assessment analytics preview">
          <div class="visual-grid" aria-hidden="true"></div>
          <div class="visual-pin visual-pin-top"><span class="pin-label">Assessment status</span><span class="pin-value"><span class="pin-icon">01</span>Ready to begin</span></div>
          <div class="visual-frame">
            <div class="visual-topline"><span>APTITUDE INDEX</span><span class="visual-index">REPORT / SAMPLE</span></div>
            <div class="visual-score"><div class="visual-score-label"><span>Performance signal</span><strong>Four domains.<br />One clear view.</strong></div><div class="visual-score-value">4<small>AREAS</small></div></div>
            <svg class="visual-chart" viewBox="0 0 440 128" preserveAspectRatio="none" aria-hidden="true">
              <defs><linearGradient id="areaFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#2F80ED" stop-opacity=".25"/><stop offset="1" stop-color="#2F80ED" stop-opacity="0"/></linearGradient></defs>
              <path class="chart-gridline" d="M0 24H440M0 63H440M0 102H440"/><path class="chart-area" d="M5 96 78 74 151 82 224 48 297 58 370 27 435 37V128H5Z"/><path class="chart-line" d="M5 96 78 74 151 82 224 48 297 58 370 27 435 37"/>
              <circle class="chart-node" cx="78" cy="74" r="3.8"/><circle class="chart-node" cx="224" cy="48" r="3.8"/><circle class="chart-node" cx="370" cy="27" r="3.8"/>
            </svg>
            <div class="visual-bottomline"><span>ANALYSIS / INSTANT</span><span><i class="status-dot"></i> RESPONSE READY</span></div>
          </div>
          <div class="visual-pin visual-pin-bottom"><span class="pin-label">Question set</span><span class="pin-value">16 questions <span class="pin-icon">20′</span></span></div>
        </div>
      </section>

      <div class="quick-facts" aria-label="Assessment at a glance">
        <div class="fact"><span class="fact-index">01</span><div><strong>16 questions</strong><span>4 focused per domain</span></div></div>
        <div class="fact"><span class="fact-index">02</span><div><strong>20 minutes</strong><span>One timed sitting</span></div></div>
        <div class="fact"><span class="fact-index">03</span><div><strong>Instant analysis</strong><span>Score, accuracy and trends</span></div></div>
        <div class="fact"><span class="fact-index">04</span><div><strong>Full review</strong><span>Answers with explanations</span></div></div>
      </div>

      <section id="domains" class="section-block" aria-labelledby="domains-title">
        <div class="section-head"><div><span class="eyebrow">A balanced view</span><h2 id="domains-title">Four ways to think.<br />One useful baseline.</h2></div><p>Each domain brings a different skill into focus. Your report shows where you are strongest and what to work on next.</p></div>
        <div class="domain-strip">
          ${CATEGORIES.map((category) => `<article class="domain-card"><div class="domain-top"><span class="domain-code">${category.code} / 04</span><span class="domain-mark" aria-hidden="true">${category.code.slice(-1)}</span></div><h3>${escapeHTML(category.name)}</h3><p>${escapeHTML(category.description)}</p><span class="domain-rule" aria-hidden="true"></span></article>`).join("")}
        </div>
      </section>

      <section class="insight-band" aria-labelledby="insight-title">
        <div class="insight-heading"><span class="eyebrow">Built for useful feedback</span><h2 id="insight-title">A score is a start.<br />The detail is the value.</h2></div>
        <div class="insight-list"><div class="insight-item"><strong>See the full picture</strong><p>Compare accuracy and question outcomes across all four areas.</p></div><div class="insight-item"><strong>Understand each answer</strong><p>Open any question to see the correct answer and the reasoning behind it.</p></div><div class="insight-item"><strong>Choose a next step</strong><p>Use practical suggestions tied to the areas that need the most attention.</p></div></div>
      </section>

      <section class="bottom-cta" aria-labelledby="bottom-cta-title"><div class="bottom-cta-copy"><span class="eyebrow">Your baseline starts here</span><h2 id="bottom-cta-title">Ready to see your signal?</h2><p>16 questions. Four domains. A focused report at the end.</p></div><button class="button-primary" type="button" data-action="start-test">Start the assessment ${iconArrow()}</button></section>
    </div>`;
}

function renderStimulus(stimulus) {
  if (!stimulus) return "";
  const columns = stimulus.columns.map((column) => `<th scope="col">${escapeHTML(column)}</th>`).join("");
  const rows = stimulus.rows.map((row) => `<tr>${row.map((cell) => `<td>${escapeHTML(cell)}</td>`).join("")}</tr>`).join("");
  return `<figure class="data-stimulus"><figcaption>${escapeHTML(stimulus.heading)}</figcaption><table class="data-table"><thead><tr>${columns}</tr></thead><tbody>${rows}</tbody></table></figure>`;
}

function renderQuestionNav() {
  return QUESTION_BANK.map((question, index) => {
    const answered = state.answers[index] !== null;
    const classes = ["question-nav-button", index === state.currentIndex ? "is-current" : "", answered ? "is-answered" : ""].filter(Boolean).join(" ");
    const current = index === state.currentIndex ? ' aria-current="step"' : "";
    return `<button class="${classes}" type="button" data-action="go-question" data-index="${index}" aria-label="Question ${index + 1}${answered ? ", answered" : ", not answered"}"${current}>${String(index + 1).padStart(2, "0")}</button>`;
  }).join("");
}

function renderTest() {
  const question = QUESTION_BANK[state.currentIndex];
  const category = CATEGORIES.find(({ name }) => name === question.category);
  const answeredCount = state.answers.filter((answer) => answer !== null).length;
  const progress = Math.round(((state.currentIndex + 1) / QUESTION_BANK.length) * 100);
  const selectedAnswer = state.answers[state.currentIndex];
  const isLastQuestion = state.currentIndex === QUESTION_BANK.length - 1;
  const firstUnansweredIndex = state.answers.findIndex((answer) => answer === null);
  const nextLabel = !isLastQuestion ? "Next question" : firstUnansweredIndex === -1 ? "Submit test" : firstUnansweredIndex === state.currentIndex ? "Submit with unanswered" : "Review unanswered";

  testScreen.innerHTML = `
    <div class="assessment-wrap">
      <header class="assessment-heading">
        <div class="assessment-head-top"><div><span class="eyebrow">Assessment / ${category.code}</span><h1 id="test-title">Work through each question.</h1><p>Choose one answer. You can move between questions before submitting.</p></div><div class="question-count-block"><span>QUESTION</span><strong>${String(state.currentIndex + 1).padStart(2, "0")} <span>/ ${String(QUESTION_BANK.length).padStart(2, "0")}</span></strong></div></div>
        <div class="progress-track" role="progressbar" aria-label="Question position" aria-valuemin="1" aria-valuemax="${QUESTION_BANK.length}" aria-valuenow="${state.currentIndex + 1}"><div class="progress-fill" style="width:${progress}%"></div></div>
        <div class="progress-meta"><span>ASSESSMENT PROGRESS</span><span>${answeredCount} OF ${QUESTION_BANK.length} ANSWERED</span></div>
      </header>
      <div class="assessment-layout">
        <section class="question-panel" aria-labelledby="question-prompt">
          <div class="question-overline"><span class="category-chip">${escapeHTML(question.category)}</span><span class="question-label">QUESTION ${String(state.currentIndex + 1).padStart(2, "0")}</span></div>
          <h2 id="question-prompt">${escapeHTML(question.prompt)}</h2>
          ${renderStimulus(question.stimulus)}
          <div class="answer-grid" role="radiogroup" aria-label="Answer choices for question ${state.currentIndex + 1}">
            ${question.options.map((option, index) => `<button class="answer-option${selectedAnswer === index ? " is-selected" : ""}" type="button" role="radio" aria-checked="${selectedAnswer === index}" data-action="select-answer" data-choice="${index}" id="answer-${state.currentIndex}-${index}"><span class="option-marker">${ALPHABET[index]}</span><span class="option-copy">${escapeHTML(option)}</span></button>`).join("")}
          </div>
          <div class="question-controls"><button class="control-btn" type="button" data-action="previous"${state.currentIndex === 0 ? " disabled" : ""}><span aria-hidden="true">←</span> Previous</button><div class="control-right"><button class="control-btn" type="button" data-action="next">${nextLabel} <span aria-hidden="true">→</span></button></div></div>
        </section>
        <aside class="side-stack" aria-label="Assessment controls">
          <section class="side-panel timer-panel"><div class="timer-caption"><span class="panel-kicker">TIME REMAINING</span><strong id="timerValue" class="timer-value" aria-live="off">${formatDuration(Math.max(0, Math.ceil((state.deadline - Date.now()) / 1000)))}</strong></div><span class="timer-icon" aria-hidden="true"><svg viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10.5" r="6.7" stroke="currentColor" stroke-width="1.4"/><path d="M10 6.5v4.2l2.7 1.6M7.4 2.3h5.2" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg></span></section>
          <section class="side-panel nav-panel"><div class="nav-panel-head"><strong>Question navigator</strong><span>${answeredCount} / ${QUESTION_BANK.length}</span></div><div class="question-nav">${renderQuestionNav()}</div><div class="nav-legend"><span class="legend-item"><i class="legend-swatch current"></i>Current</span><span class="legend-item"><i class="legend-swatch answered"></i>Answered</span><span class="legend-item"><i class="legend-swatch"></i>Open</span></div></section>
          <section class="side-panel submission-panel"><p>Your result is calculated as soon as you submit. Unanswered questions count toward the final score.</p><button class="button-primary submit-button" type="button" data-action="submit-test">Submit test ${iconArrow()}</button></section>
        </aside>
      </div>
    </div>`;
  showScreen("test");
}

function showScreen(screen) {
  state.screen = screen;
  for (const [name, element] of [["home", homeScreen], ["test", testScreen], ["results", resultScreen]]) {
    const isActive = name === screen;
    element.hidden = !isActive;
    element.classList.toggle("is-active", isActive);
    element.setAttribute("aria-hidden", String(!isActive));
  }
  siteFooter.hidden = screen === "test";
  document.body.dataset.screen = screen;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
  document.querySelector("#main").focus({ preventScroll: true });
}

function startTest() {
  if (state.timerId) window.clearInterval(state.timerId);
  state.currentIndex = 0;
  state.answers = Array(QUESTION_BANK.length).fill(null);
  state.startedAt = Date.now();
  state.deadline = state.startedAt + TOTAL_SECONDS * 1000;
  state.result = null;
  state.selectedCategory = "All";
  renderTest();
  updateTimer();
  state.timerId = window.setInterval(updateTimer, 1000);
  liveRegion.textContent = `Assessment started. Question 1 of ${QUESTION_BANK.length}.`;
}

function updateTimer() {
  if (state.screen !== "test") return;
  if (enforceDeadline()) return;
  const secondsLeft = Math.max(0, Math.ceil((state.deadline - Date.now()) / 1000));
  const timer = document.querySelector("#timerValue");
  if (timer) {
    timer.textContent = formatDuration(secondsLeft);
    timer.classList.toggle("is-warning", secondsLeft <= 300);
  }
  if (secondsLeft <= 0) finishTest();
}

function enforceDeadline() {
  if (state.screen === "test" && state.deadline > 0 && Date.now() >= state.deadline) {
    finishTest();
    return true;
  }
  return false;
}

function goToQuestion(index) {
  if (enforceDeadline()) return;
  if (!Number.isInteger(index) || index < 0 || index >= QUESTION_BANK.length) return;
  state.currentIndex = index;
  renderTest();
  liveRegion.textContent = `Question ${index + 1} of ${QUESTION_BANK.length}.`;
}

function requestSubmit() {
  if (enforceDeadline()) return;
  const unanswered = state.answers.filter((answer) => answer === null).length;
  if (unanswered === 0) {
    finishTest();
    return;
  }
  modalRoot.innerHTML = `<div class="modal-backdrop" data-action="dismiss-modal"><section class="confirm-modal" role="dialog" aria-modal="true" aria-labelledby="submit-modal-title" aria-describedby="submit-modal-description"><span class="eyebrow">Before you finish</span><h2 id="submit-modal-title">${unanswered} ${unanswered === 1 ? "question is" : "questions are"} unanswered.</h2><p id="submit-modal-description">You can keep working, or submit now. Unanswered questions count as zero in your score.</p><div class="modal-actions"><button class="button-secondary" type="button" data-action="keep-working">Keep working</button><button class="button-primary" type="button" data-action="confirm-submit">Submit now ${iconArrow()}</button></div></section></div>`;
  document.querySelector('[data-action="keep-working"]')?.focus();
}

function finishTest() {
  if (state.screen !== "test") return;
  if (state.timerId) window.clearInterval(state.timerId);
  state.timerId = null;
  const duration = Math.min(TOTAL_SECONDS, Math.floor((Date.now() - state.startedAt) / 1000));
  state.result = evaluateAssessment(state.answers, QUESTION_BANK, duration);
  state.selectedCategory = "All";
  modalRoot.innerHTML = "";
  renderResults();
  liveRegion.textContent = `Assessment complete. Score ${state.result.correct} out of ${state.result.total}.`;
}

function formatAreaNames(names) {
  if (!names || names.length === 0) return "Not established yet";
  if (names.length === CATEGORIES.length) return "Even across all four areas";
  return names.map((name) => name.replace(" Aptitude", "")).join(" · ");
}

function suggestionFor(categoryName, scorePercent) {
  const advice = {
    "Quantitative Aptitude": ["Rebuild the calculation steps", "Practise percentages, ratios and averages in short sets. Write the relationship before entering numbers."],
    "Logical Reasoning": ["Make the rule explicit", "Work through one sequence or deduction at a time. State the rule in words before choosing an option."],
    "Verbal Ability": ["Read for the exact cue", "Review sentence structure and word choice. Explain why a nearby option does not fit the sentence."],
    "Data Interpretation": ["Translate the table first", "Label the values you need, then separate absolute change from percentage change before calculating."],
  };
  const [title, detail] = advice[categoryName] ?? ["Keep the practice focused", "Review the answer logic, then try a short mixed set with a time limit."];
  const pace = scorePercent < 50
    ? "Start untimed to make each step accurate, then add a gentle time limit."
    : scorePercent < 75
      ? "Do a small targeted set each day, and note the step that caused each missed answer."
      : "Keep this strength sharp with a short timed set once or twice a week.";
  return { title, detail, pace };
}

function renderReview() {
  const filtered = QUESTION_BANK.map((question, index) => ({ question, index }))
    .filter(({ question }) => state.selectedCategory === "All" || question.category === state.selectedCategory);

  const filters = ["All", ...CATEGORIES.map(({ name }) => name)].map((name) => {
    const active = name === state.selectedCategory;
    const label = name === "All" ? "All questions" : name.replace(" Aptitude", "").replace("Reasoning", "Reasoning").replace("Ability", "Ability").replace("Interpretation", "Interpretation");
    return `<button class="filter-chip${active ? " is-active" : ""}" type="button" data-action="filter-review" data-category="${escapeHTML(name)}" aria-pressed="${active}">${escapeHTML(label)}</button>`;
  }).join("");

  const reviews = filtered.map(({ question, index }) => {
    const response = state.answers[index];
    const isCorrect = response === question.answerIndex;
    const isUnanswered = response === null;
    const status = isUnanswered ? "Unanswered" : isCorrect ? "Correct" : "Incorrect";
    const statusClass = isUnanswered ? "is-unanswered" : isCorrect ? "is-correct" : "is-incorrect";
    const selected = isUnanswered ? "No answer selected" : question.options[response];
    const correct = question.options[question.answerIndex];
    return `<details class="review-item"><summary><span class="review-number">${question.id}</span><span class="review-question">${escapeHTML(question.prompt)}</span><span class="review-status ${statusClass}">${status}</span></summary><div class="review-content"><p>${escapeHTML(question.prompt)}</p><div class="review-answer-grid"><div class="review-answer"><span>Your answer</span><strong>${escapeHTML(selected)}</strong></div><div class="review-answer is-key"><span>Correct answer</span><strong>${escapeHTML(correct)}</strong></div></div><div class="review-explanation"><span>Why this is correct</span><p>${escapeHTML(question.explanation)}</p></div></div></details>`;
  }).join("");

  return `<section id="question-review" class="review-section" aria-labelledby="review-title"><div class="review-heading"><div><span class="panel-kicker">REVIEW / ${filtered.length} ITEMS</span><h2 id="review-title">Question by question</h2><p>Open a question to compare your response and read the reasoning.</p></div><span class="review-count">${filtered.length} QUESTIONS</span></div><div class="review-filters" aria-label="Filter question review">${filters}</div><div class="review-list">${reviews || '<p class="review-empty">No questions in this category.</p>'}</div><div class="results-end"><p>Use the explanations to spot a pattern, then try the assessment again when you are ready.</p><button class="button-secondary" type="button" data-action="retake-test">Retake test ${iconArrow()}</button></div></section>`;
}

function renderResults() {
  const result = state.result;
  if (!result) return;
  const strongest = result.attempted ? formatAreaNames(result.strongestAreas) : "Not established yet";
  const weakest = result.attempted ? formatAreaNames(result.weakestAreas) : "Not established yet";
  const focusName = result.weakestAreas[0] ?? CATEGORIES[0].name;
  const focusScore = result.categoryStats[focusName].percentage;
  const personalized = result.attempted
    ? suggestionFor(focusName, focusScore)
    : { title: "Build a first baseline", detail: "Answer a few questions in each area to identify a useful focus. Your next result will show where to begin.", pace: "Start with one question at a time. The explanations will show the reasoning after submission." };

  resultScreen.innerHTML = `
    <div class="results-wrap">
      <header class="results-heading"><div><span class="eyebrow">Assessment complete / analysis</span><h1 id="results-title">Your results, in focus.</h1><p>A clear baseline across ${QUESTION_BANK.length} sample questions.</p></div><div class="result-actions"><button class="button-secondary" type="button" data-action="retake-test">Retake test</button></div></header>

      <section class="result-overview" aria-label="Overall performance summary">
        <article class="result-score-card">${renderScoreRing(result.percentage)}<div class="score-summary"><span class="panel-kicker">OVERALL SCORE</span><strong>${result.correct} <span style="color:var(--muted);font-weight:400">/ ${result.total}</span></strong><p>${result.percentage}% of all questions correct</p><span class="score-pill"><span aria-hidden="true">↗</span> ${result.accuracy}% accuracy on attempted questions</span></div></article>
        <article class="result-metrics-card" aria-label="Detailed score metrics">
          <div class="metric-cell is-correct"><span class="metric-label">Correct</span><strong class="metric-value">${result.correct}<small>of ${result.total}</small></strong></div>
          <div class="metric-cell is-incorrect"><span class="metric-label">Incorrect</span><strong class="metric-value">${result.incorrect}</strong></div>
          <div class="metric-cell is-unanswered"><span class="metric-label">Unanswered</span><strong class="metric-value">${result.unanswered}</strong></div>
          <div class="metric-cell"><span class="metric-label">Accuracy</span><strong class="metric-value">${result.accuracy}<small>%</small></strong></div>
          <div class="metric-cell"><span class="metric-label">Time taken</span><strong class="metric-value">${formatDuration(result.durationSeconds)}</strong></div>
          <div class="metric-cell"><span class="metric-label">Attempted</span><strong class="metric-value">${result.attempted}<small>/ ${result.total}</small></strong></div>
        </article>
      </section>

      <div class="results-grid">
        <section class="dashboard-card" aria-labelledby="performance-title"><div class="dashboard-card-head"><div><span class="panel-kicker">DOMAIN COMPARISON</span><h2 id="performance-title">Performance by area</h2><p>Choose a row to filter the question review below.</p></div><span class="chart-hint">CORRECT /<br />MISSED / OPEN</span></div><div class="chart-legend" aria-label="Chart legend"><span class="legend-item"><i class="legend-swatch is-correct"></i>Correct</span><span class="legend-item"><i class="legend-swatch is-incorrect"></i>Incorrect</span><span class="legend-item"><i class="legend-swatch is-unanswered"></i>Unanswered</span></div>${renderCategoryChart(result, state.selectedCategory)}</section>
        <section class="dashboard-card area-card" aria-labelledby="area-title"><div class="dashboard-card-head"><div><span class="panel-kicker">YOUR SIGNAL</span><h2 id="area-title">Strongest and focus areas</h2><p>Based on your performance in this attempt.</p></div></div><div class="area-callout"><article class="area-row is-strong"><span>Strongest area</span><strong>${escapeHTML(strongest)}</strong><p>${result.attempted ? "Keep this skill sharp with occasional timed practice." : "Complete a few questions to establish a baseline."}</p></article><article class="area-row is-focus"><span>Area to focus next</span><strong>${escapeHTML(weakest)}</strong><p>${result.attempted ? "Start with the small, targeted practice below." : "Your report will identify a focus after your first attempt."}</p></article></div></section>
      </div>

      <section class="suggestions-section" aria-labelledby="suggestions-title"><article class="suggestion-card"><span class="panel-kicker">PERSONALIZED NEXT STEP</span><h2 id="suggestions-title">${escapeHTML(personalized.title)}</h2><p>${escapeHTML(personalized.detail)}</p><span class="focus-domain">FOCUS / ${escapeHTML(focusName.toUpperCase())}</span></article><article class="suggestion-card"><span class="panel-kicker">A PRACTICAL ROUTINE</span><div class="suggestion-list"><div class="suggestion-step"><span>01 / PRACTISE</span><strong>${escapeHTML(personalized.title)}</strong><p>${escapeHTML(personalized.detail)}</p></div><div class="suggestion-step"><span>02 / BUILD PACE</span><strong>Keep the next set deliberate</strong><p>${escapeHTML(personalized.pace)}</p></div></div></article></section>

      ${renderReview()}
    </div>`;
  showScreen("results");
}

function showLeaveTestConfirmation() {
  modalRoot.innerHTML = `<div class="modal-backdrop" data-action="dismiss-modal"><section class="confirm-modal" role="dialog" aria-modal="true" aria-labelledby="leave-modal-title" aria-describedby="leave-modal-description"><span class="eyebrow">Assessment in progress</span><h2 id="leave-modal-title">Leave this attempt?</h2><p id="leave-modal-description">Returning to the landing page will discard your current answers. You can keep working or leave the test.</p><div class="modal-actions"><button class="button-secondary" type="button" data-action="keep-working">Keep working</button><button class="button-primary" type="button" data-action="discard-test">Discard &amp; go home ${iconArrow()}</button></div></section></div>`;
  document.querySelector('[data-action="keep-working"]')?.focus();
}

function handleClick(event) {
  const target = event.target.closest("[data-action]");
  if (!target) return;
  const action = target.dataset.action;

  if (action === "dismiss-modal" && event.target !== target) return;
  if (target.tagName === "A" || action !== "dismiss-modal") event.preventDefault();

  switch (action) {
    case "start-test":
    case "retake-test":
      startTest();
      break;
    case "go-home":
      if (state.screen === "test") showLeaveTestConfirmation();
      else {
        modalRoot.innerHTML = "";
        showScreen("home");
      }
      break;
    case "select-answer": {
      if (enforceDeadline()) break;
      const choice = Number(target.dataset.choice);
      if (!Number.isInteger(choice) || choice < 0) break;
      state.answers[state.currentIndex] = choice;
      const current = state.currentIndex;
      renderTest();
      document.querySelector(`#answer-${current}-${choice}`)?.focus({ preventScroll: true });
      liveRegion.textContent = `Answer ${ALPHABET[choice]} selected for question ${current + 1}.`;
      break;
    }
    case "previous":
      goToQuestion(state.currentIndex - 1);
      break;
    case "next":
      if (state.currentIndex < QUESTION_BANK.length - 1) {
        goToQuestion(state.currentIndex + 1);
      } else {
        const firstOpen = state.answers.findIndex((answer) => answer === null);
        if (firstOpen >= 0 && firstOpen !== state.currentIndex) goToQuestion(firstOpen);
        else if (firstOpen >= 0) liveRegion.textContent = "This question is unanswered. Select an answer or submit when you are ready.";
        else requestSubmit();
      }
      break;
    case "go-question":
      goToQuestion(Number(target.dataset.index));
      break;
    case "submit-test":
      requestSubmit();
      break;
    case "confirm-submit":
      finishTest();
      break;
    case "keep-working":
    case "dismiss-modal":
      modalRoot.innerHTML = "";
      document.querySelector('[data-action="submit-test"]')?.focus({ preventScroll: true });
      break;
    case "discard-test":
      if (state.timerId) window.clearInterval(state.timerId);
      state.timerId = null;
      state.answers = [];
      state.result = null;
      modalRoot.innerHTML = "";
      renderHome();
      showScreen("home");
      liveRegion.textContent = "Returned to the landing page. The assessment attempt was discarded.";
      break;
    case "filter-category":
    case "filter-review":
      state.selectedCategory = target.dataset.category || "All";
      renderResults();
      document.querySelector("#question-review")?.scrollIntoView({ behavior: "smooth", block: "start" });
      break;
    default:
      break;
  }
}

document.addEventListener("click", handleClick);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modalRoot.firstElementChild) {
    modalRoot.innerHTML = "";
    document.querySelector('[data-action="submit-test"]')?.focus({ preventScroll: true });
  }
});

renderHome();
showScreen("home");
