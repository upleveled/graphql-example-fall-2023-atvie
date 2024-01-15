import { Sql } from 'postgres';

const users = [
  { id: 1, firstName: 'Victor', age: 17 },
  { id: 2, firstName: 'Lukas', age: 13 },
];

export async function up(sql: Sql) {
  for (const user of users) {
    await sql`
      INSERT INTO users
        (first_name, age)
      VALUES
        (${user.firstName}, ${user.age})
  `;
  }
}

export async function down(sql: Sql) {
  for (const user of users) {
    await sql`
      DELETE FROM users WHERE id = ${user.id}
    `;
  }
}
