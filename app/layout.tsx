import type { Metadata } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter'
})

const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"],
  variable: '--font-display'
})

export const metadata: Metadata = {
  title: 'Point 63 | Premium Multimedia Production',
  description: 'Point 63 is a Manila-based multimedia production studio specializing in video production, 3D/CGI, motion graphics, and post-production. Bring your vision to life with our expert team.',
  keywords: ['video production', '3D graphics', 'CGI', 'motion graphics', 'post-production', 'Manila', 'Philippines', 'multimedia'],
  authors: [{ name: 'Point 63' }],
  openGraph: {
    title: 'Point 63 | Premium Multimedia Production',
    description: 'Manila-based multimedia production studio specializing in video production, 3D/CGI, motion graphics, and post-production.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} bg-background`} data-scroll-behavior="smooth">
      <body className="font-sans antialiased">
        {children}
        <Toaster position="top-right" richColors />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
