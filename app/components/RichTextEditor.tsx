"use client";
import { useRef, useEffect, useCallback } from "react";

interface Props {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minRows?: number;
  toolbar?: "basic" | "full";
}

export function RichTextEditor({ value, onChange, placeholder, minRows = 2, toolbar = "basic" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const lastValueRef = useRef<string | null>(null);
  const savedRangeRef = useRef<Range | null>(null);

  const textColors = [
    { label: "Dark", value: "#1f2937" },
    { label: "Gray", value: "#6b7280" },
    { label: "Blue", value: "#1e3a5f" },
    { label: "Red", value: "#c0392b" },
    { label: "Green", value: "#15803d" },
    { label: "Gold", value: "#b45309" },
  ];

  useEffect(() => {
    if (ref.current && value !== lastValueRef.current) {
      ref.current.innerHTML = value;
      lastValueRef.current = value;
    }
  }, [value]);

  const emit = useCallback(() => {
    const html = ref.current?.innerHTML || "";
    lastValueRef.current = html;
    onChange(html);
  }, [onChange]);

  function saveSelection() {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    const anchorNode = selection.anchorNode;
    if (anchorNode && ref.current?.contains(anchorNode)) {
      savedRangeRef.current = selection.getRangeAt(0).cloneRange();
    }
  }

  function restoreSelection() {
    const selection = window.getSelection();
    const range = savedRangeRef.current;
    if (!selection || !range) return;

    selection.removeAllRanges();
    selection.addRange(range);
  }

  function execCmd(cmd: string, val?: string) {
    ref.current?.focus();
    restoreSelection();
    document.execCommand(cmd, false, val);
    saveSelection();
    emit();
  }

  function insertLink() {
    const sel = window.getSelection();
    const selectedText = sel?.toString().trim();
    const url = prompt("Enter URL:", "https://");
    if (!url) return;
    ref.current?.focus();
    if (selectedText) {
      document.execCommand("createLink", false, url);
    } else {
      const text = prompt("Link text:", url) || url;
      document.execCommand(
        "insertHTML",
        false,
        `<a href="${url}" target="_blank" rel="noopener noreferrer">${text}</a>`
      );
    }
    emit();
  }

  const btnStyle = {
    fontSize: 12,
    padding: "2px 9px",
    borderRadius: 4,
    border: "1px solid #d1d5db",
    background: "#fff",
    cursor: "pointer",
  };

  const colorButtonStyle = {
    width: 20,
    height: 20,
    borderRadius: 999,
    border: "1px solid #cbd5e1",
    cursor: "pointer",
    padding: 0,
  };

  return (
    <div style={{ border: "1px solid #d1d5db", borderRadius: 8, overflow: "hidden", background: "#f9fafb" }}>
      <div style={{ borderBottom: "1px solid #e5e7eb", background: "#f3f4f6", padding: "4px 8px", display: "flex", gap: 4, flexWrap: "wrap", alignItems: "center" }}>
        <button type="button" title="Bold" onMouseDown={(e) => { e.preventDefault(); execCmd("bold"); }}
          style={{ ...btnStyle, fontWeight: "bold" }}>B</button>
        <button type="button" title="Italic" onMouseDown={(e) => { e.preventDefault(); execCmd("italic"); }}
          style={{ ...btnStyle, fontStyle: "italic" }}>I</button>
        <button type="button" title="Underline" onMouseDown={(e) => { e.preventDefault(); execCmd("underline"); }}
          style={{ ...btnStyle, textDecoration: "underline" }}>U</button>

        <span style={{ color: "#d1d5db", margin: "0 2px" }}>|</span>
        <span style={{ fontSize: 11, color: "#6b7280", fontWeight: 600, margin: "0 2px" }}>Color</span>
        {textColors.map((color) => (
          <button
            key={color.value}
            type="button"
            title={`${color.label} text`}
            onMouseDown={(e) => { e.preventDefault(); execCmd("foreColor", color.value); }}
            style={{ ...colorButtonStyle, background: color.value }}
            aria-label={`${color.label} text color`}
          />
        ))}
        <label
          title="Custom text color"
          style={{ ...btnStyle, display: "inline-flex", alignItems: "center", gap: 5, padding: "2px 7px" }}
        >
          A
          <input
            type="color"
            defaultValue="#1f2937"
            onMouseDown={saveSelection}
            onChange={(e) => execCmd("foreColor", e.target.value)}
            style={{ width: 18, height: 18, border: "none", padding: 0, background: "transparent", cursor: "pointer" }}
            aria-label="Custom text color"
          />
        </label>

        {toolbar === "full" && (
          <>
            <span style={{ color: "#d1d5db", margin: "0 2px" }}>|</span>
            <button type="button" title="Heading 2" onMouseDown={(e) => { e.preventDefault(); execCmd("formatBlock", "h2"); }}
              style={{ ...btnStyle, fontWeight: 700, fontSize: 11 }}>H2</button>
            <button type="button" title="Heading 3" onMouseDown={(e) => { e.preventDefault(); execCmd("formatBlock", "h3"); }}
              style={{ ...btnStyle, fontWeight: 600, fontSize: 11 }}>H3</button>
            <button type="button" title="Paragraph" onMouseDown={(e) => { e.preventDefault(); execCmd("formatBlock", "p"); }}
              style={{ ...btnStyle, fontSize: 11 }}>¶ P</button>
            <span style={{ color: "#d1d5db", margin: "0 2px" }}>|</span>
            <button type="button" title="Bullet list" onMouseDown={(e) => { e.preventDefault(); execCmd("insertUnorderedList"); }}
              style={{ ...btnStyle }}>• List</button>
            <button type="button" title="Ordered list" onMouseDown={(e) => { e.preventDefault(); execCmd("insertOrderedList"); }}
              style={{ ...btnStyle }}>1. List</button>
            <span style={{ color: "#d1d5db", margin: "0 2px" }}>|</span>
          </>
        )}

        <button type="button" title="Insert link" onMouseDown={(e) => { e.preventDefault(); insertLink(); }}
          style={{ ...btnStyle }}>🔗 Link</button>
        <button type="button" title="Remove formatting" onMouseDown={(e) => { e.preventDefault(); execCmd("removeFormat"); execCmd("formatBlock", "p"); }}
          style={{ ...btnStyle, marginLeft: "auto" }}>✕ Clear</button>
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={() => { saveSelection(); emit(); }}
        onKeyUp={saveSelection}
        onMouseUp={saveSelection}
        data-placeholder={placeholder}
        style={{
          minHeight: `${minRows * 1.6}rem`,
          padding: "10px 14px",
          fontSize: 13,
          outline: "none",
          lineHeight: 1.7,
          color: "#1f2937",
        }}
      />
    </div>
  );
}
