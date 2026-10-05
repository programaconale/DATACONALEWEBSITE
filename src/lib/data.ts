/**
 * Single source of truth for every word on the site.
 * Everything here is taken from resume.pdf (Alejandro Marcano Van Grieken).
 * Components only read from this file.
 *
 * GitHub, LinkedIn and COMMUNITY were provided directly by Alejandro (not in the PDF).
 * Not available (left empty on purpose): certifications, project repositories.
 */

/* ───────────────────────── Profile ───────────────────────── */

export const PROFILE = {
  name: "Alejandro Marcano Van Grieken",
  firstName: "Alejandro",
  initials: "AM",
  role: "Data Engineer",
  /** Full title line from the résumé header. */
  roles: ["Data Engineer", "Data Analyst", "Product Owner", "AI Developer", "Instructor"],
  email: "dataconale@gmail.com",
  phone: "+34 632 52 43 05",
  phoneHref: "tel:+34632524305",
  location: "Madrid, Spain",
  website: "https://www.alemarcano.framer.website",
  websiteLabel: "alemarcano.framer.website",
  github: "https://github.com/programaconale",
  linkedin: "https://www.linkedin.com/in/alemarcano/",
  resume: "/Alejandro-Marcano-Van-Grieken-Resume.pdf",
  resumeSummary:
    "Data professional with a strong background in data engineering, AI, and automation, with experience across startups, consultancies, and freelance work, specializing in translating business requirements into scalable data products. Experienced Product Owner managing projects from MVP to production-ready AI solutions. Passionate about teaching, sharing knowledge through training, articles, and tech events.",
  /** A second short line, also from the résumé. */
  aboutLine: "Ranked first position in the Systems Engineering graduating class.",
  /** Paraphrase of the résumé's own wording (profile paragraph). */
  quote: "Translating business requirements into scalable data products.",
  current: { title: "Data Engineer", org: "Aditelsa", client: "Indra Minsait" },
  /** ID-card fields derived from the résumé (initials + graduation year, current discipline). */
  card: { id: "AMVG-2019", dept: "Data Engineering", validTill: "7 years" },
} as const;

/* ───────────────────────── Navigation ───────────────────────── */

export type NavItem = { id: string; label: string };

export const NAV: NavItem[] = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "work", label: "Work" },
  { id: "experience", label: "Experience" },
  { id: "achievements", label: "Achievements" },
  { id: "contact", label: "Contact" },
];


/* ───────────────────────── Skills ───────────────────────── */

export type Skill = {
  /** Stable id — also the key into TechLogo's BRAND / CONCEPT maps. */
  id: string;
  name: string;
  symbol: string;
};

export type SkillGroup = { family: string; short: string; skills: Skill[] };

/**
 * Groups follow the résumé's SKILLS section. Duplicates in the résumé (PySpark, OracleDB)
 * appear once. "Tools & Practices" collects tools/methods named in the work-experience bullets.
 */
