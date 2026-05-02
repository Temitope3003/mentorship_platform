export const DOMAINS = [
  { name: 'AI & Machine Learning', color: '#ff6b2b' },
  { name: 'Data Analysis', color: '#2563eb' },
  { name: 'Software Engineering', color: '#7c3aed' },
  { name: 'Cloud & Infrastructure', color: '#0891b2' },
  { name: 'CyberSecurity', color: '#ef4444' },
  { name: 'Product & Design', color: '#ec4899' },
  { name: 'Emerging Tech', color: '#f59e0b' },
  { name: 'Virtual Assistant', color: '#059669' },
];

export const QUESTIONS = [
  {
    text: 'What best describes your background right now?',
    options: [
      { text: 'No tech background at all', scores: [0,0,0,0,0,1,0,2] },
      { text: 'Some coding or tech exposure', scores: [1,1,2,2,1,0,1,0] },
      { text: 'Business or admin background', scores: [0,1,0,0,0,2,0,2] },
      { text: 'Creative or design background', scores: [0,0,1,0,0,3,1,1] },
      { text: 'Science or math background', scores: [2,2,1,1,0,0,1,0] },
    ],
  },
  {
    text: 'When you face a problem, your first instinct is to:',
    options: [
      { text: 'Break it into logical steps and solve it', scores: [1,1,2,2,1,0,0,0] },
      { text: 'Look for patterns or trends in the situation', scores: [1,2,0,0,0,0,0,0] },
      { text: 'Think about who is affected and what they need', scores: [0,0,0,0,0,2,0,2] },
      { text: 'Find the flaw or weak point in the system', scores: [0,0,1,1,3,0,1,0] },
      { text: 'Imagine a completely different approach', scores: [2,0,1,0,0,1,3,0] },
      { text: 'Organize the moving parts and manage the process', scores: [0,1,0,1,0,1,0,3] },
    ],
  },
  {
    text: 'Which activity sounds most exciting to you?',
    multi: true,
    options: [
      { text: 'Writing code that builds something from scratch', scores: [0,0,3,0,0,0,0,0] },
      { text: 'Setting up and automating systems', scores: [0,0,0,3,0,0,0,0] },
      { text: 'Analyzing data to find useful insights', scores: [1,3,0,0,0,0,0,0] },
      { text: 'Designing apps and user experiences', scores: [0,0,0,0,0,3,0,0] },
      { text: 'Protecting systems from attackers', scores: [0,0,0,0,3,0,0,0] },
      { text: 'Supporting and organizing a high-performing team', scores: [0,0,0,0,0,0,0,3] },
      { text: 'Building AI-powered tools and models', scores: [3,0,0,0,0,0,1,0] },
      { text: 'Exploring blockchain, AR/VR, or robotics', scores: [0,0,0,0,0,0,3,0] },
    ],
  },
  {
    text: 'How do you feel about math and statistics?',
    options: [
      { text: 'I enjoy them and use them comfortably', scores: [2,2,1,0,0,0,1,0] },
      { text: 'I can handle basic math when I need to', scores: [0,1,1,1,1,1,1,0] },
      { text: 'I prefer working without heavy math', scores: [0,0,1,1,1,2,0,2] },
    ],
  },
  {
    text: 'What kind of work environment appeals to you most?',
    multi: true,
    options: [
      { text: 'Deep technical focus, solving hard problems', scores: [2,1,1,2,2,0,1,0] },
      { text: 'Collaborating with teams and different people', scores: [0,0,0,0,0,2,0,2] },
      { text: 'Building visible things people interact with daily', scores: [0,0,2,0,0,2,0,0] },
      { text: 'Working remotely with full flexibility', scores: [0,0,0,0,0,0,0,3] },
      { text: 'Exploring new and undefined territory', scores: [2,0,0,0,0,0,3,0] },
    ],
  },
  {
    text: 'What kind of impact do you want your work to have?',
    multi: true,
    options: [
      { text: 'Build products that millions of people use', scores: [0,0,2,0,0,2,0,0] },
      { text: 'Keep critical systems safe and protected', scores: [0,0,0,1,3,0,0,0] },
      { text: 'Help organisations make smarter decisions', scores: [1,3,0,0,0,1,0,0] },
      { text: 'Support and empower high-performing people', scores: [0,0,0,0,0,1,0,3] },
      { text: 'Shape what technology looks like in the future', scores: [3,0,0,0,0,0,3,0] },
      { text: 'Keep infrastructure running reliably at scale', scores: [0,0,0,3,0,0,0,0] },
    ],
  },
  {
    text: 'How do you feel about visual and creative work?',
    options: [
      { text: 'It is one of my strongest skills', scores: [0,0,0,0,0,3,0,1] },
      { text: 'I appreciate good design but prefer building logic', scores: [0,0,2,1,1,0,1,0] },
      { text: 'I prefer purely technical work with no design', scores: [1,2,1,2,2,0,0,0] },
    ],
  },
  {
    text: 'When something breaks or goes wrong, you:',
    options: [
      { text: 'Want to find the root cause immediately', scores: [0,0,0,2,3,0,0,0] },
      { text: 'Look at data to understand what happened', scores: [1,3,0,0,0,0,0,0] },
      { text: 'Fix the broken thing and move on quickly', scores: [0,0,3,0,0,0,0,0] },
      { text: 'Think about how users were affected', scores: [0,0,0,0,0,3,0,0] },
      { text: 'Find the right person to handle it', scores: [0,0,0,0,0,0,0,3] },
    ],
  },
  {
    text: 'Which have you tried or feel most drawn to?',
    multi: true,
    options: [
      { text: 'Spreadsheets and organising data', scores: [0,2,0,0,0,0,0,2] },
      { text: 'Building or tinkering with websites', scores: [0,0,3,0,0,1,0,0] },
      { text: 'Setting up software or tools for a team', scores: [0,0,0,2,0,0,0,2] },
      { text: 'Managing calendars, emails, and schedules', scores: [0,0,0,0,0,0,0,3] },
      { text: 'Drawing wireframes or designing interfaces', scores: [0,0,0,0,0,3,0,0] },
      { text: 'Writing scripts or automations', scores: [1,0,1,3,0,0,1,0] },
      { text: 'Hacking, gaming, or probing how systems work', scores: [1,0,1,0,3,0,1,0] },
      { text: 'Using AI tools like ChatGPT or Claude', scores: [3,0,0,0,0,0,1,1] },
    ],
  },
  {
    text: 'What is your target income in 3 years?',
    options: [
      { text: 'Stable income first, I will grow over time', scores: [0,0,1,1,0,0,0,2] },
      { text: '₦2M to ₦4 per year', scores: [0,1,1,1,0,0,0,2] },
      { text: '₦5M to ₦7M per year', scores: [1,1,1,2,2,1,0,0] },
      { text: '₦8+ and I will put in the work', scores: [2,1,1,1,2,1,2,0] },
    ],
  },
  {
    text: 'How do you prefer to learn new skills?',
    options: [
      { text: 'Deep dives into one subject until I master it', scores: [2,2,2,2,2,0,0,0] },
      { text: 'Mixing different skills and topics together', scores: [0,0,1,1,0,2,2,2] },
      { text: 'Building and experimenting hands-on', scores: [1,0,2,2,1,1,2,0] },
      { text: 'Watching, copying, and practising what I see', scores: [0,1,1,0,0,2,0,2] },
    ],
  },
  {
    text: 'Which sentence describes you best?',
    options: [
      { text: 'I like building reliable systems that work behind the scenes', scores: [1,1,2,3,0,0,0,0] },
      { text: 'I like making things people can see and interact with', scores: [0,0,2,0,0,3,0,0] },
      { text: 'I like protecting and securing systems from threats', scores: [0,0,0,1,3,0,0,0] },
      { text: 'I like organising and making sense of information', scores: [0,2,0,0,0,0,0,2] },
      { text: 'I like supporting and helping others succeed', scores: [0,0,0,0,0,1,0,3] },
      { text: 'I like being at the edge of what is possible', scores: [3,0,0,0,0,0,3,0] },
    ],
  },
  {
    text: 'Do you prefer working alone, in a small team, or with clients daily?',
    options: [
      { text: 'Alone, with deep uninterrupted focus', scores: [2,2,2,2,2,0,1,0] },
      { text: 'Small technical team, everyone pulls their weight', scores: [1,1,1,2,1,1,1,0] },
      { text: 'Directly with clients and different people daily', scores: [0,0,0,0,0,2,0,3] },
      { text: 'A mix, I adapt to what the situation needs', scores: [1,1,1,0,0,2,1,2] },
    ],
  },
  {
    text: 'Are you comfortable speaking up, presenting, or leading conversations?',
    options: [
      { text: 'Yes, I enjoy it and it comes naturally', scores: [0,0,0,0,0,3,0,3] },
      { text: 'I can do it when needed but I prefer not to', scores: [1,1,1,1,1,0,1,0] },
      { text: 'I strongly prefer working quietly in the background', scores: [2,2,2,2,2,0,1,0] },
    ],
  },
  {
    text: 'Do you prefer deep focus on one thing or switching tasks daily?',
    options: [
      { text: 'Deep focus on one thing for a long time', scores: [3,2,2,2,2,0,1,0] },
      { text: 'Switching between different tasks every day', scores: [0,1,0,0,0,2,0,3] },
      { text: 'A mix of both depending on the phase', scores: [1,1,1,1,1,2,1,1] },
    ],
  },
  {
    text: 'Are you comfortable with structured repeatable work or do you need new challenges?',
    options: [
      { text: 'I prefer structured, repeatable work', scores: [0,1,0,1,1,0,0,3] },
      { text: 'I need constant new challenges to stay engaged', scores: [2,0,1,0,1,1,3,0] },
      { text: 'I like both depending on the project', scores: [1,1,1,1,1,1,1,1] },
    ],
  },
  {
    text: 'How confident are you putting your thoughts into clear writing?',
    options: [
      { text: 'Very confident, writing is one of my strengths', scores: [0,1,0,0,0,3,0,3] },
      { text: 'Average, I get my point across', scores: [1,1,1,1,1,1,1,1] },
      { text: 'I prefer technical work over writing', scores: [2,2,2,2,2,0,1,0] },
    ],
  },
  {
    text: 'How many hours per week can you realistically commit to learning?',
    options: [
      { text: 'Less than 5 hours', scores: [0,0,0,0,0,1,0,2] },
      { text: '5 to 10 hours', scores: [0,1,1,1,0,1,0,1] },
      { text: '10 to 20 hours', scores: [1,1,1,1,1,1,1,0] },
      { text: '20+ hours, I am fully committed', scores: [2,2,2,2,2,1,2,0] },
    ],
  },
];