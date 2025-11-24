// src/components/HeaderSub/HeaderSub.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HeaderSub.css';

import iconPrevious from '../../assets/icons/previous_page_icon.svg';

// title: texto no centro
// backPath: rota para onde o botão de voltar deve levar (ex: "/clientes")
const HeaderSub = ({ title, backPath = -1 }) => {
  const navigate = useNavigate();

  function handleBack() {
    if (backPath === -1) {
      navigate(-1);            // volta uma página no histórico
    } else {
      navigate(backPath);      // vai para a rota indicada
    }
  }

  return (
    <header className="header-sub-page">
      {/* Lado esquerdo: ícone de voltar */}
      <div className="header-slot header-left">
        <img
          src={iconPrevious}
          alt="Voltar"
          className="header-icon"
          onClick={handleBack}
        />
      </div>

      {/* Título central */}
      <h1 className="header-title">{title}</h1>

      {/* Espaço direito vazio só para balancear o layout */}
      <div className="header-slot header-right-spacer" />
    </header>
  );
};

export default HeaderSub;
