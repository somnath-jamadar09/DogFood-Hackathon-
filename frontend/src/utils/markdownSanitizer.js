/**
 * Basic offline markdown sanitizer and renderer fallback
 */
export const sanitizeMarkdown = (rawText) => {
  if (!rawText) return '';
  return rawText
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '');
};

export const formatMarkdownPreview = (text) => {
  const safe = sanitizeMarkdown(text);
  // Simple paragraph / bold / heading parse for preview
  return safe
    .replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold text-primary mt-2 mb-1">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-primary mt-3 mb-1">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-primary mt-4 mb-2">$1</h1>')
    .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
    .replace(/\n$/gim, '<br />');
};
