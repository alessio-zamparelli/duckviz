import type { EditorProps, Monaco } from '@monaco-editor/react'
import Editor, { useMonaco } from '@monaco-editor/react'
import { useAtom } from 'jotai'
import { type editor, KeyCode, KeyMod, type Position } from 'monaco-editor'
import { useCallback, useEffect, useRef } from 'react'
import { useMediaQuery } from 'usehooks-ts'

import { queryTextAtom } from '@/atoms/query'
import { CodeBoxTabs } from '@/components/box/code-box-tabs'
import { useTheme } from '@/components/theme-provider'
import { conn } from '@/lib/duck'
import { useExecuteQuery } from '@/lib/duck/query'

export default function CodeBox() {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)
  const [queryText, setQueryText] = useAtom(queryTextAtom)

  // const [value, setValue] = useState("")
  // const [view, setView] = useState<ViewUpdate>()
  const { executeQuery } = useExecuteQuery()
  const { theme } = useTheme()
  const prefereDark = useMediaQuery('(prefers-color-scheme: dark)')
  const monaco = useMonaco()
  const isMacOs = typeof window !== 'undefined' && window.navigator.platform.toUpperCase().includes('MAC')

  // const ref = useRef(null)
  // const { height = 0 } = useResizeObserver({
  // 	ref: ref as never,
  // 	box: "border-box"
  // })

  // const debouncedHeight = useDebounceCallback(height, 100)

  // const onChange = useCallback(
  //   (val: string, viewUpdate: ViewUpdate) => {
  //     setQueryText(val)
  //     setView(viewUpdate)
  //   },
  //   [setQueryText]
  // )

  // const completions = [
  // 	{ label: "panic", type: "keyword" },
  // 	{ label: "park", type: "constant", info: "Test completion" },
  // 	{ label: "password", type: "variable" }
  // ]

  //  function myCompletions(context: CompletionContext) {
  // 	const before = context.matchBefore(/\w+/)
  // 	// If completion wasn't explicitly started and there
  // 	// is no word before the cursor, don't open completions.
  // 	if (!context.explicit && !before) return null
  // 	return {
  // 		from: before ? before.from : context.pos,
  // 		options: conn.query(
  // 			`select suggestion from sql_auto_complete('${before?.text}')`
  // 		),
  // 		validFor: /^\w*$/
  // 	}
  // }

  // const keydownHandler = (e: KeyboardEvent) => {
  // 	if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
  // 		e.preventDefault()
  // 		e.stopPropagation()
  // 		executeQuery()
  // 	}
  // }
  // useEffect(() => {
  // 	document.addEventListener("keydown", keydownHandler)

  // 	return () => {
  // 		document.removeEventListener("keydown", keydownHandler)
  // 	}
  // }, [])
  // const eventExt2 = events.content({
  //   // focus: (evn) => {
  //   // 	console.log("focus")
  //   // },
  //   // blur: (evn) => {
  //   // 	console.log("blur-sm")
  //   // },
  //   keydown: evn => {
  //     if (evn instanceof KeyboardEvent) {
  //       if (evn.key === "Enter" && (evn.ctrlKey || evn.metaKey)) {
  //         const line = view?.state.doc.lineAt(view?.state.selection.main.from)
  //         const lineContents = view?.state.sliceDoc(line?.from, line?.to)
  //         console.log("🚀 - file: code-box.tsx:85 - CodeBox - lineContents:", lineContents)
  //         // if (lineContents?.length ) {
  //         // 	setQueryText(lineContents)
  //         // } else {
  //         //   setQueryText(value)
  //         // }

  //         if (lineContents?.length) {
  //           executeQuery(lineContents)
  //         } else {
  //           executeQuery()
  //         }
  //       }
  //     }
  //   },
  // })

  const onChange2 = useCallback(
    (val?: string) => {
      console.log('[CodeBox] monaco onChange', val)
      setQueryText(val ?? '')
    },
    [setQueryText],
  )

  const runSql = useCallback(
    (editor: editor.IStandaloneCodeEditor | null) => {
      if (!editor) {
        executeQuery()
        return
      }

      const selection = editor.getSelection()
      if (selection) {
        const selected = editor.getModel()?.getValueInRange(selection)
        if (selected?.length) {
          console.log('[monaco] execute selected', selected)
          executeQuery(selected)
          return
        }
      }

      const cursorPosition = editor.getPosition()
      const indexPos = cursorPosition && editor.getModel()?.getOffsetAt(cursorPosition)
      if (cursorPosition && indexPos) {
        const startPos = Math.max(editor.getValue().lastIndexOf('\n\n', indexPos), 0)
        const endPos = editor.getValue().indexOf(';', indexPos)
        const text = editor
          .getValue()
          .slice(startPos, endPos > -1 ? endPos : undefined)
          .trim()
        console.log('🚀 - file: code-box.tsx:runSql - text:', text)
        executeQuery(text.length ? text : undefined)
        return
      }

      console.log('[monaco] execute all', queryText)
      executeQuery()
    },
    [executeQuery, queryText],
  )

  // const onChange = useCallback(
  //   (val: string, viewUpdate: ViewUpdate) => {
  //     setQueryText(val)
  //     setView(viewUpdate)
  //   },
  //   [setQueryText]
  // )

  const handleEditorDidMount: EditorProps['onMount'] = (editor: editor.IStandaloneCodeEditor, monaco: Monaco) => {
    editorRef.current = editor

    monaco.languages.register({ id: 'sql' })
    monaco.languages.registerCompletionItemProvider('sql', {
      provideCompletionItems: async (model: editor.ITextModel, position: Position) => {
        const textUntilPosition = model.getValueInRange({
          startLineNumber: 1,
          startColumn: 1,
          endLineNumber: position.lineNumber,
          endColumn: position.column,
        })
        console.log('textUntilPosition', textUntilPosition)

        const word = model.getWordUntilPosition(position)
        console.log('word', word)

        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        }
        console.log('range', range)

        const suggestions = await conn
          .query(`SELECT suggestion FROM sql_auto_complete('${textUntilPosition}')`)
          .then(r =>
            r.toArray().map(e => {
              const s = e.toJSON().suggestion
              return {
                label: s,
                kind: monaco.languages.CompletionItemKind.Text,
                // documentation: "The Lodash library exported as Node.js modules.",
                insertText: s, //'"lodash": "*"',
                range: range,
              }
            }),
          )

        return { suggestions }
      },
    })

    monaco.editor.addEditorAction({
      id: 'run sql',
      label: 'Run SQL',
      run(editor: editor.IStandaloneCodeEditor) {
        runSql(editor)
      },
      contextMenuOrder: 2,
      contextMenuGroupId: '1_modification',
      keybindings: [KeyMod.CtrlCmd | KeyCode.Enter],
    })
  }

  useEffect(() => {
    if (theme === 'dark') {
      monaco?.editor.setTheme('vs-dark')
    } else if (theme === 'light') {
      monaco?.editor.setTheme('light')
    } else {
      if (prefereDark) {
        monaco?.editor.setTheme('vs-dark')
      }
    }
  }, [monaco?.editor, prefereDark, theme])

  return (
    <div className="flex h-full min-h-0 w-full flex-col overflow-hidden">
      <CodeBoxTabs
        onRun={() => {
          runSql(editorRef.current)
        }}
        isMacOs={isMacOs}
      />
      {/* <div className="h-12 relative overflow-hidden">
        <div className="absolute inset-0 flex gap-1 overflow-auto max-w-full w-full">
          {Range(0, 100).map(i => (
            <div className="" key={i}>
              <ContextMenu>
                <ContextMenuTrigger>Right click</ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuItem>Profile</ContextMenuItem>
                  <ContextMenuItem>Billing</ContextMenuItem>
                  <ContextMenuItem>Team</ContextMenuItem>
                  <ContextMenuItem>Subscription</ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            </div>
          ))}
        </div>
      </div> */}
      <div className="relative min-h-0 w-full flex-1 overflow-hidden">
        <Editor
          height="100%"
          // width="100%"
          language="sql"
          value={queryText}
          onMount={handleEditorDidMount}
          theme={theme === 'dark' ? 'vs-dark' : theme === 'light' ? undefined : prefereDark ? 'vs-dark' : undefined}
          onChange={onChange2}
        />
      </div>
    </div>
  )

  // return (
  //   <CodeMirror
  //     basicSetup={{ autocompletion: true }}
  //     value={queryText}
  //     className="h-full w-full grow"
  //     height="100%"
  //     // height={height + "px"}
  //     theme="dark"
  //     extensions={[
  //       sql({ dialect: PostgreSQL }),
  //       eventExt2,
  //       // autocompletion({ override: [myCompletions] })
  //     ]}
  //     onChange={onChange}
  //   />
  // )
}
