// import { PostgreSQL, sql } from "@codemirror/lang-sql"
// import CodeMirror, { ViewUpdate } from "@uiw/react-codemirror"
import { useAtom } from "jotai"
import { queryTextAtom } from "@/atoms/query"
import { useCallback, useRef } from "react"
import { useExecuteQuery } from "@/lib/duck/query"
// import * as events from "@uiw/codemirror-extensions-events"
import Editor, { EditorProps } from "@monaco-editor/react"
import { KeyCode, KeyMod, type editor } from "monaco-editor"
import { conn } from "@/lib/duck"

export default function CodeBox() {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)
  const [queryText, setQueryText] = useAtom(queryTextAtom)
  // const [value, setValue] = useState("")
  // const [view, setView] = useState<ViewUpdate>()
  const { executeQuery } = useExecuteQuery()

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
  //   // 	console.log("blur")
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
      console.log("[CodeBox] monaco onChange", val)
      setQueryText(val ?? "")
    },
    [setQueryText]
  )

  // const onChange = useCallback(
  //   (val: string, viewUpdate: ViewUpdate) => {
  //     setQueryText(val)
  //     setView(viewUpdate)
  //   },
  //   [setQueryText]
  // )

  const handleEditorDidMount: EditorProps["onMount"] = (editor, monaco) => {
    editorRef.current = editor

    monaco.languages.register({ id: "sql" })
    monaco.languages.registerCompletionItemProvider("sql", {
      provideCompletionItems: async function (model, position) {
        const textUntilPosition = model.getValueInRange({
          startLineNumber: 1,
          startColumn: 1,
          endLineNumber: position.lineNumber,
          endColumn: position.column,
        })
        console.log("textUntilPosition", textUntilPosition)

        const word = model.getWordUntilPosition(position)
        console.log("word", word)

        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        }
        console.log("range", range)

        const suggestions = await conn
          .query(`SELECT suggestion FROM sql_auto_complete('${textUntilPosition}')`)
          .then(r =>
            r.toArray().map(e => {
              const s = e.toJSON()["suggestion"]
              return {
                label: s,
                kind: monaco.languages.CompletionItemKind.Text,
                // documentation: "The Lodash library exported as Node.js modules.",
                insertText: s, //'"lodash": "*"',
                range: range,
              }
            })
          )

        return { suggestions }
      },
    })

    monaco.editor.addEditorAction({
      id: "run sql",
      label: "Run SQL",
      run(editor) {
        let selected: string | undefined
        const s = editor.getSelection()
        if (s) {
          selected = editor.getModel()?.getValueInRange(s)
          if (selected?.length) {
            console.log("[monaco] execute selected", selected)
            executeQuery(selected)
          } else {
            const cursorPosition = editor.getPosition()
            const indexPos = cursorPosition && editor.getModel()?.getOffsetAt(cursorPosition)
            if (cursorPosition && indexPos) {
              console.log("🚀 - file: code-box.tsx:173 - run - indexPos:", indexPos)

              const startPos = Math.max(editor.getValue().lastIndexOf("\n\n", indexPos), 0)

              const text = editor.getValue().slice(startPos, editor.getValue().indexOf(";", indexPos))
              console.log("🚀 - file: code-box.tsx:175 - run - text:", text)

              executeQuery(text)

              // const textUntilPosition = editor.getModel()?.getValueInRange({
              //   startLineNumber: cursorPosition.lineNumber,
              //   startColumn: cursorPosition.column,
              //   endLineNumber: cursorPosition.lineNumber,
              //   endColumn: cursorPosition.column,
              // })
            } else {
              console.log("[monaco] execute all", queryText)
              executeQuery()
            }
          }
        }
      },
      contextMenuOrder: 2,
      contextMenuGroupId: "1_modification",
      keybindings: [KeyMod.CtrlCmd | KeyCode.Enter],
    })
  }

  return (
    <Editor
      height="100%"
      language="sql"
      value={queryText}
      onMount={handleEditorDidMount}
      theme="vs-dark"
      onChange={onChange2}
    />
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
