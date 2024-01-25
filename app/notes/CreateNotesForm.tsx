'use client';
import { gql, useMutation } from '@apollo/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Note } from '../../migrations/00004-createTableNotes';
import styles from './notes.module.scss';

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

export default function CreateNotesForm(props: Props) {
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
    <div className={styles.notePage}>
      <div>
        {props.notes?.length === 0 ? (
          <h2>No notes yet</h2>
        ) : (
          <>
            <h2>Notes For {props.username}</h2>
            <ul>
              {props.notes?.map((note) => (
                <Link key={`notes-div-${note.id}`} href={`/notes/${note.id}`}>
                  <li>{note.title}</li>
                </Link>
              ))}
            </ul>
          </>
        )}
      </div>
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
            onChange={(event) => setTextContent(event.currentTarget.value)}
          />
        </label>

        <button>Create +</button>
      </form>
      <p className="error">{onError}</p>
    </div>
  );
}
