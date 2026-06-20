import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { admin, deconnexion } = useAuth();
  const navigate = useNavigate();

  const handleDeconnexion = () => {
    deconnexion();
    navigate('/login');
  };

  const liens = [
    { to: '/',            icon: '🏠', label: 'Tableau de bord' },
    { to: '/membres',     icon: '👥', label: 'Membres'         },
    { to: '/en-attente',  icon: '📥', label: 'Demandes en attente' },
    { to: '/inscription', icon: '📝', label: 'Inscription'     },
    { to: '/cotisations', icon: '💰', label: 'Cotisations'     },
    { to: '/xassida',     icon: '📚', label: 'Xassida'         },
    { to: '/medias',      icon: '🖼️',  label: 'Médiathèque'    },
    { to: '/annonces',    icon: '📢', label: 'Annonces'        },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        {/* Logo de la Daara */}
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
        <p style={{ textAlign: 'center' }}>{admin?.nom || 'Administration'}</p>
      </div>

      <ul className="sidebar-menu">
        {liens.map((lien) => (
          <li key={lien.to}>
            <NavLink
              to={lien.to}
              end={lien.to === '/'}
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

export default Sidebar;