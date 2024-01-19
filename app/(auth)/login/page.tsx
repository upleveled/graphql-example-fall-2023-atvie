import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import React from 'react';
import LoginForm from './LoginForm';

export default function LoginPage() {
  // FIXME: Create secure session token and rename insecureSessionTokenCookie to sessionToken everywhere
  const insecureSessionTokenCookie = cookies().get('sessionToken');

  if (insecureSessionTokenCookie?.value) {
    redirect('/animals');
  }
  return <LoginForm />;
}
