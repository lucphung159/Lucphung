"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

type NewsItem = { date: string; type: string; text: string };
type PubLink = { label: string; href: string };
type Publication = { title: string; authors: string; venue: string; year: string; links: PubLink[] };

interface PageContent {
  profile: {
    name: string;
    title: string;
    university: string;
    advisor: string;
    email: string;
    github: string;
    scholar: string;
    linkedin: string;
    bio: string[];
  };
  news: NewsItem[];
  publications: Publication[];
  contact: { address: string; office: string; email: string };
}

const defaultContent: PageContent = {
  profile: { name: "", title: "", university: "", advisor: "", email: "", github: "", scholar: "", linkedin: "", bio: [""] },
  news: [],
  publications: [],
  contact: { address: "", office: "", email: "" },
};

type Tab = "profile" | "news" | "publications" | "contact";

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
      profile: data.profile || defaultContent.profile,
      news: data.news || [],
      publications: data.publications || [],
      contact: data.contact || defaultContent.contact,
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
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin");
  }

  // ---- Profile helpers ----
  function setProfile(key: keyof PageContent["profile"], val: string) {
    setContent((c) => ({ ...c, profile: { ...c.profile, [key]: val } }));
  }
  function setBio(i: number, val: string) {
    setContent((c) => {
      const bio = [...c.profile.bio];
      bio[i] = val;
      return { ...c, profile: { ...c.profile, bio } };
    });
  }
  function addBio() { setContent((c) => ({ ...c, profile: { ...c.profile, bio: [...c.profile.bio, ""] } })); }
  function removeBio(i: number) {
    setContent((c) => ({ ...c, profile: { ...c.profile, bio: c.profile.bio.filter((_, j) => j !== i) } }));
  }

  // ---- News helpers ----
  function setNews(i: number, key: keyof NewsItem, val: string) {
    setContent((c) => {
      const news = [...c.news];
      news[i] = { ...news[i], [key]: val };
      return { ...c, news };
    });
  }
  function addNews() {
    setContent((c) => ({ ...c, news: [{ date: "", type: "misc", text: "" }, ...c.news] }));
  }
  function removeNews(i: number) {
    setContent((c) => ({ ...c, news: c.news.filter((_, j) => j !== i) }));
  }

  // ---- Publication helpers ----
  function setPub(i: number, key: keyof Omit<Publication, "links">, val: string) {
    setContent((c) => {
      const publications = [...c.publications];
      publications[i] = { ...publications[i], [key]: val };
      return { ...c, publications };
    });
  }
  function setPubLink(pi: number, li: number, key: keyof PubLink, val: string) {
    setContent((c) => {
      const publications = [...c.publications];
      const links = [...publications[pi].links];
      links[li] = { ...links[li], [key]: val };
      publications[pi] = { ...publications[pi], links };
      return { ...c, publications };
    });
  }
  function addPubLink(pi: number) {
    setContent((c) => {
      const publications = [...c.publications];
      publications[pi] = { ...publications[pi], links: [...publications[pi].links, { label: "", href: "" }] };
      return { ...c, publications };
    });
  }
  function removePubLink(pi: number, li: number) {
    setContent((c) => {
      const publications = [...c.publications];
      publications[pi] = { ...publications[pi], links: publications[pi].links.filter((_, j) => j !== li) };
      return { ...c, publications };
    });
  }
  function addPub() {
    setContent((c) => ({
      ...c,
      publications: [{ title: "", authors: "", venue: "", year: "", links: [] }, ...c.publications],
    }));
  }
  function removePub(i: number) {
    setContent((c) => ({ ...c, publications: c.publications.filter((_, j) => j !== i) }));
  }

  // ---- Contact helpers ----
  function setContact(key: keyof PageContent["contact"], val: string) {
    setContent((c) => ({ ...c, contact: { ...c.contact, [key]: val } }));
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#f0f4f8" }}>
        <p style={{ color: "#6b7280" }}>Loading...</p>
      </div>
    );
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: "profile", label: "Profile" },
    { key: "news", label: "News" },
    { key: "publications", label: "Publications" },
    { key: "contact", label: "Contact" },
  ];

  return (
    <div className="min-h-screen" style={{ background: "#f0f4f8" }}>
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-bold text-lg" style={{ color: "#1e3a5f" }}>Admin Dashboard</span>
            <a href="/" target="_blank" className="text-xs px-2 py-1 rounded" style={{ background: "#f0f4f8", color: "#2d5a8e" }}>
              View Site ↗
            </a>
          </div>
          <div className="flex items-center gap-3">
            {saved && (
              <span className="text-xs px-3 py-1 rounded-full font-semibold" style={{ background: "#d1fae5", color: "#065f46" }}>
                ✓ Saved
              </span>
            )}
            <button
              onClick={save}
              disabled={saving}
              className="px-4 py-1.5 rounded-lg text-sm font-semibold text-white"
              style={{ background: "#1e3a5f", opacity: saving ? 0.7 : 1 }}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <button
              onClick={logout}
              className="px-3 py-1.5 rounded-lg text-sm"
              style={{ background: "#f3f4f6", color: "#6b7280" }}
            >
              Logout
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-5xl mx-auto px-6 flex gap-1 pb-0">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className="px-4 py-2 text-sm font-medium transition-colors"
              style={{
                color: tab === t.key ? "#1e3a5f" : "#6b7280",
                borderBottom: tab === t.key ? "2px solid #1e3a5f" : "2px solid transparent",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">

        {/* ===================== PROFILE TAB ===================== */}
        {tab === "profile" && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="font-bold text-base mb-5" style={{ color: "#1e3a5f" }}>Profile Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(["name", "title", "university", "advisor", "email", "github", "scholar", "linkedin"] as const).map((key) => (
                <div key={key}>
                  <label className="block text-xs font-semibold mb-1 capitalize" style={{ color: "#374151" }}>
                    {key === "scholar" ? "Google Scholar URL" : key === "github" ? "GitHub URL" : key === "linkedin" ? "LinkedIn URL" : key}
                  </label>
                  <input
                    type="text"
                    value={content.profile[key]}
                    onChange={(e) => setProfile(key, e.target.value)}
                    className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                    style={{ border: "1px solid #d1d5db", background: "#f9fafb" }}
                  />
                </div>
              ))}
            </div>

            {/* Bio paragraphs */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold" style={{ color: "#374151" }}>Bio Paragraphs</label>
                <button onClick={addBio} className="text-xs px-2 py-1 rounded" style={{ background: "#dbeafe", color: "#1e40af" }}>
                  + Add Paragraph
                </button>
              </div>
              <div className="flex flex-col gap-3">
                {content.profile.bio.map((p, i) => (
                  <div key={i} className="flex gap-2">
                    <textarea
                      value={p}
                      onChange={(e) => setBio(i, e.target.value)}
                      rows={3}
                      className="flex-1 px-3 py-2 rounded-lg text-sm outline-none resize-none"
                      style={{ border: "1px solid #d1d5db", background: "#f9fafb" }}
                      placeholder={`Paragraph ${i + 1}...`}
                    />
                    <button onClick={() => removeBio(i)} className="text-xs px-2 py-1 rounded self-start" style={{ background: "#fee2e2", color: "#b91c1c" }}>
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===================== NEWS TAB ===================== */}
        {tab === "news" && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-base" style={{ color: "#1e3a5f" }}>News Items</h2>
              <button onClick={addNews} className="text-sm px-3 py-1.5 rounded-lg font-semibold" style={{ background: "#dbeafe", color: "#1e40af" }}>
                + Add News
              </button>
            </div>
            <div className="flex flex-col gap-4">
              {content.news.length === 0 && (
                <p className="text-sm text-center py-8" style={{ color: "#9ca3af" }}>No news items yet. Click &quot;+ Add News&quot; to add one.</p>
              )}
              {content.news.map((item, i) => (
                <div key={i} className="border rounded-lg p-4" style={{ borderColor: "#e5e7eb" }}>
                  <div className="flex gap-3 items-start">
                    <div className="flex flex-col gap-2 flex-1">
                      <div className="flex gap-3">
                        <div className="flex-1">
                          <label className="block text-xs font-semibold mb-1" style={{ color: "#374151" }}>Date</label>
                          <input
                            type="text"
                            value={item.date}
                            onChange={(e) => setNews(i, "date", e.target.value)}
                            className="w-full px-3 py-1.5 rounded text-sm outline-none"
                            style={{ border: "1px solid #d1d5db", background: "#f9fafb" }}
                            placeholder="Jun 2026"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block text-xs font-semibold mb-1" style={{ color: "#374151" }}>Type</label>
                          <select
                            value={item.type}
                            onChange={(e) => setNews(i, "type", e.target.value)}
                            className="w-full px-3 py-1.5 rounded text-sm outline-none"
                            style={{ border: "1px solid #d1d5db", background: "#f9fafb" }}
                          >
                            <option value="paper">Paper</option>
                            <option value="award">Award</option>
                            <option value="talk">Talk</option>
                            <option value="misc">News</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1" style={{ color: "#374151" }}>Text</label>
                        <textarea
                          value={item.text}
                          onChange={(e) => setNews(i, "text", e.target.value)}
                          rows={2}
                          className="w-full px-3 py-1.5 rounded text-sm outline-none resize-none"
                          style={{ border: "1px solid #d1d5db", background: "#f9fafb" }}
                          placeholder="News description..."
                        />
                      </div>
                    </div>
                    <button onClick={() => removeNews(i)} className="text-xs px-2 py-1 rounded mt-5" style={{ background: "#fee2e2", color: "#b91c1c" }}>
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================== PUBLICATIONS TAB ===================== */}
        {tab === "publications" && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-base" style={{ color: "#1e3a5f" }}>Publications</h2>
              <button onClick={addPub} className="text-sm px-3 py-1.5 rounded-lg font-semibold" style={{ background: "#dbeafe", color: "#1e40af" }}>
                + Add Publication
              </button>
            </div>
            <div className="flex flex-col gap-5">
              {content.publications.length === 0 && (
                <p className="text-sm text-center py-8" style={{ color: "#9ca3af" }}>No publications yet.</p>
              )}
              {content.publications.map((pub, pi) => (
                <div key={pi} className="border rounded-lg p-4" style={{ borderColor: "#e5e7eb" }}>
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-xs font-semibold" style={{ color: "#6b7280" }}>Publication {pi + 1}</span>
                    <button onClick={() => removePub(pi)} className="text-xs px-2 py-1 rounded" style={{ background: "#fee2e2", color: "#b91c1c" }}>
                      ✕ Remove
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    {(["title", "authors", "venue", "year"] as const).map((key) => (
                      <div key={key} className={key === "title" || key === "authors" || key === "venue" ? "md:col-span-2" : ""}>
                        <label className="block text-xs font-semibold mb-1 capitalize" style={{ color: "#374151" }}>{key}</label>
                        <input
                          type="text"
                          value={pub[key]}
                          onChange={(e) => setPub(pi, key, e.target.value)}
                          className="w-full px-3 py-1.5 rounded text-sm outline-none"
                          style={{ border: "1px solid #d1d5db", background: "#f9fafb" }}
                          placeholder={key === "venue" ? "Conference/Journal name" : key === "year" ? "2026" : ""}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Links */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-semibold" style={{ color: "#374151" }}>Links</label>
                      <button onClick={() => addPubLink(pi)} className="text-xs px-2 py-1 rounded" style={{ background: "#f0f4f8", color: "#2d5a8e" }}>
                        + Add Link
                      </button>
                    </div>
                    <div className="flex flex-col gap-2">
                      {pub.links.map((link, li) => (
                        <div key={li} className="flex gap-2 items-center">
                          <input
                            type="text"
                            value={link.label}
                            onChange={(e) => setPubLink(pi, li, "label", e.target.value)}
                            className="w-24 px-2 py-1 rounded text-xs outline-none"
                            style={{ border: "1px solid #d1d5db", background: "#f9fafb" }}
                            placeholder="Label"
                          />
                          <input
                            type="text"
                            value={link.href}
                            onChange={(e) => setPubLink(pi, li, "href", e.target.value)}
                            className="flex-1 px-2 py-1 rounded text-xs outline-none"
                            style={{ border: "1px solid #d1d5db", background: "#f9fafb" }}
                            placeholder="https://..."
                          />
                          <button onClick={() => removePubLink(pi, li)} className="text-xs px-2 py-1 rounded" style={{ background: "#fee2e2", color: "#b91c1c" }}>
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================== CONTACT TAB ===================== */}
        {tab === "contact" && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="font-bold text-base mb-5" style={{ color: "#1e3a5f" }}>Contact Information</h2>
            <div className="flex flex-col gap-4">
              {(["address", "office", "email"] as const).map((key) => (
                <div key={key}>
                  <label className="block text-xs font-semibold mb-1 capitalize" style={{ color: "#374151" }}>{key}</label>
                  <input
                    type="text"
                    value={content.contact[key]}
                    onChange={(e) => setContact(key, e.target.value)}
                    className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                    style={{ border: "1px solid #d1d5db", background: "#f9fafb" }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Save button bottom */}
        <div className="flex justify-end mt-6">
          <button
            onClick={save}
            disabled={saving}
            className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white"
            style={{ background: "#1e3a5f", opacity: saving ? 0.7 : 1 }}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </main>
    </div>
  );
}
