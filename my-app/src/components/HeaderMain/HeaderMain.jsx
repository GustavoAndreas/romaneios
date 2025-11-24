import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HeaderMain.css'; // Onde o CSS do HeaderMain está definido

// 1. Importação do ícone de voltar
import iconPrevious from '../../assets/icons/previous_page_icon.svg'; 

const HeaderMain = ({ title, actionIcon, onActionClick }) => {
  const navigate = useNavigate();

  return (
    <header className="header-main-page">
      
      {/* 2. NOVO: ÍCONE DE VOLTAR PARA A HOMEPAGE (/) */}
      <img 
        src={iconPrevious} 
        alt="Voltar" 
        className="header-icon back-icon" 
        onClick={() => navigate('/')} // Navega para a Home
      />

      {/* 3. TÍTULO: Mantemos o título aqui, mas ajustamos o CSS para alinhamento */}
      <h1 className="header-title-main">{title}</h1>

      {/* SLOT DIREITO: Ícone de Ação */}
      <div className="header-slot header-right-action">
        {actionIcon && (
          <img 
            src={actionIcon} 
            alt="Ação" 
            className="header-action-icon" 
            onClick={onActionClick}
          />
        )}
      </div>
    </header>
  );
};

export default HeaderMain;