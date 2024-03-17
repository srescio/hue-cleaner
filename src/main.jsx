import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { HueContextProvider } from "./Context";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HueContextProvider>
      <App />
    </HueContextProvider>
  </React.StrictMode>,
);
