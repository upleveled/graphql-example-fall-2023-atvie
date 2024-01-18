import { cache } from 'react';
import { Users } from '../migrations/00002-createTableUsers';
import { sql } from './connect';

export const getUserByInsecureSessionToken = cache(
  async (insecureSessionToken: string) => {
    const [user] = await sql<Users[]>`
      SELECT
        *
      FROM
        users
      WHERE
        username = ${insecureSessionToken}
        -- FIXME: Implement proper token validation with INNER JOIN on sessions table
    `;
    return user;
  },
);

export async function isUserAdminBySessionToken(
  sessionToken: string | undefined,
) {
  // FIXME: Implement proper authorization
  if (sessionToken === 'macca') return await true;
  return await false;
}
