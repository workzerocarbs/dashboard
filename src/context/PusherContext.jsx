import Pusher from "pusher-js";
import { createContext, useContext, useEffect, useState } from "react";

const PusherContext = createContext();

function PusherProvider({ children }) {
  const [pusherInstance, setPusherInstance] = useState(null);
  useEffect(function () {
    const pusher = new Pusher("c2d5f90e286a2805d66d", {
      cluster: "ap2", // Specifies the cluster that Pusher app is hosted in, "ap2" is the Asia-Pacific region
      forceTLS: true, // Ensures the connection is encrypted and secure
      logToConsole: true, // Enables debug logs in console FIXME -> Remove in production
    });
    setPusherInstance(pusher);

    // Disconnects pusher instance when component unmounts
    return () => {
      pusher.disconnect();
    };
  }, []);

  return (
    <PusherContext.Provider value={pusherInstance}>
      {children}
    </PusherContext.Provider>
  );
}

function usePusher() {
  const context = useContext(PusherContext);
  if (context === undefined)
    throw new Error("PusherProvider was used outside of PusherContext");

  return context;
}

export { PusherProvider, usePusher };