export const SKILL_GROUPS: SkillGroup[] = [
  {
    family: "Programming Languages",
    short: "Languages",
    skills: [
      { id: "python", name: "Python", symbol: "Py" },
      { id: "javascript", name: "JavaScript", symbol: "Js" },
      { id: "dart", name: "Dart", symbol: "Da" },
      { id: "r", name: "R", symbol: "R" },
      { id: "java", name: "Java", symbol: "Ja" },
      { id: "c", name: "C", symbol: "C" },
    ],
  },
  {
    family: "Data Engineering",
    short: "Data Eng.",
    skills: [
      { id: "fabric", name: "Microsoft Fabric", symbol: "Fb" },
      { id: "pyspark", name: "PySpark", symbol: "Ps" },
      { id: "airflow", name: "Airflow", symbol: "Af" },
      { id: "dbt", name: "DBT", symbol: "Db" },
      { id: "docker", name: "Docker", symbol: "Dk" },
      { id: "kafka", name: "Kafka", symbol: "Kf" },
      { id: "snowflake", name: "Snowflake", symbol: "Sf" },
      { id: "bigquery", name: "BigQuery", symbol: "Bq" },
      { id: "git", name: "Git", symbol: "Gt" },
    ],
  },
  {
    family: "AI / Data Science",
    short: "AI / DS",
    skills: [
      { id: "tensorflow", name: "TensorFlow", symbol: "Tf" },
      { id: "pytorch", name: "PyTorch", symbol: "Pt" },
      { id: "keras", name: "Keras", symbol: "Ks" },
      { id: "scikitlearn", name: "scikit-learn", symbol: "Sk" },
      { id: "openai", name: "OpenAI", symbol: "Oa" },
      { id: "langchain", name: "LangChain", symbol: "Lc" },
      { id: "embeddings", name: "Embeddings", symbol: "Em" },
      { id: "pandas", name: "pandas", symbol: "Pd" },
      { id: "numpy", name: "NumPy", symbol: "Np" },
      { id: "jupyter", name: "Jupyter", symbol: "Jp" },
    ],
  },
  {
    family: "BI & Analytics",
    short: "BI",
    skills: [
      { id: "powerbi", name: "Power BI", symbol: "Pb" },
      { id: "lookerstudio", name: "Looker Studio", symbol: "Ls" },
      { id: "tableau", name: "Tableau", symbol: "Tb" },
      { id: "qlik", name: "QlikSense", symbol: "Qs" },
      { id: "jasper", name: "JasperReports", symbol: "Jr" },
      { id: "googleanalytics", name: "Google Analytics", symbol: "Ga" },
    ],
  },
  {
    family: "Databases & Cloud",
    short: "DB & Cloud",
    skills: [
      { id: "mongodb", name: "MongoDB", symbol: "Mg" },
      { id: "postgresql", name: "PostgreSQL", symbol: "Pg" },
      { id: "mysql", name: "MySQL", symbol: "My" },
      { id: "oracle", name: "OracleDB", symbol: "Or" },
      { id: "firebase", name: "Firebase", symbol: "Fi" },
      { id: "sqlserver", name: "SQL Server", symbol: "Ss" },
      { id: "gcp", name: "GCP", symbol: "Gc" },
      { id: "aws", name: "AWS", symbol: "Aw" },
    ],
  },
  {
    family: "Backend & No-Code",
    short: "Backend",
    skills: [
      { id: "django", name: "Django", symbol: "Dj" },
      { id: "flask", name: "Flask", symbol: "Fl" },
      { id: "nodejs", name: "Node.js", symbol: "No" },
      { id: "notion", name: "Notion", symbol: "Nt" },
      { id: "airtable", name: "Airtable", symbol: "At" },
      { id: "framer", name: "Framer", symbol: "Fr" },
      { id: "glide", name: "Glide", symbol: "Gl" },
      { id: "n8n", name: "n8n", symbol: "N8" },
      { id: "flutterflow", name: "FlutterFlow", symbol: "Ff" },
    ],
  },
  {
    family: "Tools & Practices",
    short: "Practices",
    skills: [
      { id: "etl", name: "ETL", symbol: "Et" },
      { id: "warehouse", name: "Data Warehouse", symbol: "Dw" },
      { id: "llm", name: "LLMs", symbol: "Ll" },
      { id: "agile", name: "Agile / SCRUM", symbol: "Ag" },
      { id: "jira", name: "JIRA", symbol: "Ji" },
      { id: "confluence", name: "Confluence", symbol: "Cf" },
      { id: "streamlit", name: "Streamlit", symbol: "St" },
      { id: "linux", name: "Linux", symbol: "Lx" },
    ],
  },
];

/* ───────────────────────── Experience & education ───────────────────────── */

export type Experience = {
  id: string;
  org: string;
  client?: string;
  mode?: string;
  title: string;
  start: string; // "YYYY-MM"
  end: string | null; // null = present
  period: string;
  bullets: string[];
};

