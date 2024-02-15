import { cache } from 'react';
import { Animal } from '../migrations/00000-createTableAnimals';
import { sql } from './connect';

export const getAnimalsInsecure = cache(async () => {
  const animals = await sql<Animal[]>`
    SELECT
      *
    FROM
      animals
  `;
  return animals;
});

export const getAnimalInsecure = cache(async (id: number) => {
  const [animal] = await sql<Animal[]>`
    SELECT
      *
    FROM
      animals
    WHERE
      id = ${id}
  `;
  return animal;
});

export const createAnimal = cache(
  async (
    insecureSessionToken: string,
    firstName: string,
    type: string,
    accessory: string,
  ) => {
    // FIXME: Remove this early return when proper session token validation is implemented (see FIXME in query below)
    if (
      insecureSessionToken !==
      'ae96c51f--fixme--insecure-hardcoded-session-token--5a3e491b4f'
    ) {
      return undefined;
    }

    const [animal] = await sql<Animal[]>`
      INSERT INTO
        animals (first_name, type, accessory)
        -- FIXME: Implement proper session token validation with INNER JOIN on sessions table
      VALUES
        (
          ${firstName},
          ${type},
          ${accessory}
        )
      RETURNING
        animals.*
    `;

    return animal;
  },
);

export const updateAnimal = cache(
  async (
    // FIXME: Rename insecureSessionToken to sessionToken everywhere
    insecureSessionToken: string,
    id: number,
    firstName: string,
    type: string,
    accessory: string,
  ) => {
    // FIXME: Remove this early return when proper session token validation is implemented (see FIXME in query below)
    if (
      insecureSessionToken !==
      'ae96c51f--fixme--insecure-hardcoded-session-token--5a3e491b4f'
    ) {
      return undefined;
    }

    const [animal] = await sql<Animal[]>`
      UPDATE animals
      SET
        first_name = ${firstName},
        type = ${type},
        accessory = ${accessory}
        -- FIXME: Implement proper session token validation with INNER JOIN on sessions table
      WHERE
        id = ${id}
      RETURNING
        animals.*
    `;

    return animal;
  },
);

export const deleteAnimal = cache(
  // FIXME: Rename insecureSessionToken to sessionToken everywhere
  async (insecureSessionToken: string, animalId: number) => {
    // FIXME: Remove this early return when proper session token validation is implemented (see FIXME in query below)
    if (
      insecureSessionToken !==
      'ae96c51f--fixme--insecure-hardcoded-session-token--5a3e491b4f'
    ) {
      return undefined;
    }

    const [animal] = await sql<Animal[]>`
      DELETE FROM animals
      -- FIXME: Implement proper session token validation with INNER JOIN on sessions table
      WHERE
        id = ${animalId}
      RETURNING
        animals.*
    `;
    return animal;
  },
);
