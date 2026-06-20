import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useMembreAuth } from '../context/MembreAuthContext';

const SidebarMembre = () => {
  const { membre, deconnexionMembre } = useMembreAuth();
  const navigate = useNavigate();

  const handleDeconnexion = () => {
    deconnexionMembre();
    navigate('/membre/login');
  };

  const liens = [
    { to: '/membre',                 icon: '🏠', label: 'Mon espace'         },
    { to: '/membre/modifier-profil', icon: '✏️', label: 'Mes informations'  },
    { to: '/membre/xassida',         icon: '📚', label: 'Xassida'           },
    { to: '/membre/annonces',        icon: '📢', label: 'Annonces'          },
    { to: '/membre/medias',          icon: '🖼️', label: 'Médiathèque'      },
    { to: '/membre/contact',         icon: '✉️', label: 'Contact'           },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <img
          src="/logo.jpg"
          alt="Logo Daara Massalick"
          style={{
            width: '70px',
            height: '70px',
            borderRadius: '50%',
            objectFit: 'cover',
            display: 'block',
            margin: '0 auto 12px auto',
            border: '2px solid #f0c040'
          }}
          onError={(e) => { e.target.style.display = 'none'; }}
        />
        <h2 style={{ textAlign: 'center' }}>Daara Massalick</h2>
        <p style={{ textAlign: 'center' }}>{membre?.prenom} {membre?.nom}</p>
      </div>

      <ul className="sidebar-menu">
        {liens.map((lien) => (
          <li key={lien.to}>
            <NavLink
              to={lien.to}
              end={lien.to === '/membre'}
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              <span className="icon">{lien.icon}</span>
              <span>{lien.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>

      <div style={{
        padding: '16px 20px',
        borderTop: '1px solid rgba(255,255,255,0.1)'
      }}>
        <button onClick={handleDeconnexion} style={{
          width: '100%', padding: '10px',
          background: 'rgba(255,255,255,0.1)',
          border: 'none', color: 'white',
          borderRadius: '8px', cursor: 'pointer', fontSize: '14px'
        }}>
          🚪 Déconnexion
        </button>
      </div>
    </div>
  );
};

export default SidebarMembre;