import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { Sepolia } from "@thirdweb-dev/chains";
import "./index.css";

// This is the chain your dApp will work on.
// Change this to the chain your app is built for.
// You can also import additional chains from `@thirdweb-dev/chains` and pass them directly.
//const activeChain = "ethereum";

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <ThirdwebProvider
      clientId="0afd0ff52cc5d4c9cee9819e533886c8"
      activeChain={Sepolia}
    >
      <App />
    </ThirdwebProvider>
  </React.StrictMode>
);
