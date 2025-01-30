import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import styles from './index.css?inline';
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
const styleSheet = document.createElement("link");

const style = document.createElement("style");
style.textContent = styles;
shadowRoot.appendChild(style);


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

