import { gql } from '@apollo/client';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getClient } from '../../../util/apolloClient';
import AnimalForm from './AnimalForm';

export default async function DashboardPage() {
  const fakeSessionTokenCookie = cookies().get('fakeSession');

  const { data } = await getClient().query({
    query: gql`
      query LoggedInUser($fakeSessionToken: String!) {
        loggedInUser(fakeSessionToken: $fakeSessionToken) {
          username
        }
      }
    `,
    variables: {
      fakeSessionToken: fakeSessionTokenCookie?.value || '',
    },
  });

  if (!data.loggedInUser) {
    redirect('/login');
  }

  return <AnimalForm />;
}
