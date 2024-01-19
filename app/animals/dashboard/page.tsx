import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getUserByInsecureSessionToken } from '../../../database/users';
import AnimalForm from './AnimalForm';

export default async function DashboardPage() {
  const insecureSessionTokenCookie = cookies().get('sessionToken');

  const user =
    insecureSessionTokenCookie &&
    (await getUserByInsecureSessionToken(insecureSessionTokenCookie.value));

  if (!user) {
    redirect('/login');
  }

  return <AnimalForm />;
}
