import { useAtom, useSetAtom } from 'jotai'
import { ScanEyeIcon, TableIcon } from 'lucide-react'
import { toast } from 'sonner'

import { queryAnswerArrowAtom, queryTextAtom } from '@/atoms/query'
import { isLoadingAtom, treeAtom } from '@/atoms/state'
import { conn } from '@/lib/duck'

export function useExecuteQuery() {
  const setIsLoading = useSetAtom(isLoadingAtom)
  const setQueryAnswerArrow = useSetAtom(queryAnswerArrowAtom)
  const [queryText, setQueryText] = useAtom(queryTextAtom)
  const setTables = useSetAtom(treeAtom)

  function updateTree() {
    conn
      .query(
        `select table_schema as "schema", table_name as "name", table_type as "type" from information_schema.tables`,
      )
      .then(r => {
        const a = r.toArray().map(e => e.toJSON())
        const tables = a.map(e => ({ name: e.name, schema: e.schema, type: e.type }))

        setTables(s => {
          s.find(e => e.id === 'memory')!.children = tables.map(t => ({
            id: t.name,
            name: t.name,
            onClick: () => setQueryText(s => `${s} '${t.name}'`),
            icon: t.type === 'BASE TABLE' ? TableIcon : t.type === 'VIEW' ? ScanEyeIcon : undefined, //<TableIcon /> : <></>,
          }))
        })
      })
  }

  function executeQuery(text?: string) {
    setIsLoading(true)

    conn
      .query(text ?? queryText)
      .then(r => setQueryAnswerArrow(r))
      .then(() => updateTree())
      .then(() => setIsLoading(false))
      .catch(error => {
        if (error instanceof Error) {
          toast('ERRORE', { description: error.message })
        } else {
          toast('ERRORE')
        }
      })
  }

  return { executeQuery, updateTree }
}

// const pickedFile: File = letUserPickFile();
// await db.registerFileHandle('local.parquet', pickedFile, DuckDBDataProtocol.BROWSER_FILEREADER, true);
