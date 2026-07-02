import { useParams, Link } from 'react-router-dom'
import { DOMAINS } from '../utils/questionData'
import { PageMeta } from '../components/PageMeta'

export interface DomainDetail {
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
}

export const DOMAIN_DETAILS: Record<string, DomainDetail> = {
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
  'Full Stack Engineering': {
    tagline: 'Own features end to end, from the database to the browser',
    description: 'Full stack engineers work across the entire web stack, building both the user-facing interface and the server-side logic that powers it. You are the generalist who can take a feature from idea to working product without waiting on another team. Startups and small companies prize full stack engineers because one person can ship a complete feature alone.',
    whatYouDo: [
      'Build user interfaces with React and connect them to your own APIs',
      'Design databases and write the backend logic that powers app features',
      'Take a feature from a Figma design to a deployed, working product alone',
      'Move fluidly between frontend bugs, backend bugs, and database issues',
      'Make architecture decisions that span the whole application',
    ],
    salaryNigeria: '₦700,000 – ₦3,200,000 per month (junior to senior)',
    salaryGlobal: '$75,000 – $185,000 per year (USA/Europe)',
    topRoles: [
      { title: 'Full Stack Engineer', desc: 'Builds and ships complete features spanning frontend, backend, and database' },
      { title: 'Startup Engineer', desc: 'Wears multiple hats at an early-stage company, often the first or only engineer' },
      { title: 'Founding Engineer', desc: 'Joins a startup pre-product-market-fit and builds the first version of the product' },
      { title: 'Technical Co-Founder', desc: 'Uses full stack skills to build and validate a startup idea from scratch' },
      { title: 'Solutions Engineer', desc: 'Builds custom integrations and demos that span the full technology stack' },
    ],
    tools: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Express', 'PostgreSQL', 'Prisma', 'Docker', 'Git', 'Vercel'],
    perfectFor: [
      'You want to understand and build every layer of an application',
      'You enjoy variety over specialising in one narrow area',
      'You want maximum flexibility in job options and startup opportunities',
      'You like owning a feature completely rather than handing it off',
    ],
    notFor: [
      'You want to become a deep specialist in one specific layer',
      'You prefer focused, narrow problems over switching contexts often',
      'You want a highly structured role with clearly defined boundaries',
    ],
    firstStep: 'Go to theodinproject.com and start the Full Stack JavaScript path today. It takes you from zero through both frontend and backend for free.',
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
    description: "Cybersecurity professionals protect organisations from hackers, data breaches, and digital attacks. With cybercrime costing trillions of dollars globally every year, skilled security professionals are in extremely high demand and short supply. Nigeria's growing digital economy needs them urgently.",
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
  'Product, Design & UX': {
    tagline: 'Shape what gets built and craft how people experience it',
    description: 'Product managers and UX/UI designers decide what products get built and ensure those products are useful, usable, and loved by the people who use them. You sit at the intersection of business, design, and technology without needing to write code.',
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
      "You dislike repetitive tasks or working to other people's schedules",
      'You want to avoid client communication entirely',
    ],
    firstStep: 'Create a free Notion account at notion.so and set up your first client management workspace today.',
  },
  'Data Science & Engineering': {
    tagline: 'Turn raw data into intelligence and build the pipelines that power it',
    description: 'Data scientists and data engineers sit at the intersection of statistics, programming, and business. Data scientists build models that extract meaning from data. Data engineers build the infrastructure that collects, stores, and delivers that data at scale.',
    whatYouDo: [
      'Build machine learning models to solve business problems',
      'Design and maintain data pipelines that move data reliably',
      'Work with SQL, Python, and big data tools like Spark and Kafka',
      'Collaborate with analysts and engineers to deliver data products',
      'Monitor data quality and model performance in production',
    ],
    salaryNigeria: '₦900,000 – ₦4,000,000 per month (junior to senior)',
    salaryGlobal: '$90,000 – $220,000 per year (USA/Europe)',
    topRoles: [
      { title: 'Data Scientist', desc: 'Builds predictive models and extracts insights from complex datasets' },
      { title: 'Data Engineer', desc: 'Builds and maintains the pipelines and infrastructure that power data products' },
      { title: 'ML Engineer', desc: 'Productionises machine learning models at scale' },
      { title: 'Analytics Engineer', desc: 'Bridges the gap between raw data and business intelligence tools' },
      { title: 'Research Scientist', desc: 'Advances the state of the art in machine learning and AI' },
    ],
    tools: ['Python', 'SQL', 'Spark', 'Kafka', 'dbt', 'Airflow', 'TensorFlow', 'Docker', 'BigQuery', 'Snowflake'],
    perfectFor: [
      'You love both statistics and engineering',
      'You want to work on problems that require deep technical thinking',
      'You enjoy building systems as much as analysing data',
      'You want one of the highest paid roles in tech',
    ],
    notFor: [
      'You dislike mathematics or programming',
      'You want quick visible results without deep study',
      'You prefer working with people over data',
    ],
    firstStep: 'Complete the Kaggle Python and Pandas courses free at kaggle.com/learn. They take about 5 hours total.',
  },
  'Frontend Development': {
    tagline: 'Build the interfaces people see, touch, and fall in love with',
    description: 'Frontend developers build everything a user sees and interacts with in a web browser or app. You turn designs into working interfaces using HTML, CSS, and JavaScript. Great frontend developers combine technical skill with an eye for design and a deep empathy for users.',
    whatYouDo: [
      'Build responsive user interfaces using React and modern CSS',
      'Turn Figma designs into pixel-perfect, working web pages',
      'Optimise websites for speed, accessibility, and mobile devices',
      'Collaborate with backend engineers to integrate APIs',
      'Write clean, reusable component code that scales',
    ],
    salaryNigeria: '₦600,000 – ₦2,800,000 per month (junior to senior)',
    salaryGlobal: '$65,000 – $160,000 per year (USA/Europe)',
    topRoles: [
      { title: 'Frontend Engineer', desc: 'Builds and maintains user-facing web interfaces' },
      { title: 'UI Engineer', desc: 'Specialises in building polished, performant user interface components' },
      { title: 'React Developer', desc: 'Builds complex single-page applications using React' },
      { title: 'Frontend Architect', desc: 'Defines the structure and standards for large frontend codebases' },
      { title: 'Web Performance Engineer', desc: 'Specialises in making websites fast and accessible' },
    ],
    tools: ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Tailwind CSS', 'Next.js', 'Vite', 'Figma', 'Git'],
    perfectFor: [
      'You are visual and care deeply about how things look',
      'You enjoy the immediate feedback of seeing your code render',
      'You want to collaborate closely with designers',
      'You take pride in building beautiful, fast, accessible interfaces',
    ],
    notFor: [
      'You prefer working in terminals and servers over browsers',
      'You dislike CSS and visual design entirely',
      'You want to avoid user feedback and prefer pure backend work',
    ],
    firstStep: 'Go to theodinproject.com and start the Foundations path today. It is completely free and takes you from zero to your first website.',
  },
  'Backend Development': {
    tagline: 'Build the engines that power everything users experience',
    description: 'Backend developers build the servers, APIs, databases, and business logic that make applications work. When a user logs in, places an order, or sends a message, the backend is doing the heavy lifting. This is where the real complexity lives.',
    whatYouDo: [
      'Design and build REST APIs that frontend apps connect to',
      'Model and manage databases using PostgreSQL or MySQL',
      'Write authentication, authorisation, and security logic',
      'Optimise slow queries and improve system performance',
      'Deploy and monitor backend services in production',
    ],
    salaryNigeria: '₦700,000 – ₦3,200,000 per month (junior to senior)',
    salaryGlobal: '$70,000 – $180,000 per year (USA/Europe)',
    topRoles: [
      { title: 'Backend Engineer', desc: 'Builds and maintains server-side application logic and APIs' },
      { title: 'API Engineer', desc: 'Specialises in designing and building clean, well-documented APIs' },
      { title: 'Database Engineer', desc: 'Designs and optimises database schemas and queries' },
      { title: 'Node.js Developer', desc: 'Builds backend systems using JavaScript and Node.js' },
      { title: 'Platform Engineer', desc: 'Builds internal backend platforms that power multiple products' },
    ],
    tools: ['Node.js', 'Express', 'PostgreSQL', 'Prisma', 'Redis', 'Docker', 'TypeScript', 'Jest', 'JWT', 'AWS'],
    perfectFor: [
      'You prefer solving logical and architectural problems over visual ones',
      'You enjoy working with data, systems, and infrastructure',
      'You want to build the foundations that make products work',
      'You are patient and methodical with debugging',
    ],
    notFor: [
      'You need immediate visual feedback from your work',
      'You dislike thinking about data structures and algorithms',
      'You want to avoid working with databases and servers',
    ],
    firstStep: 'Go to nodejs.org and install Node.js. Then build a simple Express API that returns Hello World. Push it to GitHub today.',
  },
  'AI Automation & No-Code': {
    tagline: 'Build powerful automated systems without writing traditional code',
    description: 'AI automation and no-code specialists build workflows, automated systems, and applications using tools like Zapier, Make, Bubble, and AI APIs. This is the fastest growing area in tech because every business needs automation and most cannot afford full engineering teams.',
    whatYouDo: [
      'Build automated workflows that connect apps and reduce manual work',
      'Create web applications using no-code tools like Bubble or Webflow',
      'Integrate AI APIs like OpenAI and Claude into business workflows',
      'Design chatbots and AI assistants for businesses',
      'Audit client workflows and identify automation opportunities',
    ],
    salaryNigeria: '₦400,000 – ₦2,000,000 per month (freelance income varies widely)',
    salaryGlobal: '$40 – $150 per hour (freelance, international clients)',
    topRoles: [
      { title: 'Automation Consultant', desc: 'Helps businesses identify and implement workflow automation' },
      { title: 'No-Code Developer', desc: 'Builds full applications using no-code and low-code platforms' },
      { title: 'AI Integration Specialist', desc: 'Connects AI APIs into existing business systems and workflows' },
      { title: 'Zapier/Make Expert', desc: 'Builds complex multi-step automation workflows for clients' },
      { title: 'Chatbot Developer', desc: 'Builds AI-powered chatbots for customer service and internal tools' },
    ],
    tools: ['Zapier', 'Make', 'n8n', 'Bubble', 'Webflow', 'Airtable', 'OpenAI API', 'Claude API', 'Notion', 'Slack'],
    perfectFor: [
      'You want to build powerful things without deep programming knowledge',
      'You are entrepreneurial and want to freelance or consult',
      'You enjoy solving business problems with technology',
      'You want to start earning quickly without years of study',
    ],
    notFor: [
      'You want to build complex software systems from scratch',
      'You prefer deep technical work over business problem solving',
      'You dislike client communication and requirements gathering',
    ],
    firstStep: 'Create a free Zapier account at zapier.com and build your first automation connecting two apps you already use.',
  },
  'DevRel & Technical Writing': {
    tagline: 'Bridge the gap between complex technology and the people who use it',
    description: 'Developer relations professionals and technical writers help developers succeed with technology products. DevRel engineers build communities, create content, give talks, and advocate for developers. Technical writers make complex systems understandable through documentation, tutorials, and guides.',
    whatYouDo: [
      'Write tutorials, blog posts, and documentation for developer tools',
      'Build and manage developer communities on Discord and forums',
      'Give talks at conferences and record technical videos',
      'Collect developer feedback and influence product roadmaps',
      'Create sample code and open source projects to showcase tools',
    ],
    salaryNigeria: '₦500,000 – ₦2,500,000 per month (junior to senior)',
    salaryGlobal: '$70,000 – $160,000 per year (USA/Europe)',
    topRoles: [
      { title: 'Developer Advocate', desc: 'Represents a tech company to the developer community through content and events' },
      { title: 'Technical Writer', desc: 'Creates documentation, guides, and tutorials for developer products' },
      { title: 'Developer Experience Engineer', desc: 'Improves the developer experience of a product through tooling and content' },
      { title: 'Community Manager', desc: 'Builds and manages communities of developers around a product' },
      { title: 'Developer Educator', desc: 'Creates courses and educational content for technical audiences' },
    ],
    tools: ['Markdown', 'GitHub', 'Notion', 'Postman', 'VS Code', 'Loom', 'YouTube', 'Discord', 'Twitter', 'HashNode'],
    perfectFor: [
      'You love writing and explaining technical concepts clearly',
      'You enjoy being in front of an audience or camera',
      'You want to use both your technical and communication skills',
      'You enjoy building communities and helping developers succeed',
    ],
    notFor: [
      'You prefer deep solo engineering work over communication',
      'You dislike writing, speaking, or creating content',
      'You want to avoid working with external people and communities',
    ],
    firstStep: 'Write one technical tutorial about something you already know and publish it on Hashnode at hashnode.com today. It is completely free.',
  },
  'Mobile Development': {
    tagline: 'Build the apps billions of people use on their phones every day',
    description: 'Mobile developers build applications for iOS and Android devices. With React Native and Flutter you can build for both platforms using one codebase. Mobile is where most users in Nigeria and Africa spend their digital time making this one of the most impactful tracks on the platform.',
    whatYouDo: [
      'Build cross-platform mobile apps using React Native or Flutter',
      'Design smooth, fast user interfaces optimised for touch',
      'Integrate device features like camera, GPS, and notifications',
      'Connect mobile apps to backend APIs and real-time data',
      'Deploy apps to the Google Play Store and Apple App Store',
    ],
    salaryNigeria: '₦700,000 – ₦3,000,000 per month (junior to senior)',
    salaryGlobal: '$75,000 – $180,000 per year (USA/Europe)',
    topRoles: [
      { title: 'React Native Developer', desc: 'Builds cross-platform mobile apps using React Native and JavaScript' },
      { title: 'Flutter Developer', desc: 'Builds cross-platform mobile apps using Flutter and Dart' },
      { title: 'iOS Developer', desc: 'Builds native Apple apps using Swift' },
      { title: 'Android Developer', desc: 'Builds native Android apps using Kotlin' },
      { title: 'Mobile Architect', desc: 'Designs the technical structure of large scale mobile applications' },
    ],
    tools: ['React Native', 'Flutter', 'Expo', 'TypeScript', 'Dart', 'Firebase', 'Redux', 'AsyncStorage', 'Xcode', 'Android Studio'],
    perfectFor: [
      'You want to build apps people use on their phones every day',
      'You already know some JavaScript or want to learn it',
      'You are excited by the African mobile-first internet',
      'You want to build products for the Nigerian market specifically',
    ],
    notFor: [
      'You prefer server-side or infrastructure work over user interfaces',
      'You want to avoid learning platform-specific constraints',
      'You dislike debugging device-specific issues',
    ],
    firstStep: 'Install Expo Go on your phone from the app store. Then go to docs.expo.dev and build your first React Native app today. It runs on your actual phone in minutes.',
  },
  'DevSecOps': {
    tagline: 'Build security directly into the pipelines that ship software',
    description: 'DevSecOps engineers integrate security into every stage of the software delivery pipeline, from the first commit to production deployment. Instead of security being a final checkpoint that blocks releases, DevSecOps makes it automatic, fast, and built into the tools developers already use. This is one of the most in-demand specialisations in tech because every company shipping software needs it.',
    whatYouDo: [
      'Build CI/CD pipelines with automated security scanning at every stage',
      'Configure SAST, DAST, and dependency scanning tools to catch vulnerabilities before release',
      'Harden containers, Kubernetes clusters, and cloud infrastructure against attacks',
      'Manage secrets, access controls, and policy as code across environments',
      'Respond to security incidents and lead remediation in cloud and CI/CD systems',
    ],
    salaryNigeria: '₦900,000 – ₦4,200,000 per month (junior to senior)',
    salaryGlobal: '$95,000 – $210,000 per year (USA/Europe)',
    topRoles: [
      { title: 'DevSecOps Engineer', desc: 'Builds and maintains secure CI/CD pipelines and embeds security tooling into the development workflow' },
      { title: 'Security Automation Engineer', desc: 'Automates vulnerability scanning, compliance checks, and remediation across systems' },
      { title: 'Cloud Security Engineer', desc: 'Secures cloud infrastructure, identity, and access across AWS, GCP, or Azure environments' },
      { title: 'Application Security Engineer', desc: 'Finds and fixes vulnerabilities in application code before it reaches production' },
      { title: 'Platform Security Engineer', desc: 'Builds internal security tooling and guardrails that other engineering teams rely on' },
    ],
    tools: ['Docker', 'Kubernetes', 'Terraform', 'GitHub Actions', 'HashiCorp Vault', 'Snyk', 'SonarQube', 'Trivy', 'Open Policy Agent', 'AWS'],
    perfectFor: [
      'You enjoy both security thinking and infrastructure or automation work',
      'You want to build the guardrails that let teams ship fast without breaking things',
      'You are comfortable in the command line and enjoy systems thinking',
      'You want one of the highest paid and most in-demand specialisations in tech',
    ],
    notFor: [
      'You only want to focus on either pure security or pure infrastructure, not both',
      'You dislike automation and prefer manual, one-off tasks',
      'You want quick visible results without learning multiple tools deeply',
    ],
    firstStep: 'Create a free OverTheWire account at overthewire.org and complete the first 10 levels of the Bandit wargame today.',
  },
}

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&family=Inter:wght@400;500;600;700&display=swap');

  @media (max-width: 640px) {
    .bit-domain-2col { grid-template-columns: 1fr !important; }
  }
