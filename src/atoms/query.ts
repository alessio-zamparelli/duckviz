import { Table } from "apache-arrow"
import { produce } from "immer"
import { atom } from "jotai"
import { atomWithStorage } from "jotai/utils"
import { nanoid } from "nanoid"
import { type Dictionary } from "ts-essentials"

import { QUERY_TYPE } from "@/types/query"

const defQuery = `select 
  'lineY' as type, 
  'titolo' as title, 
  current_date + x::int as x, 
  random()*10 as y1,
  random()*10 as y2
  from generate_series(1,100) v(x);`

// export const queryListAtom = (key: QUERY_TYPE["id"], initialValue: QUERY_TYPE) => {
//   const baseAtom = atom([initialValue])
//   baseAtom.onMount = setValue => {
//     ;(async () => {
//       const item = await getQueries()
//       setValue(item ?? [{ id: nanoid(), title: "query1", text: defQuery }])
//     })()
//   }
//   const derivedAtom = atom(
//     get => get(baseAtom),
//     (get, set, update) => {
//       const nextValue = typeof update === "function" ? update(get(baseAtom)) : update
//       set(baseAtom, nextValue)
//       setQueries(nextValue)
//     }
//   )
//   return derivedAtom
// }

export const queryListIdxAtom = atomWithStorage("queryListIdxAtom", 0, undefined, { getOnInit: true })
export const queryListAtom = atomWithStorage<QUERY_TYPE[]>(
  "queryListAtom",
  [{ id: nanoid(), title: "query1", text: defQuery }],
  undefined,
  {
    getOnInit: true,
  }
)

export const queryTextAtom = atom(
  get => get(queryListAtom)[get(queryListIdxAtom)].text,
  (get, set, newText: string | ((s: string) => string)) =>
    set(queryListAtom, s =>
      produce(s, draftState => {
        if (typeof newText === "function") {
          draftState[get(queryListIdxAtom)].text = newText(draftState[get(queryListIdxAtom)].text)
        } else {
          draftState[get(queryListIdxAtom)].text = newText
        }
      })
    )
)
// export const queryTextAtom = atom(
//   async get => {
//     const idx = get(queryListIdxAtom)
//     const q = await getQuery(idx.toString())
//     return q?.text ?? ""
//   },
//   (get, set, newText: string) =>
//     set(queryListAtom, s =>
//       produce(s, draftState => {
//         draftState[get(queryListIdxAtom)].text = newText
//       })
//     )
// )

// export const queryTextAtom = atomWithStorage(
//   "queryText",
//   `select
//   'lineY' as type,
//   'titolo' as title,
//   current_date + x::int as x,
//   random()*10 as y1,
//   random()*10 as y2
//   from generate_series(1,100) v(x)`,
//   undefined,
//   { getOnInit: true }
// )
export const queryAnswerAtom = atom<Dictionary<never>>()

export const queryAnswerArrowAtom = atom<Table>()

// export const queryListAtom = (key: QUERY_TYPE["id"], initialValue: QUERY_TYPE) => {
//   const baseAtom = atom(initialValue)
//   baseAtom.onMount = setValue => {
//     ;(async () => {
//       const item = await getQuery(key)
//       setValue(item ?? { id: nanoid(), title: "query1", text: defQuery })
//     })()
//   }
//   const derivedAtom = atom(
//     get => get(baseAtom),
//     (get, set, update) => {
//       const nextValue = typeof update === "function" ? update(get(baseAtom)) : update
//       set(baseAtom, nextValue)
//       setQuery(key, nextValue)
//     }
//   )
//   return derivedAtom
// }