export const EXPERIENCE: Experience[] = [
  {
    id: "aditelsa",
    org: "Aditelsa",
    client: "Indra Minsait",
    mode: "Madrid",
    title: "Data Engineer",
    start: "2025-05",
    end: null,
    period: "May 2025 – Present",
    bullets: [
      "Designed and implemented end-to-end ETL processes in Microsoft Fabric, migrating legacy architecture into a modern cloud ecosystem",
      "Built a Data Warehouse architecture models to centralize ingestion and transformation layers, ensuring scalability and governance",
      "Worked with JIRA and Confluence to structure epics, tasks, and subtasks, improving project clarity and delivery",
    ],
  },
  {
    id: "procesia",
    org: "Procesia Consulting",
    client: "INE",
    mode: "remote",
    title: "Data Product Owner",
    start: "2023-12",
    end: "2025-03",
    period: "Dec 2023 – Mar 2025",
    bullets: [
      "Reduced manual Excel workflows by 90%, cutting report delivery times from days to hours",
      "Directed the migration of legacy processes (90% Excel-based) to modern stacks (Python, SQL, Airflow)",
      "Led requirement gathering with clients and stakeholders, translating business needs into data-driven solutions using JIRA and Confluence",
    ],
  },
  {
    id: "crowdfarming",
    org: "Crowdfarming",
    mode: "hybrid in Madrid",
    title: "Product Data Analyst / Engineer",
    start: "2022-07",
    end: "2023-12",
    period: "Jul 2022 – Dec 2023",
    bullets: [
      "Built an AI-powered clustering solution for user complaints using Generative AI (LLMs, OpenAI API, n8n workflows)",
      "Improved data consistency from 60% to 98% by developing a data quality program reconciling MongoDB and PostgreSQL sources",
      "Delivered database reporting in PostgreSQL with Tableau and Streamlit",
    ],
  },
  {
    id: "innovativegx",
    org: "InnovativeGX",
    mode: "remote",
    title: "Python and SQL Developer",
    start: "2020-07",
    end: "2022-07",
    period: "Jul 2020 – Jul 2022",
    bullets: [
      "Led full-cycle development of data-driven applications as both PM and Developer using Django, Flask, Linux Servers.",
      "Automated JasperServer reports, cutting patient delivery time by 90% and manual work by 80%",
      "Integrated Snowflake for cross-referencing genetic datasets, reducing query time by 40%",
    ],
  },
  {
    id: "instructor",
    org: "Universidad Metropolitana and CultureLab",
    mode: "freelance, remote",
    title: "Instructor",
    start: "2020-09",
    end: "2021-07",
    period: "Sep 2020 – Jul 2021",
    bullets: [
      "Conducted Fundae-sponsored corporate training in Python for Data Analysis, Advanced Python, and BigQuery",
      "Taught university courses in Mathematics I, Algorithms & Programming, and Database Administration",
    ],
  },
  {
    id: "vikua",
    org: "Vikua",
    mode: "hybrid in Venezuela",
    title: "Data Scientist and Product Owner",
    start: "2018-06",
    end: "2020-07",
    period: "Jun 2018 – Jul 2020",
    bullets: [
      "Built a Data Warehouse in BigQuery using Cloud Functions and Looker Studio for GCP data visualization",
      "Developed predictive models (regression and classification) with scikit-learn and Keras on public transport data",
      "Applied Agile/SCRUM methodologies and created a chatbot using Google Dialogflow",
    ],
  },
];

export type Education = {
  id: string;
  school: string;
  place: string;
  degree: string;
  start: string;
  end: string;
  period: string;
  bullets: string[];
};

export const EDUCATION: Education[] = [
  {
    id: "unimet",
    school: "Universidad Metropolitana",
    place: "Caracas",
    degree: "Software Engineering",
    start: "2015-09",
    end: "2019-12",
    period: "Sep 2015 – Dec 2019",
    bullets: [
      "GPA: 17.28/20 — 100% scholarship for academic merit",
      "Thesis: “Facial Recognition Using Convolutional Neural Networks”, Honorable Mention",
      "Ranked first position in the Systems Engineering graduating class",
    ],
  },
];

/* ───────────────────────── Work (built from résumé deliverables) ───────────────────────── */

export type Project = {
  id: string;
  index: string;
  title: string;
  /** Company / context the work was done for, exactly as in the résumé. */
  kicker: string;
  description: string;
  features: string[];
  /** Skill ids (see SKILL_GROUPS) — rendered as chips with tiny logos. */
  tech: string[];
  github: string | null;
};

/**
 * The résumé lists no standalone projects, so each panel is a concrete deliverable
 * named in a work-experience bullet (or the thesis). Wording is from the résumé.
 */
