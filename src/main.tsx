import "./index.css"

import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import { ThemeProvider } from "@/components/theme-provider.tsx"

import App from "./App.tsx"

// import { DuckDBPlatform } from "@/lib/duck/platform_provider.tsx"
// import { DuckDBProvider } from "@/lib/duck/database_provider.tsx"
// import { DuckDBConnectionProvider } from "@/lib/duck/connection_provider.tsx"

// import * as duckdb from "@duckdb/duckdb-wasm"

// const logger = new duckdb.ConsoleLogger(duckdb.LogLevel.WARNING)

// import duckdb_wasm from "@duckdb/duckdb-wasm/dist/duckdb-mvp.wasm"
// import duckdb_wasm_eh from "@duckdb/duckdb-wasm/dist/duckdb-eh.wasm"
// import duckdb_wasm_coi from "@duckdb/duckdb-wasm/dist/duckdb-coi.wasm"

// const DUCKDB_BUNDLES: duckdb.DuckDBBundles = {
// 	mvp: {
// 		mainModule: duckdb_wasm,
// 		mainWorker: new URL(
// 			"@duckdb/duckdb-wasm/dist/duckdb-browser-mvp.worker.js",
// 			import.meta.url
// 		).toString()
// 	},
// 	eh: {
// 		mainModule: duckdb_wasm_eh,
// 		mainWorker: new URL(
// 			"@duckdb/duck	db-wasm/dist/duckdb-browser-eh.worker.js",
// 			import.meta.url
// 		).toString()
// 	},
// 	coi: {
// 		mainModule: duckdb_wasm_coi,
// 		mainWorker: new URL(
// 			"@duckdb/duckdb-wasm/dist/duckdb-browser-coi.worker.js",
// 			import.meta.url
// 		).toString(),
// 		pthreadWorker: new URL(
// 			"@duckdb/duckdb-wasm/dist/duckdb-browser-coi.pthread.worker.js",
// 			import.meta.url
// 		).toString()
// 	}
// }

createRoot(document.getElementById("root")!).render(
  // <DuckDBPlatform logger={logger} bundles={DUCKDB_BUNDLES}>
  // 	<DuckDBProvider>
  // 		<DuckDBConnectionProvider>
  <StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="theme">
      <App />
    </ThemeProvider>
  </StrictMode>,
  /* </DuckDBConnectionProvider>
		</DuckDBProvider>
	</DuckDBPlatform> */
)
