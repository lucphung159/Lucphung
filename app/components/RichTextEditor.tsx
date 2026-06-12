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
  const lastValueRef = useRef(value);

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

  function execCmd(cmd: string, val?: string) {
    ref.current?.focus();
    document.execCommand(cmd, false, val);
    emit();
  }

  function insertLink() {
    const sel = window.getSelection();
    const selectedText = sel?.toString().trim();
    const url = prompt("URL оруулна уу:", "https://");
    if (!url) return;
    ref.current?.focus();
    if (selectedText) {
      document.execCommand("createLink", false, url);
    } else {
      const text = prompt("Холбоосны текст:", url) || url;
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

  return (
    <div style={{ border: "1px solid #d1d5db", borderRadius: 8, overflow: "hidden", background: "#f9fafb" }}>
      <div style={{ borderBottom: "1px solid #e5e7eb", background: "#f3f4f6", padding: "4px 8px", display: "flex", gap: 4, flexWrap: "wrap", alignItems: "center" }}>
        <button type="button" title="Bold" onMouseDown={(e) => { e.preventDefault(); execCmd("bold"); }}
          style={{ ...btnStyle, fontWeight: "bold" }}>B</button>
        <button type="button" title="Italic" onMouseDown={(e) => { e.preventDefault(); execCmd("italic"); }}
          style={{ ...btnStyle, fontStyle: "italic" }}>I</button>

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
        onInput={emit}
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
