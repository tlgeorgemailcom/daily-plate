// Cloudinary configuration and helpers - Server Side Only
import { v2 as cloudinary } from 'cloudinary';
import { env } from '$env/dynamic/private';

// Configure Cloudinary
function getCloudinary() {
  const cloudName = env.CLOUDINARY_CLOUD_NAME;
  const apiKey = env.CLOUDINARY_API_KEY;
  const apiSecret = env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error('Missing Cloudinary environment variables');
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true
  });

  return cloudinary;
}

export interface UploadResult {
  url: string;
  thumbnailUrl: string;
  publicId: string;
}

/**
 * Upload an image to Cloudinary
 * @param fileBuffer - The image file as a Buffer
 * @param filename - Original filename for generating public_id
 * @returns URLs for the uploaded image
 */
export async function uploadRecipeImage(
  fileBuffer: Buffer,
  filename: string
): Promise<UploadResult> {
  const cloud = getCloudinary();
  
  // Generate a unique public_id based on timestamp and filename
  const timestamp = Date.now();
  const sanitizedName = filename
    .replace(/\.[^/.]+$/, '') // Remove extension
    .replace(/[^a-zA-Z0-9-_]/g, '-') // Replace special chars
    .toLowerCase()
    .slice(0, 50); // Limit length
  
  const publicId = `recipes/${timestamp}-${sanitizedName}`;

  return new Promise((resolve, reject) => {
    const uploadStream = cloud.uploader.upload_stream(
      {
        public_id: publicId,
        folder: '', // Already included in public_id
        resource_type: 'image',
        transformation: [
          { quality: 'auto', fetch_format: 'auto' }
        ]
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        
        if (!result) {
          reject(new Error('No result from Cloudinary'));
          return;
        }

        // Build URLs with transformations — use cloud.url() for both so
        // q_auto/f_auto are applied and Cloudinary CDN serves the optimised variant
        const fullUrl = cloud.url(result.public_id, {
          quality: 'auto',
          fetch_format: 'auto'
        });

        // Thumbnail: 200x200 square crop
        const thumbnailUrl = cloud.url(result.public_id, {
          width: 200,
          height: 200,
          crop: 'fill',
          gravity: 'auto',
          quality: 'auto',
          fetch_format: 'auto'
        });

        resolve({
          url: fullUrl,
          thumbnailUrl,
          publicId: result.public_id
        });
      }
    );

    // Write the buffer to the upload stream
    uploadStream.end(fileBuffer);
  });
}

/**
 * Delete a recipe image from Cloudinary by its public_id.
 * Silently succeeds if the asset does not exist.
 */
export async function deleteRecipeImage(publicId: string): Promise<void> {
  const cloud = getCloudinary();
  await cloud.uploader.destroy(publicId, { resource_type: 'image' });
}

/**
 * Extract the Cloudinary public_id from a delivery URL.
 * Handles URLs with or without transformation params and version segments.
 * Returns null if the URL is not a recognised Cloudinary recipe URL.
 */
export function extractPublicId(url: string): string | null {
  // Match the public_id that starts with the 'recipes/' folder
  const match = url.match(/\/upload\/(?:[^/]+\/)*?(recipes\/[^?#]+)/);
  return match ? match[1] : null;
}

/**
 * Upload a Feather & Spag cartoon strip to Cloudinary
 * @param fileBuffer - The strip PNG as a Buffer
 * @param publishDate - 'YYYY-MM-DD' — used as the public_id and file name
 * @returns Cloudinary delivery URL and public_id
 */
export async function uploadCartoonStrip(
  fileBuffer: Buffer,
  publishDate: string  // 'YYYY-MM-DD'
): Promise<{ url: string; publicId: string }> {
  const cloud = getCloudinary();

  const [year, month] = publishDate.split('-');
  const publicId = `feather-spag/${year}/${month}/feather-spag-${publishDate}`;

  return new Promise((resolve, reject) => {
    const uploadStream = cloud.uploader.upload_stream(
      {
        public_id: publicId,
        resource_type: 'image',
        overwrite: true,
        invalidate: true,
        transformation: [{ quality: 'auto', fetch_format: 'auto' }]
      },
      (error, result) => {
        if (error) { reject(error); return; }
        if (!result) { reject(new Error('No result from Cloudinary')); return; }

        const url = cloud.url(result.public_id, {
          version: result.version,
          width: 900,
          quality: 'auto',
          fetch_format: 'auto'
        });

        resolve({ url, publicId: result.public_id });
      }
    );
    uploadStream.end(fileBuffer);
  });
}

/**
 * Delete a Feather & Spag cartoon strip from Cloudinary
 */
export async function deleteCartoonStrip(publishDate: string): Promise<void> {
  const cloud = getCloudinary();
  const [year, month] = publishDate.split('-');
  const publicId = `feather-spag/${year}/${month}/feather-spag-${publishDate}`;
  await cloud.uploader.destroy(publicId, { invalidate: true });
}

/**
 * Generate a thumbnail URL from a full image URL
 * @param url - The full Cloudinary URL
 * @param width - Thumbnail width (default 200)
 * @param height - Thumbnail height (default 200)
 */
export function getThumbnailUrl(url: string, width = 200, height = 200): string {
  // Insert transformation before /upload/ or /v{version}/
  const match = url.match(/^(https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(v\d+\/)?(.+)$/);
  if (match) {
    const [, base, version = '', path] = match;
    return `${base}w_${width},h_${height},c_fill,g_auto,q_auto,f_auto/${version}${path}`;
  }
  return url;
}
