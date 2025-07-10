import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "@fortawesome/fontawesome-free/css/all.min.css"
import "./globals.css"
import LayoutClientSide from './layout-client'
import { ThemeProvider } from '@/components/theme-provider'
const inter = Inter({ subsets: ["latin"] })
import { RedirectType, redirect } from 'next/navigation'
import { Suspense } from 'react'
import { Toaster } from "@/components/ui/toaster"

export const viewport: Viewport = {
  themeColor: [{ media: '(prefers-color-scheme: dark)', color: '#fff' }],
  initialScale: 1,
  width: 'device-width',
  minimumScale: 1,
  maximumScale: 1,
  viewportFit: 'contain',
  userScalable: false,
  interactiveWidget: 'overlays-content'
}
export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_TITLE || 'ENV ERROR',
  description: process.env.NEXT_PUBLIC_APP_DESCRIPTION || 'ENV ERROR',
  // icons: '/img/icon512.png',
  // manifest: '/manifest.json'
}

const RootLayout = ({ children }: { children: React.ReactNode }) => {


  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* <link rel="icon" href={`/img/icon.svg`} type="image/svg+xml" /> */}
        <link rel="icon" href={`/img/icon.png`} type="image/png" />
        <link rel="manifest" href={`/manifest.json`} />
      </head>
      <body className={inter.className} suppressHydrationWarning >
        <LayoutClientSide />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange

        >
          <Suspense >
            {children}

            <Toaster />
          </Suspense>
        </ThemeProvider>

      </body>
    </html>
  )
}

export default RootLayout