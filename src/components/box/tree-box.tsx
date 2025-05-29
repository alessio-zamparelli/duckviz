import { DuckDBDataProtocol } from "@duckdb/duckdb-wasm"
import { useAtom, useSetAtom } from "jotai"
import { FileIcon, FileUpIcon, XIcon } from "lucide-react"
import { useEffect } from "react"
import { toast } from "sonner"

import { queryTextAtom } from "@/atoms/query"
import { treeAtom } from "@/atoms/state"
import { ModeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { TreeView } from "@/components/ui/tree-view"
import { db } from "@/lib/duck"
import { GithubIcon } from "@/lib/github"
import { deleteFile, filesEntries, setFile } from "@/lib/store"

export function TreeBox() {
  const [tables, setTables] = useAtom(treeAtom)
  const setQueryText = useSetAtom(queryTextAtom)

  // useEffect(() => {
  // 	conn
  // 		.query(
  // 			"select table_schema, table_name, table_type from information_schema.tables"
  // 		)
  // 		.then((r) => {
  // 			setTables((s) => {
  // 				s.find((t) => t.id === "external")?.children?.push(
  // 					...r.toArray().map((e, idx) => {
  // 						const c = e.toJSON()
  // 						return {
  // 							id: idx.toString(),
  // 							name: c["table_name"],
  // 							onClick: () => setQueryText((s) => s + " " + c["table_name"])
  // 						} as TreeDataItem
  // 					})
  // 				)
  // 			})
  // 			console.log(tables)
  // 		})
  // }, [setQueryText, setTables])

  async function getTheFile() {
    if (!("showOpenFilePicker" in window)) return alert("not supported by your browser")

    const [fileHandle] = await window.showOpenFilePicker()
    const file = await fileHandle.getFile()

    console.log("loaded", file.name)

    await db.registerFileHandle(file.name, file, DuckDBDataProtocol.BROWSER_FILEREADER, true)

    toast("File loaded " + file.name)

    await setFile(file.name, file)

    setTables(s => {
      s
        .find(e => e.id === "external")
        ?.children?.push({
          id: file.name,
          name: file.name,
          onClick: () => setQueryText(s => s + " '" + file.name + "'"),
        })
    })
  }

  async function deleteRegisteredFile(fileName: string) {
    await deleteFile(fileName)

    setTables(s => {
      s.find(e => e.id === "external")!.children = s
        .find(e => e.id === "external")
        ?.children?.filter(e => e.name !== fileName)
    })
  }

  useEffect(() => {
    const registerIndexedTables = async () => {
      const entries = await filesEntries()
      console.log("🚀 - file: tree-box.tsx:65 - ; - entries:", entries)

      const actualTables = tables.find(e => e.id === "external")!.children!.map(e => e.name)

      for (const [name, file] of entries) {
        if (!actualTables.includes(name)) {
          console.log(name, file)
          await db.registerFileHandle(name, file, DuckDBDataProtocol.BROWSER_FILEREADER, true)
          setTables(s => {
            if (!actualTables.includes(name))
              s
                .find(e => e.id === "external")
                ?.children?.push({
                  id: name,
                  name: name,
                  onClick: () => setQueryText(s => s + " '" + name + "'"),
                  icon: FileIcon,
                  actions: (
                    <Button size="icon-sm" onClick={() => deleteRegisteredFile(name)}>
                      <XIcon />
                    </Button>
                  ),
                })
          })
        }
      }
    }

    registerIndexedTables()

    return () => {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="h-full flex flex-col justify-between pb-2">
      <div className="">
        <div className="flex flex-wrap gap-2 px-2 py-1 shadow-sm justify-between">
          <div className="flex items-center gap-2">
            <img src="/DuckVIZ-logo.png" alt="DuckViz logo" className="h-8 w-8" />
            <h1 className="font-bold">DuckViz</h1>
          </div>

          <div className="flex gap-2">
            <a href="https://github.com/alessio-zamparelli/duckviz" className="h-8 w-8 p-1">
              <GithubIcon />
            </a>
            <ModeToggle />
          </div>
        </div>

        <TreeView data={tables} />
      </div>

      <Button
        className="w-36 mx-auto"
        variant="outline"
        onClick={() => {
          getTheFile()
        }}>
        <FileUpIcon /> Load file
      </Button>
    </div>
  )
}
