export interface Domain {
  name: string
  color: string
  icon: string
}

export interface QuestionOption {
  text: string
  scores: Record<string, number>
}

export interface Question {
  id: number
  text: string
  options: QuestionOption[]
  multi?: boolean
}

export const DOMAINS: Domain[] = [
  { name: 'AI & Machine Learning', color: '#ff6b2b', icon: '🤖' },
  { name: 'Data Analysis', color: '#2563eb', icon: '📊' },
  { name: 'Data Science & Engineering', color: '#7c3aed', icon: '🔬' },
  { name: 'Full Stack Engineering', color: '#0891b2', icon: '💻' },
  { name: 'Frontend Development', color: '#f59e0b', icon: '🎨' },
  { name: 'Backend Development', color: '#059669', icon: '⚙️' },
  { name: 'Cloud & Infrastructure', color: '#6366f1', icon: '☁️' },
  { name: 'Cybersecurity', color: '#ef4444', icon: '🔐' },
  { name: 'Product, Design & UX', color: '#ec4899', icon: '✏️' },
  { name: 'Emerging Tech', color: '#14b8a6', icon: '🚀' },
  { name: 'Virtual Assistant', color: '#84cc16', icon: '🗂️' },
  { name: 'AI Automation & No-Code', color: '#f97316', icon: '⚡' },
  { name: 'DevRel & Technical Writing', color: '#8b5cf6', icon: '✍️' },
  { name: 'Mobile Development', color: '#06b6d4', icon: '📱' },
  { name: 'DevSecOps', color: '#334155', icon: '🛡️' },
]

