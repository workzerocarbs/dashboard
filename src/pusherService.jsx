// PusherContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import Pusher from 'pusher-js';

const PusherContext = createContext();

export const PusherProvider = ({ children }) => {
  const [pusherInstance, setPusherInstance] = useState(null);

  useEffect(() => {
    const pusher = new Pusher('c2d5f90e286a2805d66d', {
      cluster: 'ap2',
      encrypted: true,
      forceTLS: true,
      logToConsole: true, // Enables logging
    });
    
    setPusherInstance(pusher);

    // Cleanup on unmount
    return () => {
      pusher.disconnect();
    };
  }, []);

  return (
    <PusherContext.Provider value={pusherInstance}>
      {children}
    </PusherContext.Provider>
  );
};

// Custom hook for accessing Pusher from any component
export const usePusher = () => {
  return useContext(PusherContext);
};
