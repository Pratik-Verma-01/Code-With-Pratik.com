/**
 * 〄𝙲𝙾𝙳𝙴-Ꮿɪᴛʜ-ᎮᏒᎪTᎥᏦ〄 Markdown Utilities
 * 
 * Markdown parsing and rendering helpers.
 */

/**
 * Extract first heading from markdown
 * @param {string} markdown - Markdown content
 * @returns {string|null}
 */
export function extractTitle(markdown) {
  if (!markdown) return null;
  
  const match = markdown.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : null;
}

/**
 * Extract first paragraph from markdown
 * @param {string} markdown - Markdown content
 * @returns {string|null}
 */
export function extractDescription(markdown) {
  if (!markdown) return null;
  
  // Remove headings, code blocks, and other elements
  const cleaned = markdown
    .replace(/^#+\s+.+$/gm, '') // Remove headings
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/`[^`]+`/g, '') // Remove inline code
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Convert links to text
    .replace(/[*_~]+/g, '') // Remove formatting
    .trim();
  
  // Get first non-empty paragraph
  const paragraphs = cleaned.split(/\n\n+/);
  const firstParagraph = paragraphs.find(p => p.trim().length > 0);
  
  return firstParagraph?.trim() || null;
}

/**
 * Extract all code blocks from markdown
 * @param {string} markdown - Markdown content
 * @returns {Array<{language: string, code: string}>}
 */
export function extractCodeBlocks(markdown) {
  if (!markdown) return [];
  
  const codeBlockRegex = /```(\w*)\n([\s\S]*?)```/g;
  const blocks = [];
  let match;
  
  while ((match = codeBlockRegex.exec(markdown)) !== null) {
    blocks.push({
      language: match[1] || 'text',
      code: match[2].trim(),
    });
  }
  
  return blocks;
}

/**
 * Extract all links from markdown
 * @param {string} markdown - Markdown content
 * @returns {Array<{text: string, url: string}>}
 */
export function extractLinks(markdown) {
  if (!markdown) return [];
  
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const links = [];
  let match;
  
  while ((match = linkRegex.exec(markdown)) !== null) {
    links.push({
      text: match[1],
      url: match[2],
    });
  }
  
  return links;
}

/**
 * Extract all images from markdown
 * @param {string} markdown - Markdown content
 * @returns {Array<{alt: string, url: string}>}
 */
export function extractImages(markdown) {
  if (!markdown) return [];
  
  const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  const images = [];
  let match;
  
  while ((match = imageRegex.exec(markdown)) !== null) {
    images.push({
      alt: match[1],
      url: match[2],
    });
  }
  
  return images;
}

/**
 * Get table of contents from markdown
 * @param {string} markdown - Markdown content
 * @returns {Array<{level: number, text: string, slug: string}>}
 */
export function extractTableOfContents(markdown) {
  if (!markdown) return [];
  
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const toc = [];
  let match;
  
  while ((match = headingRegex.exec(markdown)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const slug = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
    
    toc.push({ level, text, slug });
  }
  
  return toc;
}

/**
 * Count words in markdown (excluding code blocks)
 * @param {string} markdown - Markdown content
 * @returns {number}
 */
export function countWords(markdown) {
  if (!markdown) return 0;
  
  // Remove code blocks
  const withoutCode = markdown
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]+`/g, '');
  
  // Remove markdown syntax
  const plainText = withoutCode
    .replace(/^#+\s+/gm, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_~`]+/g, '')
    .replace(/\n+/g, ' ')
    .trim();
  
  if (!plainText) return 0;
  
  return plainText.split(/\s+/).filter(Boolean).length;
}

/**
 * Estimate reading time
 * @param {string} markdown - Markdown content
 * @param {number} wordsPerMinute - Reading speed
 * @returns {number} Minutes
 */
export function estimateReadingTime(markdown, wordsPerMinute = 200) {
  const words = countWords(markdown);
  return Math.ceil(words / wordsPerMinute);
}

/**
 * Convert plain text to markdown
 * @param {string} text - Plain text
 * @returns {string}
 */
export function textToMarkdown(text) {
  if (!text) return '';
  
  return text
    .split('\n\n')
    .map(paragraph => paragraph.trim())
    .filter(Boolean)
    .join('\n\n');
}

/**
 * Strip markdown formatting
 * @param {string} markdown - Markdown content
 * @returns {string} Plain text
 */
export function stripMarkdown(markdown) {
  if (!markdown) return '';
  
  return markdown
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, '')
    // Remove inline code
    .replace(/`([^`]+)`/g, '$1')
    // Remove images
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    // Convert links to text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove headings markers
    .replace(/^#+\s+/gm, '')
    // Remove bold/italic/strikethrough
    .replace(/[*_~]+([^*_~]+)[*_~]+/g, '$1')
    // Remove blockquotes
    .replace(/^>\s+/gm, '')
    // Remove horizontal rules
    .replace(/^[-*_]{3,}$/gm, '')
    // Remove list markers
    .replace(/^[\s]*[-*+]\s+/gm, '')
    .replace(/^[\s]*\d+\.\s+/gm, '')
    // Normalize whitespace
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Sanitize markdown (remove potentially dangerous content)
 * @param {string} markdown - Markdown content
 * @returns {string}
 */
export function sanitizeMarkdown(markdown) {
  if (!markdown) return '';
  
  return markdown
    // Remove HTML tags (basic)
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, '')
    .replace(/<object[\s\S]*?<\/object>/gi, '')
    .replace(/<embed[\s\S]*?>/gi, '')
    // Remove javascript: protocol
    .replace(/javascript:/gi, '')
    // Remove event handlers
    .replace(/on\w+=/gi, '');
}

/**
 * Add IDs to headings for anchor links
 * @param {string} markdown - Markdown content
 * @returns {string}
 */
export function addHeadingIds(markdown) {
  if (!markdown) return '';
  
  const usedIds = new Set();
  
  return markdown.replace(/^(#{1,6})\s+(.+)$/gm, (match, hashes, text) => {
    let id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
    
    // Handle duplicate IDs
    let uniqueId = id;
    let counter = 1;
    while (usedIds.has(uniqueId)) {
      uniqueId = `${id}-${counter}`;
      counter++;
    }
    usedIds.add(uniqueId);
    
    return `${hashes} ${text} {#${uniqueId}}`;
  });
}

/**
 * Highlight mentions in markdown
 * @param {string} markdown - Markdown content
 * @returns {string}
 */
export function highlightMentions(markdown) {
  if (!markdown) return '';
  
  return markdown.replace(
    /@(\w+)/g,
    '[@$1](/user/$1)'
  );
}

/**
 * Auto-link URLs in markdown
 * @param {string} markdown - Markdown content
 * @returns {string}
 */
export function autoLinkUrls(markdown) {
  if (!markdown) return '';
  
  // Match URLs not already in markdown link syntax
  const urlRegex = /(?<!\]\()https?:\/\/[^\s\)]+/g;
  
  return markdown.replace(urlRegex, (url) => `[${url}](${url})`);
}

export default {
  extractTitle,
  extractDescription,
  extractCodeBlocks,
  extractLinks,
  extractImages,
  extractTableOfContents,
  countWords,
  estimateReadingTime,
  textToMarkdown,
  stripMarkdown,
  sanitizeMarkdown,
  addHeadingIds,
  highlightMentions,
  autoLinkUrls,
};
