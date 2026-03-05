import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { uploadRecipeImage } from '$lib/server/cloudinary';

// Maximum file size: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Allowed MIME types
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export const POST: RequestHandler = async ({ request }) => {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File | null;

    if (!file) {
      return json({ error: 'No image file provided' }, { status: 400 });
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return json({ 
        error: 'Invalid file type. Allowed: JPEG, PNG, WebP, GIF' 
      }, { status: 400 });
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return json({ 
        error: 'File too large. Maximum size: 5MB' 
      }, { status: 400 });
    }

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary
    const result = await uploadRecipeImage(buffer, file.name);

    return json({
      success: true,
      url: result.url,
      thumbnail_url: result.thumbnailUrl,
      public_id: result.publicId
    });

  } catch (err) {
    console.error('Image upload error:', err);
    return json({ 
      error: 'Failed to upload image' 
    }, { status: 500 });
  }
};
