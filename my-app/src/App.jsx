import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Importando as páginas
import Home from './pages/Home/Home';
import Clients from './pages/Clients/Clients';
import Products from './pages/Products/Products';
import NewProduct from './pages/NewProduct/NewProduct';
import NewRomaneio from './pages/NewRomaneio/NewRomaneio';
import Company from './pages/Company/Company';
import NewClient from './pages/NewClient/NewClient';
import Romaneios from './pages/Romaneio/Romaneio';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Define qual componente aparece em qual caminho (path) */}
        <Route path="/" element={<Home />} />
        <Route path="/clientes" element={<Clients />} />
        <Route path="/clientes/novo" element={<NewClient />} />
        <Route path="/clientes/editar/:id" element={<NewClient />} />

        <Route path="/produtos" element={<Products />} />
        <Route path="/produtos/novo" element={<NewProduct />} />
        <Route path="/produtos/editar/:id" element={<NewProduct />} />

        <Route path="/romaneios" element={<Romaneios />} />
        <Route path="/novo-romaneio" element={<NewRomaneio />} />
        <Route path="/romaneios/editar/:id" element={<NewRomaneio />} />

        <Route path="/empresa" element={<Company />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;