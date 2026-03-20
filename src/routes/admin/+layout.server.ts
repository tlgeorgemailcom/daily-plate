import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { env } from '$env/dynamic/private';

export const load: LayoutServerLoad = async ({ cookies, url }) => {
  // Login page must not redirect — that would be an infinite loop
  if (url.pathname === '/admin/login') return {};
  const adminPw = env.ADMIN_PASSWORD;
  if (!adminPw || cookies.get('admin_auth') !== adminPw) {
    throw redirect(302, '/admin/login');
  }
  return {};
};
