import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ChakraProvider, ColorModeScript, extendTheme } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import "./index.css";

const theme = extendTheme({
  colors: {
    btn: "#011A21",
    link: "#20A2C4",
    dull_bg: "#1D1D1D",
    lessonlibg: "#716F77",
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  <BrowserRouter>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </BrowserRouter>
  // </React.StrictMode>
);
