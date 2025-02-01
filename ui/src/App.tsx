import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import { useEffect, useState } from 'react';
import { createContext } from 'react';
import { Outlet } from 'react-router';
import { PanelPosition } from './models/panelPosition';

export const DocumentationContext = createContext(null as string | null);
export const PanelPositionContext = createContext(null as object | null);


function App() {
  const [documentationId, setDocumentationId] = useState(null as string | null);
  const [panelPosition, setPanelPosition] = useState('');
  const [highlightResizeHandle, setHighlightResizeHandle] = useState(false);

  // When panel position changes, store in local storage
  useEffect(() => {
    if (!panelPosition) return;

    localStorage.setItem('panelPosition', panelPosition as string);
  }, [panelPosition])

  // On mount, get documentation id from root element
  useEffect(() => {
    const rootElement = document.getElementById('document-io-root');
    if (!rootElement) {
      return;
    }

    const id = rootElement.getAttribute('data-documentation-id');
    setDocumentationId(id);
    setPanelPosition(localStorage.getItem('panelPosition') ?? PanelPosition.RIGHT);

    // Hardcode documentation id for development
    if (import.meta.env.VITE_APP_ENV === 'development') {
      setDocumentationId(import.meta.env.VITE_TEST_DOCUMENTATION_ID);
    }

    return () => {
      setDocumentationId(null);
    }
  }, []);

  const handlePanelResize = (size: number) => {
    if (size < 10) {
      setHighlightResizeHandle(true);
      return;
    }
    setHighlightResizeHandle(false);
  }

  return (
    <DocumentationContext.Provider value={documentationId}>
      <PanelPositionContext.Provider value={{ panelPosition, setPanelPosition }}>
        <div data-color-mode="light" data-light-theme="light">
          <PanelGroup
            autoSaveId="document-io-panel"
            direction={panelPosition === PanelPosition.RIGHT ? "horizontal" : "vertical"}
            className={
              panelPosition == PanelPosition.RIGHT
                ? 'fixed group top-0 left-0 pointer-events-none active:pointer-events-auto'
                : "fixed group bottom-0 left-0 pointer-events-none active:pointer-events-auto"
            }
            style={
              panelPosition == PanelPosition.RIGHT
                ? {
                  minHeight: '100%', width: '100vw', zIndex: 2147483647
                }
                : {
                  minWidth: '100%', height: '100vh', zIndex: 2147483647
                }
            }
          >
            {
              panelPosition == PanelPosition.RIGHT && (
                <>
                  <Panel className='bg-transparent pointer-events-none' />

                  <PanelResizeHandle className={`w-0.5 h-full bg-slate-300 hover:bg-slate-400 
                    group-hover:bg-slate-400 transition-background duration-150 
                    pointer-events-auto ${highlightResizeHandle ? 'pulsing-animation' : ''}`} />

                  <Panel
                    className="px-7 py-5 w-full min-h-full bg-slate-50 
                      overflow-scroll pointer-events-auto 
                      scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent"
                    defaultSize={25}
                    style={{ overflowY: 'scroll' }}
                    onResize={handlePanelResize}
                  >
                    <Outlet />
                  </Panel>
                </>
              )
            }


            {
              panelPosition !== PanelPosition.RIGHT && (
                <>
                  <Panel className='bg-transparent pointer-events-none' />

                  <PanelResizeHandle className={`h-0.5 w-full bg-slate-300 hover:bg-slate-400 
                    group-hover:bg-slate-400 transition-background duration-150 
                    pointer-events-auto ${highlightResizeHandle ? 'pulsing-animation' : ''}`} />

                  <Panel
                    className="py-2 px-20 max-w-full h-full bg-slate-50 
                    overflow-scroll pointer-events-auto
                    scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent
                    "
                    defaultSize={60}
                    style={{ overflowY: 'scroll' }}
                    onResize={handlePanelResize}
                  >
                    <Outlet />
                  </Panel>

                </>
              )
            }

          </PanelGroup>
        </div>
      </PanelPositionContext.Provider>
    </DocumentationContext.Provider >

  )
}

export default App
