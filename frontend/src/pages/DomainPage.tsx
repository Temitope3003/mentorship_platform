import { useParams, Link } from 'react-router-dom'
import { DOMAINS } from '../utils/questionData'

const DOMAIN_DETAILS: Record<string, {
  tagline: string
  description: string
  whatYouDo: string[]
  salaryNigeria: string
  salaryGlobal: string
  topRoles: { title: string; desc: string }[]
  tools: string[]
  perfectFor: string[]
  notFor: string[]
  firstStep: string
}> = {
  'AI & Machine Learning': {
    tagline: 'Build intelligent systems that learn from data',
    description: 'AI and Machine Learning engineers design, build, and deploy systems that learn patterns from data and make predictions or decisions automatically. This is one of the fastest growing and highest paying fields in tech.',
    whatYouDo: [
      'Build and train machine learning models using Python',
      'Process and clean large datasets for model training',
      'Deploy models as APIs that power real products',
      'Monitor model performance and retrain when accuracy drops',
      'Work with teams to integrate AI into business products',
    ],
    salaryNigeria: '₦800,000 – ₦3,500,000 per month (junior to senior)',
    salaryGlobal: '$80,000 – $200,000 per year (USA/Europe)',
    topRoles: [
      { title: 'ML Engineer', desc: 'Builds and deploys machine learning models into production systems' },
      { title: 'MLOps Engineer', desc: 'Manages the infrastructure and pipelines that keep ML models running reliably' },
      { title: 'AI Research Engineer', desc: 'Explores new algorithms and techniques to push the boundaries of what AI can do' },
      { title: 'Data Scientist', desc: 'Analyses data to find insights and builds predictive models for business decisions' },
      { title: 'AI Product Manager', desc: 'Defines the strategy and roadmap for AI-powered products' },
    ],
    tools: ['Python', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'Pandas', 'MLflow', 'Docker', 'FastAPI', 'Hugging Face', 'SQL'],
    perfectFor: [
      'You enjoy math, statistics, or logical thinking',
      'You are curious about how things work at a deep level',
      'You like working with data and finding patterns',
      'You want to build systems that improve over time',
    ],
    notFor: [
      'You want to see results quickly without deep study',
      'You dislike mathematics entirely',
      'You prefer building visual interfaces over backend systems',
    ],
    firstStep: 'Go to cs50.harvard.edu/python and enroll in the free Python course today.',
  },

  'Data Analysis': {
    tagline: 'Turn raw data into decisions that drive business growth',
    description: 'Data analysts and analytics engineers help organisations understand what is happening in their business, why it is happening, and what to do about it. Every company that collects data needs someone who can make sense of it.',
    whatYouDo: [
      'Write SQL queries to extract and analyse business data',
      'Build dashboards and reports in tools like Looker or Tableau',
      'Identify trends, anomalies, and opportunities in data',
      'Present findings to non-technical stakeholders clearly',
      'Build data pipelines that automate reporting workflows',
    ],
    salaryNigeria: '₦600,000 – ₦2,500,000 per month (junior to senior)',
    salaryGlobal: '$60,000 – $150,000 per year (USA/Europe)',
    topRoles: [
      { title: 'Data Analyst', desc: 'Analyses business data to answer specific questions and support decisions' },
      { title: 'Analytics Engineer', desc: 'Builds the data models and pipelines that power analytics tools' },
      { title: 'Business Intelligence Engineer', desc: 'Designs dashboards and reporting systems for business stakeholders' },
      { title: 'Data Engineer', desc: 'Builds the infrastructure that collects, stores, and processes large volumes of data' },
      { title: 'Product Analyst', desc: 'Analyses user behaviour to improve product features and growth metrics' },
    ],
    tools: ['SQL', 'Python', 'Pandas', 'dbt', 'Looker Studio', 'Tableau', 'BigQuery', 'Airflow', 'Excel', 'Power BI'],
    perfectFor: [
      'You are detail-oriented and enjoy working with numbers',
      'You like telling stories with data',
      'You want to influence business strategy with evidence',
      'You enjoy organising and making sense of information',
    ],
    notFor: [
      'You dislike working with spreadsheets or databases',
      'You prefer building products people interact with directly',
      'You want to avoid business communication entirely',
    ],
    firstStep: 'Go to mode.com/sql-tutorial and complete the first 2 sections today.',
  },

  'Software Engineering': {
    tagline: 'Build the apps, systems, and tools the world runs on',
    description: 'Software engineers design and build the applications that people use every day. From mobile apps to web platforms to backend systems, software engineers are the builders of the digital world. This is the largest and most stable tech career path.',
    whatYouDo: [
      'Write clean, maintainable code in languages like JavaScript, Python, or Go',
      'Build APIs that connect frontend apps to databases and services',
      'Design systems that handle thousands of users reliably',
      'Review other engineers code and collaborate on solutions',
      'Debug problems and improve performance of existing systems',
    ],
    salaryNigeria: '₦700,000 – ₦3,000,000 per month (junior to senior)',
    salaryGlobal: '$70,000 – $180,000 per year (USA/Europe)',
    topRoles: [
      { title: 'Frontend Engineer', desc: 'Builds the user interfaces that people see and interact with in browsers and apps' },
      { title: 'Backend Engineer', desc: 'Builds the servers, APIs, and databases that power applications' },
      { title: 'Full Stack Engineer', desc: 'Works across both frontend and backend to build complete features' },
      { title: 'Mobile Engineer', desc: 'Builds iOS and Android applications for phones and tablets' },
      { title: 'Platform Engineer', desc: 'Builds internal tools and systems that other engineers use to build products' },
    ],
    tools: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'PostgreSQL', 'Docker', 'Git', 'REST APIs', 'AWS'],
    perfectFor: [
      'You enjoy building things and seeing them work',
      'You like solving logical problems step by step',
      'You want many job options across all industries',
      'You are patient with debugging and troubleshooting',
    ],
    notFor: [
      'You expect results without deep practice',
      'You want to avoid writing code entirely',
      'You strongly dislike sitting with a difficult problem for hours',
    ],
    firstStep: 'Go to theodinproject.com and start the Foundations path today. It is completely free.',
  },

  'Cloud & Infrastructure': {
    tagline: 'Keep the internet running reliably at scale',
    description: 'Cloud and infrastructure engineers build and manage the systems that keep applications running reliably 24 hours a day. Every app you use runs on infrastructure that someone designed and maintains. This field pays extremely well because downtime costs companies millions.',
    whatYouDo: [
      'Set up and manage cloud infrastructure on AWS, GCP, or Azure',
      'Automate infrastructure using code tools like Terraform',
      'Build CI/CD pipelines that deploy code safely and automatically',
      'Monitor systems and respond to incidents quickly',
      'Keep infrastructure costs optimised and systems secure',
    ],
    salaryNigeria: '₦800,000 – ₦3,500,000 per month (junior to senior)',
    salaryGlobal: '$85,000 – $200,000 per year (USA/Europe)',
    topRoles: [
      { title: 'Cloud Engineer', desc: 'Designs and manages cloud infrastructure on AWS, GCP, or Azure' },
      { title: 'DevOps Engineer', desc: 'Bridges development and operations to speed up delivery and improve reliability' },
      { title: 'Site Reliability Engineer', desc: 'Ensures large-scale systems stay fast, reliable, and available' },
      { title: 'Platform Engineer', desc: 'Builds internal platforms that make other engineers more productive' },
      { title: 'Infrastructure Engineer', desc: 'Manages the servers, networks, and systems that applications run on' },
    ],
    tools: ['AWS', 'GCP', 'Docker', 'Kubernetes', 'Terraform', 'Ansible', 'GitHub Actions', 'Linux', 'Python', 'Prometheus'],
    perfectFor: [
      'You love automating repetitive tasks',
      'You enjoy systems thinking and understanding how things connect',
      'You want to work on problems that affect millions of users',
      'You are calm under pressure and good at troubleshooting',
    ],
    notFor: [
      'You want to build visible user-facing products',
      'You dislike working with command line tools',
      'You want quick results without deep systems knowledge',
    ],
    firstStep: 'Set up a free AWS account at aws.amazon.com and complete the Getting Started with EC2 tutorial.',
  },

  'Cybersecurity': {
    tagline: 'Protect systems, data, and people from digital threats',
    description: 'Cybersecurity professionals protect organisations from hackers, data breaches, and digital attacks. With cybercrime costing trillions of dollars globally every year, skilled security professionals are in extremely high demand and short supply. Nigeria\'s growing digital economy needs them urgently.',
    whatYouDo: [
      'Find and fix vulnerabilities in systems before attackers do',
      'Monitor networks and systems for signs of attack',
      'Run penetration tests to expose security weaknesses',
      'Respond to security incidents and limit damage',
      'Advise organisations on how to build securely from the start',
    ],
    salaryNigeria: '₦700,000 – ₦3,000,000 per month (junior to senior)',
    salaryGlobal: '$75,000 – $180,000 per year (USA/Europe)',
    topRoles: [
      { title: 'Penetration Tester', desc: 'Ethically hacks systems to find vulnerabilities before real attackers do' },
      { title: 'Security Analyst', desc: 'Monitors systems for threats and investigates security incidents' },
      { title: 'SOC Analyst', desc: 'Works in a security operations centre responding to alerts around the clock' },
      { title: 'Security Engineer', desc: 'Builds and maintains security systems and tools' },
      { title: 'Cloud Security Engineer', desc: 'Specialises in securing cloud infrastructure and applications' },
    ],
    tools: ['Kali Linux', 'Burp Suite', 'Nmap', 'Metasploit', 'Wireshark', 'Splunk', 'Python', 'OWASP tools', 'Nessus', 'Aircrack-ng'],
    perfectFor: [
      'You enjoy thinking like an attacker to build better defences',
      'You are detail-oriented and patient',
      'You like puzzles and figuring out how things can be broken',
      'You want a career with strong job security and demand',
    ],
    notFor: [
      'You are uncomfortable with constant learning as threats evolve',
      'You want to build products more than protect them',
      'You dislike working under pressure during incidents',
    ],
    firstStep: 'Create a free TryHackMe account at tryhackme.com and start the Pre-Security path today.',
  },

  'Product & Design': {
    tagline: 'Shape what gets built and how people experience it',
    description: 'Product managers and UX designers decide what products get built and ensure those products are useful, usable, and loved by the people who use them. You sit at the intersection of business, design, and technology without needing to write code.',
    whatYouDo: [
      'Research user needs through interviews, surveys, and data',
      'Define product features and write clear specifications',
      'Design user interfaces and interactions in Figma',
      'Work with engineers to turn designs into real products',
      'Measure product success through data and user feedback',
    ],
    salaryNigeria: '₦500,000 – ₦2,500,000 per month (junior to senior)',
    salaryGlobal: '$65,000 – $160,000 per year (USA/Europe)',
    topRoles: [
      { title: 'Product Manager', desc: 'Owns the strategy and roadmap for a product from idea to launch' },
      { title: 'UX Designer', desc: 'Designs the user experience and interaction flows of digital products' },
      { title: 'UI Designer', desc: 'Creates the visual design and interface components users interact with' },
      { title: 'Product Designer', desc: 'Combines UX and UI to own the full design of a product end to end' },
      { title: 'Growth PM', desc: 'Focuses specifically on growing user acquisition, activation, and retention' },
    ],
    tools: ['Figma', 'Notion', 'Jira', 'Miro', 'Amplitude', 'Hotjar', 'Google Analytics', 'Maze', 'Canva', 'Loom'],
    perfectFor: [
      'You enjoy understanding why people behave the way they do',
      'You are creative but also analytical',
      'You communicate well in writing and speaking',
      'You want to shape the direction of products without coding everything yourself',
    ],
    notFor: [
      'You want to work quietly without stakeholder communication',
      'You dislike ambiguity and prefer clear technical problems',
      'You want to avoid presenting or defending your decisions',
    ],
    firstStep: 'Create a free Figma account at figma.com and complete their beginner tutorial today.',
  },

  'Emerging Tech': {
    tagline: 'Build at the frontier of what technology can do',
    description: 'Emerging tech engineers work on the technologies that will define the next decade. Web3, AR/VR, AI agents, robotics, and quantum computing are all growing fast. This path rewards creativity, tolerance for ambiguity, and a desire to work on what does not fully exist yet.',
    whatYouDo: [
      'Explore new technologies before they reach mainstream adoption',
      'Build prototypes and demos that prove new concepts work',
      'Write smart contracts, AR experiences, or AI agent systems',
      'Contribute to open source communities driving new standards',
      'Translate complex emerging tech into practical applications',
    ],
    salaryNigeria: '₦700,000 – ₦4,000,000 per month (varies widely by specialisation)',
    salaryGlobal: '$80,000 – $220,000 per year (USA/Europe, varies widely)',
    topRoles: [
      { title: 'Web3 Engineer', desc: 'Builds decentralised applications and smart contracts on blockchain platforms' },
      { title: 'AR/VR Developer', desc: 'Creates augmented and virtual reality experiences for headsets and phones' },
      { title: 'AI Systems Designer', desc: 'Builds multi-agent AI systems that reason and act autonomously' },
      { title: 'Robotics Engineer', desc: 'Programs robots to sense, move, and interact with the physical world' },
      { title: 'Spatial Computing Engineer', desc: 'Builds experiences for mixed reality platforms like Apple Vision Pro' },
    ],
    tools: ['Solidity', 'Unity', 'Unreal Engine', 'Python', 'ROS', 'WebXR', 'Three.js', 'LangChain', 'Rust', 'OpenAI API'],
    perfectFor: [
      'You are excited by what does not exist yet',
      'You are comfortable with ambiguity and rapid change',
      'You want to work on things that feel like science fiction',
      'You have a strong general programming foundation to build on',
    ],
    notFor: [
      'You need stable, well-documented paths and clear career ladders',
      'You are still building foundational programming skills',
      'You want immediate high-paying job options',
    ],
    firstStep: 'Pick one emerging field that excites you most and spend one week reading everything you can find about it. Then build something small in it.',
  },

  'Virtual Assistant': {
    tagline: 'Support high-performing people and businesses remotely',
    description: 'Virtual assistants provide remote administrative, technical, and creative support to entrepreneurs, executives, and businesses. This is the most accessible entry point into the digital economy. You can start earning within weeks, work from anywhere, and build a thriving freelance business.',
    whatYouDo: [
      'Manage email inboxes, calendars, and schedules',
      'Handle customer service and client communication',
      'Create content, manage social media, and run email campaigns',
      'Organise data, research topics, and prepare reports',
      'Automate repetitive tasks using tools like Zapier',
    ],
    salaryNigeria: '₦150,000 – ₦800,000 per month (entry to experienced, freelance)',
    salaryGlobal: '$15 – $65 per hour (international clients, USD)',
    topRoles: [
      { title: 'General VA', desc: 'Provides broad administrative support covering scheduling, email, and research' },
      { title: 'Executive VA', desc: 'Supports C-level executives with high-stakes scheduling and communication' },
      { title: 'Social Media VA', desc: 'Manages social media accounts, content calendars, and community engagement' },
      { title: 'Technical VA', desc: 'Handles website management, tool setup, and technical support tasks' },
      { title: 'AI-Powered VA', desc: 'Uses AI tools to dramatically increase productivity and offer premium services' },
    ],
    tools: ['Notion', 'Trello', 'Google Workspace', 'Canva', 'Buffer', 'Zapier', 'Calendly', 'Slack', 'Zoom', 'ChatGPT'],
    perfectFor: [
      'You are organised and good at managing multiple things at once',
      'You communicate clearly and professionally in writing',
      'You want to start earning quickly without years of technical study',
      'You want the freedom to work from anywhere in the world',
    ],
    notFor: [
      'You want to build technical products or systems',
      'You dislike repetitive tasks or working to other people\'s schedules',
      'You want to avoid client communication entirely',
    ],
    firstStep: 'Create a free Notion account at notion.so and set up your first client management workspace today.',
  },
}

