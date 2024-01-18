import { gql } from '@apollo/client';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getClient } from '../../../util/apolloClient';
import AnimalForm from './AnimalForm';

export default async function DashboardPage() {
  const insecureSessionTokenCookie = cookies().get('fakeSession');

  const { data } = await getClient().query({
    query: gql`
      query LoggedInUser($insecureSessionToken: String!) {
        loggedInUser(insecureSessionToken: $insecureSessionToken) {
          username
        }
      }
    `,
    variables: {
      insecureSessionToken: insecureSessionTokenCookie?.value || '',
    },
  });

  if (!data.loggedInUser) {
    redirect('/login');
  }

  return <AnimalForm />;
}
