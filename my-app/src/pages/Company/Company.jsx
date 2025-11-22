import React from 'react';
import BottomMenu from '../../components/BottomMenu/BottomMenu';

function Company() {
  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', color: 'white', padding: '20px' }}>
      <h1>Dados da Empresa</h1>
      <p style={{ marginTop: '10px' }}>
        Aqui criaremos o formulário para editar os dados da 5Beer 
        (CNPJ, Endereço, Telefone) que aparecerão no cabeçalho do PDF.
      </p>
      
      {/* O Menu continua aqui para navegar para outras áreas */}
      <BottomMenu />
    </div>
  );
}

export default Company;