import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import React from 'react';
import LoginForm from './LoginForm';

export default function LoginPage() {
  const insecureSessionTokenCookie = cookies().get('fakeSession');

  if (insecureSessionTokenCookie?.value) {
    redirect('/animals');
  }
  return <LoginForm />;
}
