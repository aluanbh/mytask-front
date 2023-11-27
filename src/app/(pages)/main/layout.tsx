'use client';

import Header from '@/components/parts/header';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();

  useEffect(() => {
    if (session && session.user) {
      localStorage.setItem('user', JSON.stringify(session.user));
    }
  }, [session]);

  return (
    <html lang='en'>
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
