import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import indexStyles from './index.css?inline';

// TODO: Separate styles for shadow dom and root in App.css
import './App.css';

// Shadow DOM specific styles
import reactContexifyStyles from "react-contexify/dist/ReactContexify.css?inline";
import reactTooltipStyles from 'react-tooltip/dist/react-tooltip.css?inline';
import reactMDEditorStyles from "@uiw/react-md-editor/markdown-editor.css?inline";
import AppStyles from './App.css?inline';



import App from './App.tsx'
import { MemoryRouter, Route, Routes } from "react-router";
import AnnotationEditView from './views/AnnotationEditView.tsx';
import AnnotationListView from './views/AnnotationListView.tsx';
import SampleSite from '../samples/SampleSite.tsx';
import AnnotationAddView from './views/AnnotationAddView.tsx';
import AnnotationDetailsView from './views/AnnotationDetailsView.tsx';

// If in development mode, render the sample website for testing
if (import.meta.env.VITE_APP_ENV === 'development') {
  document.getElementById('document-io-root')?.insertAdjacentHTML(
    "beforebegin",
    `<div id="sample-site"></div>`
  );

  createRoot(document.getElementById('sample-site')!).render(
    <SampleSite />
  )
}

const mountPoint = document.getElementById('document-io-root');
const shadowRoot = mountPoint!.attachShadow({ mode: 'open' });



const reactContexifyStyle = document.createElement("style");
reactContexifyStyle.textContent = reactContexifyStyles;
shadowRoot.appendChild(reactContexifyStyle);

const reactTooltipStyle = document.createElement("style");
reactTooltipStyle.textContent = reactTooltipStyles;
shadowRoot.appendChild(reactTooltipStyle);

const reactMDEditorStyle = document.createElement("style");
reactMDEditorStyle.textContent = reactMDEditorStyles;
shadowRoot.appendChild(reactMDEditorStyle);


const indexStyle = document.createElement("style");
indexStyle.textContent = indexStyles;
shadowRoot.appendChild(indexStyle);

const appStyle = document.createElement("style");
appStyle.textContent = AppStyles;
shadowRoot.appendChild(appStyle);

const rootContainer = document.createElement("div");
shadowRoot.appendChild(rootContainer);


createRoot(rootContainer).render(
  <StrictMode>
    <MemoryRouter>
      <Routes>
        <Route element={<App />}>
          <Route path="/" element={<AnnotationListView />} />
          <Route path="/add" element={<AnnotationAddView />} />
          <Route path="/:id" element={<AnnotationDetailsView />} />
          <Route path="/:id/edit" element={<AnnotationEditView />} />
        </Route>
      </Routes>
    </MemoryRouter>
  </StrictMode>
)

