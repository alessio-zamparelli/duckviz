import { produce } from 'immer'
import { useAtom } from 'jotai'
import { PlayIcon, PlusCircleIcon, TrashIcon } from 'lucide-react'
import { nanoid } from 'nanoid'
import { useState } from 'react'

import { queryListAtom, queryListIdxAtom } from '@/atoms/query'
import { Button } from '@/components/ui/button'
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu'
import { Kbd } from '@/components/ui/kbd'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

export function CodeBoxTabs({ onRun, isMacOs }: { onRun?: () => void; isMacOs?: boolean }) {
  const [queryList, setQueryList] = useAtom(queryListAtom)
  const [queryListIdx, setQueryListIdx] = useAtom(queryListIdxAtom)
  const [renameActiveTab, setRenameActiveTab] = useState(false)

  return (
    <div className='flex items-center bg-background pr-2'>
      <ScrollArea className='grow whitespace-nowrap'>
        <div className='flex w-max items-center space-x-2 p-2'>
          {queryList.map((q, idx) => (
            <div className={cn('rounded px-2', queryListIdx === idx && 'bg-accent')} key={q.id}>
              <ContextMenu>
                <ContextMenuTrigger
                  className='cursor-pointer'
                  onClick={() => {
                    setQueryListIdx(idx)
                  }}>
                  {renameActiveTab && queryListIdx === idx ? (
                    <input
                      onKeyDown={e => e.key === 'Enter' && setRenameActiveTab(false)}
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
            size='icon-xs'
            variant='outline'
            onClick={() => {
              setQueryList(s => [...s, { id: nanoid(), title: `q-${nanoid(4)}`, text: '' }])
            }}>
            <PlusCircleIcon />
          </Button>
        </div>
        <ScrollBar orientation='horizontal' />
      </ScrollArea>
      <Button size='sm' variant='default' onClick={onRun} className='sticky right-0'>
        <PlayIcon />
        <Kbd>{isMacOs ? '⌘' : 'Ctrl'}+ ⏎</Kbd>
      </Button>
      {/* <div className='absolute inset-y-0 right-0 z-10 flex items-center gap-2 border-l bg-background/95 px-2 backdrop-blur supports-[backdrop-filter]:bg-background/70'>
        <Button size='sm' variant='default' onClick={onRun}>
          <PlayIcon />
          <Kbd>{isMacOs ? '⌘' : 'Ctrl'}+ ⏎</Kbd>
        </Button>
      </div> */}
    </div>
  )
}
