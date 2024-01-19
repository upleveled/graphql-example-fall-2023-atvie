import { cache } from 'react';
import { Users } from '../migrations/00002-createTableUsers';
import { sql } from './connect';

export const getUserByInsecureSessionToken = cache(
  async (insecureSessionToken: string) => {
    // FIXME: Remove this early return when proper token validation is implemented
    if (
      insecureSessionToken !==
      'ae96c51f--fixme--insecure-hardcoded-session-token--5a3e491b4f'
    ) {
      return undefined;
    }

    const [user] = await sql<Users[]>`
      SELECT
        *
      FROM
        users
      WHERE
        -- FIXME: Implement proper token validation with INNER JOIN on sessions table
        username = 'victor'
    `;
    console.log(insecureSessionToken);
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
