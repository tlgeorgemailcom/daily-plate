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
 * Delete an image from Cloudinary
 * @param publicId - The public_id of the image to delete
 */
export async function deleteRecipeImage(publicId: string): Promise<void> {
  const cloud = getCloudinary();
  await cloud.uploader.destroy(publicId);
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
