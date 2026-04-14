const { Anthropic } = require('@anthropic-ai/sdk');
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const QUESTIONS = [ /* paste all 18 questions from your index.html here */ ];

function scoreAssessment(answers) {
  const scores = {
    "AI & Machine Learning": 0, "Data": 0, /* ... all 8 domains */
  };
  // exact scoring logic from spec
  answers.forEach((ans, qIdx) => {
    const q = QUESTIONS[qIdx];
    const indices = Array.isArray(ans) ? ans : [ans];
    indices.forEach(i => {
      const weights = q.options[i].scores;
      Object.keys(scores).forEach((domain, idx) => scores[domain] += weights[idx]);
    });
  });
  return scores;
}

async function analyseGoalAlignment(statedGoal, topMatch, secondMatch, scores) {
  const scoresSummary = Object.entries(scores).map(([d, s]) => `${d}: ${s}`).join(', ');
  const prompt = `...` + /* exact prompt from section 16 */ ;

  const msg = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1000,
    messages: [{ role: 'user', content: prompt }]
  });

  return JSON.parse(msg.content[0].text);
}

module.exports = { scoreAssessment, analyseGoalAlignment };