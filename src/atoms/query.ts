import { Table } from "apache-arrow"
import { atom } from "jotai"
import { atomWithStorage } from "jotai/utils"
import { type Dictionary } from "ts-essentials"

export const queryTextAtom = atomWithStorage(
  "queryText",
  `select 
  'lineY' as type, 
  'titolo' as title, 
  current_date + x::int as x, 
  random()*10 as y1,
  random()*10 as y2
  from generate_series(1,100) v(x)`,
  undefined,
  { getOnInit: true }
)
export const queryAnswerAtom = atom<Dictionary<never>>()

export const queryAnswerArrowAtom = atom<Table>()
