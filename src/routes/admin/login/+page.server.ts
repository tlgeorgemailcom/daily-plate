import { redirect, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { env } from '$env/dynamic/private';

const AUTH_TOKEN = 'ok';

// If already logged in, skip the login page
export const load: PageServerLoad = async ({ cookies }) => {
  if (cookies.get('admin_auth') === AUTH_TOKEN) {
    throw redirect(303, '/admin/analytics');
  }
  return { hasPw: !!env.ADMIN_PASSWORD?.trim() };
};

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const data = await request.formData();
    const pw = String(data.get('password') ?? '').trim();
    const adminPw = env.ADMIN_PASSWORD?.trim();

    if (!adminPw || !pw || pw !== adminPw) {
      return fail(401, { error: 'Wrong password' });
    }

    cookies.set('admin_auth', AUTH_TOKEN, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      maxAge: 60 * 60 * 8,   // 8 hours
    });

    return { success: true };
  },
};
