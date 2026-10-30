import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { StoreProvider } from "@/store/StoreProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";
import App from "./App";
import "./index.css";
const rootElement = document.getElementById("root");
if (rootElement) {
    ReactDOM.createRoot(rootElement).render(<React.StrictMode>
      <StoreProvider>
        <TooltipProvider>
          <BrowserRouter>
            <App />
            <Toaster richColors position="top-right"/>
          </BrowserRouter>
        </TooltipProvider>
      </StoreProvider>
    </React.StrictMode>);
}
