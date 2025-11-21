import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import ClientHeader from '@/components/ClientHeader';
import { UserProvider } from '@/contexts/UserContext'; 

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AtendeAI',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <UserProvider>
          <ClientHeader />
          <main className="!pt-20 flex flex-col min-h-screen">
            {children}
          </main>
        </UserProvider>
      </body>
    </html >
  )
}