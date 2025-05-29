import { createStore, del, entries, get, keys, set } from "idb-keyval"

// const customStore3 = createStore('db3', 'keyval');
const filesStore = createStore("files", "keyval")

export const setFile = (name: IDBValidKey, file: File) => set(name, file, filesStore)
export const getFile = (name: IDBValidKey) => get(name, filesStore)
export const getAllFileNames = () => keys(filesStore)
export const deleteFile = (name: IDBValidKey) => del(name, filesStore)
export const filesEntries = () => entries<string, File>(filesStore)

// const queryStore = createStore("query", "keyval")
// // export const getQueries = () => get("q", queryStore)
// // export const setQueries = (queries: QUERY_TYPE[]) => set("q", queries, queryStore)
// // export const deleteQueries = () => del("q", queryStore)

// export const setQuery = (id: QUERY_TYPE["id"], query: QUERY_TYPE) => set(id, query, queryStore)
// export const getQuery = (id: QUERY_TYPE["id"]) => get<QUERY_TYPE>(id, queryStore)
// export const getQueries = () => values<QUERY_TYPE>(queryStore)
// export const getQueryNames = () => keys<QUERY_TYPE["id"]>(queryStore)
// export const deleteQuery = (id: QUERY_TYPE["id"]) => del(id, queryStore)
// export const queryEntries = () => entries<QUERY_TYPE["id"], QUERY_TYPE>(queryStore)
