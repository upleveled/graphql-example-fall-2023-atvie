import { gql } from '@apollo/client';
import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { GraphQLError } from 'graphql';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import {
  createAnimal,
  deleteAnimalById,
  getAnimalById,
  getAnimals,
  getLoggedInAnimalByToken,
  updateAnimalById,
} from '../../../database/animals';
import { getAnimalOwnerBySessionToken } from '../../../database/users';
import { Animal } from '../../../migrations/00000-createTableAnimals';

export type GraphQlResponseBody =
  | {
      animal: Animal;
    }
  | Error;

type FakeAuthenticatedAnimalOwner = {
  isAnimalOwner: boolean;
};

type AnimalInput = {
  firstName: string;
  type: string;
  accessory: string;
};

const typeDefs = gql`
  type Animal {
    id: ID!
    firstName: String!
    type: String!
    accessory: String
  }

  type Query {
    animals: [Animal]
    animal(id: ID!): Animal
    loggedInAnimal: Animal
  }

  type Mutation {
    createAnimal(firstName: String!, type: String!, accessory: String): Animal

    deleteAnimalById(id: ID!): Animal

    updateAnimalById(
      id: ID!
      firstName: String!
      type: String!
      accessory: String
    ): Animal

    login(username: String!, password: String!): Animal
  }
`;

const resolvers = {
  Query: {
    animals: async () => {
      return await getAnimals();
    },

    animal: async (parent: null, args: { id: string }) => {
      return await getAnimalById(parseInt(args.id));
    },

    loggedInAnimal: async (
      parent: null,
      args: null,
      contextValue: {
        fakeSessionToken: {
          value: string;
        };
      },
    ) => {
      return await getLoggedInAnimalByToken(
        contextValue.fakeSessionToken.value,
      );
    },
  },

  Mutation: {
    createAnimal: async (parent: null, args: AnimalInput) => {
      if (
        typeof args.firstName !== 'string' ||
        typeof args.type !== 'string' ||
        (args.accessory && typeof args.type !== 'string') ||
        !args.firstName ||
        !args.type
      ) {
        throw new GraphQLError('Required field is missing');
      }

      return await createAnimal(args.firstName, args.type, args.accessory);
    },

    deleteAnimalById: async (
      parent: null,
      args: { id: string },
      contextValue: FakeAuthenticatedAnimalOwner,
    ) => {
      if (!contextValue.isAnimalOwner) {
        throw new GraphQLError('Unauthorized operation');
      }
      return await deleteAnimalById(parseInt(args.id));
    },

    updateAnimalById: async (
      parent: null,
      args: AnimalInput & { id: string },
    ) => {
      if (
        typeof args.firstName !== 'string' ||
        typeof args.type !== 'string' ||
        (args.accessory && typeof args.type !== 'string') ||
        !args.firstName ||
        !args.type
      ) {
        throw new GraphQLError('Required field missing');
      }
      return await updateAnimalById(
        parseInt(args.id),
        args.firstName,
        args.type,
        args.accessory,
      );
    },

    login: (parent: null, args: { username: string; password: string }) => {
      //  FIXME: Implement secure authentication
      if (
        typeof args.username !== 'string' ||
        typeof args.password !== 'string' ||
        !args.username ||
        !args.password
      ) {
        throw new GraphQLError('Required field missing');
      }

      if (args.username !== 'lucia' || args.password !== 'asdf') {
        throw new GraphQLError('Invalid username or password');
      }

      cookies().set('fakeSession', args.username, {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });
    },
  },
};

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const apolloServer = new ApolloServer({
  schema,
});

const handler = startServerAndCreateNextHandler<NextRequest>(apolloServer, {
  context: async (req) => {
    // FIXME: Implement secure authentication and Authorization
    const fakeSessionToken = req.cookies.get('fakeSession');

    const isAnimalOwner = await getAnimalOwnerBySessionToken(
      fakeSessionToken?.value,
    );

    return {
      req,
      isAnimalOwner,
      fakeSessionToken,
    };
  },
});

// This setup is incomplete without type annotation
// export async function GET(req: NextRequest) {
//   return await handler(req);
// }

// export async function POST(req: NextRequest) {
//   return await handler(req);
// }

export async function GET(
  req: NextRequest,
): Promise<NextResponse<GraphQlResponseBody>> {
  return (await handler(req)) as NextResponse<GraphQlResponseBody>;
}

export async function POST(
  req: NextRequest,
): Promise<NextResponse<GraphQlResponseBody>> {
  return (await handler(req)) as NextResponse<GraphQlResponseBody>;
}
