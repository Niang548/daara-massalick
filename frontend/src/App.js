import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider, useAuth } from './context/AuthContext';
import { MembreAuthProvider, useMembreAuth } from './context/MembreAuthContext';
import Sidebar from './components/Sidebar';
import SidebarMembre from './components/SidebarMembre';

import Login        from './pages/Login';
import Dashboard     from './pages/Dashboard';
import Membres       from './pages/Membres';
import ModifierMembre from './pages/ModifierMembre';
import Inscription   from './pages/Inscription';
import Cotisations   from './pages/Cotisations';
import Xassida       from './pages/Xassida';
import Medias        from './pages/Medias';
import Annonces      from './pages/Annonces';

import CreerMotDePasse   from './pages/CreerMotDePasse';
import MembreLogin       from './pages/MembreLogin';
import MembreDashboard   from './pages/MembreDashboard';
import MembreModifierProfil from './pages/MembreModifierProfil';
import MembreXassida     from './pages/MembreXassida';
import MembreAnnonces    from './pages/MembreAnnonces';
import MembreMedias      from './pages/MembreMedias';
import MembreContact     from './pages/MembreContact';

const RouteProtegee = ({ children }) => {
  const { admin, loading } = useAuth();
  if (loading) return <div className="loader">Chargement...</div>;
  return admin ? children : <Navigate to="/login" />;
};

const RouteMembreProtegee = ({ children }) => {
  const { membre, loading } = useMembreAuth();
  if (loading) return <div className="loader">Chargement...</div>;
  return membre ? children : <Navigate to="/membre/login" />;
};

const Layout = ({ children }) => (
  <>
    <Sidebar />
    <div className="main-content">{children}</div>
  </>
);

const LayoutMembre = ({ children }) => (
  <>
    <SidebarMembre />
    <div className="main-content">{children}</div>
  </>
);

const App = () => {
  return (
    <AuthProvider>
      <MembreAuthProvider>
        <BrowserRouter>
          <ToastContainer position="top-right" autoClose={3000} />
          <Routes>
            {/* ── Routes Admin ── */}
            <Route path="/login" element={<Login />} />
            <Route path="/" element={
              <RouteProtegee><Layout><Dashboard /></Layout></RouteProtegee>
            }/>
            <Route path="/membres" element={
              <RouteProtegee><Layout><Membres /></Layout></RouteProtegee>
            }/>
            <Route path="/membres/:id/modifier" element={
              <RouteProtegee><Layout><ModifierMembre /></Layout></RouteProtegee>
            }/>
            <Route path="/inscription" element={
              <RouteProtegee><Layout><Inscription /></Layout></RouteProtegee>
            }/>
            <Route path="/cotisations" element={
              <RouteProtegee><Layout><Cotisations /></Layout></RouteProtegee>
            }/>
            <Route path="/xassida" element={
              <RouteProtegee><Layout><Xassida /></Layout></RouteProtegee>
            }/>
            <Route path="/medias" element={
              <RouteProtegee><Layout><Medias /></Layout></RouteProtegee>
            }/>
            <Route path="/annonces" element={
              <RouteProtegee><Layout><Annonces /></Layout></RouteProtegee>
            }/>

            {/* ── Routes Espace membre ── */}
            <Route path="/creer-mot-de-passe/:token" element={<CreerMotDePasse />} />
            <Route path="/membre/login" element={<MembreLogin />} />
            <Route path="/membre" element={
              <RouteMembreProtegee><LayoutMembre><MembreDashboard /></LayoutMembre></RouteMembreProtegee>
            }/>
            <Route path="/membre/modifier-profil" element={
              <RouteMembreProtegee><LayoutMembre><MembreModifierProfil /></LayoutMembre></RouteMembreProtegee>
            }/>
            <Route path="/membre/xassida" element={
              <RouteMembreProtegee><LayoutMembre><MembreXassida /></LayoutMembre></RouteMembreProtegee>
            }/>
            <Route path="/membre/annonces" element={
              <RouteMembreProtegee><LayoutMembre><MembreAnnonces /></LayoutMembre></RouteMembreProtegee>
            }/>
            <Route path="/membre/medias" element={
              <RouteMembreProtegee><LayoutMembre><MembreMedias /></LayoutMembre></RouteMembreProtegee>
            }/>
            <Route path="/membre/contact" element={
  <RouteMembreProtegee><LayoutMembre><MembreContact /></LayoutMembre></RouteMembreProtegee>
}/>
          </Routes>
        </BrowserRouter>
      </MembreAuthProvider>
    </AuthProvider>
  );
};

export default App;