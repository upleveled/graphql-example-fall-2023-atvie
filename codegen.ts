import { CodegenConfig } from '@graphql-codegen/cli';
import { setEnvironmentVariables } from './util/config';

setEnvironmentVariables();

const codegenConfig: CodegenConfig = {
  overwrite: true,
  schema: `${process.env.NEXT_PUBLIC_BASE_URL}/api/graphql`,
  documents: ['app/**/*.tsx'],
  generates: {
    'app/graphqlGeneratedTypes.ts': {
      plugins: ['typescript', 'typescript-operations'],
    },
  },
};

export default codegenConfig;
