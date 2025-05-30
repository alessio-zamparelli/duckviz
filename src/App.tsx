import { ActivePanelSelector } from "@/components/active-panel"
import { PlotConfig } from "@/components/box/plot-builder"
import { TreeBox } from "@/components/box/tree-box"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { Toaster } from "@/components/ui/sonner"

export default function App() {
  // async function handleFiles(files) {
  // 	for (const file of files) {
  // 		const blob = await file.getFile()
  // 		blob.handle = file
  // 		const text = await blob.text()

  // 		console.log(`${file.name} handled, content: ${text}`)
  // 	}
  // }

  // async function getTheFile() {
  // 	if (!("showOpenFilePicker" in window))
  // 		return alert("not supported by your browser")

  // 	const [fileHandle] = await window.showOpenFilePicker()
  // 	const file = await fileHandle.getFile()
  // 	console.log("loaded", file.name)
  // 	await db.registerFileHandle(
  // 		file.name,
  // 		file,
  // 		DuckDBDataProtocol.BROWSER_FILEREADER,
  // 		true
  // 	)
  // 	toast("File loaded " + file.name)

  // 	// if ("launchQueue" in window) {
  // 	// 	console.log("File Handling API is supported!")

  // 	// 	launchQueue.setConsumer((launchParams) => {
  // 	// 		handleFiles(launchParams.files)
  // 	// 	})
  // 	// } else {
  // 	// 	console.error("File Handling API is not supported!")
  // 	// }
  // 	// const pickerOpts = {
  // 	// 	types: [
  // 	// 		{
  // 	// 			description: "Images",
  // 	// 			accept: {
  // 	// 				"image/*": [".png", ".gif", ".jpeg", ".jpg"]
  // 	// 			}
  // 	// 		}
  // 	// 	],
  // 	// 	excludeAcceptAllOption: true,
  // 	// 	multiple: false
  // 	// }

  // 	// // open file picker
  // 	// const [fileHandle] = await window.showOpenFilePicker(pickerOpts)

  // 	// // get file contents
  // 	// console.log(fileHandle)
  // 	// // const fileData = await fileHandle.getFile()
  // 	// // return fileData
  // }

  return (
    <>
      {/* <NavBar /> */}

      <ResizablePanelGroup direction="horizontal" className="h-full">
        <ResizablePanel defaultSize={20}>
          <TreeBox />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={80}>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={50}>
              <ActivePanelSelector position="top" />
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={50}>
              <ActivePanelSelector position="bottom" />
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>

      <Toaster />

      <PlotConfig />
    </>
  )
}

// return (
// <>
/* <div>
				<a href="https://vite.dev" target="_blank">
					<img src={viteLogo} className="logo" alt="Vite logo" />
				</a>
				<a href="https://react.dev" target="_blank">
					<img src={reactLogo} className="logo react" alt="React logo" />
				</a>
			</div>
			<h1>Vite + React</h1>
			<div className="card">
				<Button
					onClick={() => {
						setCount((count) => count + 1)
						// Basic query
						async function a() {
							console.log("Basic query")
							let q = await conn.query(`
                SELECT count(*)::INTEGER as v
                FROM generate_series(0, 100) t(v)`) 
							console.log("Query result (Arrow Table):", JSON.parse(JSON.stringify(q.toArray())))
						}
            a()
					}}
				>
					count is {count}
				</Button>
				<p>
					Edit <code>src/App.tsx</code> and save to test HMR
				</p>
			</div>
			<p className="read-the-docs">
				Click on the Vite and React logos to learn more
			</p> */
// </>
// )
