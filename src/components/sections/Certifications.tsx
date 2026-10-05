import { CERTIFICATIONS } from "@/lib/data";
import SectionHead from "../ui/SectionHead";

/**
 * Ink-flood index. Rendered only when CERTIFICATIONS has entries
 * (the current résumé lists none, so App skips this section).
 */
const css = `
.ce{background:var(--card);border-block:1px solid var(--line)}
.ce-grid{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,7fr);gap:clamp(32px,5vw,80px);align-items:start}
.ce-head{position:sticky;top:calc(var(--nav-h) + 24px)}
.ce-count{margin:22px 0 0;color:var(--mute);font-size:15px}
.ce-list{list-style:none;margin:0;padding:0;border-top:1px solid var(--line)}
.ce-row{position:relative;display:grid;grid-template-columns:52px minmax(0,1fr) 28px;align-items:center;gap:16px;padding:24px 18px;border-bottom:1px solid var(--line);isolation:isolate;overflow:hidden;transition:color .5s var(--ease)}
.ce-row::before{content:"";position:absolute;inset:0;background:var(--ink);transform:scaleX(0);transform-origin:0 50%;transition:transform .7s var(--ease);z-index:-1}
.ce-row:hover,.ce-row:focus-visible{color:#fff}
.ce-row:hover::before,.ce-row:focus-visible::before{transform:scaleX(1)}
.ce-n{font:500 12px/1 var(--font-mono);color:var(--mute);transition:color .5s var(--ease)}
.ce-row:hover .ce-n,.ce-row:focus-visible .ce-n,.ce-row:hover .ce-iss,.ce-row:focus-visible .ce-iss{color:rgba(255,255,255,.65)}
.ce-t{font-weight:600;font-size:clamp(17px,1.6vw,22px);letter-spacing:-.03em;line-height:1.2}
.ce-iss{display:block;margin-top:4px;font-size:14px;color:var(--mute);transition:color .5s var(--ease)}
.ce-arr{opacity:0;transform:translateX(-12px);transition:opacity .5s var(--ease),transform .6s var(--ease);font-size:18px}
.ce-row:hover .ce-arr,.ce-row:focus-visible .ce-arr{opacity:1;transform:none}
@media (max-width:899px){.ce-grid{grid-template-columns:minmax(0,1fr)}.ce-head{position:static}}
`;

export default function Certifications() {
  return (
    <section id="certifications" className="section ce" aria-labelledby="certifications-title">
      <style>{css}</style>
      <div className="wrap ce-grid">
        <div className="ce-head">
          <SectionHead id="certifications" label="Certifications" lead="Always" accent="learning." />
          <p className="ce-count rv">
            {CERTIFICATIONS.length} certification{CERTIFICATIONS.length === 1 ? "" : "s"}
          </p>
        </div>
        <ol className="ce-list">
          {CERTIFICATIONS.map((c, i) => {
            const inner = (
              <>
                <span className="ce-n">{String(i + 1).padStart(2, "0")}</span>
                <span>
                  <span className="ce-t">{c.title}</span>
                  <span className="ce-iss">{c.issuer}</span>
                </span>
                <span className="ce-arr" aria-hidden="true">
                  ↗
                </span>
              </>
            );
            return (
              <li key={c.title} className="rv" style={{ ["--i" as string]: i }}>
                {c.href ? (
                  <a className="ce-row" href={c.href} target="_blank" rel="noopener noreferrer">
                    {inner}
                  </a>
                ) : (
                  <div className="ce-row" tabIndex={0}>
                    {inner}
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
