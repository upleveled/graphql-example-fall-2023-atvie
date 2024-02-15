import { CodegenConfig } from '@graphql-codegen/cli';
import { setEnvironmentVariables } from './util/config';

setEnvironmentVariables();

const codegenConfig: CodegenConfig = {
  overwrite: true,
  schema: `${process.env.NEXT_PUBLIC_BASE_URL}/api/graphql`,
  documents: ['app/**/*.tsx', 'app/api/graphql/route.ts'],
  generates: {
    'graphql/graphqlGeneratedTypes.ts': {
      plugins: ['typescript', 'typescript-resolvers'],
    },
  },
};

export default codegenConfig;
