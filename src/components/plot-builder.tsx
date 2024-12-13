import { Label } from "@/components/ui/label"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select"
import * as Plot from "@observablehq/plot"
import { Table } from "apache-arrow"

import { useEffect, useRef, useState } from "react"
// function getPlot(type: string, x: string, y: string){}
import { useImmer } from "use-immer"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"
import { Field2Typed, getPalette } from "@/lib/utils"
import { useResizeObserver } from "usehooks-ts"

export default function PlotBuilder({ data }: { data: Table }) {
	const containerRef = useRef<HTMLDivElement | null>(null)
	const [xTrace, setXTrace] = useState<string>("")
	const [traces, setTraces] = useImmer<string[]>([""])
	const { width = 0, height = 0 } = useResizeObserver({
		ref: containerRef,
		box: "border-box"
	})

	useEffect(() => {
		if (!(data && containerRef.current && xTrace && traces.length)) return
		console.log("xTrace", xTrace)
		console.log("traces", traces)

		// if (!data.schema.fields.find((e) => e.name === "type")) {
		// 	return alert("create type column to plot!")
		// }

		const formatters = Object.fromEntries(
			data.schema.fields.map((f) => [f.name, Field2Typed(f).typed])
		)

		const _data = data
			.toArray()
			.map((row) =>
				Object.fromEntries(
					Object.entries(row.toJSON()).map(([k, v]) => [k, formatters[k](v)])
				)
			)

		console.table(_data)

		const plot = Plot.plot({
			// y: { grid: true },
			// color: { scheme: "burd" },
			color: { legend: true },
			height,
			width,
			marks: [
				Plot.ruleY([0]),
				...traces.map((t, i) =>
					Plot.lineY(_data, {
						x: xTrace,
						y: t,
						title: t,
						tip: true,
						stroke: getPalette(traces)[i]
					})
				)
			]

			// marks: traces.map((t) =>
			// 	Plot.lineY(_data, {
			// 		x: xTrace,
			// 		y: t,
			// 		title: data.schema.fields.filter((e) => e.name === t)?.[0]?.name
			// 	})
			// )
		})

		containerRef.current.append(plot)
		return () => plot.remove()
	}, [data, height, traces, width, xTrace])

	return (
		<>
			<div className="flex gap-2 items-end px-2">

				<Label>
					X
					<Select value={xTrace} onValueChange={setXTrace}>
						<SelectTrigger>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{data.schema.fields.map((f) => (
								<SelectItem key={f.name} value={f.name}>
									{f.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</Label>
				{traces.map((t, idx) => (
					<Label key={t}>
						Y{idx + 1}
						<Select
							value={t}
							onValueChange={(v) => setTraces((t) => void (t[idx] = v))}
						>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{data.schema.fields.map((f) => (
									<SelectItem key={f.name} value={f.name}>
										{f.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</Label>
				))}
				<Button
					disabled={traces.findIndex((e) => e === "") >= 0}
					onClick={() => {
						setTraces((t) => void t.push(""))
					}}
				>
					<PlusIcon />
				</Button>
			</div>

			<div ref={containerRef} className="grow"/>
		</>
	)
}

// const plotType = {
// 	lineY: Plot.lineY,
// 	lineX: Plot.lineX
// }
