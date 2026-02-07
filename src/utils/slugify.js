/**
 * 〄𝙲𝙾𝙳𝙴-Ꮿɪᴛʜ-ᎮᏒᎪTᎥᏦ〄 Slugify Utility
 * 
 * URL-friendly slug generator.
 */

/**
 * Character replacement map for special characters
 */
const charMap = {
  // Latin
  'À': 'A', 'Á': 'A', 'Â': 'A', 'Ã': 'A', 'Ä': 'A', 'Å': 'A', 'Æ': 'AE',
  'Ç': 'C', 'È': 'E', 'É': 'E', 'Ê': 'E', 'Ë': 'E', 'Ì': 'I', 'Í': 'I',
  'Î': 'I', 'Ï': 'I', 'Ð': 'D', 'Ñ': 'N', 'Ò': 'O', 'Ó': 'O', 'Ô': 'O',
  'Õ': 'O', 'Ö': 'O', 'Ő': 'O', 'Ø': 'O', 'Ù': 'U', 'Ú': 'U', 'Û': 'U',
  'Ü': 'U', 'Ű': 'U', 'Ý': 'Y', 'Þ': 'TH', 'ß': 'ss',
  'à': 'a', 'á': 'a', 'â': 'a', 'ã': 'a', 'ä': 'a', 'å': 'a', 'æ': 'ae',
  'ç': 'c', 'è': 'e', 'é': 'e', 'ê': 'e', 'ë': 'e', 'ì': 'i', 'í': 'i',
  'î': 'i', 'ï': 'i', 'ð': 'd', 'ñ': 'n', 'ò': 'o', 'ó': 'o', 'ô': 'o',
  'õ': 'o', 'ö': 'o', 'ő': 'o', 'ø': 'o', 'ù': 'u', 'ú': 'u', 'û': 'u',
  'ü': 'u', 'ű': 'u', 'ý': 'y', 'þ': 'th', 'ÿ': 'y',
  
  // Symbols
  '©': 'c', '®': 'r', '™': 'tm', '&': 'and', '@': 'at',
  
  // Currency
  '€': 'euro', '£': 'pound', '¥': 'yen', '$': 'dollar',
  
  // Programming symbols (keep readable)
  '+': 'plus', '#': 'sharp', '.': '-',
};

/**
 * Convert string to URL-friendly slug
 * @param {string} str - String to slugify
 * @param {Object} options - Options
 * @returns {string} Slugified string
 */
export function slugify(str, options = {}) {
  const {
    lowercase = true,
    separator = '-',
    maxLength = 150,
    strict = false,
    trim = true,
  } = options;
  
  if (!str || typeof str !== 'string') {
    return '';
  }
  
  let slug = str;
  
  // Replace special characters
  slug = slug.split('').map(char => charMap[char] || char).join('');
  
  // Convert to lowercase if option is set
  if (lowercase) {
    slug = slug.toLowerCase();
  }
  
  // Remove accents/diacritics
  slug = slug.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  
  // Replace spaces and non-alphanumeric characters with separator
  if (strict) {
    // Strict mode: only allow alphanumeric
    slug = slug.replace(/[^a-zA-Z0-9]+/g, separator);
  } else {
    // Normal mode: allow some special characters
    slug = slug.replace(/[^\w\s-]+/g, '');
    slug = slug.replace(/[\s_]+/g, separator);
  }
  
  // Remove consecutive separators
  const separatorRegex = new RegExp(`${separator}{2,}`, 'g');
  slug = slug.replace(separatorRegex, separator);
  
  // Trim separators from start and end
  if (trim) {
    const trimRegex = new RegExp(`^${separator}+|${separator}+$`, 'g');
    slug = slug.replace(trimRegex, '');
  }
  
  // Truncate to max length
  if (maxLength && slug.length > maxLength) {
    slug = slug.slice(0, maxLength);
    // Don't end with a separator
    slug = slug.replace(new RegExp(`${separator}+$`), '');
  }
  
  return slug;
}

/**
 * Generate unique slug with random suffix
 * @param {string} str - String to slugify
 * @param {number} suffixLength - Length of random suffix
 * @returns {string} Unique slug
 */
export function uniqueSlug(str, suffixLength = 6) {
  const baseSlug = slugify(str);
  const randomSuffix = Math.random()
    .toString(36)
    .substring(2, 2 + suffixLength);
  
  return `${baseSlug}-${randomSuffix}`;
}

/**
 * Generate slug from title with timestamp
 * @param {string} title - Title to slugify
 * @returns {string} Slug with timestamp
 */
export function timestampSlug(title) {
  const baseSlug = slugify(title);
  const timestamp = Date.now().toString(36);
  
  return `${baseSlug}-${timestamp}`;
}

/**
 * Check if string is a valid slug
 * @param {string} str - String to check
 * @returns {boolean}
 */
export function isValidSlug(str) {
  if (!str || typeof str !== 'string') return false;
  
  // Valid slug: lowercase alphanumeric with hyphens, no consecutive hyphens
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(str);
}

/**
 * Convert slug back to readable title
 * @param {string} slug - Slug to convert
 * @returns {string} Readable title
 */
export function unslugify(slug) {
  if (!slug || typeof slug !== 'string') return '';
  
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Create SEO-friendly slug for projects
 * @param {string} title - Project title
 * @param {Object} options - Additional options
 * @returns {string} SEO-friendly slug
 */
export function createProjectSlug(title, options = {}) {
  const { maxLength = 80 } = options;
  
  // Remove common stop words for cleaner slugs
  const stopWords = ['a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
  
  let cleanTitle = title.toLowerCase();
  
  // Remove stop words (but keep if it makes the slug too short)
  const words = cleanTitle.split(/\s+/);
  if (words.length > 3) {
    cleanTitle = words
      .filter(word => !stopWords.includes(word))
      .join(' ');
  }
  
  return slugify(cleanTitle, { maxLength, strict: true });
}

export default slugify;
