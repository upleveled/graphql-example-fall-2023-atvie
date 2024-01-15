import { cache } from 'react';
import { Users } from '../migrations/00002-createTableUsers';
import { sql } from './connect';

export const getUserByFirstName = cache(async (firstName: string) => {
  if (!firstName) {
    return undefined;
  }

  const [user] = await sql<Users[]>`
      SELECT
        *
      FROM
        users
      WHERE
        first_name = ${firstName}
  `;
  return user;
});

export async function isUserAdminBySessionToken(
  sessionToken: string | undefined,
) {
  // FIXME: Implement proper authorization
  if (sessionToken === 'Victor') return await true;
  return await false;
}
