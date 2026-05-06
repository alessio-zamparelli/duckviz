import { ActivePanelSelector } from '@/components/active-panel'
import { PlotConfig } from '@/components/box/plot-builder'
import { TreeBox } from '@/components/box/tree-box'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { Toaster } from '@/components/ui/sonner'

export default function App() {
  return (
    <>
      <ResizablePanelGroup
        orientation='horizontal'
        className='h-full'
        onLayoutChanged={() => void window.dispatchEvent(new Event('resize'))}>
        <ResizablePanel defaultSize={20}>
          <TreeBox />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={80}>
          <ResizablePanelGroup
            orientation='vertical'
            onLayoutChanged={() => void window.dispatchEvent(new Event('resize'))}>
            <ResizablePanel defaultSize={50}>
              <ActivePanelSelector position='top' />
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={50}>
              <ActivePanelSelector position='bottom' />
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>

      <Toaster />
      <PlotConfig />
    </>
  )
}
