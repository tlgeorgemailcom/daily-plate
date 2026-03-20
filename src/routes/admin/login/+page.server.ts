import { redirect, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { env } from '$env/dynamic/private';

// If already logged in, skip the login page
export const load: PageServerLoad = async ({ cookies }) => {
  const adminPw = env.ADMIN_PASSWORD?.trim();
  if (adminPw && cookies.get('admin_auth') === adminPw) {
    throw redirect(303, '/admin/analytics');
  }
  return {};
};

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const data = await request.formData();
    const pw = String(data.get('password') ?? '').trim();
    const adminPw = env.ADMIN_PASSWORD?.trim();

    if (!adminPw || !pw || pw !== adminPw) {
      return fail(401, { error: 'Wrong password' });
    }

    cookies.set('admin_auth', adminPw, {
      path: '/admin',
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
      maxAge: 60 * 60 * 8,   // 8 hours
    });

    throw redirect(303, '/admin/analytics');
  },
};
