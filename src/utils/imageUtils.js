/**
 * 〄𝙲𝙾𝙳𝙴-Ꮿɪᴛʜ-ᎮᏒᎪTᎥᏦ〄 Image Utilities
 * 
 * Image compression, optimization, and manipulation.
 */

/**
 * Default compression options
 */
const DEFAULT_OPTIONS = {
  maxWidth: 1920,
  maxHeight: 1080,
  quality: 0.8,
  type: 'image/jpeg',
};

/**
 * Load image from file
 * @param {File} file - Image file
 * @returns {Promise<HTMLImageElement>}
 */
const loadImage = (file) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Calculate new dimensions while maintaining aspect ratio
 * @param {number} width - Original width
 * @param {number} height - Original height
 * @param {number} maxWidth - Maximum width
 * @param {number} maxHeight - Maximum height
 * @returns {Object} New dimensions
 */
const calculateDimensions = (width, height, maxWidth, maxHeight) => {
  let newWidth = width;
  let newHeight = height;
  
  // Scale down if needed
  if (width > maxWidth) {
    newWidth = maxWidth;
    newHeight = (height * maxWidth) / width;
  }
  
  if (newHeight > maxHeight) {
    newHeight = maxHeight;
    newWidth = (width * maxHeight) / height;
  }
  
  return {
    width: Math.round(newWidth),
    height: Math.round(newHeight),
  };
};

/**
 * Compress image file
 * @param {File} file - Image file to compress
 * @param {Object} options - Compression options
 * @returns {Promise<File>} Compressed file
 */
export async function compressImage(file, options = {}) {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  
  // Skip compression for small files
  if (file.size < 100 * 1024) { // Less than 100KB
    return file;
  }
  
  // Skip compression for non-image files
  if (!file.type.startsWith('image/')) {
    return file;
  }
  
  try {
    const img = await loadImage(file);
    
    // Calculate new dimensions
    const { width, height } = calculateDimensions(
      img.width,
      img.height,
      opts.maxWidth,
      opts.maxHeight
    );
    
    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    
    // Draw image
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, width, height);
    
    // Convert to blob
    const blob = await new Promise((resolve) => {
      canvas.toBlob(resolve, opts.type, opts.quality);
    });
    
    // Clean up
    URL.revokeObjectURL(img.src);
    
    // Create new file
    const fileName = file.name.replace(/\.[^.]+$/, getExtension(opts.type));
    return new File([blob], fileName, { type: opts.type });
  } catch (error) {
    console.error('Image compression error:', error);
    return file; // Return original on error
  }
}

/**
 * Get file extension for MIME type
 * @param {string} mimeType - MIME type
 * @returns {string}
 */
const getExtension = (mimeType) => {
  const extensions = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
    'image/gif': '.gif',
  };
  return extensions[mimeType] || '.jpg';
};

/**
 * Convert image to base64
 * @param {File} file - Image file
 * @returns {Promise<string>}
 */
export function imageToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Convert base64 to blob
 * @param {string} base64 - Base64 string
 * @param {string} mimeType - MIME type
 * @returns {Blob}
 */
export function base64ToBlob(base64, mimeType = 'image/jpeg') {
  const byteString = atob(base64.split(',')[1]);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  
  return new Blob([ab], { type: mimeType });
}

/**
 * Get image dimensions from file
 * @param {File} file - Image file
 * @returns {Promise<{width: number, height: number}>}
 */
export async function getImageDimensions(file) {
  const img = await loadImage(file);
  URL.revokeObjectURL(img.src);
  return { width: img.width, height: img.height };
}

/**
 * Check if image meets minimum dimensions
 * @param {File} file - Image file
 * @param {number} minWidth - Minimum width
 * @param {number} minHeight - Minimum height
 * @returns {Promise<boolean>}
 */
export async function meetsMinDimensions(file, minWidth, minHeight) {
  const { width, height } = await getImageDimensions(file);
  return width >= minWidth && height >= minHeight;
}

/**
 * Create thumbnail from image
 * @param {File} file - Image file
 * @param {number} size - Thumbnail size (square)
 * @returns {Promise<Blob>}
 */
export async function createThumbnail(file, size = 200) {
  const img = await loadImage(file);
  
  // Calculate crop dimensions (center crop for square)
  const minDim = Math.min(img.width, img.height);
  const sx = (img.width - minDim) / 2;
  const sy = (img.height - minDim) / 2;
  
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, size, size);
  
  URL.revokeObjectURL(img.src);
  
  return new Promise((resolve) => {
    canvas.toBlob(resolve, 'image/jpeg', 0.85);
  });
}

/**
 * Crop image to aspect ratio
 * @param {File} file - Image file
 * @param {number} aspectWidth - Aspect ratio width
 * @param {number} aspectHeight - Aspect ratio height
 * @returns {Promise<Blob>}
 */
export async function cropToAspectRatio(file, aspectWidth = 16, aspectHeight = 9) {
  const img = await loadImage(file);
  
  const targetRatio = aspectWidth / aspectHeight;
  const imgRatio = img.width / img.height;
  
  let sw, sh, sx, sy;
  
  if (imgRatio > targetRatio) {
    // Image is wider than target ratio
    sh = img.height;
    sw = sh * targetRatio;
    sx = (img.width - sw) / 2;
    sy = 0;
  } else {
    // Image is taller than target ratio
    sw = img.width;
    sh = sw / targetRatio;
    sx = 0;
    sy = (img.height - sh) / 2;
  }
  
  const canvas = document.createElement('canvas');
  canvas.width = sw;
  canvas.height = sh;
  
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
  
  URL.revokeObjectURL(img.src);
  
  return new Promise((resolve) => {
    canvas.toBlob(resolve, 'image/jpeg', 0.9);
  });
}

/**
 * Generate image placeholder (blur hash style solid color)
 * @param {number} width - Width
 * @param {number} height - Height
 * @param {string} color - Background color
 * @returns {string} Data URL
 */
export function generatePlaceholder(width = 100, height = 100, color = '#1e293b') {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);
  
  return canvas.toDataURL('image/png');
}

/**
 * Preload image
 * @param {string} src - Image source URL
 * @returns {Promise<HTMLImageElement>}
 */
export function preloadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Preload multiple images
 * @param {Array<string>} sources - Array of image URLs
 * @returns {Promise<Array<HTMLImageElement>>}
 */
export function preloadImages(sources) {
  return Promise.all(sources.map(preloadImage));
}

/**
 * Get dominant color from image (simplified)
 * @param {File|string} source - Image file or URL
 * @returns {Promise<string>} Hex color
 */
export async function getDominantColor(source) {
  const img = typeof source === 'string'
    ? await preloadImage(source)
    : await loadImage(source);
  
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, 1, 1);
  
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
  
  if (typeof source !== 'string') {
    URL.revokeObjectURL(img.src);
  }
  
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

export default {
  compressImage,
  imageToBase64,
  base64ToBlob,
  getImageDimensions,
  meetsMinDimensions,
  createThumbnail,
  cropToAspectRatio,
  generatePlaceholder,
  preloadImage,
  preloadImages,
  getDominantColor,
};
