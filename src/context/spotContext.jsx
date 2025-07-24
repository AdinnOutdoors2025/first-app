import { createContext, useState, useContext } from "react";

// Create the context
const SpotContext = createContext();

// Context Provider
export const SpotProvider = ({ children }) => {
  const [selectedSpot, setSelectedSpot] = useState(null);

  return (
    <SpotContext.Provider value={{ selectedSpot, setSelectedSpot }}>
      {children}
    </SpotContext.Provider>
  );
};

// Custom hook to use context
export const useSpot = () => useContext(SpotContext);


