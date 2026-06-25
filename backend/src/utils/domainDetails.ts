export interface DomainPreviewDetail {
  tagline: string
  salaryNigeria: string
  salaryGlobal: string
}

/**
 * Mirrors the tagline/salary fields from frontend/src/pages/DomainPage.tsx's
 * DOMAIN_DETAILS. Kept in sync manually since the two apps do not share a
 * package — only the fields needed by the roadmap preview endpoint live here.
 */
export const DOMAIN_PREVIEW_DETAILS: Record<string, DomainPreviewDetail> = {
  'AI & Machine Learning': {
    tagline: 'Build intelligent systems that learn from data',
    salaryNigeria: '₦800,000 – ₦3,500,000 per month (junior to senior)',
    salaryGlobal: '$80,000 – $200,000 per year (USA/Europe)',
  },
  'Data Analysis': {
    tagline: 'Turn raw data into decisions that drive business growth',
    salaryNigeria: '₦600,000 – ₦2,500,000 per month (junior to senior)',
    salaryGlobal: '$60,000 – $150,000 per year (USA/Europe)',
  },
  'Data Science & Engineering': {
    tagline: 'Turn raw data into intelligence and build the pipelines that power it',
    salaryNigeria: '₦900,000 – ₦4,000,000 per month (junior to senior)',
    salaryGlobal: '$90,000 – $220,000 per year (USA/Europe)',
  },
  'Full Stack Engineering': {
    tagline: 'Own features end to end, from the database to the browser',
    salaryNigeria: '₦700,000 – ₦3,200,000 per month (junior to senior)',
    salaryGlobal: '$75,000 – $185,000 per year (USA/Europe)',
  },
  'Frontend Development': {
    tagline: 'Build the interfaces people see, touch, and fall in love with',
    salaryNigeria: '₦600,000 – ₦2,800,000 per month (junior to senior)',
    salaryGlobal: '$65,000 – $160,000 per year (USA/Europe)',
  },
  'Backend Development': {
    tagline: 'Build the engines that power everything users experience',
    salaryNigeria: '₦700,000 – ₦3,200,000 per month (junior to senior)',
    salaryGlobal: '$70,000 – $180,000 per year (USA/Europe)',
  },
  'Cloud & Infrastructure': {
    tagline: 'Keep the internet running reliably at scale',
    salaryNigeria: '₦800,000 – ₦3,500,000 per month (junior to senior)',
    salaryGlobal: '$85,000 – $200,000 per year (USA/Europe)',
  },
  'Cybersecurity': {
    tagline: 'Protect systems, data, and people from digital threats',
    salaryNigeria: '₦700,000 – ₦3,000,000 per month (junior to senior)',
    salaryGlobal: '$75,000 – $180,000 per year (USA/Europe)',
  },
  'Product, Design & UX': {
    tagline: 'Shape what gets built and craft how people experience it',
    salaryNigeria: '₦500,000 – ₦2,500,000 per month (junior to senior)',
    salaryGlobal: '$65,000 – $160,000 per year (USA/Europe)',
  },
  'Emerging Tech': {
    tagline: 'Build at the frontier of what technology can do',
    salaryNigeria: '₦700,000 – ₦4,000,000 per month (varies widely by specialisation)',
    salaryGlobal: '$80,000 – $220,000 per year (USA/Europe, varies widely)',
  },
  'Virtual Assistant': {
    tagline: 'Support high-performing people and businesses remotely',
    salaryNigeria: '₦150,000 – ₦800,000 per month (entry to experienced, freelance)',
    salaryGlobal: '$15 – $65 per hour (international clients, USD)',
  },
  'AI Automation & No-Code': {
    tagline: 'Build powerful automated systems without writing traditional code',
    salaryNigeria: '₦400,000 – ₦2,000,000 per month (freelance income varies widely)',
    salaryGlobal: '$40 – $150 per hour (freelance, international clients)',
  },
  'DevRel & Technical Writing': {
    tagline: 'Bridge the gap between complex technology and the people who use it',
    salaryNigeria: '₦500,000 – ₦2,500,000 per month (junior to senior)',
    salaryGlobal: '$70,000 – $160,000 per year (USA/Europe)',
  },
  'Mobile Development': {
    tagline: 'Build the apps billions of people use on their phones every day',
    salaryNigeria: '₦700,000 – ₦3,000,000 per month (junior to senior)',
    salaryGlobal: '$75,000 – $180,000 per year (USA/Europe)',
  },
  'DevSecOps': {
    tagline: 'Build security directly into the pipelines that ship software',
    salaryNigeria: '₦900,000 – ₦4,200,000 per month (junior to senior)',
    salaryGlobal: '$95,000 – $210,000 per year (USA/Europe)',
  },
}
