import React, { createContext, useState, useContext, useEffect } from 'react';

const MembreAuthContext = createContext();

export const MembreAuthProvider = ({ children }) => {
  const [membre, setMembre]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token      = localStorage.getItem('membre_token');
    const membreData = localStorage.getItem('membre_data');
    if (token && membreData) {
      setMembre(JSON.parse(membreData));
    }
    setLoading(false);
  }, []);

  const connexionMembre = (token, membreData) => {
    localStorage.setItem('membre_token', token);
    localStorage.setItem('membre_data', JSON.stringify(membreData));
    setMembre(membreData);
  };

  const deconnexionMembre = () => {
    localStorage.removeItem('membre_token');
    localStorage.removeItem('membre_data');
    setMembre(null);
  };

  return (
    <MembreAuthContext.Provider value={{ membre, connexionMembre, deconnexionMembre, loading }}>
      {children}
    </MembreAuthContext.Provider>
  );
};

export const useMembreAuth = () => useContext(MembreAuthContext);