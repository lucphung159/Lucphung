"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { RichTextEditor } from "@/app/components/RichTextEditor";

type NewsItem = { date: string; type: string; text: string };
type PubLink = { label: string; href: string };
type PubSectionItem = {
  badge: string; title: string; titleHref: string;
  authors: string; venue: string; links: PubLink[];
};
type PubSection = { title: string; publicationsList: PubSectionItem[] };
type GroupMember = {
  name: string; nameHref: string; role: string; research: string;
  badge: string; coAdvise: string; image: string;
};

interface PageContent {
  profile: {
    name: string; title: string; university: string; advisor: string;
    email: string; scholar: string; twitter: string; facultyPage: string;
    youtube: string; instagram: string; profileImage: string; bio: string[];
  };
  news: NewsItem[];
  publicationSections: PubSection[];
  groupMembers: GroupMember[];
  openings: string;
  contact: { address: string; office: string; email: string };
}

const defaultContent: PageContent = {
  profile: { name: "", title: "", university: "", advisor: "", email: "", scholar: "", twitter: "", facultyPage: "", youtube: "", instagram: "", profileImage: "", bio: [""] },
  news: [],
  publicationSections: [],
  groupMembers: [],
  openings: "",
  contact: { address: "", office: "", email: "" },
};

type Tab = "profile" | "news" | "publications" | "group" | "openings" | "contact";

const inputStyle = { border: "1px solid #d1d5db", background: "#f9fafb" };

function Field({ label, value, onChange, placeholder, type = "text" }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <div>
      <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 4 }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ ...inputStyle, width: "100%", padding: "7px 12px", borderRadius: 8, fontSize: 13, outline: "none" }}
      />
    </div>
  );
}

