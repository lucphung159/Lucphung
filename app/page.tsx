import { connectDB } from "@/lib/mongodb";
import { Content } from "@/lib/models/Content";

async function getContent() {
  await connectDB();
  let doc = await Content.findOne({ type: "page_content" }).lean() as Record<string, unknown> | null;
  if (!doc) {
    const created = await Content.create({ type: "page_content" });
    doc = created.toObject();
  }
  return doc as {
    profile: {
      name: string; title: string; university: string; advisor: string;
      email: string; github: string; scholar: string; linkedin: string; bio: string[];
    };
    news: { date: string; type: string; text: string }[];
    publications: { title: string; authors: string; venue: string; year: string; links: { label: string; href: string }[] }[];
    contact: { address: string; office: string; email: string };
  };
}

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

export const revalidate = 0;

export default async function Home() {
  const data = await getContent();
  const { profile, news, publications, contact } = data;

  return (
    <div className="min-h-screen bg-white">
      {/* Top Nav */}
      <header style={{ borderBottom: "1px solid var(--border)", background: "#fff" }} className="sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
          <span style={{ color: "var(--accent)", fontWeight: 700, fontSize: "1rem" }}>
            {profile.name}
          </span>
          <nav className="flex gap-6 text-sm" style={{ color: "var(--muted)" }}>
            <a href="#about" className="hover:text-gray-900 transition-colors">About</a>
            <a href="#news" className="hover:text-gray-900 transition-colors">News</a>
            <a href="#publications" className="hover:text-gray-900 transition-colors">Publications</a>
            <a href="#contact" className="hover:text-gray-900 transition-colors">Contact</a>
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
              style={{ width: 180, height: 210, background: "var(--highlight)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="40" cy="30" r="20" fill="#c7d7ea" />
                <ellipse cx="40" cy="75" rx="30" ry="20" fill="#c7d7ea" />
              </svg>
            </div>

            <div className="flex flex-col gap-2 text-sm" style={{ color: "var(--muted)" }}>
              <a href={`mailto:${profile.email}`} className="flex items-center gap-2 hover:text-gray-800">
                <EmailIcon /> {profile.email}
              </a>
              {profile.github && (
                <a href={profile.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-gray-800">
                  <GitHubIcon /> GitHub
                </a>
              )}
              {profile.scholar && (
                <a href={profile.scholar} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-gray-800">
                  <ScholarIcon /> Google Scholar
                </a>
              )}
              {profile.linkedin && (
                <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-gray-800">
                  <LinkedInIcon /> LinkedIn
                </a>
              )}
              <a href="/cv.pdf" className="flex items-center gap-2 hover:text-gray-800">
                <CVIcon /> CV
              </a>
            </div>
          </aside>

          {/* Right: Bio */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-1" style={{ color: "var(--accent)" }}>
              {profile.name}
            </h1>
            <p className="text-base mb-1" style={{ color: "var(--muted)" }}>{profile.title}</p>
            <p className="text-sm mb-4" style={{ color: "var(--muted)" }}>
              {profile.university}
              {profile.advisor && <> &nbsp;|&nbsp; Advisor: {profile.advisor}</>}
            </p>
            {profile.bio.map((para, i) => (
              <p key={i} className="text-sm leading-relaxed mb-3">{para}</p>
            ))}
          </div>
        </section>

        {/* News Section */}
        {news.length > 0 && (
          <section id="news" className="mb-12">
            <h2 className="section-title">News</h2>
            <div>
              {news.map((item, i) => (
                <div key={i} className="news-item">
                  <span className="font-medium text-xs pt-0.5" style={{ color: "var(--muted)" }}>{item.date}</span>
                  <span>
                    <span className={`badge ${badgeClass[item.type] || "badge-misc"}`}>
                      {badgeLabel[item.type] || "News"}
                    </span>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Publications Section */}
        {publications.length > 0 && (
          <section id="publications" className="mb-12">
            <h2 className="section-title">Publications</h2>
            <div>
              {publications.map((pub, i) => (
                <div key={i} className="publication-entry">
                  <p className="text-sm font-semibold leading-snug mb-1">{pub.title}</p>
                  <p className="text-sm mb-1" style={{ color: "var(--muted)" }}>{pub.authors}</p>
                  <p className="text-sm italic mb-1.5" style={{ color: "var(--accent)" }}>
                    {pub.venue}{pub.year && `, ${pub.year}`}
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {pub.links.map((link, j) => (
                      <a
                        key={j}
                        href={link.href}
                        className="text-xs px-2 py-0.5 rounded"
                        style={{ background: "var(--highlight)", color: "var(--accent-light)", border: "1px solid #c7d7ea", fontWeight: 500 }}
                      >
                        [{link.label}]
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Contact Section */}
        <section id="contact" className="mb-12">
          <h2 className="section-title">Contact</h2>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            {contact.address && <>{contact.address}<br /></>}
            {contact.office && <>Office: {contact.office}<br /></>}
            {contact.email && <>Email: <a href={`mailto:${contact.email}`}>{contact.email}</a></>}
          </p>
        </section>
      </main>

      <footer className="text-center text-xs py-6" style={{ color: "var(--muted)", borderTop: "1px solid var(--border)" }}>
        © {new Date().getFullYear()} {profile.name}. Built with Next.js.
        &nbsp;·&nbsp;
        <a href="/admin" style={{ color: "var(--muted)" }}>Admin</a>
      </footer>
    </div>
  );
}

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
