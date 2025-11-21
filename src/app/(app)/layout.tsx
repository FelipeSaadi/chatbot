import ClientHeader from '@/components/ClientHeader';

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <ClientHeader />
      <main className="!pt-20 flex flex-col min-h-screen">
        {children}
      </main>
    </>
  )
}