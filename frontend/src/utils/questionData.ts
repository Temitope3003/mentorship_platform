export const DOMAINS = [
  { name: 'AI & Machine Learning', color: '#ff6b2b', icon: '🤖' },
  { name: 'Data Analysis', color: '#2563eb', icon: '📊' },
  { name: 'Software Engineering', color: '#7c3aed', icon: '💻' },
  { name: 'Cloud & Infrastructure', color: '#0891b2', icon: '☁️' },
  { name: 'CyberSecurity', color: '#ef4444', icon: '🔐' },
  { name: 'Product & Design', color: '#ec4899', icon: '🎨' },
  { name: 'Emerging Tech', color: '#f59e0b', icon: '🚀' },
  { name: 'Virtual Assistant', color: '#059669', icon: '🗂️' },
]

export const QUESTIONS = [
  {
    text: 'What best describes your background right now?',
    options: [
      { text: 'No tech background at all' },
      { text: 'Some coding or tech exposure' },
      { text: 'Business or admin background' },
      { text: 'Creative or design background' },
      { text: 'Science or math background' },
    ],
  },
  {
    text: 'When you face a problem, your first instinct is to:',
    options: [
      { text: 'Break it into logical steps and solve it' },
      { text: 'Look for patterns or trends in the situation' },
      { text: 'Think about who is affected and what they need' },
      { text: 'Find the flaw or weak point in the system' },
      { text: 'Imagine a completely different approach' },
      { text: 'Organize the moving parts and manage the process' },
    ],
  },
  {
    text: 'Which activity sounds most exciting to you?',
    multi: true,
    options: [
      { text: 'Writing code that builds something from scratch' },
      { text: 'Setting up and automating systems' },
      { text: 'Analyzing data to find useful insights' },
      { text: 'Designing apps and user experiences' },
      { text: 'Protecting systems from attackers' },
      { text: 'Supporting and organizing a high-performing team' },
      { text: 'Building AI-powered tools and models' },
      { text: 'Exploring blockchain, AR/VR, or robotics' },
    ],
  },
  {
    text: 'How do you feel about math and statistics?',
    options: [
      { text: 'I enjoy them and use them comfortably' },
      { text: 'I can handle basic math when I need to' },
      { text: 'I prefer working without heavy math' },
    ],
  },
  {
    text: 'What kind of work environment appeals to you most?',
    multi: true,
    options: [
      { text: 'Deep technical focus, solving hard problems' },
      { text: 'Collaborating with teams and different people' },
      { text: 'Building visible things people interact with daily' },
      { text: 'Working remotely with full flexibility' },
      { text: 'Exploring new and undefined territory' },
    ],
  },
  {
    text: 'What kind of impact do you want your work to have?',
    multi: true,
    options: [
      { text: 'Build products that millions of people use' },
      { text: 'Keep critical systems safe and protected' },
      { text: 'Help organisations make smarter decisions' },
      { text: 'Support and empower high-performing people' },
      { text: 'Shape what technology looks like in the future' },
      { text: 'Keep infrastructure running reliably at scale' },
    ],
  },
  {
    text: 'How do you feel about visual and creative work?',
    options: [
      { text: 'It is one of my strongest skills' },
      { text: 'I appreciate good design but prefer building logic' },
      { text: 'I prefer purely technical work with no design' },
    ],
  },
  {
    text: 'When something breaks or goes wrong, you:',
    options: [
      { text: 'Want to find the root cause immediately' },
      { text: 'Look at data to understand what happened' },
      { text: 'Fix the broken thing and move on quickly' },
      { text: 'Think about how users were affected' },
      { text: 'Find the right person to handle it' },
    ],
  },
  {
    text: 'Which have you tried or feel most drawn to?',
    multi: true,
    options: [
      { text: 'Spreadsheets and organising data' },
      { text: 'Building or tinkering with websites' },
      { text: 'Setting up software or tools for a team' },
      { text: 'Managing calendars, emails, and schedules' },
      { text: 'Drawing wireframes or designing interfaces' },
      { text: 'Writing scripts or automations' },
      { text: 'Hacking, gaming, or probing how systems work' },
      { text: 'Using AI tools like ChatGPT or Claude' },
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
      { text: 'Deep dives into one subject until I master it' },
      { text: 'Mixing different skills and topics together' },
      { text: 'Building and experimenting hands-on' },
      { text: 'Watching, copying, and practising what I see' },
    ],
  },
  {
    text: 'Which sentence describes you best?',
    options: [
      { text: 'I like building reliable systems that work behind the scenes' },
      { text: 'I like making things people can see and interact with' },
      { text: 'I like protecting and securing systems from threats' },
      { text: 'I like organising and making sense of information' },
      { text: 'I like supporting and helping others succeed' },
      { text: 'I like being at the edge of what is possible' },
    ],
  },
  {
    text: 'Do you prefer working alone, in a small team, or with clients daily?',
    options: [
      { text: 'Alone, with deep uninterrupted focus' },
      { text: 'Small technical team, everyone pulls their weight' },
      { text: 'Directly with clients and different people daily' },
      { text: 'A mix, I adapt to what the situation needs' },
    ],
  },
  {
    text: 'Are you comfortable speaking up, presenting, or leading conversations?',
    options: [
      { text: 'Yes, I enjoy it and it comes naturally' },
      { text: 'I can do it when needed but I prefer not to' },
      { text: 'I strongly prefer working quietly in the background' },
    ],
  },
  {
    text: 'Do you prefer deep focus on one thing or switching tasks daily?',
    options: [
      { text: 'Deep focus on one thing for a long time' },
      { text: 'Switching between different tasks every day' },
      { text: 'A mix of both depending on the phase' },
    ],
  },
  {
    text: 'Are you comfortable with structured repeatable work or do you need new challenges?',
    options: [
      { text: 'I prefer structured, repeatable work' },
      { text: 'I need constant new challenges to stay engaged' },
      { text: 'I like both depending on the project' },
    ],
  },
  {
    text: 'How confident are you putting your thoughts into clear writing?',
    options: [
      { text: 'Very confident, writing is one of my strengths' },
      { text: 'Average, I get my point across' },
      { text: 'I prefer technical work over writing' },
    ],
  },
  {
    text: 'How many hours per week can you realistically commit to learning?',
    options: [
      { text: 'Less than 5 hours' },
      { text: '5 to 10 hours' },
      { text: '10 to 20 hours' },
      { text: '20+ hours, I am fully committed' },
    ],
  },
]