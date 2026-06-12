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
  contact: { address: string; office: string; email: string };
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

export function TabContent({ news, publicationSections, groupMembers, contact }: Props) {
  const [tab, setTab] = useState<"about" | "publications" | "group">("about");

  const tabs = [
    { key: "about" as const, label: "About" },
    { key: "publications" as const, label: "Publications" },
    { key: "group" as const, label: "Group" },
  ];

  return (
    <div>
      {/* Tab bar */}
      <div
        style={{
          borderTop: "1px solid var(--border)",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          marginBottom: "2rem",
        }}
      >
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              flex: 1,
              padding: "0.6rem 1rem",
              fontSize: "0.9rem",
              fontWeight: tab === t.key ? 600 : 400,
              color: tab === t.key ? "var(--accent)" : "var(--muted)",
              background: "none",
              border: "none",
              borderBottom: tab === t.key ? "2px solid var(--accent)" : "2px solid transparent",
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* About tab */}
      {tab === "about" && (
        <div>
          {news.length > 0 && (
            <section style={{ marginBottom: "2.5rem" }}>
              <h2 className="section-title">News</h2>
              <div>
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
              </div>
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

      {/* Publications tab */}
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
                              <a
                                key={li}
                                href={link.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ color: "var(--accent-light)", marginRight: "0.35rem" }}
                              >
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
                          <a
                            key={li}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: "var(--accent-light)", marginRight: "0.35rem", fontSize: "0.88rem" }}
                          >
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

      {/* Group tab */}
      {tab === "group" && (
        <div style={{ marginBottom: "2.5rem" }}>
          {groupMembers.length === 0 && (
            <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>No group members yet.</p>
          )}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))",
              gap: "1.25rem",
            }}
          >
            {groupMembers.map((member, i) => (
              <div
                key={i}
                style={{
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  padding: "1.25rem 1rem",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  background: "#fff",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                }}
              >
                {/* Photo */}
                <div style={{ position: "relative", marginBottom: "0.75rem" }}>
                  <div
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: "50%",
                      overflow: "hidden",
                      background: "var(--highlight)",
                      border: "2px solid var(--border)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {member.image ? (
                      <img
                        src={member.image}
                        alt={member.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      <svg width="44" height="44" viewBox="0 0 80 80" fill="none">
                        <circle cx="40" cy="30" r="20" fill="#c7d7ea" />
                        <ellipse cx="40" cy="75" rx="30" ry="20" fill="#c7d7ea" />
                      </svg>
                    )}
                  </div>
                  {member.badge && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: -8,
                        left: "50%",
                        transform: "translateX(-50%)",
                        background: "var(--accent)",
                        color: "#fff",
                        fontSize: "0.6rem",
                        fontWeight: 600,
                        padding: "2px 7px",
                        borderRadius: 20,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {member.badge}
                    </div>
                  )}
                </div>

                {/* Name */}
                <div style={{ marginTop: member.badge ? "0.6rem" : 0 }}>
                  {member.nameHref ? (
                    <a href={member.nameHref} target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent-light)", fontWeight: 600, fontSize: "0.95rem" }}>
                      {member.name}
                    </a>
                  ) : (
                    <span style={{ color: "var(--accent-light)", fontWeight: 600, fontSize: "0.95rem" }}>{member.name}</span>
                  )}
                </div>

                {/* Role */}
                {member.role && (
                  <div style={{ fontSize: "0.78rem", color: "var(--muted)", marginTop: "0.2rem" }}>{member.role}</div>
                )}

                {/* Co-advise */}
                {member.coAdvise && (
                  <div style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: "0.15rem" }}>{member.coAdvise}</div>
                )}

                {/* Research */}
                {member.research && (
                  <div style={{ fontSize: "0.75rem", color: "var(--muted)", fontStyle: "italic", marginTop: "0.25rem" }}>
                    {member.research}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
