"use client";
import { useEffect, useState } from "react";
import { richTextHtml } from "@/lib/richText";

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
type PubSection = { title: string; note?: string; publicationsList: PubSectionItem[] };
type GroupSectionKey = "keyCoInvestigators" | "currentStudents" | "alumni";
type GroupMember = {
  name: string;
  nameHref?: string;
  role: string;
  research: string;
  badge?: string;
  coAdvise?: string;
  groupSection?: GroupSectionKey;
  image?: string;
};

const groupSections: { key: GroupSectionKey; title: string }[] = [
  { key: "keyCoInvestigators", title: "Key Co-Investigators" },
  { key: "currentStudents", title: "Current Students" },
  { key: "alumni", title: "Alumni" },
];

interface Props {
  news: NewsItem[];
  aboutIntro: string;
  publicationSections: PubSection[];
  groupMembers: GroupMember[];
  openings: string;
  contact: { address: string; office: string; email: string };
  tabOrder?: TabItem[];
}

const badgeClass: Record<string, string> = {
  paper: "badge-paper", award: "badge-award", talk: "badge-talk", misc: "badge-misc",
};
const badgeLabel: Record<string, string> = {
  paper: "Paper", award: "Award", talk: "Talk", misc: "News",
};

type TabKey = "publications" | "labMembers" | "aboutMe" | "openings";
type TabItem = { key: TabKey; label: string };

const defaultTabs: TabItem[] = [
  { key: "publications", label: "Publications" },
  { key: "labMembers", label: "Lab Members" },
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

function memberSection(member: GroupMember) {
  return groupSections.some((section) => section.key === member.groupSection)
    ? member.groupSection
    : "currentStudents";
}

function splitMemberRole(role: string) {
  const match = role.trim().match(/^(.*?)\s*(\([^()]+\))\s*$/);
  return match && match[1]
    ? { role: match[1], intake: match[2] }
    : { role, intake: "" };
}

function MemberRole({ role }: { role: string }) {
  const parts = splitMemberRole(role);

  return (
    <div className="member-role">
      <div>{parts.role}</div>
      {parts.intake && <div className="member-intake">{parts.intake}</div>}
    </div>
  );
}

export function TabContent({ news, aboutIntro, publicationSections, groupMembers, openings, contact, tabOrder }: Props) {
  const tabs = normalizeTabs(tabOrder);
  const [tab, setTab] = useState<TabKey>(tabs[0]?.key || "publications");

  useEffect(() => {
    function openContactFromHash() {
      if (window.location.hash !== "#contact") return;

      setTab("aboutMe");
      window.setTimeout(() => {
        document.getElementById("contact")?.scrollIntoView({ block: "start" });
      }, 0);
    }

    openContactFromHash();
    window.addEventListener("hashchange", openContactFromHash);

    return () => window.removeEventListener("hashchange", openContactFromHash);
  }, []);

  return (
    <div>
      {/* Tab bar */}
      <div
        style={{
          borderTop: "1px solid var(--border)",
          borderBottom: "1px solid var(--border)",
          display: "grid",
          gridTemplateColumns: `repeat(${tabs.length}, 1fr)`,
          marginBottom: "2rem",
        }}
      >
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              padding: "0.65rem 0.5rem",
              fontSize: "0.9rem",
              fontWeight: 700,
              color: tab === t.key ? "#c0392b" : "#333",
              background: tab === t.key ? "#f5f5f5" : "#fff",
              border: "none",
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
          {aboutIntro && (
            <section style={{ marginBottom: "2.5rem" }}>
              <h2 className="section-title">About Me</h2>
              <div
                className="rich-text-content"
                style={{ color: "var(--muted)", fontSize: "0.95rem", lineHeight: 1.8, margin: 0 }}
                dangerouslySetInnerHTML={richTextHtml(aboutIntro)}
              />
            </section>
          )}
          {news.length > 0 && (
            <section style={{ marginBottom: "2.5rem" }}>
              <h2 className="section-title">News</h2>
              {news.map((item, i) => (
                <div key={i} className="news-item">
                  <span style={{ color: "var(--muted)", fontWeight: 500, fontSize: "0.85rem" }}>{item.date}</span>
                  <div className="news-text">
                    <span className={`badge ${badgeClass[item.type] || "badge-misc"}`}>
                      {badgeLabel[item.type] || "News"}
                    </span>
                    <span
                      className="rich-text-content rich-text-inline"
                      dangerouslySetInnerHTML={richTextHtml(item.text)}
                    />
                  </div>
                </div>
              ))}
            </section>
          )}
          <section id="contact" style={{ marginBottom: "2.5rem", scrollMarginTop: "4.5rem" }}>
            <h2 className="section-title">Contact</h2>
            <div style={{ color: "var(--muted)", fontSize: "0.9rem", lineHeight: 1.8 }}>
              {contact.address && (
                <div
                  className="rich-text-content"
                  dangerouslySetInnerHTML={richTextHtml(contact.address)}
                />
              )}
              {contact.office && <>Office: {contact.office}<br /></>}
              {contact.email && (
                <>Email: <a href={`mailto:${contact.email}`} style={{ color: "var(--accent-light)" }}>{contact.email}</a></>
              )}
            </div>
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
              {section.note && (
                <div
                  className="rich-text-content publication-note"
                  dangerouslySetInnerHTML={richTextHtml(section.note)}
                />
              )}
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
          {groupSections.map((section) => {
            const members = groupMembers.filter((member) => memberSection(member) === section.key);

            return (
              <section key={section.key} className="member-section">
                <h2 className="section-title">{section.title}</h2>
                {members.length === 0 ? (
                  <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>No members yet.</p>
                ) : (
                  <div className="member-list">
                    {members.map((member, i) => (
                      <div key={`${section.key}-${i}`} className="member-card">
                        <div className="member-photo-wrap">
                          <div className="member-photo">
                            {member.image ? (
                              <img src={member.image} alt={member.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            ) : (
                              <svg width="50" height="50" viewBox="0 0 80 80" fill="none">
                                <circle cx="40" cy="30" r="20" fill="#c7d7ea" />
                                <ellipse cx="40" cy="75" rx="30" ry="20" fill="#c7d7ea" />
                              </svg>
                            )}
                          </div>
                          {member.badge && (
                            <div className="member-badge">
                              {member.badge}
                            </div>
                          )}
                        </div>
                        <div className="member-info">
                          <div>
                            {member.nameHref ? (
                              <a href={member.nameHref} target="_blank" rel="noopener noreferrer" className="member-name">
                                {member.name}
                              </a>
                            ) : (
                              <span className="member-name">{member.name}</span>
                            )}
                          </div>
                          {member.role && <MemberRole role={member.role} />}
                          {member.coAdvise && <div className="member-advisor">{member.coAdvise}</div>}
                          {member.research && <div className="member-research">{member.research}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            );
          })}
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
