import './globals.css'
import { ThemeProvider } from '@/context/ThemeContext'
import { ReactNode } from 'react'

export const metadata = {
  title: 'Developer Knowledge Base',
  description: 'A searchable knowledge base for developers',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
