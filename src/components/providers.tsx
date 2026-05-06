import type { PropsWithChildren } from 'react'
import { ThemeProvider } from '@/components/theme-provider.tsx'

export function Providers({ children }: PropsWithChildren) {
  return (
    <ThemeProvider defaultTheme='system' storageKey='theme'>
      {children}
    </ThemeProvider>
  )
}
