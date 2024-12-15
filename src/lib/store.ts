/* eslint-disable @typescript-eslint/no-explicit-any */

import { createStore, del, entries, get, keys, set } from "idb-keyval"

// const customStore3 = createStore('db3', 'keyval');
const filesStore = createStore("files", "keyval")

export const setFile = (name: IDBValidKey, file: any) => set(name, file, filesStore)
export const getFile = (name: IDBValidKey) => get(name, filesStore)
export const getAllFileNames = () => keys(filesStore)
export const deleteFile = (name: IDBValidKey) => del(name, filesStore)
export const filesEntries = () => entries<string, File>(filesStore)
