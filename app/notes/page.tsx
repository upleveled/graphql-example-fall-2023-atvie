import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getNotesBySessionToken } from '../../database/notes';
import { getUserBySessionToken } from '../../database/users';
import NotesForm from './NotesForm';

export default async function NotesPage() {
  // Task: Restrict access to the notes page and only display notes belonging to the current logged in user

  // 1. Checking if the sessionToken cookie exists
  const sessionTokenCookie = cookies().get('sessionToken');

  // 2. Query user with the sessionToken
  const user =
    sessionTokenCookie &&
    (await getUserBySessionToken(sessionTokenCookie.value));

  if (!user) redirect('/login?returnTo=/notes');

  // 3. Display the notes for the current logged in user
  const notes = await getNotesBySessionToken(sessionTokenCookie.value);

  return <NotesForm notes={notes} username={user.username} />;
}
