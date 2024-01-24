'use client';
import { gql, useMutation } from '@apollo/client';
import { useSuspenseQuery } from '@apollo/experimental-nextjs-app-support/ssr';
import { useState } from 'react';
import { Animal } from '../../../migrations/00000-createTableAnimals';

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
      setOnError('');
      await refetch();
    },
  });

  return (
    <div>
      Animal Dashboard
      <br />
      <label>
        First Name
        <input
          value={firstName}
          onChange={(event) => {
            setFirstName(event.currentTarget.value);
          }}
        />
      </label>
      <br />
      <label>
        Type
        <input
          value={type}
          onChange={(event) => {
            setType(event.currentTarget.value);
          }}
        />
      </label>
      <br />
      <label>
        Accessory
        <input
          value={accessory}
          onChange={(event) => {
            setAccessory(event.currentTarget.value);
          }}
        />
      </label>
      <br />
      <br />
      <button onClick={async () => await createAnimalHandler()}>
        Create Animal
      </button>
      <br />
      <br />
      <hr />
      <br />
      {data.animals.map((animal) => {
        const isEditing = onEditId === animal.id;
        return (
          <div key={`animal-div-${animal.id}`}>
            {isEditing ? (
              <input
                value={firstNameOnEditInput}
                onChange={(event) => {
                  setFirstNameOnEditInput(event.currentTarget.value);
                }}
              />
            ) : (
              <span>{animal.firstName}</span>
            )}
            {isEditing ? (
              <input
                value={typeOnEditInput}
                onChange={(event) => {
                  setTypeOnEditInput(event.currentTarget.value);
                }}
              />
            ) : (
              <span>{animal.type}</span>
            )}
            {isEditing ? (
              <input
                value={accessoryOnEditInput}
                onChange={(event) => {
                  setAccessoryOnEditInput(event.currentTarget.value);
                }}
              />
            ) : (
              <span>{animal.accessory}</span>
            )}
            <button
              onClick={async () => {
                await deleteAnimalHandler({
                  variables: {
                    id: animal.id,
                  },
                });
              }}
            >
              X
            </button>

            {isEditing ? (
              <button
                onClick={async () => {
                  await updateAnimalHandler();
                  setOnEditId(undefined);
                }}
              >
                Save
              </button>
            ) : (
              <button
                onClick={() => {
                  setOnEditId(animal.id);
                  setFirstNameOnEditInput(animal.firstName);
                  setAccessoryOnEditInput(animal.accessory || '');
                  setTypeOnEditInput(animal.type);
                }}
              >
                Edit
              </button>
            )}
          </div>
        );
      })}
      <p className="error">{onError}</p>
    </div>
  );
}
