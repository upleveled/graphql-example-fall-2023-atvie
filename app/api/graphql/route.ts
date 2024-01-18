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
  updateAnimalById,
} from '../../../database/animals';
import {
  getUserByInsecureSessionToken,
  isUserAdminBySessionToken,
} from '../../../database/users';
import { Animal } from '../../../migrations/00000-createTableAnimals';

export type GraphQlResponseBody =
  | {
      animal: Animal;
    }
  | Error;

type FakeAdminAnimalContext = {
  isAdmin: boolean;
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

  type User {
    id: ID!
    username: String
  }

  type Query {
    animals: [Animal]
    animal(id: ID!): Animal
    loggedInUser(insecureSessionToken: String!): User
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

    login(username: String!, password: String!): User
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

    loggedInUser: async (
      parent: null,
      args: { insecureSessionToken: string },
    ) => {
      return await getUserByInsecureSessionToken(args.insecureSessionToken);
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
      context: FakeAdminAnimalContext,
    ) => {
      if (!context.isAdmin) {
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

      if (args.username !== 'victor' || args.password !== 'asdf') {
        throw new GraphQLError('Invalid username or password');
      }

      // FIXME: Generate and set a secure session token following the steps below
      // 1. Generate a token
      // 2. Store the token in the database
      // 3. Set the cookie with the response from the database (the token)

      // Currently setting a cookie with the username as the session token
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
    const insecureSessionTokenCookie = req.cookies.get('fakeSession');

    const isAdmin = await isUserAdminBySessionToken(
      insecureSessionTokenCookie?.value,
    );

    return {
      req,
      isAdmin,
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
