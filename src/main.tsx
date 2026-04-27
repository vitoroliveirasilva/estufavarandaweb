import React from "react";
import { createRoot } from "react-dom/client";

import { Providers } from "@/app/providers";

import "@/index.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Elemento raiz #root não encontrado. Verifique o arquivo index.html.");
}

createRoot(rootElement).render(
  <React.StrictMode>
    <Providers />
  </React.StrictMode>,
);
