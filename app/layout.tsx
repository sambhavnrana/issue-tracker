import '@radix-ui/themes/styles.css';
import localFont from 'next/font/local';
import './globals.css';
import type { Metadata } from 'next'
import NavBar from './NavBar'
import { Container, Theme } from '@radix-ui/themes';
import AuthProvider from './auth/Provider';
import QueryClientProvider from './QueryClientProvider';
import Footer from './Footer';

const poppins = localFont({
  src: '../public/fonts/poppins-regular-webfont.woff2',
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'TrackBuddy - Issue Tracker',
  description: 'TrackBuddy is an advanced issue tracker for all of your requirements',
  keywords: ['issue tracker', 'bug tracker', 'project management'],

}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" >
      <body className={poppins.variable}>
        <QueryClientProvider>
          <AuthProvider>
            <Theme appearance="light" accentColor="pink" radius="large">
              <div className="pt-8 md:pt-24">
                <NavBar />
              </div>
              <main className='p-5'>
                <Container>
                  {children}
                  <Footer />
                </Container>
              </main>
            </Theme>
          </AuthProvider>
        </QueryClientProvider>
      </body>
    </html>
  )
}