export function DomainPage() {
  const { domainId } = useParams<{ domainId: string }>()
  const decodedDomain = decodeURIComponent(domainId || '')
  const domain = DOMAINS.find(d => d.name === decodedDomain)
  const details = DOMAIN_DETAILS[decodedDomain]

  if (!domain || !details) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ivory px-4">
        <div className="text-center">
          <p className="mb-4 text-muted">Domain not found.</p>
          <Link to="/" className="text-accent hover:text-accent/80">← Back to home</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-ivory">
      {/* hero */}
      <div className="border-b border-border bg-white px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-muted transition hover:text-text">
            ← Back to all domains
          </Link>
          <div className="flex items-center gap-5 mb-6">
            <div
              className="flex h-16 w-16 items-center justify-center rounded-2xl text-3xl"
              style={{ background: domain.color + '18' }}
            >
              {domain.icon}
            </div>
            <div>
              <h1 className="font-display text-3xl font-black text-text md:text-4xl">
                {domain.name}
              </h1>
              <p className="mt-1 text-base font-medium" style={{ color: domain.color }}>
                {details.tagline}
              </p>
            </div>
          </div>
          <p className="text-base leading-relaxed text-text2 mb-8">
            {details.description}
          </p>
          <Link
            to="/assess"
            className="inline-flex items-center gap-2 rounded-2xl px-8 py-4 text-base font-semibold text-white shadow-warm-md transition hover:-translate-y-0.5 hover:shadow-warm-lg"
            style={{ background: domain.color }}
          >
            Take the Assessment to See If This Fits You →
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 py-16">

        {/* salary */}
        <div className="mb-10 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-white p-6 shadow-warm-sm">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-muted">Salary in Nigeria</p>
            <p className="font-display text-xl font-bold text-text">{details.salaryNigeria}</p>
            <p className="mt-1 text-xs text-muted">Based on current market rates for Nigerian companies and remote roles</p>
          </div>
          <div className="rounded-2xl border border-border bg-white p-6 shadow-warm-sm">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-muted">Global Market (Remote)</p>
            <p className="font-display text-xl font-bold text-text">{details.salaryGlobal}</p>
            <p className="mt-1 text-xs text-muted">USA and European companies hiring remotely from Nigeria</p>
          </div>
        </div>

        {/* what you do */}
        <div className="mb-10">
          <h2 className="font-display mb-5 text-2xl font-bold text-text">What you actually do day to day</h2>
          <div className="space-y-3">
            {details.whatYouDo.map((item, i) => (
              <div key={i} className="flex items-start gap-3 rounded-xl border border-border bg-white p-4 shadow-warm-sm">
                <span
                  className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                  style={{ background: domain.color }}
                >
                  {i + 1}
                </span>
                <p className="text-sm leading-relaxed text-text2">{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* top roles */}
        <div className="mb-10">
          <h2 className="font-display mb-5 text-2xl font-bold text-text">Top career roles</h2>
          <div className="space-y-3">
            {details.topRoles.map((role, i) => (
              <div key={i} className="rounded-xl border border-border bg-white p-5 shadow-warm-sm">
                <div className="mb-1 text-sm font-bold text-text" style={{ color: domain.color }}>
                  {role.title}
                </div>
                <p className="text-sm text-muted">{role.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* tools */}
        <div className="mb-10">
          <h2 className="font-display mb-5 text-2xl font-bold text-text">Tools you will learn</h2>
          <div className="flex flex-wrap gap-2">
            {details.tools.map((tool, i) => (
              <span
                key={i}
                className="rounded-full border px-4 py-2 text-sm font-medium"
                style={{ background: domain.color + '10', borderColor: domain.color + '30', color: domain.color }}
              >
                {tool}
              </span>
            ))}
          </div>
        </div>

        {/* fit check */}
        <div className="mb-10 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-green-200 bg-green-50 p-6">
            <h3 className="font-display mb-4 text-lg font-bold text-green-800">This path is perfect for you if</h3>
            <div className="space-y-2">
              {details.perfectFor.map((item, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-green-700">
                  <span className="mt-0.5 flex-shrink-0 text-green-500">✓</span>
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-red-100 bg-red-50 p-6">
            <h3 className="font-display mb-4 text-lg font-bold text-red-800">This path may not fit if</h3>
            <div className="space-y-2">
              {details.notFor.map((item, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-red-700">
                  <span className="mt-0.5 flex-shrink-0 text-red-400">✕</span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* first step */}
        <div
          className="rounded-2xl border p-6"
          style={{ background: domain.color + '08', borderColor: domain.color + '25' }}
        >
          <p className="mb-2 text-xs font-bold uppercase tracking-widest" style={{ color: domain.color }}>
            Your first step this week
          </p>
          <p className="mb-5 text-base leading-relaxed text-text2">{details.firstStep}</p>
          <Link
            to="/assess"
            className="inline-flex items-center gap-2 rounded-2xl px-7 py-3.5 text-sm font-semibold text-white shadow-warm-md transition hover:-translate-y-0.5"
            style={{ background: domain.color }}
          >
            Take the Free Assessment →
          </Link>
        </div>

      </div>
    </div>
  )
}