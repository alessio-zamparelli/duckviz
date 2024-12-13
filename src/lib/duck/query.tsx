import {
	queryAnswerArrowAtom,
	queryAnswerAtom,
	queryTextAtom
} from "@/atoms/query"
import { isLoadingAtom } from "@/atoms/state"
import { conn } from "@/lib/duck"
import { useAtomValue, useSetAtom } from "jotai"
import * as arrow from "apache-arrow"
import { toast } from "sonner"

export function useExecuteQuery() {
	const setQueryAnswer = useSetAtom(queryAnswerAtom)
	const setIsLoading = useSetAtom(isLoadingAtom)
	const setQueryAnswerArrow = useSetAtom(queryAnswerArrowAtom)
	const queryText = useAtomValue(queryTextAtom)

	function executeQuery() {
		setIsLoading(true)
		console.log("query", queryText)
		conn
			.query(queryText)
			.then((r) => {
				setQueryAnswerArrow(r)
				console.table(
					r.schema.fields.map((t) => ({
						name: t.name,
						type: t.type,
						isInt: arrow.DataType.isInt(t.type),
						isTimestamp: arrow.DataType.isTimestamp(t.type),
						typeId: t.typeId,
						nullable: t.nullable
					}))
				)
				setQueryAnswer(
					JSON.parse(
						JSON.stringify(r.toArray(), (_, v) =>
							typeof v === "bigint" ? v.toString() : v
						)
					)
				)
			})
			.then(() => setIsLoading(false))
			.catch((error) => {
				if (error instanceof Error) {
					toast("ERRORE", { description: error.message })
				} else {
					toast("ERRORE")
				}
			})
	}

	return executeQuery
}

// const pickedFile: File = letUserPickFile();
// await db.registerFileHandle('local.parquet', pickedFile, DuckDBDataProtocol.BROWSER_FILEREADER, true);
