import './globals.css'
import { Inter } from 'next/font/google'
import type { Metadata } from 'next'
import { UserProvider } from "@/contexts/UserContext";

const inter = Inter({ subsets: ['latin'] })
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
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <UserProvider>
          {children}
        </UserProvider>
      </body>
    </html >
  )
}