export const PROJECTS: Project[] = [
  {
    id: "fabric-etl",
    index: "01",
    title: "Fabric ETL & Data Warehouse",
    kicker: "Aditelsa — Client: Indra Minsait · 2025",
    description:
      "Designed and implemented end-to-end ETL processes in Microsoft Fabric, migrating legacy architecture into a modern cloud ecosystem.",
    features: [
      "End-to-end ETL in Microsoft Fabric",
      "Legacy architecture → modern cloud",
      "Data Warehouse architecture models",
      "Centralised ingestion & transformation layers",
      "Built for scalability and governance",
      "Epics, tasks & subtasks in JIRA / Confluence",
    ],
    tech: ["fabric", "etl", "warehouse", "jira", "confluence"],
    github: null,
  },
  {
    id: "excel-migration",
    index: "02",
    title: "Excel → Modern Stack Migration",
    kicker: "Procesia Consulting — Client: INE · 2023–2025",
    description:
      "Directed the migration of legacy processes (90% Excel-based) to modern stacks (Python, SQL, Airflow).",
    features: [
      "Manual Excel workflows reduced by 90%",
      "Report delivery: from days to hours",
      "Requirement gathering with stakeholders",
      "Business needs → data-driven solutions",
    ],
    tech: ["python", "airflow", "jira", "confluence"],
    github: null,
  },
  {
    id: "complaint-clustering",
    index: "03",
    title: "AI Complaint Clustering",
    kicker: "Crowdfarming · 2022–2023",
    description:
      "Built an AI-powered clustering solution for user complaints using Generative AI (LLMs, OpenAI API, n8n workflows).",
    features: ["Generative AI (LLMs)", "OpenAI API", "n8n workflows", "Clustering of user complaints"],
    tech: ["llm", "openai", "n8n"],
    github: null,
  },
  {
    id: "data-quality",
    index: "04",
    title: "Data Quality Program",
    kicker: "Crowdfarming · 2022–2023",
    description:
      "Improved data consistency from 60% to 98% by developing a data quality program reconciling MongoDB and PostgreSQL sources.",
    features: [
      "Data consistency: 60% → 98%",
      "MongoDB ↔ PostgreSQL reconciliation",
      "Database reporting in PostgreSQL",
      "Delivered with Tableau and Streamlit",
    ],
    tech: ["mongodb", "postgresql", "tableau", "streamlit"],
    github: null,
  },
  {
    id: "genomics-apps",
    index: "05",
    title: "Data-Driven Apps & Report Automation",
    kicker: "InnovativeGX · 2020–2022",
    description:
      "Led full-cycle development of data-driven applications as both PM and Developer using Django, Flask, Linux Servers.",
    features: [
      "Automated JasperServer reports",
      "Patient delivery time cut by 90%",
      "Manual work cut by 80%",
      "Snowflake for genetic datasets",
      "Query time reduced by 40%",
      "PM and Developer, full cycle",
    ],
    tech: ["django", "flask", "linux", "jasper", "snowflake"],
    github: null,
  },
  {
    id: "transit-warehouse",
    index: "06",
    title: "BigQuery Warehouse & Predictive Models",
    kicker: "Vikua · 2018–2020",
    description:
      "Built a Data Warehouse in BigQuery using Cloud Functions and Looker Studio for GCP data visualization.",
    features: [
      "Predictive models: regression & classification",
      "Public transport data",
      "scikit-learn and Keras",
      "Agile/SCRUM methodologies",
      "Chatbot with Google Dialogflow",
    ],
    tech: ["bigquery", "gcp", "lookerstudio", "scikitlearn", "keras", "agile"],
    github: null,
  },
  {
    id: "facial-recognition",
    index: "07",
    title: "Facial Recognition with CNNs",
    kicker: "Thesis · Universidad Metropolitana · 2019",
    description: "Thesis: “Facial Recognition Using Convolutional Neural Networks”, Honorable Mention.",
    features: ["Convolutional Neural Networks", "Facial recognition", "Honorable Mention", "Software Engineering thesis"],
    tech: [],
    github: null,
  },
];

/* ───────────────────────── Community (off the clock) ───────────────────────── */

export type CommunityItem = {
  id: string;
  name: string;
  /** Short context line, e.g. what I did there. */
  kicker: string;
  status: "Live" | "In progress" | "Volunteer";
  description: string;
  url: string;
  domain: string;
  /** Full-page capture in /public/community (scripts/capture-community.cjs). */
  image: string;
};

