// export * from "./connection_provider"
// export * from "./database_provider"
// export * from "./platform_provider"
// export * from "./resolvable"

import * as duckdb from '@duckdb/duckdb-wasm';
// import duckdb_wasm from '@duckdb/duckdb-wasm/dist/duckdb-mvp.wasm?url';
// import mvp_worker from '@duckdb/duckdb-wasm/dist/duckdb-browser-mvp.worker.js?url';
// import duckdb_wasm_eh from '@duckdb/duckdb-wasm/dist/duckdb-eh.wasm?url';
// import eh_worker from '@duckdb/duckdb-wasm/dist/duckdb-browser-eh.worker.js?url';

// const MANUAL_BUNDLES: duckdb.DuckDBBundles = {
// 	mvp: {
// 			mainModule: duckdb_wasm,
// 			mainWorker: mvp_worker,
// 	},
// 	eh: {
// 			mainModule: duckdb_wasm_eh,
// 			mainWorker: eh_worker,
// 	},
// };

// Select a bundle based on browser checks
// const bundle = await duckdb.selectBundle(MANUAL_BUNDLES)


const JSDELIVR_BUNDLES = duckdb.getJsDelivrBundles();

// Select a bundle based on browser checks
const bundle = await duckdb.selectBundle(JSDELIVR_BUNDLES);

const worker_url = URL.createObjectURL(
  new Blob([`importScripts("${bundle.mainWorker!}");`], {type: 'text/javascript'})
);

// Instantiate the asynchronus version of DuckDB-wasm
// const worker = new Worker(bundle.mainWorker!)
const worker = new Worker(worker_url);
const logger = new duckdb.ConsoleLogger()
export const db = new duckdb.AsyncDuckDB(logger, worker)
await db.instantiate(bundle.mainModule, bundle.pthreadWorker)

export const conn = await db.connect() // Connect to db

export async function closeConn() {
	// Closing everything
	await conn.close()
	await db.terminate()
	worker.terminate()
}