`

export function DomainPage() {
  const { domainId } = useParams<{ domainId: string }>()
  const decodedDomain = decodeURIComponent(domainId || '')
  const domain = DOMAINS.find(d => d.name === decodedDomain)
  const details = DOMAIN_DETAILS[decodedDomain]

  if (!domain || !details) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F9F7F1', fontFamily: "'Inter', sans-serif", padding: '20px' }}>
        <style>{CSS}</style>
        <div style={{ textAlign: 'center' }}>
          <i className="ti ti-mood-sad" style={{ fontSize: 40, color: '#C8C0B4', display: 'block', marginBottom: 14 }} />
          <p style={{ marginBottom: 16, color: '#6B6B6B', fontSize: 14 }}>Domain not found.</p>
          <Link to="/" style={{ color: '#C9A84C', fontWeight: 700, textDecoration: 'none', fontSize: 14, display: 'inline-flex', alignItems: 'center', gap: 5 }}>
            <i className="ti ti-arrow-left" style={{ fontSize: 13 }} /> Back to home
          </Link>
        </div>
      </div>
    )
  }

  const domainColor = domain.color

  return (
    <div style={{ minHeight: '100vh', background: '#F9F7F1', fontFamily: "'Inter', sans-serif", color: '#0F1F3D' }}>
      <PageMeta
        title={`${decodedDomain} Career Track`}
        description={`${details.tagline}. See salary ranges, top roles, required tools, and get your free personalised 48-week roadmap.`}
        path={`/domain/${encodeURIComponent(decodedDomain)}`}
      />
      <style>{CSS}</style>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E8E4D9', padding: '56px 28px 52px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <Link
            to="/"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#8A8070', textDecoration: 'none', marginBottom: 28, transition: 'color 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#0F1F3D')}
            onMouseLeave={e => (e.currentTarget.style.color = '#8A8070')}
          >
            <i className="ti ti-arrow-left" style={{ fontSize: 13 }} /> Back to all domains
          </Link>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 22, marginBottom: 20, flexWrap: 'wrap' }}>
            <div style={{
              width: 64, height: 64, borderRadius: 16, fontSize: 30,
              background: domainColor + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              {domain.icon}
            </div>
            <div>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 34, fontWeight: 900, color: '#0F1F3D', lineHeight: 1.15, marginBottom: 6 }}>
                {domain.name}
              </h1>
              <p style={{ fontSize: 15, fontWeight: 600, color: domainColor }}>{details.tagline}</p>
            </div>
          </div>

          <p style={{ fontSize: 15, lineHeight: 1.8, color: '#4A4A4A', marginBottom: 28, maxWidth: 640 }}>
            {details.description}
          </p>

          <Link
            to="/assess"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: domainColor, color: '#fff', borderRadius: 10,
              padding: '14px 26px', fontSize: 14, fontWeight: 700, textDecoration: 'none',
              transition: 'opacity 0.15s, transform 0.15s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '0.88'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '1'; (e.currentTarget as HTMLElement).style.transform = 'none' }}
          >
            <i className="ti ti-bolt" style={{ fontSize: 15 }} />
            Take the Assessment to See If This Fits You
          </Link>
        </div>
      </div>

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '48px 28px 72px' }}>

        {/* ── SALARY ─────────────────────────────────────────────────────── */}
        <div className="bit-domain-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 36 }}>
          {[
            { label: 'Salary in Nigeria', value: details.salaryNigeria, note: 'Based on current market rates for Nigerian companies and remote roles', icon: 'ti ti-building' },
            { label: 'Global Market (Remote)', value: details.salaryGlobal, note: 'USA and European companies hiring remotely from Nigeria', icon: 'ti ti-world' },
          ].map(s => (
            <div key={s.label} style={{ background: '#fff', border: '1px solid #E8E4D9', borderRadius: 12, padding: '20px 22px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8A8070', marginBottom: 10 }}>
                <i className={s.icon} style={{ fontSize: 12 }} /> {s.label}
              </div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 900, color: '#0F1F3D', marginBottom: 5 }}>
                {s.value}
              </div>
              <p style={{ fontSize: 11, color: '#8A8070', lineHeight: 1.6 }}>{s.note}</p>
            </div>
          ))}
        </div>

        {/* ── WHAT YOU DO ────────────────────────────────────────────────── */}
        <div style={{ marginBottom: 36 }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 900, color: '#0F1F3D', marginBottom: 16 }}>
            What you actually do day to day
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {details.whatYouDo.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, background: '#fff', border: '1px solid #E8E4D9', borderRadius: 10, padding: '14px 18px' }}>
                <span style={{
                  width: 24, height: 24, borderRadius: 99, background: domainColor,
                  color: '#fff', fontWeight: 700, fontSize: 11, display: 'flex',
                  alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1,
                }}>
                  {i + 1}
                </span>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: '#3A3A3A', margin: 0 }}>{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── TOP ROLES ──────────────────────────────────────────────────── */}
        <div style={{ marginBottom: 36 }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 900, color: '#0F1F3D', marginBottom: 16 }}>
            Top career roles
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {details.topRoles.map((role, i) => (
              <div key={i} style={{ background: '#fff', border: '1px solid #E8E4D9', borderRadius: 10, padding: '16px 20px' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: domainColor, marginBottom: 4 }}>{role.title}</div>
                <p style={{ fontSize: 13, color: '#6B6B6B', lineHeight: 1.6, margin: 0 }}>{role.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── TOOLS ──────────────────────────────────────────────────────── */}
        <div style={{ marginBottom: 36 }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 900, color: '#0F1F3D', marginBottom: 16 }}>
            Tools you will learn
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {details.tools.map((tool, i) => (
              <span key={i} style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                background: domainColor + '10', border: `1px solid ${domainColor}30`,
                borderRadius: 999, padding: '7px 16px',
                fontSize: 13, fontWeight: 600, color: domainColor,
              }}>
                {tool}
              </span>
            ))}
          </div>
        </div>

        {/* ── FIT CHECK ──────────────────────────────────────────────────── */}
        <div className="bit-domain-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 36 }}>
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 12, padding: '22px 22px' }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 900, color: '#15803d', marginBottom: 14 }}>
              This path is perfect for you if
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {details.perfectFor.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: '#166534' }}>
                  <i className="ti ti-circle-check" style={{ fontSize: 14, color: '#16a34a', flexShrink: 0, marginTop: 1 }} />
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: '#fff5f5', border: '1px solid #fecaca', borderRadius: 12, padding: '22px 22px' }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 900, color: '#b91c1c', marginBottom: 14 }}>
              This path may not fit if
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {details.notFor.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: '#991b1b' }}>
                  <i className="ti ti-circle-x" style={{ fontSize: 14, color: '#ef4444', flexShrink: 0, marginTop: 1 }} />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── FIRST STEP ─────────────────────────────────────────────────── */}
        <div style={{
          background: domainColor + '08', border: `1px solid ${domainColor}25`,
          borderRadius: 14, padding: '26px 26px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', color: domainColor, marginBottom: 12 }}>
            <i className="ti ti-player-play" style={{ fontSize: 12 }} /> Your first step this week
          </div>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: '#3A3A3A', marginBottom: 22 }}>{details.firstStep}</p>
          <Link
            to="/assess"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: domainColor, color: '#fff', borderRadius: 10,
              padding: '13px 24px', fontSize: 14, fontWeight: 700, textDecoration: 'none',
              transition: 'opacity 0.15s, transform 0.15s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '0.88'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '1'; (e.currentTarget as HTMLElement).style.transform = 'none' }}
          >
            <i className="ti ti-bolt" style={{ fontSize: 14 }} />
            Take the Free Assessment
          </Link>
        </div>

      </div>
    </div>
  )
}
