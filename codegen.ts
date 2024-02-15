import { CodegenConfig } from '@graphql-codegen/cli';
import { setEnvironmentVariables } from './util/config';

setEnvironmentVariables();

const codegenConfig: CodegenConfig = {
  overwrite: true,
  schema: './app/api/graphql/route.ts',
  documents: ['./app/**/*.tsx', './app/api/graphql/route.ts'],
  generates: {
    './graphql/graphqlGeneratedTypes.ts': {
      plugins: ['typescript', 'typescript-resolvers'],
    },
  },
};

export default codegenConfig;
