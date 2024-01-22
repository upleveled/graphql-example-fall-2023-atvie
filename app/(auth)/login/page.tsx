import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import React from 'react';
import { getSafeReturnToPath } from '../../../util/validation';
import LoginForm from './LoginForm';

type Props = { searchParams: { returnTo?: string | string[] } };

export default function LoginPage({ searchParams }: Props) {
  const fakeSessionToken = cookies().get('fakeSession');

  if (fakeSessionToken?.value) {
    redirect(getSafeReturnToPath(searchParams.returnTo) || '/');
  }
  return <LoginForm />;
}
