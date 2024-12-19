import { queryAnswerArrowAtom } from "@/atoms/query"
import { activePanelAtom, panelType } from "@/atoms/state"
import CodeBox from "@/components/box/code-box"
import PlotBuilder from "@/components/box/plot-builder"
import { Table2Column, Table2Data } from "@/components/box/result-box"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/virtualized-data-table"
import { useAtom } from "jotai"
import { ChartLineIcon, DatabaseIcon, TableIcon } from "lucide-react"
import { useRef } from "react"
import { useResizeObserver } from "usehooks-ts"

export function ActivePanelSelector({ position }: { position: "top" | "bottom" }) {
  const [activePanel, setActivePanel] = useAtom(activePanelAtom)
  const [queryAnswerArrow] = useAtom(queryAnswerArrowAtom)
  const ref = useRef<HTMLDivElement>(null)
  const { height = 0 } = useResizeObserver({ ref, box: "border-box" })

  function Selector({ active }: { active: panelType }) {
    return (
      <div className="flex flex-col justify-center gap-2 mx-px">
        <Button
          size="icon-sm"
          variant={active === "query" ? "default" : "ghost"}
          onClick={() => {
            if (position === "top") {
              setActivePanel(s => {
                return { top: "query", bottom: s.bottom === "query" ? s.top : s.bottom }
              })
            } else {
              setActivePanel(s => {
                return { bottom: "query", top: s.bottom === "query" ? s.bottom : s.top }
              })
            }
          }}>
          <DatabaseIcon />
        </Button>
        <Button
          size="icon-sm"
          variant={active === "table" ? "default" : "ghost"}
          onClick={() => {
            if (position === "top") {
              setActivePanel(s => {
                return { top: "table", bottom: s.bottom === "table" ? s.top : s.bottom }
              })
            } else {
              setActivePanel(s => {
                return { bottom: "table", top: s.bottom === "table" ? s.bottom : s.top }
              })
            }
          }}>
          <TableIcon />
        </Button>
        <Button
          size="icon-sm"
          variant={active === "plot" ? "default" : "ghost"}
          onClick={() => {
            if (position === "top") {
              setActivePanel(s => {
                return { top: "plot", bottom: s.bottom === "plot" ? s.top : s.bottom }
              })
            } else {
              setActivePanel(s => {
                return { bottom: "plot", top: s.bottom === "plot" ? s.bottom : s.top }
              })
            }
          }}>
          <ChartLineIcon />
        </Button>
      </div>
    )
  }

  if (activePanel[position] === "query") {
    return (
      <div className="flex h-full">
        <CodeBox />
        <Selector active="query" />
      </div>
    )
  }
  if (activePanel[position] === "table") {
    return (
      <div className="flex h-full overflow-auto" ref={ref}>
        {queryAnswerArrow ? (
          <div className="grow">
            <DataTable
              height={height - 2 + "px"}
              columns={Table2Column(queryAnswerArrow)}
              data={Table2Data(queryAnswerArrow)}
            />
            <div className="absolute bottom-1 right-1">
              <Badge>{queryAnswerArrow.numRows} row(s)</Badge>
            </div>
          </div>
        ) : (
          <p className="grow">Execute a query first</p>
        )}
        <Selector active="table" />
      </div>
    )
  }
  if (activePanel[position] === "plot") {
    return (
      <div className="flex h-full">
        {queryAnswerArrow ? <PlotBuilder data={queryAnswerArrow} /> : <p className="grow">Execute a query first</p>}
        <Selector active="plot" />
      </div>
    )
  }

  return null
}
