import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { NextUIProvider } from "@nextui-org/react";
import { BrowserRouter, Route, Routes } from "react-router";
import AnnotationEditorView from './views/AnnotationEditorView.tsx';
import AnnotationListView from './views/AnnotationListView.tsx';


createRoot(document.getElementById('document-io-root')!).render(
  <StrictMode>
    <NextUIProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<App />}>
            <Route path="/" element={<AnnotationListView />} />
            <Route path="/editor/:id" element={<AnnotationEditorView />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </NextUIProvider>
  </StrictMode>,
)
