import Image from "next/image";

const news = [
  {
    date: "Jun 2026",
    type: "talk",
    text: 'Gave a talk on "Modern AI Applications in Industry" at TechConf 2026.',
  },
  {
    date: "Mar 2026",
    type: "paper",
    text: 'New paper accepted at ICML 2026: "Scalable Representation Learning for Large Language Models".',
  },
  {
    date: "Jan 2026",
    type: "award",
    text: "Received the Outstanding Researcher Award from XYZ Institute.",
  },
  {
    date: "Oct 2025",
    type: "misc",
    text: "Started a new research collaboration with the AI Lab at University of Technology.",
  },
  {
    date: "Jul 2025",
    type: "paper",
    text: 'Paper accepted at NeurIPS 2025: "Efficient Fine-tuning of Foundation Models".',
  },
];

const publications = [
  {
    title: "Scalable Representation Learning for Large Language Models",
    authors: "Luc Phung, Jane Doe, John Smith",
    venue: "International Conference on Machine Learning (ICML)",
    year: "2026",
    links: [
      { label: "Paper", href: "#" },
      { label: "Code", href: "#" },
    ],
  },
  {
    title: "Efficient Fine-tuning of Foundation Models via Adapter Networks",
    authors: "Luc Phung, Alice Wang, Bob Chen",
    venue: "Advances in Neural Information Processing Systems (NeurIPS)",
    year: "2025",
    links: [
      { label: "Paper", href: "#" },
      { label: "Code", href: "#" },
      { label: "Poster", href: "#" },
    ],
  },
  {
    title: "Cross-lingual Transfer in Low-resource Settings",
    authors: "Luc Phung, Maria Rodriguez",
    venue: "Annual Meeting of the Association for Computational Linguistics (ACL)",
    year: "2024",
    links: [
      { label: "Paper", href: "#" },
      { label: "Slides", href: "#" },
    ],
  },
  {
    title: "Towards Robust Natural Language Understanding with Contrastive Learning",
    authors: "Luc Phung, Wei Liu, Sarah Kim",
    venue: "Empirical Methods in Natural Language Processing (EMNLP)",
    year: "2023",
    links: [{ label: "Paper", href: "#" }],
  },
];

const badgeClass: Record<string, string> = {
  paper: "badge-paper",
  award: "badge-award",
  talk: "badge-talk",
  misc: "badge-misc",
};

