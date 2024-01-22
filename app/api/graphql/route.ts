import { gql } from '@apollo/client';
import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { GraphQLError } from 'graphql';
import { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import {
  createAnimal,
  deleteAnimalBySessionToken,
  getAnimalById,
  getAnimals,
  updateAnimalBySessionToken,
} from '../../../database/animals';
import { Animal } from '../../../migrations/00000-createTableAnimals';

export type GraphQlResponseBody =
  | {
      animal: Animal;
    }
  | Error;

type GraphQLContext = {
  // FIXME: Rename insecureSessionTokenCookie type to sessionToken everywhere
  insecureSessionTokenCookie: RequestCookie | undefined;
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
  }

  type Mutation {
    createAnimal(firstName: String!, type: String!, accessory: String): Animal

    deleteAnimal(id: ID!): Animal

    updateAnimal(
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
      return await getAnimalById(Number(args.id));
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

    deleteAnimal: async (
      parent: null,
      args: { id: string },
      context: GraphQLContext,
    ) => {
      if (!context.insecureSessionTokenCookie) {
        throw new GraphQLError('Unauthorized operation');
      }
      return await deleteAnimalBySessionToken(
        context.insecureSessionTokenCookie.value,
        Number(args.id),
      );
    },

    updateAnimal: async (
      parent: null,
      args: AnimalInput & { id: string },
      context: GraphQLContext,
    ) => {
      if (!context.insecureSessionTokenCookie) {
        throw new GraphQLError('Unauthorized operation');
      }

      if (
        typeof args.firstName !== 'string' ||
        typeof args.type !== 'string' ||
        (args.accessory && typeof args.type !== 'string') ||
        !args.firstName ||
        !args.type
      ) {
        throw new GraphQLError('Required field missing');
      }
      return await updateAnimalBySessionToken(
        context.insecureSessionTokenCookie.value,
        Number(args.id),
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

      // FIXME: Create a secure session token cookie:
      // 1. Generate a token
      // 2. Store the token in the database
      // 3. Set a cookie with the token value
      cookies().set(
        'sessionToken',
        'ae96c51f--fixme--insecure-hardcoded-session-token--5a3e491b4f',
        {
          httpOnly: true,
          sameSite: 'lax',
          path: '/',
          maxAge: 60 * 60 * 24 * 30, // 30 days
        },
      );
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
    // FIXME: Create secure session token and rename insecureSessionTokenCookie to sessionToken everywhere
    const insecureSessionTokenCookie = await req.cookies.get('sessionToken');

    return {
      insecureSessionTokenCookie,
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
