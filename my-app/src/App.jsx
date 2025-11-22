import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Importando as páginas
import Home from './pages/Home/Home';
import Clients from './pages/Clients/Clients';
import Products from './pages/Products/Products';
import NewRomaneio from './pages/NewRomaneio/NewRomaneio';
import History from './pages/History/History';
import Company from './pages/Company/Company';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Define qual componente aparece em qual caminho (path) */}
        <Route path="/" element={<Home />} />
        <Route path="/clientes" element={<Clients />} />
        <Route path="/produtos" element={<Products />} />
        <Route path="/novo-romaneio" element={<NewRomaneio />} />
        <Route path="/historico" element={<History />} />
        <Route path="/empresa" element={<Company />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;