import { ThemeProvider } from '@/components/theme/ThemeProvider'
import { AppShell } from '@/components/layout/AppShell'
import { NOTES } from '@/libs/notes'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const tree = NOTES.getNotesNavTree()
  const notes = NOTES.getAllNoteMeta()

  return (
    <ThemeProvider>
      <AppShell tree={tree} notes={notes}>
        {children}
      </AppShell>
    </ThemeProvider>
  )
}
