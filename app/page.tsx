import { connectDB } from "@/lib/mongodb";
import { Content } from "@/lib/models/Content";
import { TabContent } from "@/app/components/TabContent";

async function getContent() {
  await connectDB();
  let doc = await Content.findOne({ type: "page_content" }).lean() as Record<string, unknown> | null;
  if (!doc) {
    const created = await Content.create({ type: "page_content" });
    doc = created.toObject();
  }
  return doc as unknown as PageData;
}

interface PageData {
  profile: {
    name: string; title: string; university: string; advisor: string;
    email: string; github: string; scholar: string; linkedin: string;
    twitter: string; facultyPage: string; bio: string[];
  };
  news: { date: string; type: string; text: string }[];
  publicationSections: {
    title: string;
    publicationsList: {
      badge?: string; title: string; titleHref?: string;
      authors: string; venue: string;
      links: { label: string; href: string }[];
    }[];
  }[];
  groupMembers: {
    name: string; nameHref?: string; role: string; research: string;
    badge?: string; coAdvise?: string; image?: string;
  }[];
  contact: { address: string; office: string; email: string };
}

export const revalidate = 0;

export default async function Home() {
  const data = await getContent();
  const { profile, news, publicationSections, groupMembers, contact } = data;

  const links = [
    profile.facultyPage && { label: "Faculty Page", href: profile.facultyPage },
    profile.scholar && { label: "Google Scholar", href: profile.scholar },
    profile.linkedin && { label: "LinkedIn", href: profile.linkedin },
    profile.twitter && { label: "X (Twitter)", href: profile.twitter },
    profile.github && { label: "GitHub", href: profile.github },
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <div className="min-h-screen bg-white">
      {/* Top Nav */}
      <header style={{ borderBottom: "1px solid var(--border)", background: "#fff" }} className="sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-3 flex items-center justify-between">
          <span style={{ color: "var(--accent)", fontWeight: 700, fontSize: "1rem" }}>
            {profile.name}
          </span>
          <nav className="flex gap-5 text-sm" style={{ color: "var(--muted)" }}>
            <a href="#top" className="hover:text-gray-900 transition-colors">Home</a>
          </nav>
        </div>
      </header>

      <main id="top" className="max-w-4xl mx-auto px-6 py-10">
        {/* Profile header */}
        <section style={{ display: "flex", gap: "2.5rem", marginBottom: "2rem", flexWrap: "wrap" }}>
          {/* Left: text */}
          <div style={{ flex: 1, minWidth: 220 }}>
            <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--accent)", marginBottom: "0.4rem" }}>
              {profile.name}
            </h1>

            {profile.email && (
              <div style={{ marginBottom: "0.6rem" }}>
                <a
                  href={`mailto:${profile.email}`}
                  style={{
                    display: "inline-block",
                    fontFamily: "monospace",
                    fontSize: "0.85rem",
                    background: "var(--highlight)",
                    color: "var(--accent-light)",
                    border: "1px solid #c7d7ea",
                    borderRadius: 4,
                    padding: "2px 10px",
                  }}
                >
                  {profile.email.replace("@", " [at] ")}
                </a>
              </div>
            )}

            {profile.title && (
              <p style={{ color: "#374151", fontSize: "0.95rem", marginBottom: "0.2rem" }}>{profile.title}</p>
            )}
            {profile.university && (
              <p style={{ color: "var(--muted)", fontSize: "0.9rem", marginBottom: "0.75rem" }}>
                {profile.university}
                {profile.advisor && <> &nbsp;|&nbsp; Advisor: {profile.advisor}</>}
              </p>
            )}

            {links.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.25rem 0", fontSize: "0.9rem", color: "var(--accent-light)" }}>
                {links.map((l, i) => (
                  <span key={i}>
                    {i > 0 && <span style={{ color: "var(--muted)", margin: "0 0.4rem" }}>|</span>}
                    <a href={l.href} target="_blank" rel="noopener noreferrer">{l.label}</a>
                  </span>
                ))}
              </div>
            )}

            {/* Bio */}
            {profile.bio?.length > 0 && (
              <div style={{ marginTop: "1.25rem" }}>
                {profile.bio.map((para, i) => (
                  <p key={i} style={{ fontSize: "0.9rem", lineHeight: 1.7, marginBottom: "0.75rem", color: "#374151" }}>
                    {para}
                  </p>
                ))}
              </div>
            )}
          </div>

          {/* Right: photo */}
          <div style={{ display: "flex", alignItems: "flex-start" }}>
            <div
              style={{
                width: 160,
                height: 160,
                borderRadius: "50%",
                overflow: "hidden",
                background: "var(--highlight)",
                border: "2px solid var(--border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <svg width="70" height="70" viewBox="0 0 80 80" fill="none">
                <circle cx="40" cy="30" r="20" fill="#c7d7ea" />
                <ellipse cx="40" cy="75" rx="30" ry="20" fill="#c7d7ea" />
              </svg>
            </div>
          </div>
        </section>

        {/* Tabbed content */}
        <TabContent
          news={news || []}
          publicationSections={publicationSections || []}
          groupMembers={groupMembers || []}
          contact={contact || { address: "", office: "", email: "" }}
        />
      </main>

      <footer className="text-center text-xs py-6" style={{ color: "var(--muted)", borderTop: "1px solid var(--border)" }}>
        © {new Date().getFullYear()} {profile.name}. Built with Next.js.
        &nbsp;·&nbsp;
        <a href="/admin" style={{ color: "var(--muted)" }}>Admin</a>
      </footer>
    </div>
  );
}
