import { Table } from "apache-arrow"
import { useAtom } from "jotai"
import { PlusIcon, TrashIcon } from "lucide-react"
import { nanoid } from "nanoid"
import { Data } from "plotly.js"
import { useRef } from "react"
import createPlotlyComponent from "react-plotly.js/factory"

import { PlotTypeArray, tracesAtom } from "@/atoms/plot.js"
import { queryAnswerArrowAtom } from "@/atoms/query.js"
import { isPlotPanelActiveAtom } from "@/atoms/state.js"
// function getPlot(type: string, x: string, y: string){}
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox.js"
import DraggableWrapper from "@/components/ui/dragble-wrapper"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { defConfig, defLayout } from "@/lib/plotly-config.js"
// import { getPalette } from "@/lib/utils"
// import { useResizeObserver } from "usehooks-ts"
import { Field2Typed } from "@/lib/utils-components"

// @ts-expect-error non ho dichiarato il file
import Plotly from "../../lib/plotly.js"

export default function PlotBuilder({ data }: { data: Table }) {
  const Plot = createPlotlyComponent(Plotly)
  const containerRef = useRef<HTMLDivElement | null>(null)
  // const [xTrace, setXTrace] = useState<string>("")
  // const [traces, setTraces] = useImmer<string[]>([""])

  const [traces] = useAtom(tracesAtom)

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

  // useEffect(() => {
  //   const x0 = data.getChild(xTrace)?.toArray()[0]
  //   console.log("x0", x0)
  //   console.log(
  //     "x0 field",
  //     data.schema.fields.find(e => e.name === xTrace)
  //   )
  //   console.log("x0 typed", Field2Typed(data.schema.fields.find(e => e.name === xTrace)).typed(x0))

  //   console.log(
  //     "[PLOT] traces",
  //     traces.map(
  //       t =>
  //         ({
  //           type: "scatter",
  //           x: [...(data.getChild(xTrace)?.toArray() ?? [])].map(
  //             Field2Typed(data.schema.fields.find(e => e.name === xTrace)).typed
  //           ),
  //           y: [...(data.getChild(t)?.toArray() ?? [])].map(
  //             Field2Typed(data.schema.fields.find(e => e.name === t)).typed
  //           ),
  //           name: t,
  //         } as Data)
  //     )
  //   )
  // }, [data, traces, xTrace])

  return (
    <div className="grow h-full">
      <Plot
        className="grow h-full w-full"
        useResizeHandler
        data={
          traces
            .filter(t => t.x && t.y && t.type)
            .map(
              t =>
                ({
                  type: t.type,
                  x: [...(data.getChild(t.x!)?.toArray() ?? [])].map(
                    Field2Typed(data.schema.fields.find(e => e.name === t.x)).typed,
                  ),
                  y: [...(data.getChild(t.y!)?.toArray() ?? [])].map(
                    Field2Typed(data.schema.fields.find(e => e.name === t.y)).typed,
                  ),
                  name: t.y,
                  yaxis: t.secondaryY && "y2",
                }) as Data,
            )
          // traces.map(
          //   t =>
          //     ({
          //       type: "scatter",
          //       x: [...(data.getChild(xTrace)?.toArray() ?? [])].map(
          //         Field2Typed(data.schema.fields.find(e => e.name === xTrace)).typed
          //       ),
          //       y: [...(data.getChild(t)?.toArray() ?? [])].map(
          //         Field2Typed(data.schema.fields.find(e => e.name === t)).typed
          //       ),
          //       name: t,
          //     } as Data)
          // )
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

export function PlotConfig() {
  const [traces, setTraces] = useAtom(tracesAtom)
  const [data] = useAtom(queryAnswerArrowAtom)
  const [activePanel] = useAtom(isPlotPanelActiveAtom)

  // ({
  //   type: "scatter",
  //   x: [...(data.getChild(xTrace)?.toArray() ?? [])].map(
  //     Field2Typed(data.schema.fields.find(e => e.name === xTrace)).typed
  //   ),
  //   y: [...(data.getChild(t)?.toArray() ?? [])].map(
  //     Field2Typed(data.schema.fields.find(e => e.name === t)).typed
  //   ),
  //   name: t,
  // } as Data)

  return (
    <DraggableWrapper
      title={"Plot config"}
      width="min-w-xl"
      height="auto"
      fullScreenWidth="60%"
      fullScreenHeight="auto"
      hidden={!activePanel}>
      {/* <div className="flex gap-2 items-end px-2"> */}
      {/* <div className=""> */}
      {/* <Label>
        X
        <Select value={trace} onValueChange={setXTrace}>
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
      </Label> */}
      {traces.map((t, idx) => (
        <Card key={t.id} className="flex gap-3 items-center p-2 my-1">
          <CardHeader className="p-0">
            <CardTitle>
              <Label>Trace {idx + 1} </Label>
            </CardTitle>
            {/* <CardDescription>Card Description</CardDescription> */}
          </CardHeader>

          <CardContent className="flex items-center p-0 gap-1 grow">
            <Select
              value={t.type}
              onValueChange={v => setTraces(t => void (t[idx] = { ...t?.[idx], type: v as never }))}>
              <SelectTrigger>
                <SelectValue placeholder="Type?" />
              </SelectTrigger>
              <SelectContent>
                {PlotTypeArray.map(f => (
                  <SelectItem key={f} value={f}>
                    {f}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={t.x} onValueChange={v => setTraces(t => void (t[idx] = { ...t?.[idx], x: v }))}>
              <SelectTrigger>
                <SelectValue placeholder="X?" />
              </SelectTrigger>
              <SelectContent>
                {data?.schema.fields.map(f => (
                  <SelectItem key={f.name} value={f.name}>
                    {f.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={t.y} onValueChange={v => setTraces(t => void (t[idx] = { ...t?.[idx], y: v }))}>
              <SelectTrigger>
                <SelectValue placeholder="Y?" />
              </SelectTrigger>
              <SelectContent>
                {data?.schema.fields.map(f => (
                  <SelectItem key={f.name} value={f.name}>
                    {f.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center space-x-2">
              <Checkbox
                id={"secondaryY-" + idx}
                checked={t.secondaryY}
                onCheckedChange={c => setTraces(t => void (t[idx] = { ...t?.[idx], secondaryY: !!c }))}
              />
              <label
                htmlFor={"secondaryY-" + idx}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Secondary Y
              </label>
            </div>
          </CardContent>

          <CardFooter className="p-0">
            <Button
              variant="destructive"
              size="icon-sm"
              type="button"
              onClick={() => {
                setTraces(t => void t.splice(idx, 1))
              }}>
              <TrashIcon />
            </Button>
          </CardFooter>
        </Card>
      ))}
      <Button
        className="mt-1"
        size="sm"
        disabled={traces.findIndex(e => !e.x || !e.y) >= 0}
        onClick={() => {
          setTraces(t => void t.push({ id: nanoid(), secondaryY: false }))
        }}>
        Add trace
        <PlusIcon />
      </Button>
      {/* </div> */}
    </DraggableWrapper>
  )
}
