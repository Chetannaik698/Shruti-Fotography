/**
 * Optimizes a Cloudinary image URL by inserting transformation parameters.
 * If the URL is not a Cloudinary URL, it returns it as-is.
 *
 * @param {string} url - The original image URL
 * @param {number|string} [width] - Optional width limit for the image
 * @returns {string} - The optimized URL
 */
export function getOptimizedCloudinaryUrl(url, width) {
  if (!url) return ''

  // Only apply to Cloudinary URLs
  if (typeof url === 'string' && url.includes('cloudinary.com')) {
    const parts = url.split('/upload/')
    if (parts.length === 2) {
      // f_auto: automatically select best format (WebP, AVIF)
      // q_auto: automatically compress quality
      // c_limit: resize image to fit within width limit without enlarging
      const transform = width ? `f_auto,q_auto,w_${width},c_limit` : 'f_auto,q_auto'
      return `${parts[0]}/upload/${transform}/${parts[1]}`
    }
  }
  return url
}