export default function AdminDashboard() {
  const [content, setContent] = useState<PageContent>(defaultContent);
  const [tab, setTab] = useState<Tab>("profile");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchContent = useCallback(async () => {
    const res = await fetch("/api/content");
    if (res.status === 401) { router.push("/admin"); return; }
    const data = await res.json();
    setContent({
      profile: {
        name: data.profile?.name || "",
        title: data.profile?.title || "",
        university: data.profile?.university || "",
        advisor: data.profile?.advisor || "",
        email: data.profile?.email || "",
        scholar: data.profile?.scholar || "",
        twitter: data.profile?.twitter || "",
        facultyPage: data.profile?.facultyPage || "",
        youtube: data.profile?.youtube || "",
        instagram: data.profile?.instagram || "",
        profileImage: data.profile?.profileImage || "",
        bio: data.profile?.bio || [""],
      },
      news: data.news || [],
      publicationSections: data.publicationSections || [],
      groupMembers: data.groupMembers || [],
      openings: data.openings || "",
      contact: data.contact || { address: "", office: "", email: "" },
    });
    setLoading(false);
  }, [router]);

  useEffect(() => { fetchContent(); }, [fetchContent]);

  async function save() {
    setSaving(true);
    await fetch("/api/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(content),
    });
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin");
  }

  // Profile helpers
  function setProfile<K extends keyof PageContent["profile"]>(key: K, val: PageContent["profile"][K]) {
    setContent((c) => ({ ...c, profile: { ...c.profile, [key]: val } }));
  }
  function setBio(i: number, val: string) {
    setContent((c) => { const bio = [...c.profile.bio]; bio[i] = val; return { ...c, profile: { ...c.profile, bio } }; });
  }

  // News helpers
  function setNews(i: number, key: keyof NewsItem, val: string) {
    setContent((c) => { const news = [...c.news]; news[i] = { ...news[i], [key]: val }; return { ...c, news }; });
  }
  function addNews() { setContent((c) => ({ ...c, news: [{ date: "", type: "misc", text: "" }, ...c.news] })); }
  function removeNews(i: number) { setContent((c) => ({ ...c, news: c.news.filter((_, j) => j !== i) })); }

  // Publication section helpers
  function addSection() {
    setContent((c) => ({ ...c, publicationSections: [...c.publicationSections, { title: "New Section", publicationsList: [] }] }));
  }
  function removeSection(si: number) {
    setContent((c) => ({ ...c, publicationSections: c.publicationSections.filter((_, j) => j !== si) }));
  }
  function setSectionTitle(si: number, val: string) {
    setContent((c) => {
      const secs = [...c.publicationSections];
      secs[si] = { ...secs[si], title: val };
      return { ...c, publicationSections: secs };
    });
  }
  function addPubToSection(si: number) {
    setContent((c) => {
      const secs = [...c.publicationSections];
      secs[si] = { ...secs[si], publicationsList: [{ badge: "", title: "", titleHref: "", authors: "", venue: "", links: [] }, ...secs[si].publicationsList] };
      return { ...c, publicationSections: secs };
    });
  }
  function removePubFromSection(si: number, pi: number) {
    setContent((c) => {
      const secs = [...c.publicationSections];
      secs[si] = { ...secs[si], publicationsList: secs[si].publicationsList.filter((_, j) => j !== pi) };
      return { ...c, publicationSections: secs };
    });
  }
  function setPubField(si: number, pi: number, key: keyof Omit<PubSectionItem, "links">, val: string) {
    setContent((c) => {
      const secs = [...c.publicationSections];
      const pubs = [...secs[si].publicationsList];
      pubs[pi] = { ...pubs[pi], [key]: val };
      secs[si] = { ...secs[si], publicationsList: pubs };
      return { ...c, publicationSections: secs };
    });
  }
  function addPubLink(si: number, pi: number) {
    setContent((c) => {
      const secs = [...c.publicationSections];
      const pubs = [...secs[si].publicationsList];
      pubs[pi] = { ...pubs[pi], links: [...pubs[pi].links, { label: "", href: "" }] };
      secs[si] = { ...secs[si], publicationsList: pubs };
      return { ...c, publicationSections: secs };
    });
  }
  function setPubLink(si: number, pi: number, li: number, key: keyof PubLink, val: string) {
    setContent((c) => {
      const secs = [...c.publicationSections];
      const pubs = [...secs[si].publicationsList];
      const links = [...pubs[pi].links];
      links[li] = { ...links[li], [key]: val };
      pubs[pi] = { ...pubs[pi], links };
      secs[si] = { ...secs[si], publicationsList: pubs };
      return { ...c, publicationSections: secs };
    });
  }
  function removePubLink(si: number, pi: number, li: number) {
    setContent((c) => {
      const secs = [...c.publicationSections];
      const pubs = [...secs[si].publicationsList];
      pubs[pi] = { ...pubs[pi], links: pubs[pi].links.filter((_, j) => j !== li) };
      secs[si] = { ...secs[si], publicationsList: pubs };
      return { ...c, publicationSections: secs };
    });
  }

  // Group member helpers
  function setMember(i: number, key: keyof GroupMember, val: string) {
    setContent((c) => { const gm = [...c.groupMembers]; gm[i] = { ...gm[i], [key]: val }; return { ...c, groupMembers: gm }; });
  }
  function addMember() {
    setContent((c) => ({ ...c, groupMembers: [...c.groupMembers, { name: "", nameHref: "", role: "", research: "", badge: "", coAdvise: "", image: "" }] }));
  }
  function removeMember(i: number) { setContent((c) => ({ ...c, groupMembers: c.groupMembers.filter((_, j) => j !== i) })); }

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f0f4f8" }}>
        <p style={{ color: "#6b7280" }}>Loading...</p>
      </div>
    );
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: "profile", label: "Profile" },
    { key: "news", label: "News" },
    { key: "publications", label: "Publications" },
    { key: "group", label: "Group" },
    { key: "openings", label: "Openings" },
    { key: "contact", label: "Contact" },
  ];

  const card = { background: "#fff", borderRadius: 12, boxShadow: "0 1px 4px rgba(0,0,0,0.07)", padding: "1.5rem" };
  const sectionHeader = { color: "#1e3a5f", fontWeight: 700, fontSize: 15, marginBottom: 16 };

  return (
    <div style={{ minHeight: "100vh", background: "#f0f4f8" }}>
      {/* Header */}
      <header style={{ background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontWeight: 700, fontSize: 17, color: "#1e3a5f" }}>Admin Dashboard</span>
            <a href="/" target="_blank" style={{ fontSize: 12, padding: "3px 10px", borderRadius: 6, background: "#f0f4f8", color: "#2d5a8e" }}>
              View Site ↗
            </a>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {saved && (
              <span style={{ fontSize: 12, padding: "3px 12px", borderRadius: 20, background: "#d1fae5", color: "#065f46", fontWeight: 600 }}>
                ✓ Saved
              </span>
            )}
            <button onClick={save} disabled={saving} style={{ padding: "7px 18px", borderRadius: 8, fontSize: 13, fontWeight: 600, color: "#fff", background: "#1e3a5f", border: "none", cursor: "pointer", opacity: saving ? 0.7 : 1 }}>
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <button onClick={logout} style={{ padding: "7px 14px", borderRadius: 8, fontSize: 13, background: "#f3f4f6", color: "#6b7280", border: "none", cursor: "pointer" }}>
              Logout
            </button>
          </div>
        </div>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px", display: "flex", gap: 2 }}>
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                padding: "8px 16px",
                fontSize: 13,
                fontWeight: 500,
                color: tab === t.key ? "#1e3a5f" : "#6b7280",
                background: "none",
                border: "none",
                borderBottom: tab === t.key ? "2px solid #1e3a5f" : "2px solid transparent",
                cursor: "pointer",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </header>

      <main style={{ maxWidth: 900, margin: "0 auto", padding: "2rem 1.5rem" }}>

        {/* =================== PROFILE =================== */}
        {tab === "profile" && (
          <div style={card}>
            <h2 style={sectionHeader}>Profile Information</h2>

            {/* Profile photo upload */}
            <ProfileImageUpload
              image={content.profile.profileImage}
              onChange={(v) => setProfile("profileImage", v)}
            />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 20 }}>
              {(["name", "title", "university", "advisor", "email", "facultyPage", "scholar", "twitter", "youtube", "instagram"] as const).map((key) => (
                <Field
                  key={key}
                  label={
                    key === "scholar" ? "Google Scholar URL" :
                    key === "facultyPage" ? "Faculty Page URL" :
                    key === "twitter" ? "X (Twitter) URL" :
                    key === "youtube" ? "YouTube URL" :
                    key === "instagram" ? "Instagram URL" : key
                  }
                  value={content.profile[key] as string}
                  onChange={(v) => setProfile(key, v)}
                />
              ))}
            </div>

            <div style={{ marginTop: 20 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>Bio Paragraphs</label>
                <button onClick={() => setContent((c) => ({ ...c, profile: { ...c.profile, bio: [...c.profile.bio, ""] } }))}
                  style={{ fontSize: 12, padding: "3px 10px", borderRadius: 6, background: "#dbeafe", color: "#1e40af", border: "none", cursor: "pointer" }}>
                  + Add Paragraph
                </button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {content.profile.bio.map((p, i) => (
                  <div key={i} style={{ display: "flex", gap: 8 }}>
                    <textarea value={p} onChange={(e) => setBio(i, e.target.value)} rows={3}
                      style={{ ...inputStyle, flex: 1, padding: "8px 12px", borderRadius: 8, fontSize: 13, outline: "none", resize: "none" }}
                      placeholder={`Paragraph ${i + 1}...`} />
                    <button onClick={() => setContent((c) => ({ ...c, profile: { ...c.profile, bio: c.profile.bio.filter((_, j) => j !== i) } }))}
                      style={{ fontSize: 12, padding: "4px 8px", borderRadius: 6, background: "#fee2e2", color: "#b91c1c", border: "none", cursor: "pointer", alignSelf: "flex-start" }}>✕</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =================== NEWS =================== */}
        {tab === "news" && (
          <div style={card}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <h2 style={{ ...sectionHeader, marginBottom: 0 }}>News Items</h2>
              <button onClick={addNews} style={{ fontSize: 13, padding: "6px 14px", borderRadius: 8, fontWeight: 600, background: "#dbeafe", color: "#1e40af", border: "none", cursor: "pointer" }}>
                + Add News
              </button>
            </div>
            {content.news.length === 0 && <p style={{ color: "#9ca3af", fontSize: 13, textAlign: "center", padding: "2rem" }}>No news yet.</p>}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {content.news.map((item, i) => (
                <div key={i} style={{ border: "1px solid #e5e7eb", borderRadius: 10, padding: 14 }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                      <div style={{ display: "flex", gap: 12 }}>
                        <Field label="Date" value={item.date} onChange={(v) => setNews(i, "date", v)} placeholder="Jun 2026" />
                        <div style={{ flex: 1 }}>
                          <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 4 }}>Type</label>
                          <select value={item.type} onChange={(e) => setNews(i, "type", e.target.value)}
                            style={{ ...inputStyle, width: "100%", padding: "7px 12px", borderRadius: 8, fontSize: 13, outline: "none" }}>
                            <option value="paper">Paper</option>
                            <option value="award">Award</option>
                            <option value="talk">Talk</option>
                            <option value="misc">News</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 4 }}>Text</label>
                        <textarea value={item.text} onChange={(e) => setNews(i, "text", e.target.value)} rows={2}
                          style={{ ...inputStyle, width: "100%", padding: "7px 12px", borderRadius: 8, fontSize: 13, outline: "none", resize: "none" }} />
                      </div>
                    </div>
                    <button onClick={() => removeNews(i)} style={{ marginTop: 20, fontSize: 12, padding: "4px 8px", borderRadius: 6, background: "#fee2e2", color: "#b91c1c", border: "none", cursor: "pointer" }}>✕</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =================== PUBLICATIONS =================== */}
        {tab === "publications" && (
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <h2 style={{ ...sectionHeader, marginBottom: 0 }}>Publication Sections</h2>
              <button onClick={addSection} style={{ fontSize: 13, padding: "6px 14px", borderRadius: 8, fontWeight: 600, background: "#dbeafe", color: "#1e40af", border: "none", cursor: "pointer" }}>
                + Add Section
              </button>
            </div>
            {content.publicationSections.length === 0 && (
              <div style={{ ...card, textAlign: "center", color: "#9ca3af", fontSize: 13, padding: "2rem" }}>
                No sections yet. Click &quot;+ Add Section&quot; to add one (e.g., &quot;Recent Preprints&quot;).
              </div>
            )}
            {content.publicationSections.map((section, si) => (
              <div key={si} style={{ ...card, marginBottom: 20 }}>
                <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 14 }}>
                  <input
                    value={section.title}
                    onChange={(e) => setSectionTitle(si, e.target.value)}
                    placeholder="Section title (e.g. Recent Preprints)"
                    style={{ ...inputStyle, flex: 1, padding: "7px 12px", borderRadius: 8, fontSize: 14, fontWeight: 600, outline: "none" }}
                  />
                  <button onClick={() => addPubToSection(si)} style={{ fontSize: 12, padding: "6px 12px", borderRadius: 8, background: "#dbeafe", color: "#1e40af", border: "none", cursor: "pointer", whiteSpace: "nowrap" }}>
                    + Add Paper
                  </button>
                  <button onClick={() => removeSection(si)} style={{ fontSize: 12, padding: "6px 10px", borderRadius: 8, background: "#fee2e2", color: "#b91c1c", border: "none", cursor: "pointer" }}>
                    ✕ Remove Section
                  </button>
                </div>

                {section.publicationsList.length === 0 && (
                  <p style={{ color: "#9ca3af", fontSize: 13, textAlign: "center", padding: "1rem" }}>No papers yet in this section.</p>
                )}

                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {section.publicationsList.map((pub, pi) => (
                    <div key={pi} style={{ border: "1px solid #e5e7eb", borderRadius: 10, padding: 14 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                        <span style={{ fontSize: 12, color: "#6b7280", fontWeight: 600 }}>Paper {pi + 1}</span>
                        <button onClick={() => removePubFromSection(si, pi)} style={{ fontSize: 12, padding: "3px 8px", borderRadius: 6, background: "#fee2e2", color: "#b91c1c", border: "none", cursor: "pointer" }}>
                          ✕ Remove
                        </button>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                        <Field label="Badge (optional, e.g. NEW)" value={pub.badge} onChange={(v) => setPubField(si, pi, "badge", v)} placeholder="NEW" />
                        <Field label="Venue / Reference" value={pub.venue} onChange={(v) => setPubField(si, pi, "venue", v)} placeholder="arXiv 2602.13458" />
                        <div style={{ gridColumn: "1 / -1" }}>
                          <Field label="Title" value={pub.title} onChange={(v) => setPubField(si, pi, "title", v)} placeholder="Paper title..." />
                        </div>
                        <div style={{ gridColumn: "1 / -1" }}>
                          <Field label="Title URL (optional)" value={pub.titleHref} onChange={(v) => setPubField(si, pi, "titleHref", v)} placeholder="https://arxiv.org/abs/..." />
                        </div>
                      </div>

                      {/* Authors rich text editor */}
                      <div style={{ marginBottom: 10 }}>
                        <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 4 }}>
                          Authors <span style={{ fontWeight: 400, color: "#9ca3af" }}>(use Bold for main author, Link for hyperlinks)</span>
                        </label>
                        <RichTextEditor
                          value={pub.authors}
                          onChange={(v) => setPubField(si, pi, "authors", v)}
                          placeholder="Author names..."
                          minRows={2}
                        />
                      </div>

                      {/* Links */}
                      <div>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                          <label style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>Links</label>
                          <button onClick={() => addPubLink(si, pi)} style={{ fontSize: 12, padding: "3px 8px", borderRadius: 6, background: "#f0f4f8", color: "#2d5a8e", border: "none", cursor: "pointer" }}>
                            + Add Link
                          </button>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                          {pub.links.map((link, li) => (
                            <div key={li} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                              <input value={link.label} onChange={(e) => setPubLink(si, pi, li, "label", e.target.value)}
                                placeholder="paper" style={{ ...inputStyle, width: 90, padding: "5px 8px", borderRadius: 6, fontSize: 12, outline: "none" }} />
                              <input value={link.href} onChange={(e) => setPubLink(si, pi, li, "href", e.target.value)}
                                placeholder="https://..." style={{ ...inputStyle, flex: 1, padding: "5px 8px", borderRadius: 6, fontSize: 12, outline: "none" }} />
                              <button onClick={() => removePubLink(si, pi, li)} style={{ fontSize: 11, padding: "3px 7px", borderRadius: 6, background: "#fee2e2", color: "#b91c1c", border: "none", cursor: "pointer" }}>✕</button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* =================== GROUP =================== */}
        {tab === "group" && (
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <h2 style={{ ...sectionHeader, marginBottom: 0 }}>Group Members</h2>
              <button onClick={addMember} style={{ fontSize: 13, padding: "6px 14px", borderRadius: 8, fontWeight: 600, background: "#dbeafe", color: "#1e40af", border: "none", cursor: "pointer" }}>
                + Add Member
              </button>
            </div>
            {content.groupMembers.length === 0 && (
              <div style={{ ...card, textAlign: "center", color: "#9ca3af", fontSize: 13, padding: "2rem" }}>
                No group members yet.
              </div>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {content.groupMembers.map((member, i) => (
                <MemberCard
                  key={i}
                  member={member}
                  index={i}
                  onUpdate={(key, val) => setMember(i, key, val)}
                  onRemove={() => removeMember(i)}
                />
              ))}
            </div>
          </div>
        )}

        {/* =================== OPENINGS =================== */}
        {tab === "openings" && (
          <div style={card}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
              <div>
                <h2 style={{ ...sectionHeader, marginBottom: 4 }}>Openings</h2>
                <p style={{ fontSize: 12, color: "#6b7280", marginBottom: 0 }}>
                  Rich content shown on the Openings tab. Supports headings (H2, H3), bold, bullet lists, and hyperlinks.
                </p>
              </div>
            </div>
            <RichTextEditor
              value={content.openings}
              onChange={(v) => setContent((c) => ({ ...c, openings: v }))}
              placeholder="Write openings content here... (e.g. position descriptions, requirements, how to apply)"
              minRows={16}
              toolbar="full"
            />
            {content.openings && (
              <div style={{ marginTop: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 8 }}>Preview</div>
                <div
                  className="openings-content"
                  style={{ border: "1px solid #e5e7eb", borderRadius: 8, padding: "1rem", background: "#fafafa" }}
                  dangerouslySetInnerHTML={{ __html: content.openings }}
                />
              </div>
            )}
          </div>
        )}

        {/* =================== CONTACT =================== */}
        {tab === "contact" && (
          <div style={card}>
            <h2 style={sectionHeader}>Contact Information</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {(["address", "office", "email"] as const).map((key) => (
                <Field key={key} label={key} value={content.contact[key]}
                  onChange={(v) => setContent((c) => ({ ...c, contact: { ...c.contact, [key]: v } }))} />
              ))}
            </div>
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 24 }}>
          <button onClick={save} disabled={saving} style={{ padding: "10px 24px", borderRadius: 10, fontSize: 14, fontWeight: 600, color: "#fff", background: "#1e3a5f", border: "none", cursor: "pointer", opacity: saving ? 0.7 : 1 }}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </main>
    </div>
  );
}

function MemberCard({ member, index, onUpdate, onRemove }: {
  member: GroupMember;
  index: number;
  onUpdate: (key: keyof GroupMember, val: string) => void;
  onRemove: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const inputStyle = { border: "1px solid #d1d5db", background: "#f9fafb" };

  function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { onUpdate("image", ev.target?.result as string); };
    reader.readAsDataURL(file);
  }

  return (
    <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 1px 4px rgba(0,0,0,0.07)", padding: "1.25rem" }}>
      <div style={{ display: "flex", gap: "1.25rem", alignItems: "flex-start" }}>
        {/* Photo */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <div
            onClick={() => fileRef.current?.click()}
            style={{
              width: 90, height: 90, borderRadius: "50%", overflow: "hidden",
              background: "#f0f4f8", border: "2px dashed #c7d7ea",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", position: "relative",
            }}
            title="Click to upload photo"
          >
            {member.image ? (
              <img src={member.image} alt={member.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <span style={{ fontSize: 24 }}>📷</span>
            )}
          </div>
          <button
            onClick={() => fileRef.current?.click()}
            style={{ fontSize: 11, padding: "3px 10px", borderRadius: 20, background: "#f0f4f8", color: "#2d5a8e", border: "1px solid #c7d7ea", cursor: "pointer" }}
          >
            {member.image ? "Change" : "Upload"} Photo
          </button>
          {member.image && (
            <button onClick={() => onUpdate("image", "")}
              style={{ fontSize: 11, padding: "3px 10px", borderRadius: 20, background: "#fee2e2", color: "#b91c1c", border: "none", cursor: "pointer" }}>
              Remove
            </button>
          )}
          <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} style={{ display: "none" }} />
        </div>

        {/* Fields */}
        <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {([
            { key: "name", label: "Name" },
            { key: "nameHref", label: "Name URL (optional)" },
            { key: "role", label: "Role (e.g. PhD Student (2024 Fall))" },
            { key: "badge", label: "Badge (e.g. AISG PhD Fellowship)" },
            { key: "research", label: "Research Interests" },
            { key: "coAdvise", label: "Co-advise note (optional)" },
          ] as { key: keyof GroupMember; label: string }[]).map(({ key, label }) => (
            <div key={key}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#374151", marginBottom: 3 }}>{label}</label>
              <input
                value={member[key]}
                onChange={(e) => onUpdate(key, e.target.value)}
                style={{ ...inputStyle, width: "100%", padding: "6px 10px", borderRadius: 8, fontSize: 12, outline: "none" }}
              />
            </div>
          ))}
        </div>

        <button onClick={onRemove} style={{ fontSize: 12, padding: "5px 10px", borderRadius: 8, background: "#fee2e2", color: "#b91c1c", border: "none", cursor: "pointer", flexShrink: 0 }}>
          ✕ Remove
        </button>
      </div>
      <div style={{ marginTop: 8, fontSize: 11, color: "#9ca3af", textAlign: "right" }}>Member #{index + 1}</div>
    </div>
  );
}

function ProfileImageUpload({ image, onChange }: { image: string; onChange: (v: string) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => onChange(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 20, padding: "16px", background: "#f9fafb", borderRadius: 10, border: "1px solid #e5e7eb" }}>
      <div
        onClick={() => fileRef.current?.click()}
        style={{
          width: 90, height: 90, borderRadius: "50%", overflow: "hidden",
          background: "#e5e7eb", border: "2px dashed #c7d7ea",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", flexShrink: 0,
        }}
        title="Click to upload"
      >
        {image ? (
          <img src={image} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <span style={{ fontSize: 28 }}>📷</span>
        )}
      </div>
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Profile Photo</div>
        <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 10 }}>
          Circular photo displayed on the public page. Stored as base64 in DB.
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => fileRef.current?.click()}
            style={{ fontSize: 12, padding: "5px 14px", borderRadius: 20, background: "#1e3a5f", color: "#fff", border: "none", cursor: "pointer" }}>
            {image ? "Change Photo" : "Upload Photo"}
          </button>
          {image && (
            <button onClick={() => onChange("")}
              style={{ fontSize: 12, padding: "5px 14px", borderRadius: 20, background: "#fee2e2", color: "#b91c1c", border: "none", cursor: "pointer" }}>
              Remove
            </button>
          )}
        </div>
      </div>
      <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} />
    </div>
  );
}
