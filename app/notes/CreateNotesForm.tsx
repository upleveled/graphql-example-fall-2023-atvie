'use client';
import { gql, useMutation } from '@apollo/client';
import { useState } from 'react';

const createNote = gql`
  mutation CreateNote($title: String!, $textContent: String!) {
    createNote(title: $title, textContent: $textContent) {
      id
      title
    }
  }
`;

export default function CreateNotesForm() {
  const [title, setTitle] = useState('');
  const [textContent, setTextContent] = useState('');
  const [onError, setOnError] = useState('');

  const [createNoteHandler] = useMutation(createNote, {
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
    },
  });

  return (
    <>
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          await createNoteHandler();
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
    </>
  );
}