export const QUESTIONS: Question[] = [
  {
    id: 1,
    text: 'If you had to pick a tech career path today, which one feels closest to what you want?',
    options: [
      { text: 'Building AI or machine learning systems', scores: { 'AI & Machine Learning': 15 } },
      { text: 'Analysing data and turning it into insights', scores: { 'Data Analysis': 15 } },
      { text: 'Building websites or web applications', scores: { 'Full Stack Engineering': 15 } },
      { text: 'Building mobile apps', scores: { 'Mobile Development': 15 } },
      { text: 'Cybersecurity or protecting systems', scores: { 'Cybersecurity': 15 } },
      { text: 'Cloud infrastructure and DevOps', scores: { 'Cloud & Infrastructure': 15 } },
      { text: 'Product design and user experience', scores: { 'Product, Design & UX': 15 } },
      { text: 'I genuinely have no idea yet', scores: {} },
    ],
  },
  {
    id: 2,
    text: 'When you solve a problem, which approach do you naturally take?',
    options: [
      { text: 'Break it into data and look for patterns', scores: { 'AI & Machine Learning': 3, 'Data Analysis': 3, 'Data Science & Engineering': 4 } },
      { text: 'Build something step by step and test it', scores: { 'Full Stack Engineering': 3, 'Frontend Development': 2, 'Backend Development': 3, 'Mobile Development': 2 } },
      { text: 'Think about the user experience and how it should feel', scores: { 'Product, Design & UX': 4, 'Frontend Development': 3 } },
      { text: 'Look for security gaps or things that could go wrong', scores: { 'Cybersecurity': 4, 'Cloud & Infrastructure': 2, 'DevSecOps': 4 } },
    ],
  },
  {
    id: 3,
    text: 'What kind of work excites you most on a typical day?',
    options: [
      { text: 'Writing code and building features', scores: { 'Full Stack Engineering': 3, 'Frontend Development': 3, 'Backend Development': 3, 'Mobile Development': 3 } },
      { text: 'Analysing data and drawing insights', scores: { 'Data Analysis': 4, 'Data Science & Engineering': 4 } },
      { text: 'Designing interfaces and user flows', scores: { 'Product, Design & UX': 4, 'Frontend Development': 3 } },
      { text: 'Automating repetitive tasks and building workflows', scores: { 'AI Automation & No-Code': 5, 'Cloud & Infrastructure': 2, 'DevSecOps': 3 } },
    ],
  },
  {
    id: 4,
    text: 'Which of these describes your learning style best?',
    multi: true,
    options: [
      { text: 'I learn by reading documentation and writing things down', scores: { 'DevRel & Technical Writing': 4, 'Data Analysis': 2 } },
      { text: 'I learn by building projects and seeing results', scores: { 'Full Stack Engineering': 3, 'Mobile Development': 3, 'Frontend Development': 3, 'Backend Development': 3 } },
      { text: 'I learn by experimenting and testing hypotheses', scores: { 'AI & Machine Learning': 4, 'Data Science & Engineering': 4, 'Cybersecurity': 3, 'DevSecOps': 3 } },
      { text: 'I learn by watching how users interact with things', scores: { 'Product, Design & UX': 4 } },
      { text: 'I learn by exploring new tools and platforms', scores: { 'Emerging Tech': 4, 'AI Automation & No-Code': 3, 'Virtual Assistant': 2 } },
      { text: 'I learn by organising, scheduling, and supporting others', scores: { 'Virtual Assistant': 5 } },
    ],
  },
  {
    id: 5,
    text: 'How do you feel about mathematics and statistics?',
    options: [
      { text: 'I enjoy it and find it natural', scores: { 'AI & Machine Learning': 5, 'Data Science & Engineering': 5, 'Data Analysis': 3 } },
      { text: 'I can handle it when I need to', scores: { 'Full Stack Engineering': 2, 'Backend Development': 2, 'Cloud & Infrastructure': 2 } },
      { text: 'I prefer to avoid it', scores: { 'Product, Design & UX': 2, 'Virtual Assistant': 3, 'DevRel & Technical Writing': 2, 'AI Automation & No-Code': 2 } },
      { text: 'I use it occasionally for analysis', scores: { 'Data Analysis': 3, 'Product, Design & UX': 2 } },
    ],
  },
  {
    id: 6,
    text: 'What type of project would you be most proud to show someone?',
    multi: true,
    options: [
      { text: 'A mobile app I built from scratch', scores: { 'Mobile Development': 5, 'Full Stack Engineering': 2 } },
      { text: 'A dashboard that visualises real business data', scores: { 'Data Analysis': 4, 'Data Science & Engineering': 3, 'Frontend Development': 2 } },
      { text: 'A machine learning model that makes predictions', scores: { 'AI & Machine Learning': 5, 'Data Science & Engineering': 4 } },
      { text: 'A beautifully designed website or app interface', scores: { 'Frontend Development': 5, 'Product, Design & UX': 4 } },
      { text: 'An automated system that saves hours of manual work', scores: { 'AI Automation & No-Code': 5, 'Backend Development': 3, 'Cloud & Infrastructure': 3, 'DevSecOps': 3 } },
    ],
  },
  {
    id: 7,
    text: 'Which of these tools or concepts are you most drawn to?',
    multi: true,
    options: [
      { text: 'Figma, design systems, and user research', scores: { 'Product, Design & UX': 5, 'Frontend Development': 2 } },
      { text: 'APIs, databases, and server architecture', scores: { 'Backend Development': 5, 'Full Stack Engineering': 3 } },
      { text: 'React, CSS, and browser performance', scores: { 'Frontend Development': 5, 'Full Stack Engineering': 2 } },
      { text: 'Docker, Kubernetes, and cloud platforms', scores: { 'Cloud & Infrastructure': 5, 'DevSecOps': 4 } },
      { text: 'Zapier, Make, Bubble, or Webflow', scores: { 'AI Automation & No-Code': 5, 'Virtual Assistant': 2 } },
    ],
  },
  {
    id: 8,
    text: 'How do you feel about writing and explaining technical concepts?',
    options: [
      { text: 'I love writing and explaining things clearly', scores: { 'DevRel & Technical Writing': 5, 'Product, Design & UX': 2 } },
      { text: 'I prefer to build things rather than explain them', scores: { 'Full Stack Engineering': 3, 'Backend Development': 3, 'AI & Machine Learning': 2 } },
      { text: 'I enjoy presenting to audiences and doing demos', scores: { 'DevRel & Technical Writing': 4, 'Product, Design & UX': 3 } },
      { text: 'I document my work but do not enjoy it as a career', scores: { 'Data Science & Engineering': 2, 'Cloud & Infrastructure': 2 } },
    ],
  },
  {
    id: 9,
    text: 'When you think about your ideal work environment, which fits best?',
    options: [
      { text: 'Deep focus work alone on complex technical problems', scores: { 'AI & Machine Learning': 4, 'Backend Development': 4, 'Data Science & Engineering': 4, 'Cybersecurity': 3, 'DevSecOps': 3 } },
      { text: 'Collaborative work with designers, PMs, and engineers', scores: { 'Frontend Development': 4, 'Product, Design & UX': 4, 'Full Stack Engineering': 3 } },
      { text: 'Building and maintaining infrastructure that keeps things running', scores: { 'Cloud & Infrastructure': 5, 'Backend Development': 3, 'DevSecOps': 4 } },
      { text: 'Flexible remote work supporting clients and teams', scores: { 'Virtual Assistant': 5, 'DevRel & Technical Writing': 3 } },
    ],
  },
  {
    id: 10,
    text: 'Which career outcome excites you most?',
    options: [
      { text: 'Building AI products that solve real world problems', scores: { 'AI & Machine Learning': 5, 'AI Automation & No-Code': 4, 'Data Science & Engineering': 3 } },
      { text: 'Creating apps millions of people use on their phones', scores: { 'Mobile Development': 5, 'Frontend Development': 3, 'Full Stack Engineering': 3 } },
      { text: 'Protecting organisations from cyber attacks', scores: { 'Cybersecurity': 5, 'DevSecOps': 4 } },
      { text: 'Helping developers succeed with tools and documentation', scores: { 'DevRel & Technical Writing': 5 } },
    ],
  },
  {
    id: 11,
    text: 'How comfortable are you with ambiguity and undefined problems?',
    options: [
      { text: 'I thrive in ambiguity and enjoy defining problems', scores: { 'Product, Design & UX': 4, 'Emerging Tech': 4, 'AI Automation & No-Code': 3 } },
      { text: 'I prefer clear specifications before I start', scores: { 'Backend Development': 4, 'Cloud & Infrastructure': 3, 'Data Analysis': 3, 'DevSecOps': 2 } },
      { text: 'I can handle some ambiguity but like structure', scores: { 'Full Stack Engineering': 3, 'Frontend Development': 3, 'Mobile Development': 3 } },
      { text: 'I like following proven processes and best practices', scores: { 'Virtual Assistant': 4, 'DevRel & Technical Writing': 3, 'Data Science & Engineering': 2 } },
    ],
  },
  {
    id: 12,
    text: 'Which of these activities would you do for fun on a weekend?',
    multi: true,
    options: [
      { text: 'Build a small app or script to solve a personal problem', scores: { 'Full Stack Engineering': 3, 'Backend Development': 3, 'Frontend Development': 3, 'Mobile Development': 3 } },
      { text: 'Try to hack a practice target on TryHackMe', scores: { 'Cybersecurity': 5, 'DevSecOps': 4 } },
      { text: 'Explore a new AI tool or no-code platform', scores: { 'AI Automation & No-Code': 4, 'Emerging Tech': 3, 'Virtual Assistant': 2 } },
      { text: 'Redesign an app interface in Figma', scores: { 'Product, Design & UX': 5, 'Frontend Development': 3 } },
      { text: 'Write a blog post or tutorial about something you learned', scores: { 'DevRel & Technical Writing': 5 } },
      { text: 'Analyse a dataset and find interesting patterns', scores: { 'Data Analysis': 5, 'Data Science & Engineering': 4 } },
    ],
  },
  {
    id: 13,
    text: 'When you look at a mobile app, what do you notice first?',
    options: [
      { text: 'How fast it loads and how smooth the animations are', scores: { 'Mobile Development': 5, 'Frontend Development': 4 } },
      { text: 'How the data is structured and where it comes from', scores: { 'Backend Development': 4, 'Data Science & Engineering': 3 } },
      { text: 'How intuitive and easy it is to navigate', scores: { 'Product, Design & UX': 5 } },
      { text: 'What security vulnerabilities it might have', scores: { 'Cybersecurity': 5, 'DevSecOps': 4 } },
    ],
  },
  {
    id: 14,
    text: 'How do you feel about working with large amounts of data?',
    options: [
      { text: 'I love it and want to build pipelines and models with it', scores: { 'Data Science & Engineering': 5, 'AI & Machine Learning': 4 } },
      { text: 'I enjoy analysing it and presenting insights', scores: { 'Data Analysis': 5, 'Data Science & Engineering': 3 } },
      { text: 'I would rather build the systems that collect and store it', scores: { 'Backend Development': 4, 'Cloud & Infrastructure': 4, 'DevSecOps': 2 } },
      { text: 'I prefer working with people and processes over raw data', scores: { 'Virtual Assistant': 4, 'Product, Design & UX': 3, 'DevRel & Technical Writing': 3 } },
    ],
  },
  {
    id: 15,
    text: 'Which programming concept interests you most?',
    options: [
      { text: 'Machine learning algorithms and neural networks', scores: { 'AI & Machine Learning': 5, 'Data Science & Engineering': 4 } },
      { text: 'REST APIs, databases, and authentication systems', scores: { 'Backend Development': 5, 'Full Stack Engineering': 3 } },
      { text: 'Component architecture, animations, and responsive design', scores: { 'Frontend Development': 5, 'Mobile Development': 3 } },
      { text: 'Infrastructure as code and deployment pipelines', scores: { 'Cloud & Infrastructure': 5, 'DevSecOps': 5 } },
    ],
  },
  {
    id: 16,
    text: 'What motivates you most about working in tech?',
    options: [
      { text: 'Building products that directly improve people\'s lives', scores: { 'Mobile Development': 3, 'Full Stack Engineering': 3, 'Product, Design & UX': 4 } },
      { text: 'Solving complex technical problems at scale', scores: { 'Backend Development': 4, 'Cloud & Infrastructure': 4, 'Data Science & Engineering': 4, 'DevSecOps': 3 } },
      { text: 'Staying at the frontier of new technology', scores: { 'Emerging Tech': 5, 'AI & Machine Learning': 3, 'AI Automation & No-Code': 3 } },
      { text: 'Teaching and helping other people grow in tech', scores: { 'DevRel & Technical Writing': 5, 'Virtual Assistant': 2 } },
    ],
  },
  {
    id: 17,
    text: 'How do you prefer to work with other people?',
    options: [
      { text: 'I lead and facilitate, keeping teams organised and moving', scores: { 'Product, Design & UX': 4, 'Virtual Assistant': 4, 'DevRel & Technical Writing': 3 } },
      { text: 'I prefer deep individual work with minimal meetings', scores: { 'AI & Machine Learning': 3, 'Backend Development': 4, 'Data Science & Engineering': 3, 'Cybersecurity': 3, 'DevSecOps': 3 } },
      { text: 'I collaborate closely with designers and PMs to ship features', scores: { 'Frontend Development': 4, 'Full Stack Engineering': 3, 'Mobile Development': 3 } },
      { text: 'I work independently with clients remotely', scores: { 'Virtual Assistant': 5, 'DevRel & Technical Writing': 3 } },
    ],
  },
  {
    id: 18,
    text: 'Which of these challenges would you most enjoy solving?',
    options: [
      { text: 'Why is this ML model performing poorly on new data', scores: { 'AI & Machine Learning': 5, 'Data Science & Engineering': 4 } },
      { text: 'Why does this page load slowly on mobile networks', scores: { 'Frontend Development': 4, 'Mobile Development': 4 } },
      { text: 'How do we automate this 3-hour manual process', scores: { 'AI Automation & No-Code': 5, 'Cloud & Infrastructure': 3, 'DevSecOps': 3 } },
      { text: 'How do we explain this complex API to developers clearly', scores: { 'DevRel & Technical Writing': 5 } },
    ],
  },
  {
    id: 19,
    text: 'What is your relationship with creativity and visual thinking?',
    options: [
      { text: 'I am highly visual and love creating beautiful things', scores: { 'Frontend Development': 5, 'Product, Design & UX': 5 } },
      { text: 'I am creative but in a systems and logic way', scores: { 'Backend Development': 3, 'AI & Machine Learning': 3, 'Cloud & Infrastructure': 3 } },
      { text: 'I prefer clear structured work over open-ended creativity', scores: { 'Data Analysis': 3, 'Virtual Assistant': 3, 'Data Science & Engineering': 3 } },
      { text: 'I am creative in communication and storytelling', scores: { 'DevRel & Technical Writing': 4, 'Product, Design & UX': 3 } },
    ],
  },
  {
    id: 20,
    text: 'When you think about React Native or Flutter, what comes to mind?',
    options: [
      { text: 'I want to build cross-platform mobile apps', scores: { 'Mobile Development': 5 } },
      { text: 'I know about them but prefer web development', scores: { 'Frontend Development': 4, 'Full Stack Engineering': 3 } },
      { text: 'I am not sure what they are', scores: { 'Virtual Assistant': 2, 'AI Automation & No-Code': 2 } },
      { text: 'They interest me as part of a full stack skill set', scores: { 'Full Stack Engineering': 3, 'Mobile Development': 3 } },
    ],
  },
  {
    id: 21,
    text: 'How do you feel about writing articles, tutorials, or documentation?',
    options: [
      { text: 'I genuinely enjoy it and do it already', scores: { 'DevRel & Technical Writing': 5 } },
      { text: 'I would do it as part of a broader role', scores: { 'Product, Design & UX': 2, 'AI & Machine Learning': 2, 'Full Stack Engineering': 2 } },
      { text: 'I prefer building over writing', scores: { 'Backend Development': 3, 'Mobile Development': 3, 'Frontend Development': 3 } },
      { text: 'I write to explain things to non-technical people', scores: { 'Virtual Assistant': 3, 'DevRel & Technical Writing': 4, 'Product, Design & UX': 3 } },
    ],
  },
  {
    id: 22,
    text: 'Which of these tools would you most like to master?',
    multi: true,
    options: [
      { text: 'TensorFlow, PyTorch, or Hugging Face', scores: { 'AI & Machine Learning': 5, 'Data Science & Engineering': 3 } },
      { text: 'React Native or Flutter', scores: { 'Mobile Development': 5 } },
      { text: 'Zapier, Make, or n8n', scores: { 'AI Automation & No-Code': 5, 'Virtual Assistant': 3 } },
      { text: 'Figma and user research tools', scores: { 'Product, Design & UX': 5, 'Frontend Development': 2 } },
      { text: 'Node.js, PostgreSQL, and Docker', scores: { 'Backend Development': 5, 'Full Stack Engineering': 3, 'DevSecOps': 3 } },
      { text: 'dbt, Spark, or Airflow', scores: { 'Data Science & Engineering': 5, 'Data Analysis': 3 } },
    ],
  },
  {
    id: 23,
    text: 'How important is it to you to see your work used by real people quickly?',
    options: [
      { text: 'Very important, I want fast visible results', scores: { 'Frontend Development': 4, 'Mobile Development': 4, 'AI Automation & No-Code': 4, 'Virtual Assistant': 3 } },
      { text: 'Important but I am willing to work on long term projects', scores: { 'Backend Development': 3, 'Cloud & Infrastructure': 3, 'Data Science & Engineering': 3, 'DevSecOps': 3 } },
      { text: 'I prefer deep foundational work even if results take time', scores: { 'AI & Machine Learning': 4, 'Cybersecurity': 3, 'Data Science & Engineering': 3, 'DevSecOps': 3 } },
      { text: 'I want to influence decisions more than build directly', scores: { 'Product, Design & UX': 4, 'DevRel & Technical Writing': 3 } },
    ],
  },
  {
    id: 24,
    text: 'What is your honest relationship with the command line and servers?',
    options: [
      { text: 'I love it and want to live in the terminal', scores: { 'Cloud & Infrastructure': 5, 'Backend Development': 4, 'Cybersecurity': 4, 'DevSecOps': 5 } },
      { text: 'I use it when I need to but prefer GUIs', scores: { 'Full Stack Engineering': 3, 'Data Analysis': 2, 'Frontend Development': 2, 'DevSecOps': 1 } },
      { text: 'I avoid it where possible', scores: { 'AI Automation & No-Code': 3, 'Virtual Assistant': 3, 'Product, Design & UX': 2 } },
      { text: 'I am learning to get comfortable with it', scores: { 'Data Science & Engineering': 3, 'Mobile Development': 2 } },
    ],
  },
  {
    id: 25,
    text: 'In five years, which role fits your vision best?',
    options: [
      { text: 'Senior ML Engineer or AI Researcher', scores: { 'AI & Machine Learning': 5, 'Data Science & Engineering': 3 } },
      { text: 'Lead Mobile Developer building apps used across Africa', scores: { 'Mobile Development': 5 } },
      { text: 'Developer Advocate at a major tech company', scores: { 'DevRel & Technical Writing': 5 } },
      { text: 'Automation Consultant helping businesses work smarter', scores: { 'AI Automation & No-Code': 5, 'Virtual Assistant': 3 } },
    ],
  },
]
