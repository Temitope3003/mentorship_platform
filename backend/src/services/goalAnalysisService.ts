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

  const prompt = `You are a tech career advisor working with beginner mentees.

Mentee stated goal: "${statedGoal}"
Top aptitude match: ${topMatch}
Second aptitude match: ${secondMatch}
All domain scores: ${scoresSummary}
Available domains: ${domainList}

Respond ONLY with this exact JSON structure, no extra text, no markdown:
{
  "goalDomain": "the domain name from the available list that best matches the stated goal",
  "alignmentStatus": "match or partial or conflict",
  "alignmentSummary": "2 sentences max. Plain language. What their goal maps to and whether it aligns with their aptitude.",
  "warningText": "2 to 3 sentences explaining the gap if conflict or partial. Honest but encouraging. Empty string if match.",
  "mentorNote": "1 to 2 sentences written for the mentor about what to discuss in the first 1-on-1.",
  "choiceContext": "1 sentence explaining what choosing goal path versus aptitude path means practically."
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