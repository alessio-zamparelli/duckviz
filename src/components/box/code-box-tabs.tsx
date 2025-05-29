import { produce } from "immer"
import { useAtom } from "jotai"
import { PlusCircleIcon, TrashIcon } from "lucide-react"
import { nanoid } from "nanoid"
import { useState } from "react"

import { queryListAtom, queryListIdxAtom } from "@/atoms/query"
import { Button } from "@/components/ui/button"
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

export function CodeBoxTabs() {
  const [queryList, setQueryList] = useAtom(queryListAtom)
  const [queryListIdx, setQueryListIdx] = useAtom(queryListIdxAtom)
  const [renameActiveTab, setRenameActiveTab] = useState(false)

  return (
    <div className="relative overflow-hidden">
      <ScrollArea className="absolute inset-0 whitespace-nowrap rounded-md border">
        <div className="flex w-max space-x-2 p-2">
          {queryList.map((q, idx) => (
            <div className={cn("px-2 rounded", queryListIdx === idx && "bg-accent")} key={idx}>
              <ContextMenu>
                <ContextMenuTrigger
                  className="cursor-pointer"
                  onClick={() => {
                    setQueryListIdx(idx)
                  }}>
                  {renameActiveTab && queryListIdx === idx ? (
                    <input
                      onKeyDown={e => e.key === "Enter" && setRenameActiveTab(false)}
                      value={q.title}
                      onChange={e =>
                        setQueryList(s =>
                          produce(s, draftState => {
                            draftState[queryListIdx].title = e.target.value
                          }),
                        )
                      }
                    />
                  ) : (
                    q.title
                  )}
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuItem
                    disabled={queryList.length <= 1}
                    hidden={queryList.length <= 1}
                    onClick={() => {
                      if (queryList.length > 1) {
                        setQueryListIdx(i => (i > 0 ? --i : 0))
                        setQueryList(s =>
                          produce(s, draftState => {
                            draftState.splice(queryListIdx, 1)
                          }),
                        )
                      }
                    }}>
                    <TrashIcon /> delete
                  </ContextMenuItem>
                  <ContextMenuItem
                    onClick={() => {
                      setRenameActiveTab(true)
                    }}>
                    rename tab
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            </div>
          ))}
          <Button
            size="icon-xs"
            variant="outline"
            onClick={() => {
              setQueryList(s => [...s, { id: nanoid(), title: "q-" + nanoid(4), text: "" }])
            }}>
            <PlusCircleIcon />
          </Button>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  )
}
