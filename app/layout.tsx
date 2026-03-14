import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const montserrat = Montserrat({ 
  subsets: ["latin"],
  variable: '--font-montserrat',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'AscendIQ | Mentorship & Training for the AI Economy',
  description: 'Upskill your kids. Entry-level roles are disappearing — we prepare young people with skills, startups, and career training. For parents and schools.',
  generator: 'v0.app',
  icons: {
    icon: [
      { url: '/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} font-sans antialiased text-foreground bg-background`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