/** Provided directly by Alejandro (not in the résumé PDF). */
export const COMMUNITY: CommunityItem[] = [
  {
    id: "volta",
    name: "Volta Run Club",
    kicker: "Website · built with AI · Madrid",
    status: "Live",
    description: "I built the website for Volta Run Club, the Madrid running community I run with, designing and shipping it with AI.",
    url: "https://voltarunclub.es/",
    domain: "voltarunclub.es",
    image: "/community/volta.webp",
  },
  {
    id: "activemarmenor",
    name: "Active Mar Menor",
    kicker: "Calisthenics · Volunteering",
    status: "Volunteer",
    description: "Where I trained calisthenics and volunteered.",
    url: "https://activemarmenor.eu/",
    domain: "activemarmenor.eu",
    image: "/community/activemarmenor.webp",
  },
  {
    id: "seijas",
    name: "Seijas Fit Box",
    kicker: "Website · CrossFit box",
    status: "In progress",
    description: "I'm currently updating the website for the CrossFit box where I train.",
    url: "https://seijasfitbox.com/",
    domain: "seijasfitbox.com",
    image: "/community/seijas.webp",
  },
];

/* ───────────────────────── Certifications ───────────────────────── */

/** None listed in the résumé — the section and its nav link are omitted. */
export const CERTIFICATIONS: { title: string; issuer: string; href?: string }[] = [];

/* ───────────────────────── Achievements ───────────────────────── */

export type Achievement = {
  id: string;
  /** Skill id for a real brand logo, or a CONCEPT icon id. */
  icon: string;
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  label: string;
  caption: string;
  detail: string;
};

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "jobarcelona",
    icon: "trophy",
    value: 2,
    suffix: "nd",
    label: "2nd Place, JOBarcelona Hackathon",
    caption: "Camp Nou, JOBarcelona, NUWE · Jun 2022",
    detail: "One-day hackathon using Python, TensorFlow, scikit-learn, pandas, Streamlit, and Graphext",
  },
  {
    id: "class-rank",
    icon: "medal",
    value: 1,
    suffix: "st",
    label: "First in class",
    caption: "Universidad Metropolitana · 2019",
    detail: "Ranked first position in the Systems Engineering graduating class",
  },
  {
    id: "gpa",
    icon: "cap",
    value: 17.28,
    decimals: 2,
    suffix: "/20",
    label: "GPA",
    caption: "Software Engineering · Universidad Metropolitana",
    detail: "100% scholarship for academic merit",
  },
  {
    id: "excel",
    icon: "airflow",
    value: 90,
    prefix: "−",
    suffix: "%",
    label: "Manual Excel workflows",
    caption: "Procesia Consulting — Client: INE",
    detail: "Cutting report delivery times from days to hours",
  },
  {
    id: "consistency",
    icon: "postgresql",
    value: 98,
    suffix: "%",
    label: "Data consistency",
    caption: "Crowdfarming",
    detail: "Up from 60%, reconciling MongoDB and PostgreSQL sources",
  },
  {
    id: "patient-delivery",
    icon: "doc",
    value: 90,
    prefix: "−",
    suffix: "%",
    label: "Patient delivery time",
    caption: "InnovativeGX",
    detail: "Automated JasperServer reports — manual work down 80%",
  },
  {
    id: "query-time",
    icon: "snowflake",
    value: 40,
    prefix: "−",
    suffix: "%",
    label: "Query time",
    caption: "InnovativeGX",
    detail: "Integrated Snowflake for cross-referencing genetic datasets",
  },
];

/* ───────────────────────── Derived helpers ───────────────────────── */

export const ALL_SKILLS = SKILL_GROUPS.flatMap((g) =>
  g.skills.map((s) => ({ ...s, family: g.family, short: g.short })),
);

export function skillById(id: string) {
  return ALL_SKILLS.find((s) => s.id === id);
}

export function projectsUsing(skillId: string) {
  return PROJECTS.filter((p) => p.tech.includes(skillId));
}

/** Section index used by the "03 — Selected work" tags, in page order (empty sections are skipped). */
export const SECTION_INDEX: Record<string, string> = Object.fromEntries(
  [
    "about",
    "skills",
    ...(PROJECTS.length ? ["work"] : []),
    ...(COMMUNITY.length ? ["community"] : []),
    ...(CERTIFICATIONS.length ? ["certifications"] : []),
    "experience",
    ...(ACHIEVEMENTS.length ? ["achievements"] : []),
    "contact",
  ].map((id, i) => [id, String(i + 1).padStart(2, "0")]),
);
