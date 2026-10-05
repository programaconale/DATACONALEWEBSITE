import { ALL_SKILLS } from "@/lib/data";
import type { CSSProperties, ReactNode } from "react";

/**
 * Real brand logos (devicon "original" SVGs, MIT; simple-icons paths, CC0) live in /public/logos.
 * `tint` is the official brand colour, used only for a very soft glow behind the logo.
 */
export const BRAND: Record<string, { file: string; tint: string }> = {
  python: { file: "python", tint: "#3776AB" },
  javascript: { file: "javascript", tint: "#F7DF1E" },
  dart: { file: "dart", tint: "#0175C2" },
  r: { file: "r", tint: "#276DC3" },
  java: { file: "java", tint: "#E76F00" },
  c: { file: "c", tint: "#659AD2" },
  pyspark: { file: "apachespark", tint: "#E25A1C" },
  airflow: { file: "apacheairflow", tint: "#017CEE" },
  docker: { file: "docker", tint: "#2496ED" },
  kafka: { file: "apachekafka", tint: "#231F20" },
  snowflake: { file: "snowflake", tint: "#29B5E8" },
  bigquery: { file: "googlebigquery", tint: "#669DF6" },
  git: { file: "git", tint: "#F05032" },
  tensorflow: { file: "tensorflow", tint: "#FF6F00" },
  pytorch: { file: "pytorch", tint: "#EE4C2C" },
  keras: { file: "keras", tint: "#D00000" },
  scikitlearn: { file: "scikitlearn", tint: "#F7931E" },
  langchain: { file: "langchain", tint: "#1C3C3C" },
  pandas: { file: "pandas", tint: "#150458" },
  numpy: { file: "numpy", tint: "#4DABCF" },
  jupyter: { file: "jupyter", tint: "#F37626" },
  qlik: { file: "qlik", tint: "#009848" },
  googleanalytics: { file: "googleanalytics", tint: "#E37400" },
  mongodb: { file: "mongodb", tint: "#47A248" },
  postgresql: { file: "postgresql", tint: "#336791" },
  mysql: { file: "mysql", tint: "#00758F" },
  oracle: { file: "oracle", tint: "#F80000" },
  firebase: { file: "firebase", tint: "#FFCA28" },
  sqlserver: { file: "microsoftsqlserver", tint: "#CC2927" },
  gcp: { file: "googlecloud", tint: "#4285F4" },
  aws: { file: "amazonwebservices", tint: "#FF9900" },
  django: { file: "django", tint: "#092E20" },
  flask: { file: "flask", tint: "#3BABC3" },
  nodejs: { file: "nodejs", tint: "#5FA04E" },
  notion: { file: "notion", tint: "#787774" },
  airtable: { file: "airtable", tint: "#18BFFF" },
  framer: { file: "framer", tint: "#0055FF" },
  glide: { file: "glide", tint: "#18BED4" },
  n8n: { file: "n8n", tint: "#EA4B71" },
  jira: { file: "jira", tint: "#2684FF" },
  confluence: { file: "confluence", tint: "#2684FF" },
  streamlit: { file: "streamlit", tint: "#FF4B4B" },
  linux: { file: "linux", tint: "#FCC624" },
};

const S = { fill: "none", stroke: "currentColor", strokeWidth: 1.25, strokeLinecap: "round", strokeLinejoin: "round" } as const;

