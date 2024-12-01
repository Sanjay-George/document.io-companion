import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import { Card, CardBody, CardFooter, CardHeader, Divider, Image, Link } from '@nextui-org/react'
import { MDXEditor, UndoRedo, BoldItalicUnderlineToggles, toolbarPlugin } from '@mdxeditor/editor'
import ButtonPrimary from './components/ButtonPrimary'
import RightArrowIcon from './components/icons/RightArrowIcon'
import H2 from './components/H2';
import './App.css';
import '@mdxeditor/editor/style.css'
import LeftArrowIcon from './components/icons/LeftArrowIcon'
import Sidebar from './components/Sidebar';


function App() {

  const documentation = {
    title: 'NextUI Intro',
    url: 'https://nextui.org'
  }

  return (
    <div>

      {/* TODO: (Remove) Background website for TESTING */}
      <div className='w-full h-full absolute top-0 left-0'>
        <iframe src={documentation.url} style={{ width: '100%', height: '100%' }}></iframe>
      </div>

      {/* Panel in foreground */}
      <PanelGroup direction="horizontal"
        className='fixed top-0 left-0 pointer-events-none active:pointer-events-auto'
        style={{
          minHeight: '100%', width: '100vw', zIndex: 2147483647
        }}
      >
        <Panel className="px-7 py-5 w-full min-h-full bg-slate-50
         overflow-scroll pointer-events-auto" defaultSize={30}>
          <Sidebar />
        </Panel>

        <PanelResizeHandle className="w-1.5 h-full bg-slate-200 hover:bg-slate-300 transition-background duration-150 pointer-events-auto" />

        <Panel className='bg-transparent pointer-events-none' />

      </PanelGroup>
    </div>

  )
}

export default App
