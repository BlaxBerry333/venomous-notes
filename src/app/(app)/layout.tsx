import { ThemeProvider } from '@/components/theme/ThemeProvider'
import { AppShell } from '@/components/layout/AppShell'
import { NOTES } from '@/libs/notes'
import { MINDMAPS } from '@/libs/mindmaps'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const notesTree = NOTES.getNotesNavTree()
  const mindmapsTree = MINDMAPS.getMindmapsNavTree()
  const notes = NOTES.getAllNoteMeta()

  return (
    <ThemeProvider>
      <AppShell notesTree={notesTree} mindmapsTree={mindmapsTree} notes={notes}>
        {children}
      </AppShell>
    </ThemeProvider>
  )
}
