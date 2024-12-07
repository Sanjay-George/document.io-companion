import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
// import SidePanel from './components/SidePanel';
import { useEffect, useState } from 'react';
import { createContext } from 'react';

// Import CSS files
import './App.css';
import { Outlet } from 'react-router';

export const DocumentationContext = createContext(null as string | null);

function App() {
  const [documentationId, setDocumentationId] = useState(null as string | null);

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
      <div>
        <PanelGroup direction="horizontal"
          className='fixed top-0 left-0 pointer-events-none active:pointer-events-auto'
          style={{
            minHeight: '100%', width: '100vw', zIndex: 2147483647
          }}
        >
          <Panel className="px-7 py-5 w-full min-h-full bg-slate-50
         overflow-scroll pointer-events-auto" defaultSize={30} style={{ overflowY: 'scroll' }}>
            <Outlet />
          </Panel>

          <PanelResizeHandle className="w-1.5 h-full bg-slate-200 hover:bg-slate-300 transition-background duration-150 pointer-events-auto" />

          <Panel className='bg-transparent pointer-events-none' />

        </PanelGroup>
      </div>
    </DocumentationContext.Provider >

  )
}

export default App
