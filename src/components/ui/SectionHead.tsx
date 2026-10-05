import { SECTION_INDEX } from "@/lib/data";
import type { ReactNode } from "react";

type Props = {
  id: string;
  label: string;
  /** Heading words before the italic accent. */
  lead: ReactNode;
  /** The single Instrument Serif italic word (include its punctuation). */
  accent: string;
  headingId?: string;
  className?: string;
  children?: ReactNode;
};

/** "03 — Selected work" tag + bold heading ending in one serif italic word. */
export default function SectionHead({ id, label, lead, accent, headingId, className = "", children }: Props) {
  return (
    <header className={className}>
      <p className="tag rv">
        <b>{SECTION_INDEX[id]}</b>
        <span>{label}</span>
      </p>
      <h2 id={headingId ?? `${id}-title`} className="h2" style={{ marginTop: 22 }}>
        <span className="rv-mask">
          <span>
            {lead} <em>{accent}</em>
          </span>
        </span>
      </h2>
      {children}
    </header>
  );
}
