"use client";
import { useState } from "react";

type NewsItem = { date: string; type: string; text: string };
type PubLink = { label: string; href: string };
type PubSectionItem = {
  badge?: string;
  title: string;
  titleHref?: string;
  authors: string;
  venue: string;
  links: PubLink[];
};
type PubSection = { title: string; publicationsList: PubSectionItem[] };
type GroupMember = {
  name: string;
  nameHref?: string;
  role: string;
  research: string;
  badge?: string;
  coAdvise?: string;
  image?: string;
};

interface Props {
  news: NewsItem[];
  publicationSections: PubSection[];
  groupMembers: GroupMember[];
  openings: string;
  blog: string;
  contact: { address: string; office: string; email: string };
  tabOrder?: TabItem[];
}

const badgeClass: Record<string, string> = {
  paper: "badge-paper", award: "badge-award", talk: "badge-talk", misc: "badge-misc",
};
const badgeLabel: Record<string, string> = {
  paper: "Paper", award: "Award", talk: "Talk", misc: "News",
};

type TabKey = "publications" | "labMembers" | "blog" | "aboutMe" | "openings";
type TabItem = { key: TabKey; label: string };

const defaultTabs: TabItem[] = [
  { key: "publications", label: "Publications" },
  { key: "labMembers", label: "Lab Members" },
  { key: "blog", label: "Blog" },
  { key: "aboutMe", label: "About Me" },
  { key: "openings", label: "Openings" },
];

function normalizeTabs(tabOrder?: TabItem[]) {
  const seen = new Set<TabKey>();
  const validKeys = new Set(defaultTabs.map((t) => t.key));
  const ordered = (tabOrder || []).filter((t): t is TabItem => {
    if (!validKeys.has(t.key) || seen.has(t.key)) return false;
    seen.add(t.key);
    return true;
  });
  return [
    ...ordered.map((tab) => ({
      key: tab.key,
      label: tab.label || defaultTabs.find((defaultTab) => defaultTab.key === tab.key)?.label || tab.key,
    })),
    ...defaultTabs.filter((tab) => !seen.has(tab.key)),
  ];
}

