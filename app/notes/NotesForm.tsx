'use client';

import { gql, useMutation } from '@apollo/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Note } from '../../migrations/00004-createTableNotes';
import styles from './notesForm.module.scss';

type Props = {
  notes: Note[] | undefined;
  username: string;
};

const createNoteMutation = gql`
  mutation CreateNote($title: String!, $textContent: String!) {
    createNote(title: $title, textContent: $textContent) {
      id
      title
    }
  }
`;

export default function NotesForm(props: Props) {
  const [title, setTitle] = useState('');
  const [textContent, setTextContent] = useState('');
  const [onError, setOnError] = useState('');

  const router = useRouter();

  const [createNote] = useMutation(createNoteMutation, {
    variables: {
      title,
      textContent,
    },

    onError: (error) => {
      setOnError(error.message);
    },

    onCompleted: () => {
      setTitle('');
      setTextContent('');
      setOnError('');
      router.refresh();
    },
  });

  return (
    <>
      <h1>Notes</h1>
      <div className={styles.notePage}>
        <div>
          {props.notes?.length === 0 ? (
            <h2>No notes yet</h2>
          ) : (
            <>
              <h2>Notes For {props.username}</h2>
              <ul>
                {props.notes?.map((note) => (
                  <li key={`note-${note.id}`}>
                    <Link href={`/notes/${note.id}`}>{note.title}</Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        <div className={styles.noteForm}>
          <div>
            <h2>Create Note</h2>
            <form
              onSubmit={async (event) => {
                event.preventDefault();
                await createNote();
              }}
            >
              <label>
                Title:
                <input
                  value={title}
                  onChange={(event) => setTitle(event.currentTarget.value)}
                />
              </label>

              <label>
                Note:
                <input
                  value={textContent}
                  onChange={(event) =>
                    setTextContent(event.currentTarget.value)
                  }
                />
              </label>

              <button>Add Note</button>
            </form>
            <div className="error">{onError}</div>
          </div>
        </div>
      </div>
    </>
  );
}
