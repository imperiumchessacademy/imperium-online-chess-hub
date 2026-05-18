import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Sidebar } from '@/components/sidebar'
import { SidebarProvider } from '@/components/sidebar-context'
import { MainContent } from '@/components/main-content'
import { ThemeProvider } from '@/components/theme-provider'
import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackClientApp } from "../stack-client";
import './globals.css'

const geistSans = Geist({ subsets: ["latin"], variable: '--font-geist-sans' });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: '--font-geist-mono' });

export const metadata: Metadata = {
  title: { default: 'Imperium Online Chess Hub', template: '%s | Imperium Online Chess Hub' },
  description: 'Track live league standings, tournament outcomes, and player performance.',
}

export const viewport: Viewport = { themeColor: '#c68a2e' }

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className="bg-background">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased min-h-screen`}>
        <StackProvider app={stackClientApp}>
          <StackTheme>
            <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
              <SidebarProvider>
                <div className="flex min-h-screen">
                  <Sidebar />
                  <MainContent>
                    {children}
                    {process.env.NODE_ENV === 'production' && <Analytics />}
                  </MainContent>
                </div>
              </SidebarProvider>
            </ThemeProvider>
          </StackTheme>
        </StackProvider>
      </body>
    </html>
  )
}
