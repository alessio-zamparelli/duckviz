import { TreeDataItem } from "@/components/ui/tree-view"
import { atom } from "jotai"
import { atomWithImmer } from "jotai-immer"

export const isLoadingAtom = atom(false)
export type panelType = "query" | "table" | "plot"
export const activePanelAtom = atom<{ top: panelType; bottom: panelType }>({ top: "query", bottom: "table" })
export const isPlotPanelActiveAtom = atom(
  get => get(activePanelAtom).bottom === "plot" || get(activePanelAtom).bottom === "plot"
)

export const treeAtom = atomWithImmer<TreeDataItem[]>([
  { id: "external", name: "Externals", children: [] },
  { id: "memory", name: "Memory DB", children: [] },
])
