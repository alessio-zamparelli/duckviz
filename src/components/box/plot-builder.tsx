import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// @ts-expect-error non ho dichiarato il file
import Plotly from "../../lib/plotly.js"
import { Table } from "apache-arrow"
import createPlotlyComponent from "react-plotly.js/factory"
import { useEffect, useRef, useState } from "react"
// function getPlot(type: string, x: string, y: string){}
import { useImmer } from "use-immer"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"
// import { getPalette } from "@/lib/utils"
// import { useResizeObserver } from "usehooks-ts"
import { Field2Typed } from "@/lib/utils-components"
import { defConfig, defLayout } from "@/lib/plotly-config.js"
import { Data } from "plotly.js"

export default function PlotBuilder({ data }: { data: Table }) {
  const Plot = createPlotlyComponent(Plotly)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [xTrace, setXTrace] = useState<string>("")
  const [traces, setTraces] = useImmer<string[]>([""])
  // const { width = 0, height = 0 } = useResizeObserver({
  //   ref: containerRef,
  //   box: "border-box",
  // })

  // const _data = useMemo(() => {
  //   const formatters = Object.fromEntries(data.schema.fields.map(f => [f.name, Field2Typed(f).typed]))
  //   return data
  //     .toArray()
  //     .map(row => Object.fromEntries(Object.entries(row.toJSON()).map(([k, v]) => [k, formatters[k](v)])))
  // }, [])

  // useEffect(() => {
  // 	if (!(data && containerRef.current && xTrace && traces.length)) return
  // 	console.log("xTrace", xTrace)
  // 	console.log("traces", traces)

  // 	// if (!data.schema.fields.find((e) => e.name === "type")) {
  // 	// 	return alert("create type column to plot!")
  // 	// }

  // 	const formatters = Object.fromEntries(
  // 		data.schema.fields.map((f) => [f.name, Field2Typed(f).typed])
  // 	)

  // 	const _data = data
  // 		.toArray()
  // 		.map((row) =>
  // 			Object.fromEntries(
  // 				Object.entries(row.toJSON()).map(([k, v]) => [k, formatters[k](v)])
  // 			)
  // 		)

  // 	console.table(_data)

  // 	const plot = Plot.plot({
  // 		// y: { grid: true },
  // 		// color: { scheme: "burd" },
  // 		color: { legend: true },
  // 		height,
  // 		width,
  // 		marks: [
  // 			Plot.ruleY([0]),
  // 			...traces.map((t, i) =>
  // 				Plot.lineY(_data, {
  // 					x: xTrace,
  // 					y: t,
  // 					title: t,
  // 					tip: true,
  // 					stroke: getPalette(traces)[i]
  // 				})
  // 			)
  // 		]

  // 		// marks: traces.map((t) =>
  // 		// 	Plot.lineY(_data, {
  // 		// 		x: xTrace,
  // 		// 		y: t,
  // 		// 		title: data.schema.fields.filter((e) => e.name === t)?.[0]?.name
  // 		// 	})
  // 		// )
  // 	})

  // 	containerRef.current.append(plot)
  // 	return () => plot.remove()
  // }, [data, height, traces, width, xTrace])

  useEffect(() => {
    const x0 = data.getChild(xTrace)?.toArray()[0]
    console.log("x0", x0)
    console.log(
      "x0 field",
      data.schema.fields.find(e => e.name === xTrace)
    )
    console.log("x0 typed", Field2Typed(data.schema.fields.find(e => e.name === xTrace)).typed(x0))

    console.log(
      "[PLOT] traces",
      traces.map(
        t =>
          ({
            type: "scatter",
            x: [...(data.getChild(xTrace)?.toArray() ?? [])].map(
              Field2Typed(data.schema.fields.find(e => e.name === xTrace)).typed
            ),
            y: [...(data.getChild(t)?.toArray() ?? [])].map(
              Field2Typed(data.schema.fields.find(e => e.name === t)).typed
            ),
            name: t,
          } as Data)
      )
    )
  }, [data, traces, xTrace])

  return (
    <div className="grow h-full">
      <div className="flex gap-2 items-end px-2">
        <Label>
          X
          <Select value={xTrace} onValueChange={setXTrace}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {data.schema.fields.map(f => (
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
            <Select value={t} onValueChange={v => setTraces(t => void (t[idx] = v))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {data.schema.fields.map(f => (
                  <SelectItem key={f.name} value={f.name}>
                    {f.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Label>
        ))}
        <Button
          disabled={traces.findIndex(e => e === "") >= 0}
          onClick={() => {
            setTraces(t => void t.push(""))
          }}>
          <PlusIcon />
        </Button>
      </div>

      <Plot
        className="grow h-[calc(100%-50px)] w-full"
        useResizeHandler
        data={
          traces.map(
            t =>
              ({
                type: "scatter",
                x: [...(data.getChild(xTrace)?.toArray() ?? [])].map(
                  Field2Typed(data.schema.fields.find(e => e.name === xTrace)).typed
                ),
                y: [...(data.getChild(t)?.toArray() ?? [])].map(
                  Field2Typed(data.schema.fields.find(e => e.name === t)).typed
                ),
                name: t,
              } as Data)
          )
          // [

          // {
          // type: "indicator",
          // mode: "number+delta",
          // title: {
          // 	text: "Ritm gestite",
          // 	font: { ...defLayout.titlefont, size: 20 }
          // },
          // value: dates.curr && data?.openedLastYear?.filter(e => isSameMonth(e.month, dates.curr!)).at(0)?.ritmCnt,
          // domain: { x: [0, 0.5], y: [0, 0.5] },
          // delta: {
          //   reference:
          //     dates.curr && data?.openedLastYear?.filter(e => isSameMonth(e.month, dates.prev!)).at(0)?.ritmCnt,
          //   relative: true,
          //   position: "top",
          //   valueformat: ".0%",
          // },
          // number: { font: { size: 30 } },
          // },
          // ]
        }
        layout={{ ...defLayout }}
        config={{ ...defConfig }}
      />

      <div ref={containerRef} className="grow" />
    </div>
  )
}

// const plotType = {
// 	lineY: Plot.lineY,
// 	lineX: Plot.lineX
// }