export function TabContent({ news, publicationSections, groupMembers, openings, blog, contact, tabOrder }: Props) {
  const tabs = normalizeTabs(tabOrder);
  const [tab, setTab] = useState<TabKey>(tabs[0]?.key || "publications");

  return (
    <div>
      {/* Tab bar — segmented control matching reference */}
      <div
        style={{
          border: "1px solid var(--border)",
          display: "grid",
          gridTemplateColumns: `repeat(${tabs.length}, 1fr)`,
          marginBottom: "2rem",
          overflow: "hidden",
        }}
      >
        {tabs.map((t, i) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              padding: "0.65rem 0.5rem",
              fontSize: "0.9rem",
              fontWeight: 400,
              color: tab === t.key ? "#c0392b" : "#333",
              background: tab === t.key ? "#f5f5f5" : "#fff",
              border: "none",
              borderLeft: i > 0 ? "1px solid var(--border)" : "none",
              cursor: "pointer",
              transition: "background 0.12s",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* -------- About Me -------- */}
      {tab === "aboutMe" && (
        <div>
          {news.length > 0 && (
            <section style={{ marginBottom: "2.5rem" }}>
              <h2 className="section-title">News</h2>
              {news.map((item, i) => (
                <div key={i} className="news-item">
                  <span style={{ color: "var(--muted)", fontWeight: 500, fontSize: "0.85rem" }}>{item.date}</span>
                  <span>
                    <span className={`badge ${badgeClass[item.type] || "badge-misc"}`}>
                      {badgeLabel[item.type] || "News"}
                    </span>
                    {item.text}
                  </span>
                </div>
              ))}
            </section>
          )}
          <section style={{ marginBottom: "2.5rem" }}>
            <h2 className="section-title">Contact</h2>
            <p style={{ color: "var(--muted)", fontSize: "0.9rem", lineHeight: 1.8 }}>
              {contact.address && <>{contact.address}<br /></>}
              {contact.office && <>Office: {contact.office}<br /></>}
              {contact.email && (
                <>Email: <a href={`mailto:${contact.email}`} style={{ color: "var(--accent-light)" }}>{contact.email}</a></>
              )}
            </p>
          </section>
        </div>
      )}

      {/* -------- Publications -------- */}
      {tab === "publications" && (
        <div style={{ marginBottom: "2.5rem" }}>
          {publicationSections.length === 0 && (
            <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>No publications yet.</p>
          )}
          {publicationSections.map((section, si) => (
            <div key={si} style={{ marginBottom: "2rem" }}>
              <h2 className="section-title">{section.title}</h2>
              <ul style={{ listStyle: "disc", paddingLeft: "1.25rem", margin: 0 }}>
                {section.publicationsList.map((pub, pi) => (
                  <li key={pi} style={{ marginBottom: "1rem", lineHeight: 1.6 }}>
                    {pub.badge && (
                      <em style={{ color: "#b45309", fontStyle: "italic", marginRight: "0.4rem", fontSize: "0.85rem" }}>
                        [{pub.badge}]
                      </em>
                    )}
                    {pub.titleHref ? (
                      <a href={pub.titleHref} target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent-light)", fontWeight: 500 }}>
                        {pub.title}
                      </a>
                    ) : (
                      <span style={{ fontWeight: 500 }}>{pub.title}</span>
                    )}
                    {pub.authors && (
                      <div
                        style={{ fontSize: "0.88rem", color: "var(--muted)", marginTop: "0.15rem" }}
                        dangerouslySetInnerHTML={{ __html: pub.authors }}
                      />
                    )}
                    {pub.venue && (
                      <div style={{ fontSize: "0.88rem", color: "var(--muted)", marginTop: "0.1rem" }}>
                        {pub.venue}
                        {pub.links.length > 0 && (
                          <span style={{ marginLeft: "0.5rem" }}>
                            {pub.links.map((link, li) => (
                              <a key={li} href={link.href} target="_blank" rel="noopener noreferrer"
                                style={{ color: "var(--accent-light)", marginRight: "0.35rem" }}>
                                [{link.label}]
                              </a>
                            ))}
                          </span>
                        )}
                      </div>
                    )}
                    {!pub.venue && pub.links.length > 0 && (
                      <div style={{ marginTop: "0.1rem" }}>
                        {pub.links.map((link, li) => (
                          <a key={li} href={link.href} target="_blank" rel="noopener noreferrer"
                            style={{ color: "var(--accent-light)", marginRight: "0.35rem", fontSize: "0.88rem" }}>
                            [{link.label}]
                          </a>
                        ))}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* -------- Lab Members -------- */}
      {tab === "labMembers" && (
        <div style={{ marginBottom: "2.5rem" }}>
          {groupMembers.length === 0 && (
            <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>No group members yet.</p>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))", gap: "1.25rem" }}>
            {groupMembers.map((member, i) => (
              <div key={i} style={{ border: "1px solid var(--border)", borderRadius: 12, padding: "1.25rem 1rem", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
                <div style={{ position: "relative", marginBottom: "0.75rem" }}>
                  <div style={{ width: 100, height: 100, borderRadius: "50%", overflow: "hidden", background: "var(--highlight)", border: "2px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {member.image ? (
                      <img src={member.image} alt={member.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <svg width="44" height="44" viewBox="0 0 80 80" fill="none">
                        <circle cx="40" cy="30" r="20" fill="#c7d7ea" />
                        <ellipse cx="40" cy="75" rx="30" ry="20" fill="#c7d7ea" />
                      </svg>
                    )}
                  </div>
                  {member.badge && (
                    <div style={{ position: "absolute", bottom: -8, left: "50%", transform: "translateX(-50%)", background: "var(--accent)", color: "#fff", fontSize: "0.6rem", fontWeight: 600, padding: "2px 7px", borderRadius: 20, whiteSpace: "nowrap" }}>
                      {member.badge}
                    </div>
                  )}
                </div>
                <div style={{ marginTop: member.badge ? "0.6rem" : 0 }}>
                  {member.nameHref ? (
                    <a href={member.nameHref} target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent-light)", fontWeight: 600, fontSize: "0.95rem" }}>
                      {member.name}
                    </a>
                  ) : (
                    <span style={{ color: "var(--accent-light)", fontWeight: 600, fontSize: "0.95rem" }}>{member.name}</span>
                  )}
                </div>
                {member.role && <div style={{ fontSize: "0.78rem", color: "var(--muted)", marginTop: "0.2rem" }}>{member.role}</div>}
                {member.coAdvise && <div style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: "0.15rem" }}>{member.coAdvise}</div>}
                {member.research && <div style={{ fontSize: "0.75rem", color: "var(--muted)", fontStyle: "italic", marginTop: "0.25rem" }}>{member.research}</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* -------- Blog -------- */}
      {tab === "blog" && (
        <div style={{ marginBottom: "2.5rem" }}>
          {blog ? (
            <div className="openings-content" dangerouslySetInnerHTML={{ __html: blog }} />
          ) : (
            <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>No blog posts yet.</p>
          )}
        </div>
      )}

      {/* -------- Openings -------- */}
      {tab === "openings" && (
        <div style={{ marginBottom: "2.5rem" }}>
          {openings ? (
            <div
              className="openings-content"
              dangerouslySetInnerHTML={{ __html: openings }}
            />
          ) : (
            <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>No openings information yet.</p>
          )}
        </div>
      )}
    </div>
  );
}
