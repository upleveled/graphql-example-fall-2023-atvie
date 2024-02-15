import { CodegenConfig } from '@graphql-codegen/cli';
import { config } from 'dotenv-safe';

config();

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
