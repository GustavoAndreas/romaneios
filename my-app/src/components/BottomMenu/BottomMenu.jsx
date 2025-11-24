import React from 'react';
import './BottomMenu.css';
import { useNavigate } from 'react-router-dom'; 

// Importação dos ícones
import iconClient from '../../assets/icons/client.svg';
import iconBeer from '../../assets/icons/beer.svg';
import iconAdd from '../../assets/icons/add.svg';
import iconHistory from '../../assets/icons/history.svg';
import iconLogo from '../../assets/icons/logo.svg';

const BottomMenu = () => {
  const navigate = useNavigate(); // Hook para navegar

  return (
    <nav className="bottom-nav">
      
      {/* 1. Clientes */}
      <div className="nav-item" onClick={() => navigate('/clientes')}>
        <img src={iconClient} alt="Clientes" className="nav-icon" />
        <span>Clientes</span>
      </div>
      
      {/* 2. Produtos */}
      <div className="nav-item" onClick={() => navigate('/produtos')}>
        <img src={iconBeer} alt="Produtos" className="nav-icon" />
        <span>Produtos</span>
      </div>
      
      {/* 3. Romaneio */}
      <div className="nav-item" onClick={() => navigate('/novo-romaneio')}>
         <img src={iconAdd} alt="Romaneio" className="nav-icon" />
         <span>Romaneio</span>
      </div>

      {/* 4. Histórico */}
      <div className="nav-item" onClick={() => navigate('/romaneios')}>
        <img src={iconHistory} alt="Histórico" className="nav-icon" />
        <span>Histórico</span>
      </div>
      
      {/* 5. Logo (Ao clicar volta para a Home) */}
      <div className="nav-item logo-item" onClick={() => navigate('/empresa')}> 
        <img src={iconLogo} alt="5 Beer" className="nav-logo" />
      </div>
      
    </nav>
  );
};

export default BottomMenu;