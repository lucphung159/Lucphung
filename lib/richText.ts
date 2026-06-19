export function formatRichTextHtml(text = "") {
  return text.replace(/\/n/g, "<br />");
}

export function richTextHtml(text = "") {
  return { __html: formatRichTextHtml(text) };
}
