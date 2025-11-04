export type ServiceItem = {
  slug: string
  title: string
  shortDescription: string
  longDescription: string
  features: string[]
  ctaLink?: string
  iconKey:
    | "video"
    | "users"
    | "bookOpen"
    | "graduationCap"
    | "briefcase"
    | "lightbulb"
    | "award"
    | "barChart3"
}

export const services: ServiceItem[] = [
  {
    slug: "on-demand-tutoring",
    title: "On‑Demand Tutoring (Live)",
    shortDescription: "Real‑time sessions with experts for personalized academic support.",
    longDescription:
      "Get immediate help from qualified tutors in live sessions. We emphasize inquiry‑based guidance over answer‑giving, building strong problem‑solving skills and confidence.",
    features: [
      "Personalized, concept‑first explanations",
      "Flexible scheduling and 24/7 availability",
      "Recorded sessions for later review",
    ],
    ctaLink: "/register/tutee",
    iconKey: "video",
  },
  {
    slug: "asynchronous-video-solutions",
    title: "Asynchronous Video Solutions",
    shortDescription: "Submit questions and receive detailed video explanations.",
    longDescription:
      "Send us your questions and receive a tailored, step‑by‑step video solution that teaches the underlying concepts, not only the final answer.",
    features: [
      "Clear, structured solutions",
      "Reusable for revision",
      "Affordable pay‑per‑question pricing",
    ],
    ctaLink: "/contact",
    iconKey: "video",
  },
  {
    slug: "custom-video-library",
    title: "Custom Video Library",
    shortDescription: "Searchable explanations by subject, grade, and textbook.",
    longDescription:
      "Access a growing library of curated video explanations mapped by subject, grade level, and book references for quick, targeted help.",
    features: [
      "Indexed by topic and grade",
      "Continuously expanding content",
      "Anytime, anywhere access",
    ],
    ctaLink: "/contact",
    iconKey: "bookOpen",
  },
  {
    slug: "face-to-face-supporting",
    title: "Face‑to‑Face Supporting",
    shortDescription: "In‑person sessions for personalized, engaging learning.",
    longDescription:
      "For learners who prefer in‑person interaction, our tutors provide direct, immediate feedback and highly engaging support sessions.",
    features: [
      "Immediate feedback",
      "Tailored pace and style",
      "Ideal for complex subjects",
    ],
    ctaLink: "/contact",
    iconKey: "users",
  },
  {
    slug: "professional-trainings",
    title: "Professional Trainings",
    shortDescription: "Workshops for educators and professionals across key skills.",
    longDescription:
      "Practical, outcomes‑focused trainings spanning languages, software, programming, pedagogy, and more—delivered online or on‑site.",
    features: [
      "Language prep (IELTS, TOEFL, etc.)",
      "Software tools (AutoCAD, GIS, MATLAB, etc.)",
      "Programming and modern web stacks",
    ],
    ctaLink: "/register/training",
    iconKey: "graduationCap",
  },
  {
    slug: "strategic-consultations",
    title: "Strategic Consultations",
    shortDescription: "Curriculum, policy, capacity building, e‑learning, assessment.",
    longDescription:
      "We partner with schools, NGOs, and businesses to design curricula, policies, e‑learning strategies, and assessment tools that scale impact.",
    features: [
      "Curriculum and policy design",
      "Capacity building and change enablement",
      "Assessment frameworks and tools",
    ],
    ctaLink: "/contact",
    iconKey: "lightbulb",
  },
  {
    slug: "research-advisory",
    title: "Research Advisory",
    shortDescription: "Guidance on academic and institutional research projects.",
    longDescription:
      "Methodology guidance, literature support, instruments, and analysis oversight to elevate academic and institutional research quality.",
    features: [
      "Method and design coaching",
      "Review and feedback loops",
      "Ethical and quality considerations",
    ],
    ctaLink: "/contact",
    iconKey: "bookOpen",
  },
  {
    slug: "scholarship-search-support",
    title: "Scholarship Search Support",
    shortDescription: "Help students find and apply for the right opportunities.",
    longDescription:
      "We help identify relevant scholarships and guide strong, timely applications that reflect each student’s goals and context.",
    features: [
      "Targeted scholarship matching",
      "Application planning and review",
      "Document preparation guidance",
    ],
    ctaLink: "/contact",
    iconKey: "award",
  },
  {
    slug: "research-document-reviews",
    title: "Research/Document Reviews",
    shortDescription: "Thorough reviews and quality assurance for organizations.",
    longDescription:
      "We review academic and organizational documents for rigor, clarity, and alignment with standards and objectives.",
    features: [
      "Quality assurance and compliance",
      "Constructive, actionable feedback",
      "Faster iteration cycles",
    ],
    ctaLink: "/contact",
    iconKey: "bookOpen",
  },
  {
    slug: "data-entry-services",
    title: "Data Entry Services",
    shortDescription: "Accurate, efficient data management for institutions.",
    longDescription:
      "Trusted data entry and processing to keep institutional operations organized, consistent, and analysis‑ready.",
    features: [
      "High accuracy and timeliness",
      "Secure handling",
      "Scalable delivery",
    ],
    ctaLink: "/contact",
    iconKey: "barChart3",
  },
  {
    slug: "entrepreneurship",
    title: "Entrepreneurship",
    shortDescription: "Tailored services that empower personal and business growth.",
    longDescription:
      "From idea to execution: training and advisory across sectors like agriculture, manufacturing, and creative industries.",
    features: [
      "Sector‑specific guidance",
      "Business planning and feasibility",
      "Practical project support",
    ],
    ctaLink: "/register/entrepreneurship",
    iconKey: "briefcase",
  },
]


