import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../styles/globals.css';
import { getServerSession } from 'next-auth';
import SessionProvider from '@/utils/SessionProvider';


const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'My Task',
  description: 'App for managing tasks',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession()
  return (
    <html lang="en">
      <SessionProvider session={session}>
        <body className={inter.className}>{children}</body>
      </SessionProvider>
    </html>
  )
}
