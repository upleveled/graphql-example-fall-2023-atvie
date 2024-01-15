import { gql } from '@apollo/client';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getClient } from '../../../util/apolloClient';
import AdminDashboard from './AdminDashboard';

export default async function AdminPage() {
  const fakeSessionToken = cookies().get('fakeSession');

  const { data } = await getClient().query({
    query: gql`
      query LoggedInUser($firstName: String!) {
        loggedInUser(firstName: $firstName) {
          firstName
        }
      }
    `,
    variables: {
      firstName: fakeSessionToken?.value || '',
    },
  });

  if (!data.loggedInUser) {
    redirect('/login');
  }

  return <AdminDashboard />;
}
