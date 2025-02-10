import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.scss";
import "./tailwind.css"; // Import the Tailwind CSS file
import { PusherProvider } from "./context/PusherContext.jsx";
import { ReceivedOrderProvider } from "./context/ReceivedOrderContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ReceivedOrderProvider>
      <PusherProvider>
        <App />
      </PusherProvider>
    </ReceivedOrderProvider>
  </React.StrictMode>
);
