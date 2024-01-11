import { gql } from '@apollo/client';
import { redirect } from 'next/navigation';
import { getClient } from '../../../util/apolloClient';
import AnimalsForm from './AnimalsForm';

export default async function Dashboard() {
  const { data } = await getClient().query({
    query: gql`
      query LoggedInAnimal {
        loggedInAnimal {
          firstName
        }
      }
    `,
  });

  if (!data.loggedInAnimal) {
    redirect('/login');
  }

  return <AnimalsForm />;
}
