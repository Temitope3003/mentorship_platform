import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export interface GoalAnalysis {
  goalDomain: string;
  alignmentStatus: 'match' | 'partial' | 'conflict';
  alignmentSummary: string;
  warningText: string;
  mentorNote: string;
  choiceContext: string;
}

export async function analyseGoalAlignment(
  statedGoal: string,
  topMatch: string,
  secondMatch: string,
  scores: Record<string, number>
): Promise<GoalAnalysis> {
  const scoresSummary = Object.entries(scores)
    .map(([d, s]) => `${d}: ${s}`)
    .join(', ');

  const domainList = Object.keys(scores).join(', ');

  const prompt = `You are a tech career mentor writing directly to a person who just completed their aptitude assessment. You are writing TO them, not about them.

CRITICAL VOICE RULES — follow these without exception:
- Always use "you" and "your". Never write "the mentee", "they", "their", or any third-person reference to the person.
- Write like a mentor talking to someone face-to-face — warm, direct, honest.
- Short sentences. No hedging words like "it's possible that", "may potentially", "however with dedication", or "it's essential to explore".
- Do NOT soften real findings. If there's a genuine mismatch between their goal and aptitude, say it clearly. Just say it like a person, not a case file.

TONE EXAMPLES (follow this style):
- BAD: "The mentee's top aptitude matches are in AI & Machine Learning and Data Science & Engineering, which indicates a potential mismatch with their stated goal."
- GOOD: "Your natural strengths showed up strongest in AI & Machine Learning and Data Science — that's where your aptitude is pointing right now."

- BAD: "While it's possible to pursue backend development, the mentee's strengths lie elsewhere. It's essential to discuss and explore these options further."
- GOOD: "Your goal of becoming a backend engineer doesn't fully match where your strengths showed up in this assessment. That doesn't mean you can't do it — it just means you'd be building against the grain rather than with it."

- BAD: "Choosing to pursue the goal path versus the aptitude path means practically deciding between developing skills in a specific area versus leveraging their natural strengths."
- GOOD: "You could either push toward backend since that's your goal, or follow where your natural strengths already are. Both are real options — the question is what kind of work will keep you motivated for the next 12 months."

---

Person's stated goal: "${statedGoal}"
Their top aptitude match: ${topMatch}
Their second aptitude match: ${secondMatch}
All domain scores: ${scoresSummary}
Available domains: ${domainList}

Respond ONLY with this exact JSON structure, no extra text, no markdown:
{
  "goalDomain": "the domain name from the available list that best matches the stated goal",
  "alignmentStatus": "match or partial or conflict",
  "alignmentSummary": "2 sentences max. Written directly to them using you/your. What their goal maps to and whether it lines up with their aptitude. Plain language.",
  "warningText": "2 to 3 sentences written directly to them using you/your. Honest about the gap if conflict or partial, but not harsh. Empty string if match.",
  "mentorNote": "1 to 2 sentences written for the mentor (third person is fine here only) about what to cover in the first 1-on-1.",
  "choiceContext": "2 to 3 sentences written directly to them using you/your. What following each path would actually mean for them in practical terms — like real advice, not an abstract description of a decision."
}`;

  try {
    const completion = await groq.chat.completions.create({
      
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 1000,
    });

    

    const text = completion.choices[0]?.message?.content || '';

    

    if (!text) {
      throw new Error('Groq returned empty content');
    }

    const clean = text.replace(/```json|```/g, '').trim();

    

    return JSON.parse(clean);

  } catch (error) {
    console.error('Goal analysis error:', JSON.stringify(error));
    return {
      goalDomain: topMatch,
      alignmentStatus: 'match',
      alignmentSummary:
        'Your assessment results point toward ' +
        topMatch +
        '. This aligns with your overall aptitude profile.',
      warningText: '',
      mentorNote:
        'AI analysis was unavailable. Review the mentee scores manually.',
      choiceContext:
        'Follow your aptitude match to get started on a proven path.',
    };
  }
}