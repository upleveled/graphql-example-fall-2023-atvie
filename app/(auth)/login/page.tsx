import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import React from 'react';
import LoginForm from './LoginForm';

export default function LoginPage() {
  const fakeSessionTokenCookie = cookies().get('fakeSession');

  if (fakeSessionTokenCookie?.value) {
    redirect('/animals');
  }
  return <LoginForm />;
}
