'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

export default function Home() {
  const { data: session, status } = useSession();


  if (status === 'loading') {
    return <p>Carregando...</p>;
  }

  if (!session) {
    return <p>Acesso negado. Você precisa estar logado.</p>;

  }

  return redirect('/main');
}
