import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState(() => {
    const storedData = localStorage.getItem("authData");
    return storedData ? JSON.parse(storedData) : null;
  });

  useEffect(() => {
    if (authData) {
      localStorage.setItem("authData", JSON.stringify(authData));
    } else {
      localStorage.removeItem("authData");
    }
  }, [authData]);

  const logout = () => {
    setAuthData(null);
  };

  return (
    <AuthContext.Provider value={{ authData, setAuthData, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
