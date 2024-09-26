import '@radix-ui/themes/styles.css';
import localFont from 'next/font/local';
import './globals.css';
import type { Metadata } from 'next'
import NavBar from './NavBar'
import { Container, Theme } from '@radix-ui/themes';
import AuthProvider from './auth/Provider';
import QueryClientProvider from './QueryClientProvider';
import Footer from './Footer';
import AppShell from './components/AppShell';
import { Toaster } from 'react-hot-toast';

const poppins = localFont({
  src: '../public/fonts/poppins-regular-webfont.woff2',
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'TrackBuddy - Issue Tracker',
  description: 'TrackBuddy is an advanced issue tracker for all of your requirements',
  keywords: ['issue tracker', 'bug tracker', 'project management'],
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" >
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body className={poppins.variable}>
        <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
        <QueryClientProvider>
          <AuthProvider>
            <Theme appearance="light" accentColor="pink" radius="large">
              <div className="flex flex-col min-h-screen">
                <div className="pt-4 sm:pt-6 md:pt-8 pb-8 sm:pb-10 md:pb-12">
                  <NavBar />
                </div>
                <main className="flex-1 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
                  <AppShell>{children}</AppShell>
                </main>
                <Footer />
              </div>
            </Theme>
          </AuthProvider>
        </QueryClientProvider>
      </body>
    </html>
  )
}