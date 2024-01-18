'use server';

import { cookies } from 'next/headers';

export async function logout() {
  const insecureSessionTokenCookie = cookies().get('fakeSession');

  if (!insecureSessionTokenCookie) return undefined;
  // FIXME: Delete the session from the database

  // set the cookie to be expired
  await cookies().set('fakeSession', '', { maxAge: -1 });
}
