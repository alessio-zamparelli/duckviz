/* eslint-disable @typescript-eslint/no-unused-vars */

import { PostgreSQL, sql } from "@codemirror/lang-sql"
import CodeMirror, { ViewUpdate } from "@uiw/react-codemirror"
import { useAtom } from "jotai"
import { queryTextAtom } from "@/atoms/query"
import { useCallback } from "react"
import { useExecuteQuery } from "@/lib/duck/query"
import * as events from "@uiw/codemirror-extensions-events"

export default function CodeBox() {
	const [value, setValue] = useAtom(queryTextAtom)
	const executeQuery = useExecuteQuery()

	// const ref = useRef(null)
	// const { height = 0 } = useResizeObserver({
	// 	ref: ref as never,
	// 	box: "border-box"
	// })

	// const debouncedHeight = useDebounceCallback(height, 100)

	const onChange = useCallback(
		(val: string, _viewUpdate: ViewUpdate) => {
			setValue(val)
		},
		[setValue]
	)

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
	const eventExt2 = events.content({
		// focus: (evn) => {
		// 	console.log("focus")
		// },
		// blur: (evn) => {
		// 	console.log("blur")
		// },
		keydown: (evn) => {
			if (evn instanceof KeyboardEvent) {
				if (evn.key === "Enter" && (evn.ctrlKey || evn.metaKey)) {
					executeQuery()
				}
			}
		}
	})

	return (
		<CodeMirror
			value={value}
			className="h-full w-full grow"
			height="100%"
			// height={height + "px"}
			theme="dark"
			extensions={[sql({ dialect: PostgreSQL }), eventExt2]}
			onChange={onChange}
		/>
	)
}
