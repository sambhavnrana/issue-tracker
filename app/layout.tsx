import '@radix-ui/themes/styles.css';
import localFont from 'next/font/local';
import './globals.css';
import type { Metadata } from 'next'
import NavBar from './NavBar'
import { Theme, ThemePanel } from '@radix-ui/themes';

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
        <Theme appearance="light" accentColor="orange" radius="large">
          <NavBar />
          <main className='p-5'>
            {children}
          </main>
        </Theme>
      </body>
    </html>
  )
}