const badgeLabel: Record<string, string> = {
  paper: "Paper",
  award: "Award",
  talk: "Talk",
  misc: "News",
};

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Top Nav */}
      <header
        style={{ borderBottom: "1px solid var(--border)", background: "#fff" }}
        className="sticky top-0 z-10"
      >
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
          <span
            style={{ color: "var(--accent)", fontWeight: 700, fontSize: "1rem" }}
          >
            Luc Phung
          </span>
          <nav className="flex gap-6 text-sm" style={{ color: "var(--muted)" }}>
            <a href="#about" className="hover:text-gray-900 transition-colors">
              About
            </a>
            <a href="#news" className="hover:text-gray-900 transition-colors">
              News
            </a>
            <a
              href="#publications"
              className="hover:text-gray-900 transition-colors"
            >
              Publications
            </a>
            <a href="#contact" className="hover:text-gray-900 transition-colors">
              Contact
            </a>
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        {/* Profile Section */}
        <section id="about" className="flex flex-col md:flex-row gap-10 mb-12">
          {/* Left: Photo + Links */}
          <aside className="flex flex-col items-center md:items-start gap-4 md:w-56 shrink-0">
            <div
              className="rounded-lg overflow-hidden"
              style={{
                width: 180,
                height: 210,
                background: "var(--highlight)",
                border: "1px solid var(--border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* Replace src with your actual photo */}
              <svg
                width="80"
                height="80"
                viewBox="0 0 80 80"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="40" cy="30" r="20" fill="#c7d7ea" />
                <ellipse cx="40" cy="75" rx="30" ry="20" fill="#c7d7ea" />
              </svg>
            </div>

            {/* Social Links */}
            <div
              className="flex flex-col gap-2 text-sm"
              style={{ color: "var(--muted)" }}
            >
              <a
                href="mailto:lucphung@example.com"
                className="flex items-center gap-2 hover:text-gray-800"
              >
                <EmailIcon /> lucphung@example.com
              </a>
              <a
                href="https://github.com/lucphung159"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-gray-800"
              >
                <GitHubIcon /> GitHub
              </a>
              <a
                href="https://scholar.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-gray-800"
              >
                <ScholarIcon /> Google Scholar
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-gray-800"
              >
                <LinkedInIcon /> LinkedIn
              </a>
              <a
                href="/cv.pdf"
                className="flex items-center gap-2 hover:text-gray-800"
              >
                <CVIcon /> CV
              </a>
            </div>
          </aside>

          {/* Right: Bio */}
          <div className="flex-1">
            <h1
              className="text-3xl font-bold mb-1"
              style={{ color: "var(--accent)" }}
            >
              Luc Phung
            </h1>
            <p className="text-base mb-1" style={{ color: "var(--muted)" }}>
              PhD Student · Department of Computer Science
            </p>
            <p className="text-sm mb-4" style={{ color: "var(--muted)" }}>
              University of Technology &nbsp;|&nbsp; Advisor: Prof. Jane Doe
            </p>

            <p className="text-sm leading-relaxed mb-3">
              I am a PhD student in Computer Science at the University of
              Technology. My research focuses on{" "}
              <strong>natural language processing</strong> and{" "}
              <strong>machine learning</strong>, with particular interest in
              large language models, efficient fine-tuning, and cross-lingual
              transfer learning.
            </p>
            <p className="text-sm leading-relaxed mb-3">
              I am broadly interested in building AI systems that are
              efficient, generalizable, and accessible — especially in
              low-resource settings. I collaborate closely with researchers
              across industry and academia on both fundamental and applied
              problems.
            </p>
            <p className="text-sm leading-relaxed">
              Before my PhD, I received my B.Sc. in Computer Science from ABC
              University, where I worked on sequence modeling and information
              retrieval.
            </p>
          </div>
        </section>

        {/* News Section */}
        <section id="news" className="mb-12">
          <h2 className="section-title">News</h2>
          <div>
            {news.map((item, i) => (
              <div key={i} className="news-item">
                <span
                  className="font-medium text-xs pt-0.5"
                  style={{ color: "var(--muted)" }}
                >
                  {item.date}
                </span>
                <span>
                  <span className={`badge ${badgeClass[item.type]}`}>
                    {badgeLabel[item.type]}
                  </span>
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Publications Section */}
        <section id="publications" className="mb-12">
          <h2 className="section-title">Publications</h2>
          <div>
            {publications.map((pub, i) => (
              <div key={i} className="publication-entry">
                <p className="text-sm font-semibold leading-snug mb-1">
                  {pub.title}
                </p>
                <p className="text-sm mb-1" style={{ color: "var(--muted)" }}>
                  {pub.authors}
                </p>
                <p className="text-sm italic mb-1.5" style={{ color: "var(--accent)" }}>
                  {pub.venue}, {pub.year}
                </p>
                <div className="flex gap-2 flex-wrap">
                  {pub.links.map((link, j) => (
                    <a
                      key={j}
                      href={link.href}
                      className="text-xs px-2 py-0.5 rounded"
                      style={{
                        background: "var(--highlight)",
                        color: "var(--accent-light)",
                        border: "1px solid #c7d7ea",
                        fontWeight: 500,
                      }}
                    >
                      [{link.label}]
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="mb-12">
          <h2 className="section-title">Contact</h2>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            Department of Computer Science, University of Technology
            <br />
            Office: Room 404, CS Building
            <br />
            Email:{" "}
            <a href="mailto:lucphung@example.com">lucphung@example.com</a>
          </p>
        </section>
      </main>

      <footer
        className="text-center text-xs py-6"
        style={{ color: "var(--muted)", borderTop: "1px solid var(--border)" }}
      >
        © {new Date().getFullYear()} Luc Phung. Built with Next.js.
      </footer>
    </div>
  );
}

/* ---- SVG Icons ---- */
function EmailIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.205.084 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.31.468-2.381 1.236-3.221-.124-.303-.536-1.524.117-3.176 0 0 1.008-.322 3.3 1.23A11.51 11.51 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.29-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222 0 1.606-.015 2.898-.015 3.293 0 .322.216.694.825.576C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function ScholarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 3L1 9l4 2.18V15c0 3.31 3.13 6 7 6s7-2.69 7-6v-3.82L22 9 12 3zm6 10.39c-.35 1.82-1.92 3.32-4 3.8V15l-2 1-2-1v2.19c-2.08-.48-3.65-1.98-4-3.8L8 14H6v-1.82L12 10l6 2.18V14h-2l.01-.61z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function CVIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}
