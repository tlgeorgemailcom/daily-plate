import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { uploadCartoonStrip } from '$lib/server/cloudinary';
import { getGameDb } from '$lib/server/turso';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

// POST /api/cartoon/upload  (admin only)
// Accepts: multipart form with image, publish_date, alt_text, strip_type
export const POST: RequestHandler = async ({ request, cookies }) => {
  if (cookies.get('admin_auth') !== 'ok') {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('image') as File | null;
    const publishDate = (formData.get('publish_date') as string | null)?.trim();
    const altText = (formData.get('alt_text') as string | null)?.trim() ?? '';
    const stripType = (formData.get('strip_type') as string | null)?.trim() ?? 'weekday';

    if (!file) return json({ error: 'No image provided' }, { status: 400 });
    if (!publishDate || !/^\d{4}-\d{2}-\d{2}$/.test(publishDate)) {
      return json({ error: 'publish_date must be YYYY-MM-DD' }, { status: 400 });
    }
    if (!['weekday', 'sunday'].includes(stripType)) {
      return json({ error: 'strip_type must be weekday or sunday' }, { status: 400 });
    }
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
      return json({ error: 'Image must be PNG, JPEG, or WebP' }, { status: 400 });
    }
    if (file.size > MAX_FILE_SIZE) {
      return json({ error: 'Image exceeds 10 MB limit' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const { url, publicId } = await uploadCartoonStrip(buffer, publishDate);

    const db = getGameDb();
    await db.execute({
      sql: `INSERT INTO cartoon_strips (publish_date, image_url, alt_text, strip_type)
            VALUES (?, ?, ?, ?)
            ON CONFLICT(publish_date) DO UPDATE SET
              image_url  = excluded.image_url,
              alt_text   = excluded.alt_text,
              strip_type = excluded.strip_type`,
      args: [publishDate, url, altText, stripType]
    });

    return json({ success: true, url, publicId, publish_date: publishDate });
  } catch (err) {
    console.error('POST /api/cartoon/upload error:', err);
    return json({ error: 'Upload failed' }, { status: 500 });
  }
};
