import { gql } from '@apollo/client';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getClient } from '../../../util/apolloClient';
import AnimalForm from './AnimalForm';

export default async function DashboardPage() {
  const fakeSessionToken = cookies().get('fakeSession');

  const { data } = await getClient().query({
    query: gql`
      query LoggedInUser($username: String!) {
        loggedInUser(username: $username) {
          username
        }
      }
    `,
    variables: {
      username: fakeSessionToken?.value || '',
    },
  });

  if (!data.loggedInUser) {
    redirect('/login');
  }

  return <AnimalForm />;
}
