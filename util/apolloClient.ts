import { setContext } from '@apollo/client/link/context';
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { registerApolloClient } from '@apollo/experimental-nextjs-app-support/rsc';
import { cookies, headers } from 'next/headers';

const applicationContext = setContext(() => {
  return {
    headers: {
      cookie: `fakeSession=${cookies().get('fakeSession')?.value}`,
    },
  };
});

export const { getClient } = registerApolloClient(() => {
  const link = new HttpLink({
    uri: 'http://localhost:3000/api/graphql',
    credentials: 'same-origin',
  });

  headers();
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: applicationContext.concat(link),
  });
});
