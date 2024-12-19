import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import { useEffect, useState } from 'react';
import { createContext } from 'react';

// Import CSS files
import './App.css';
import { Outlet } from 'react-router';

export const DocumentationContext = createContext(null as string | null);
export const PanelPositionContext = createContext(null as object | null);

function App() {
  const [documentationId, setDocumentationId] = useState(null as string | null);
  const [panelPosition, setPanelPosition] = useState('left');

  // On mount, get documentation id from root element
  useEffect(() => {
    const rootElement = document.getElementById('document-io-root');
    if (rootElement) {
      const id = rootElement.getAttribute('data-documentation-id');
      setDocumentationId(id);
    }

    // Set documentation id for development
    if (import.meta.env.VITE_APP_ENV === 'development') {
      setDocumentationId(import.meta.env.VITE_TEST_DOCUMENTATION_ID);
    }
  }, []);


  return (
    <DocumentationContext.Provider value={documentationId}>
      <PanelPositionContext.Provider value={{ panelPosition, setPanelPosition }}>
        <div>
          <PanelGroup
            direction={panelPosition == 'left' ? "horizontal" : "vertical"}
            className={
              panelPosition == 'left'
                ? 'fixed top-0 left-0 pointer-events-none active:pointer-events-auto'
                : "fixed bottom-0 left-0 pointer-events-none active:pointer-events-auto"
            }
            style={
              panelPosition == 'left'
                ? {
                  minHeight: '100%', width: '100vw', zIndex: 2147483647
                }
                : {
                  minWidth: '100%', height: '100vh', zIndex: 2147483647
                }
            }
          >
            {panelPosition == 'left' && (
              <>
                <Panel
                  className="px-7 py-5 w-full min-h-full bg-slate-50 overflow-scroll pointer-events-auto"
                  defaultSize={30}
                  style={{ overflowY: 'scroll' }}>
                  <Outlet />
                </Panel>

                <PanelResizeHandle className="w-1.5 h-full bg-slate-200 hover:bg-slate-300 transition-background duration-150 pointer-events-auto" />

                <Panel className='bg-transparent pointer-events-none' />
              </>
            )}


            {
              panelPosition == 'bottom' && (
                <>
                  <Panel className='bg-transparent pointer-events-none' />

                  <PanelResizeHandle className="h-1.5 w-full bg-slate-200 hover:bg-slate-300 transition-background duration-150 pointer-events-auto" />

                  <Panel
                    className="py-2 px-20 min-w-full h-full bg-slate-50 overflow-scroll pointer-events-auto"
                    defaultSize={60}
                    style={{ overflowY: 'scroll' }}>
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
