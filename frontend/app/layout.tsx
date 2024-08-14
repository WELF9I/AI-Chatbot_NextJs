import '@/styles/globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from "@/components/theme-provider"
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI Chatbot',
  description: 'Your personal AI assistant',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body className={inter.className}>
        
      <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
       >     
        {children}
          </ThemeProvider>
      </body>
    </html>
    </ClerkProvider>
  )
}