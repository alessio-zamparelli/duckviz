import { queryAnswerArrowAtom } from "@/atoms/query"
import { useAtomValue } from "jotai"
import { ColumnDef, RowData } from "@tanstack/react-table"
import { DataTable } from "@/components/ui/data-table"
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header"
import { useState } from "react"
import { Field, Table } from "apache-arrow"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PlotBuilder from "@/components/box/plot-builder"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Field2Typed } from "@/lib/utils-components"

export function ResultBox() {
	const queryAnswerArrow = useAtomValue(queryAnswerArrowAtom)
	const [activeTab, setActiveTab] = useState("table")

	if (!queryAnswerArrow) {
		return <p>nothing to show</p>
	}

	return (
		<Tabs
			value={activeTab}
			onValueChange={setActiveTab}
			className="h-[calc(100%-4px)]"
		>
			<div className="flex justify-center mt-1">
				<TabsList className="">
					<TabsTrigger value="table">Table result</TabsTrigger>
					<TabsTrigger value="plot">Plot</TabsTrigger>
				</TabsList>
			</div>

			<TabsContent value="table" className="ciao">
				<ScrollArea>
					<DataTable
						columns={Table2Column(queryAnswerArrow)}
						data={Table2Data(queryAnswerArrow)}
					/>
				</ScrollArea>
			</TabsContent>
			<TabsContent value="plot" className="h-[calc(100%-48px)] flex flex-col">
				<PlotBuilder data={queryAnswerArrow} />
			</TabsContent>
		</Tabs>
	)

	// return (
	// 	<Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
	// 		<div className="flex justify-center mt-1">
	// 			<TabsList className="">
	// 				<TabsTrigger value="table">Table result</TabsTrigger>
	// 				<TabsTrigger value="plot">Plot</TabsTrigger>
	// 			</TabsList>
	// 		</div>

	// 		<TabsContent value="table" className="ciao">
	// 			<ScrollArea>
	// 				<DataTable
	// 					columns={Table2Column(queryAnswerArrow)}
	// 					data={Table2Data(queryAnswerArrow)}
	// 				/>
	// 			</ScrollArea>
	// 		</TabsContent>
	// 		<TabsContent value="plot" className="">
	// 			<PlotBuilder data={queryAnswerArrow} />
	// 		</TabsContent>
	// 	</Tabs>
	// )
}

const c = (field: Field): ColumnDef<RowData> => {
	return {
		accessorKey: field.name,
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title={Field2Typed(field).title} />
		),
		cell: ({ row }) => Field2Typed(field).formatter(row.getValue(field.name))
	}
}

export function Table2Column(table: Table) {
	return table.schema.fields.map(c)
}

export function Table2Data(table: Table) {
	return table.toArray().map((row) => row.toJSON())
}