/** Thin line icons for concepts (and for brands with no freely licensed logo — see README). */
export const CONCEPT: Record<string, ReactNode> = {
  etl: (
    <g {...S}>
      <rect x="2.5" y="5" width="5" height="5" rx="1" />
      <rect x="2.5" y="14" width="5" height="5" rx="1" />
      <rect x="16.5" y="9.5" width="5" height="5" rx="1" />
      <path d="M7.5 7.5h3a2 2 0 0 1 2 2v1M7.5 16.5h3a2 2 0 0 0 2-2v-1M12.5 12h4" />
    </g>
  ),
  warehouse: (
    <g {...S}>
      <ellipse cx="12" cy="5.5" rx="7.5" ry="2.5" />
      <path d="M4.5 5.5v13c0 1.4 3.4 2.5 7.5 2.5s7.5-1.1 7.5-2.5v-13M4.5 10c0 1.4 3.4 2.5 7.5 2.5s7.5-1.1 7.5-2.5M4.5 14.3c0 1.4 3.4 2.5 7.5 2.5s7.5-1.1 7.5-2.5" />
    </g>
  ),
  llm: (
    <g {...S}>
      <path d="M4 5.5h16v10H9l-4 3.5v-3.5H4z" />
      <path d="M8 9h8M8 12h5" />
    </g>
  ),
  agile: (
    <g {...S}>
      <path d="M19.5 12a7.5 7.5 0 1 1-2.2-5.3" />
      <path d="M19.8 4.5v3.2h-3.2" />
      <path d="M9 12l2 2 4-4" />
    </g>
  ),
  embeddings: (
    <g {...S}>
      <path d="M4 20V4M4 20h16" />
      <circle cx="9" cy="14" r="1.2" />
      <circle cx="11.5" cy="11.5" r="1.2" />
      <circle cx="16" cy="8" r="1.2" />
      <circle cx="17.5" cy="10.5" r="1.2" />
      <circle cx="8" cy="9" r="1.2" />
    </g>
  ),
  trophy: (
    <g {...S}>
      <path d="M7.5 4h9v5a4.5 4.5 0 0 1-9 0z" />
      <path d="M7.5 6H4.5v1.5A3 3 0 0 0 7.6 10.5M16.5 6h3v1.5a3 3 0 0 1-3.1 3" />
      <path d="M12 13.5V17M8.5 20h7M9.5 17h5v3h-5z" />
    </g>
  ),
  medal: (
    <g {...S}>
      <path d="M8 3l2.5 6M16 3l-2.5 6" />
      <circle cx="12" cy="14.5" r="5.5" />
      <path d="M11 13l1.2-.8V17" />
    </g>
  ),
  cap: (
    <g {...S}>
      <path d="M2.5 9L12 4.5 21.5 9 12 13.5z" />
      <path d="M6.5 11v4.5c0 1.4 2.5 2.8 5.5 2.8s5.5-1.4 5.5-2.8V11M21.5 9v5" />
    </g>
  ),
  doc: (
    <g {...S}>
      <path d="M6 3h8l4 4v14H6z" />
      <path d="M14 3v4h4M9 12h6M9 15h6M9 18h3" />
    </g>
  ),
};

export function isBrand(id: string): boolean {
  return id in BRAND;
}

type Props = { id: string; size?: number; className?: string; style?: CSSProperties; decorative?: boolean };

/** Brand logo, concept line icon, or — for a brand without a licensed logo — its periodic symbol. */
export default function TechLogo({ id, size = 24, className, style, decorative = true }: Props) {
  const skill = ALL_SKILLS.find((s) => s.id === id);
  const alt = decorative ? "" : `${skill?.name ?? id} logo`;
  if (BRAND[id]) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={`/logos/${BRAND[id].file}.svg`}
        width={size}
        height={size}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={className}
        style={{ width: size, height: size, objectFit: "contain", ...style }}
      />
    );
  }
  if (CONCEPT[id]) {
    return (
      <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        className={className}
        style={{ color: "var(--ink)", ...style }}
        aria-hidden={decorative || undefined}
        role={decorative ? undefined : "img"}
        aria-label={decorative ? undefined : skill?.name ?? id}
      >
        {CONCEPT[id]}
      </svg>
    );
  }
  return (
    <span
      className={className}
      aria-hidden={decorative || undefined}
      style={{
        width: size,
        height: size,
        display: "inline-grid",
        placeItems: "center",
        borderRadius: size * 0.22,
        boxShadow: "inset 0 0 0 1px rgba(13,13,13,.22)",
        font: `700 ${Math.round(size * 0.42)}px/1 var(--font-sans)`,
        letterSpacing: "-0.04em",
        color: "var(--ink)",
        ...style,
      }}
    >
      {skill?.symbol ?? id.slice(0, 2)}
    </span>
  );
}
