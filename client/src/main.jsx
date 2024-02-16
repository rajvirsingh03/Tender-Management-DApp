import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { Sepolia } from "@thirdweb-dev/chains";
import "./index.css";
import { TransactionProvider } from "./context/TransactionContext";

// This is the chain your dApp will work on.
// Change this to the chain your app is built for.
// You can also import additional chains from @thirdweb-dev/chains and pass them directly.
//const activeChain = "ethereum";

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <ThirdwebProvider
      clientId="a514b51e06ccce41b59d5dc637c7a5b3"
      activeChain={Sepolia}
    >
    <TransactionProvider>
      <App />
    </TransactionProvider>
    </ThirdwebProvider>
  </React.StrictMode>
);