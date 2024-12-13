import { atom } from "jotai"

export const isLoadingAtom = atom(false)
export type panelType = "query" | "table" | "plot"
export const activePanelAtom = atom<{ top: panelType; bottom: panelType }>({ top: "query", bottom: "table" })
export const isPlotPanelActiveAtom = atom(
  get => get(activePanelAtom).bottom === "plot" || get(activePanelAtom).bottom === "plot"
)
