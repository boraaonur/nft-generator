import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import { ChakraProvider } from "@chakra-ui/react";

/*
const rootElement = document.createElement('div');
rootElement.id = 'nft-generator-plugin';
document.body.appendChild(rootElement);

document.addEventListener('DOMContentLoaded', function () {
  const root = ReactDOM.createRoot(rootElement);

  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});
*/

document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("root")!;
  const root = ReactDOM.createRoot(container);
  root.render(
    <ChakraProvider>
      <App />
    </ChakraProvider>
  );
});
