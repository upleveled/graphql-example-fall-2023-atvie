'use client';

import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from './notes.module.scss';

const createNoteMutation = gql`
  mutation CreateNote($title: String!, $textContent: String!) {
    createNote(title: $title, textContent: $textContent) {
      id
      title
    }
  }
`;

export default function NotesForm() {
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
              onChange={(event) => setTextContent(event.currentTarget.value)}
            />
          </label>

          <button>Add Note</button>
        </form>
        <div className="error">{onError}</div>
      </div>
    </div>
  );
}
