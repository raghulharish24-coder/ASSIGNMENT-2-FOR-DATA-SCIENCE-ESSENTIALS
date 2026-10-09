# ASSIGNMENT-2-FOR-DATA-SCIENCE-ESSENTIALS

## Aptitude Test Analysis

A responsive, browser-based aptitude assessment and results dashboard built as a college software project. The site uses a black, electric-blue and white visual system and calculates demo results locally in the browser.

### Assessment overview

- **16 sample multiple-choice questions** across Quantitative Aptitude, Logical Reasoning, Verbal Ability and Data Interpretation (four questions per area).
- **20-minute countdown timer** with automatic submission when time expires.
- Question navigation, progress indicator, answer selection, and confirmation before submitting with unanswered questions.
- Results summary with score, percentage, accuracy, correct / incorrect / unanswered counts, and time taken.
- Interactive category performance chart, strongest and focus-area summaries, and targeted improvement suggestions.
- Expandable question review with the selected answer, correct answer, and explanation.
- Retake and restart controls.

### Run locally

No package installation is required. From the repository directory, run:

```bash
python3 -m http.server 3000 --bind 127.0.0.1
```

Then open <http://localhost:3000> in a modern browser. Serve the files over HTTP rather than opening `index.html` directly as a `file://` URL, because the application uses native JavaScript modules.

### Scoring

- **Overall percentage** = correct answers ÷ all 16 questions.
- **Accuracy** = correct answers ÷ attempted questions. Unanswered questions do not enter the accuracy denominator.
- Unanswered questions count as zero toward the overall score. An entirely blank attempt reports 0% accuracy.
- Category results, time taken and recommendations are calculated from the current attempt.

### Project structure

```text
.
├── index.html              # Application shell and metadata
├── favicon.svg             # Aptitude Index mark
└── src/
    ├── assessment.js       # Scoring and duration helpers
    ├── charts.js           # SVG score ring and category chart
    ├── main.js             # Screens, state, timer and interactions
    ├── questions.js        # Sample question bank and category definitions
    └── styles.css          # Responsive visual system
```

The interface is client-side only; no account, database or server-side submission is required for this sample demonstration.
