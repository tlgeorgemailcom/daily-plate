import { redirect, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

const ADMIN_PASSWORD = '4444';
const AUTH_TOKEN = 'ok';

// If already logged in, skip the login page
export const load: PageServerLoad = async ({ cookies }) => {
  if (cookies.get('admin_auth') === AUTH_TOKEN) {
    throw redirect(303, '/admin/analytics');
  }
  return {};
};

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const data = await request.formData();
    const pw = String(data.get('password') ?? '').trim();

    if (pw !== ADMIN_PASSWORD) {
      return fail(401, { error: 'Wrong password' });
    }

    cookies.set('admin_auth', AUTH_TOKEN, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      maxAge: 60 * 60 * 8,
    });

    return { success: true };
  },
};
