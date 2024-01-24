'use client';
import { gql, useMutation } from '@apollo/client';
import { useSuspenseQuery } from '@apollo/experimental-nextjs-app-support/ssr';
import { useState } from 'react';
import { Animal } from '../../../migrations/00000-createTableAnimals';
import styles from './AnimalsForm.module.scss';

const createAnimal = gql`
  mutation CreateAnimal(
    $firstName: String!
    $type: String!
    $accessory: String
  ) {
    createAnimal(firstName: $firstName, type: $type, accessory: $accessory) {
      id
      firstName
      type
      accessory
    }
  }
`;

const deleteAnimal = gql`
  mutation DeleteAnimal($id: ID!) {
    deleteAnimal(id: $id) {
      id
    }
  }
`;

const animals = gql`
  query Animals {
    animals {
      id
      firstName
      type
      accessory
    }
  }
`;

const updateAnimal = gql`
  mutation UpdateAnimal(
    $id: ID!
    $firstName: String!
    $type: String!
    $accessory: String
  ) {
    updateAnimal(
      id: $id
      firstName: $firstName
      type: $type
      accessory: $accessory
    ) {
      id
      firstName
      type
      accessory
    }
  }
`;

export default function AnimalForm() {
  const [id, setId] = useState(0);
  const [firstName, setFirstName] = useState('');
  const [type, setType] = useState('');
  const [accessory, setAccessory] = useState('');
  const [onError, setOnError] = useState('');

  function resetFormStates() {
    setId(0);
    setFirstName('');
    setType('');
    setAccessory('');
  }

  const { data, refetch } = useSuspenseQuery<{ animals: Animal[] }>(animals);

  const [createAnimalHandler] = useMutation(createAnimal, {
    variables: {
      firstName,
      type,
      accessory,
    },

    onError: (error) => {
      setOnError(error.message);
    },

    onCompleted: async () => {
      resetFormStates();
      setOnError('');
      await refetch();
    },
  });

  const [deleteAnimalHandler] = useMutation(deleteAnimal, {
    onError: (error) => {
      setOnError(error.message);
    },

    onCompleted: async () => {
      resetFormStates();
      setOnError('');
      await refetch();
    },
  });

  const [updateAnimalHandler] = useMutation(updateAnimal, {
    variables: {
      id,
      firstName,
      type,
      accessory,
    },

    onError: (error) => {
      setOnError(error.message);
    },

    onCompleted: async () => {
      resetFormStates();
      setOnError('');
      await refetch();
    },
  });

  return (
    <>
      <h1 className={styles.title}>Animal Dashboard</h1>
      <div className={styles.dashboard}>
        <div>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Accessory</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {data.animals.map((animal) => (
                <tr
                  key={`animal-${animal.id}`}
                  className={id === animal.id ? styles.selectedItem : ''}
                >
                  <td>{animal.firstName}</td>
                  <td>{animal.type}</td>
                  <td>{animal.accessory}</td>
                  <td className={styles.buttonCell}>
                    <button
                      onClick={() => {
                        setId(animal.id);
                        setFirstName(animal.firstName);
                        setType(animal.type);
                        setAccessory(animal.accessory || '');
                      }}
                      disabled={id === animal.id && true}
                    >
                      Edit
                    </button>
                    <button
                      onClick={async () => {
                        await deleteAnimalHandler({
                          variables: {
                            id: animal.id,
                          },
                        });
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className={styles.animalForm}>
          <h2>{id ? 'Edit Animal' : 'Add Animal'}</h2>
          <form
            onSubmit={(event) => {
              event.preventDefault();
            }}
          >
            <label>
              Name
              <input
                onChange={(event) => setFirstName(event.currentTarget.value)}
                value={firstName}
              />
            </label>
            <label>
              Type
              <input
                onChange={(event) => setType(event.currentTarget.value)}
                value={type}
              />
            </label>
            <label>
              Accessory
              <input
                onChange={(event) => setAccessory(event.currentTarget.value)}
                value={accessory}
              />
            </label>
            {id ? (
              <button
                onClick={async () => {
                  await updateAnimalHandler();
                }}
              >
                Save Changes
              </button>
            ) : (
              <button onClick={async () => await createAnimalHandler()}>
                Add Animal
              </button>
            )}
          </form>
          <p className="error">{onError}</p>
        </div>
      </div>
    </>
  );
}
