import { queryAnswerArrowAtom, queryTextAtom } from "@/atoms/query"
import { isLoadingAtom, treeAtom } from "@/atoms/state"
import { conn } from "@/lib/duck"
import { useAtom, useSetAtom } from "jotai"
import { ScanEyeIcon, TableIcon } from "lucide-react"

import { toast } from "sonner"

export function useExecuteQuery() {
  const setIsLoading = useSetAtom(isLoadingAtom)
  const setQueryAnswerArrow = useSetAtom(queryAnswerArrowAtom)
  const [queryText, setQueryText] = useAtom(queryTextAtom)
  const setTables = useSetAtom(treeAtom)

  function updateTree() {
    conn
      .query(
        `select table_schema as "schema", table_name as "name", table_type as "type" from information_schema.tables`
      )
      .then(r => {
        const a = r.toArray().map(e => e.toJSON())
        console.log("res", a)

        const tables = a.map(e => ({ name: e.name, schema: e.schema, type: e.type }))
        console.table(tables)

        setTables(s => {
          s.find(e => e.id === "memory")!.children = tables.map(t => ({
            id: t.name,
            name: t.name,
            onClick: () => setQueryText(s => s + " '" + t.name + "'"),
            icon: t.type === "BASE TABLE" ? TableIcon : t.type === "VIEW" ? ScanEyeIcon : undefined, //<TableIcon /> : <></>,
          }))
        })
      })
  }

  function executeQuery(text?: string) {
    setIsLoading(true)

    console.log("[executeQuery] queryText", queryText)
    console.log("[executeQuery] text", text)

    conn
      .query(text ?? queryText)
      .then(r => {
        setQueryAnswerArrow(r)
        console.log("query answer datatype", r.schema.fields)
        // console.table(
        //   r.schema.fields.map(t => ({
        //     name: t.name,
        //     type: t.type,
        //     // isInt: arrow.DataType.isInt(t.type),
        //     // isTimestamp: arrow.DataType.isTimestamp(t.type),
        //     // typeId: t.typeId,
        //     // nullable: t.nullable
        //   }))
        // )
        // setQueryAnswer(
        // 	JSON.parse(
        // 		JSON.stringify(r.toArray(), (_, v) =>
        // 			typeof v === "bigint" ? v.toString() : v
        // 		)
        // 	)
        // )
      })
      .then(() => updateTree())
      .then(() => setIsLoading(false))
      .catch(error => {
        if (error instanceof Error) {
          toast("ERRORE", { description: error.message })
        } else {
          toast("ERRORE")
        }
      })
  }

  return { executeQuery, updateTree }
}

// const pickedFile: File = letUserPickFile();
// await db.registerFileHandle('local.parquet', pickedFile, DuckDBDataProtocol.BROWSER_FILEREADER, true);
