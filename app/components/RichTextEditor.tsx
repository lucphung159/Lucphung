"use client";
import { useRef, useEffect, useCallback } from "react";

interface Props {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minRows?: number;
}

export function RichTextEditor({ value, onChange, placeholder, minRows = 2 }: Props) {
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

  return (
    <div style={{ border: "1px solid #d1d5db", borderRadius: 8, overflow: "hidden", background: "#f9fafb" }}>
      <div
        style={{
          borderBottom: "1px solid #e5e7eb",
          background: "#f3f4f6",
          padding: "4px 8px",
          display: "flex",
          gap: 4,
          flexWrap: "wrap",
        }}
      >
        {[
          { label: "B", title: "Bold", style: { fontWeight: "bold" as const }, cmd: () => execCmd("bold") },
          { label: "I", title: "Italic", style: { fontStyle: "italic" as const }, cmd: () => execCmd("italic") },
        ].map((btn) => (
          <button
            key={btn.label}
            type="button"
            title={btn.title}
            onMouseDown={(e) => { e.preventDefault(); btn.cmd(); }}
            style={{
              ...btn.style,
              fontSize: 12,
              padding: "2px 9px",
              borderRadius: 4,
              border: "1px solid #d1d5db",
              background: "#fff",
              cursor: "pointer",
            }}
          >
            {btn.label}
          </button>
        ))}
        <button
          type="button"
          title="Insert link"
          onMouseDown={(e) => { e.preventDefault(); insertLink(); }}
          style={{ fontSize: 12, padding: "2px 9px", borderRadius: 4, border: "1px solid #d1d5db", background: "#fff", cursor: "pointer" }}
        >
          🔗 Link
        </button>
        <button
          type="button"
          title="Remove formatting"
          onMouseDown={(e) => { e.preventDefault(); execCmd("removeFormat"); }}
          style={{ fontSize: 12, padding: "2px 9px", borderRadius: 4, border: "1px solid #d1d5db", background: "#fff", cursor: "pointer", marginLeft: "auto" }}
        >
          ✕ Clear
        </button>
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={emit}
        data-placeholder={placeholder}
        style={{
          minHeight: `${minRows * 1.6}rem`,
          padding: "8px 12px",
          fontSize: 13,
          outline: "none",
          lineHeight: 1.6,
          color: "#1f2937",
        }}
      />
    </div>
  );
}
