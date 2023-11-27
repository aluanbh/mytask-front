'use client';

import { TableMain } from '@/components/parts/table';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

const Main = () => {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <p>Carregando...</p>;
  }

  if (!session) {
    redirect('/auth');
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <main className='flex min-h-screen md:mt-0 mt-24 items-start justify-center p-2  md:p-24 md:px-6 '>
        <TableMain />
      </main>
    </LocalizationProvider>
  );
};

export default Main;
