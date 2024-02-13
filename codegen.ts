import { CodegenConfig } from '@graphql-codegen/cli';
import { setEnvironmentVariables } from './util/config';

setEnvironmentVariables();

const config: CodegenConfig = {
  overwrite: true,
  schema: `${process.env.NEXT_PUBLIC_BASE_URL}/api/graphql`,
  documents: ['app/**/*.tsx'],
  generates: {
    'app/generatedGraphqlTypes.ts': {
      plugins: ['typescript', 'typescript-operations'],
    },
    'app/': {
      preset: 'near-operation-file',
      presetConfig: {
        extension: '.generated.ts',
        baseTypesPath: 'generatedGraphqlTypes.ts',
      },
    },
  },
};

export default config;
