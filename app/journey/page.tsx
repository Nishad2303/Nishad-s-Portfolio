import Link from 'next/link';
import JourneyScrollCanvas from './JourneyScrollCanvas';

export const metadata = {
  title: "NISHAD'S PORTFOLIO | Journey",
  description: 'Nishad’s aerospace journey through drone systems, satellite work, and aircraft structural repair.',
};

function PortfolioNav() {
  return (
    <nav className="portfolio-nav" aria-label="Portfolio pages">
      <div className="nav-orbit-links">
        <Link className="nav-orbit-link nav-home" href="/index.html" aria-label="Home">
          <img src="/assets/nav-icons/home.png" alt="" /><span>Home</span>
        </Link>
        <div className="nav-about-group">
          <Link className="nav-orbit-link nav-about" href="/about.html" aria-label="About me">
            <img src="/assets/nav-icons/about-me.png" alt="" /><span>About me</span>
          </Link>
          <Link className="nav-journey-link" href="/journey" aria-current="page">
            <img src="/assets/nav-icons/journey.png" alt="" /><span>My Journey</span>
          </Link>
        </div>
        <Link className="nav-orbit-link nav-projects" href="/projects.html" aria-label="Projects">
          <img src="/assets/nav-icons/project.png" alt="" /><span>Projects</span>
        </Link>
        <Link className="nav-orbit-link nav-certification" href="/certification.html" aria-label="Certification">
          <img src="/assets/nav-icons/certificate.png" alt="" /><span>Certification</span>
        </Link>
        <Link className="nav-orbit-link nav-achievements" href="/achievements.html" aria-label="Achievements">
          <img src="/assets/nav-icons/achievements.png" alt="" /><span>Achievements</span>
        </Link>
      </div>
    </nav>
  );
}

export default function JourneyPage() {
  return (
    <main className="journey-app">
      <PortfolioNav />
      <JourneyScrollCanvas />
      <section className="journey-contact" id="contact" aria-labelledby="contact-title">
        <p className="chapter-label">THE NEXT CHAPTER</p>
        <h2 id="contact-title">Let’s build what comes next.</h2>
        <p className="contact-placeholder">Add your preferred email or professional profile here.</p>
        <Link className="contact-back-link" href="/about.html">Back to the portfolio <span aria-hidden="true">↗</span></Link>
      </section>
    </main>
  );
}
