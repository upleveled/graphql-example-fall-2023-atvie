import { gql } from '@apollo/client';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getClient } from '../../../util/apolloClient';
import AnimalForm from './AnimalForm';

export default async function DashboardPage() {
  const fakeSessionToken = cookies().get('fakeSession');

  const { data } = await getClient().query({
    query: gql`
      query LoggedInAnimal($firstName: String!) {
        loggedInAnimalByFirstName(firstName: $firstName) {
          firstName
        }
      }
    `,
    variables: {
      firstName: fakeSessionToken?.value || '',
    },
  });

  if (!data.loggedInAnimalByFirstName) {
    redirect('/login');
  }

  return <AnimalForm />;
}
