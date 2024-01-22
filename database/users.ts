import { cache } from 'react';
import { User } from '../migrations/00002-createTableUsers';
import { sql } from './connect';

export const getUserBySessionToken = cache(
  async (insecureSessionToken: string) => {
    // FIXME: Remove this early return when proper token validation is implemented (see FIXME in query below)
    if (
      insecureSessionToken !==
      'ae96c51f--fixme--insecure-hardcoded-session-token--5a3e491b4f'
    ) {
      return undefined;
    }

    const [user] = await sql<User[]>`
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
