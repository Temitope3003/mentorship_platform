import { DOMAINS, QUESTIONS } from '../utils/questionData';

export function scoreAssessment(
  answers: (number | number[])[]
): Record<string, number> {
  const scores: Record<string, number> = {};
  DOMAINS.forEach((d) => {
    scores[d.name] = 0;
  });

  answers.forEach((answer, qi) => {
    if (answer === null || answer === undefined) return;
    if (!QUESTIONS[qi]) return;

    const indices = Array.isArray(answer) ? answer : [answer];

    indices.forEach((ai) => {
      const option = QUESTIONS[qi].options[ai];
      if (!option) return;
      DOMAINS.forEach((d, i) => {
        scores[d.name] += option.scores[i];
      });
    });
  });

  return scores;
}

export function rankDomains(scores: Record<string, number>) {
  return Object.entries(scores)
    .sort(([, a], [, b]) => b - a)
    .map(([domain, score]) => ({ domain, score }));
}

export function generateAccessCode(
  name: string,
  existingCodes: string[]
): string {
  const base = name
    .split(' ')[0]
    .toUpperCase()
    .replace(/[^A-Z]/g, '')
    .substring(0, 6);

  let code: string;
  let attempts = 0;

  do {
    const num = Math.floor(1000 + Math.random() * 9000);
    code = `${base}-${num}`;
    attempts++;
    if (attempts > 100) {
      code = `USER-${Date.now().toString().slice(-4)}`;
      break;
    }
  } while (existingCodes.includes(code));

  return code;
}