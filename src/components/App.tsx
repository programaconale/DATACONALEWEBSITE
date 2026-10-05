import Navigation from "./Navigation";
import Hero from "./hero/Hero";
import About from "./sections/About";
import Skills from "./sections/Skills";
import Work from "./sections/Work";
import Community from "./sections/Community";
import Certifications from "./sections/Certifications";
import Experience from "./sections/Experience";
import Achievements from "./sections/Achievements";
import Contact from "./sections/Contact";
import RevealObserver from "./ui/RevealObserver";
import { ScrollProvider } from "@/lib/scroll";
import { CERTIFICATIONS, COMMUNITY, PROJECTS, ACHIEVEMENTS } from "@/lib/data";

export default function App() {
  return (
    <ScrollProvider>
      <a href="#main" className="skip">Skip to content</a>
      <style>{`.skip{position:fixed;left:16px;top:-60px;z-index:100;background:var(--ink);color:#fff;padding:10px 16px;border-radius:999px;font-size:14px;transition:top .4s var(--ease)}.skip:focus{top:16px}`}</style>
      <RevealObserver />
      <Navigation />
      <main id="main">
        <Hero />
        <About />
        <Skills />
        {PROJECTS.length > 0 && <Work />}
        {COMMUNITY.length > 0 && <Community />}
        {CERTIFICATIONS.length > 0 && <Certifications />}
        <Experience />
        {ACHIEVEMENTS.length > 0 && <Achievements />}
        <Contact />
      </main>
    </ScrollProvider>
  );
}
