import { cookies } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getNotesBySessionToken } from '../../database/notes';
import { getUserBySessionToken } from '../../database/users';
import styles from './notes.module.scss';
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

  return (
    <div className={styles.notePage}>
      <h1>Create Notes</h1>
      <NotesForm />
      <div>
        {notes?.length === 0 ? (
          <h2>No notes yet</h2>
        ) : (
          <>
            <h2>Notes For {user.username}</h2>
            <ul>
              {notes?.map((note) => (
                <Link key={`notes-div-${note.id}`} href={`/notes/${note.id}`}>
                  <li>{note.title}</li>
                </Link>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
