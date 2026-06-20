import axios from 'axios';

const API = axios.create({
  baseURL: 'https://daara-massalick-backend.onrender.com/api',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getMembres       = (params)    => API.get('/membres', { params });
export const getMembreById    = (id)        => API.get(`/membres/${id}`);
export const creerMembre      = (data)      => API.post('/membres', data);
export const modifierMembre   = (id, data)  => API.put(`/membres/${id}`, data);
export const supprimerMembre  = (id)        => API.delete(`/membres/${id}`);
export const supprimerMembreDefinitivement = (id) => API.delete(`/membres/${id}/definitif`);

export const getCotisations       = (params)   => API.get('/cotisations', { params });
export const getStatsCotisations  = ()         => API.get('/cotisations/stats');
export const getCotisationsMembre = (id)       => API.get(`/cotisations/membre/${id}`);
export const enregistrerCotisation = (data)    => API.post('/cotisations', data);
export const modifierCotisation   = (id, data) => API.put(`/cotisations/${id}`, data);

export const getXassida       = ()     => API.get('/xassida');
export const ajouterXassida   = (data) => API.post('/xassida', data, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const supprimerXassida = (id)   => API.delete(`/xassida/${id}`);

export const getMedias      = (params) => API.get('/medias', { params });
export const ajouterMedia   = (data)   => API.post('/medias', data, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const supprimerMedia = (id)     => API.delete(`/medias/${id}`);

export const getAnnonces      = ()     => API.get('/annonces');
export const creerAnnonce     = (data) => API.post('/annonces', data);
export const supprimerAnnonce = (id)   => API.delete(`/annonces/${id}`);

export const login    = (data) => API.post('/auth/login', data);
export const register = (data) => API.post('/auth/register', data);
// ── Espace membre ─────────────────────────────────
export const verifierToken      = (token)       => API.get(`/membre-auth/verifier-token/${token}`);
export const creerMotDePasse    = (token, data) => API.post(`/membre-auth/creer-mot-de-passe/${token}`, data);
export const loginMembre        = (data)        => API.post('/membre-auth/login', data);
export const getMesCotisations = () => API.get('/membre-auth/mes-cotisations', {
  headers: { Authorization: `Bearer ${localStorage.getItem('membre_token')}` }
});
export const getMonProfil = () => API.get('/membre-auth/mon-profil', {
  headers: { Authorization: `Bearer ${localStorage.getItem('membre_token')}` }
});
export const modifierMonProfil = (data) => API.put('/membre-auth/mon-profil', data, {
  headers: { Authorization: `Bearer ${localStorage.getItem('membre_token')}` }
});
export const getXassidaMembre = () => API.get('/membre-auth/xassida', {
  headers: { Authorization: `Bearer ${localStorage.getItem('membre_token')}` }
});
export const getAnnoncesMembre = () => API.get('/membre-auth/annonces', {
  headers: { Authorization: `Bearer ${localStorage.getItem('membre_token')}` }
});

export const getMediasMembre = (params) => API.get('/membre-auth/medias', {
  params,
  headers: { Authorization: `Bearer ${localStorage.getItem('membre_token')}` }
});