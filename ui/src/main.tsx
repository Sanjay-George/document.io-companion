import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { MemoryRouter, Route, Routes } from "react-router";
import AnnotationEditorView from './views/AnnotationEditorView.tsx';
import AnnotationListView from './views/AnnotationListView.tsx';
import SampleSite from '../samples/SampleSite.tsx';
import AnnotationAddView from './views/AnnotationAddView.tsx';

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

createRoot(document.getElementById('document-io-root')!).render(
  <StrictMode>
    <MemoryRouter>
      <Routes>
        <Route element={<App />}>
          <Route path="/" element={<AnnotationListView />} />
          <Route path="/add" element={<AnnotationAddView />} />
          <Route path="/edit/:id" element={<AnnotationEditorView />} />
        </Route>
      </Routes>
    </MemoryRouter>
  </StrictMode>
)

