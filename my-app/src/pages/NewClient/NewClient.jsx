import React from 'react';
import BottomMenu from '../../components/BottomMenu/BottomMenu'; // Importe o menu em todas por enquanto

function NewClient() {
  return (
    <div style={{ color: 'white', padding: '50px' }}>
      <h1>Tela de Clientes</h1>
      <BottomMenu />
    </div>
  );
}
export default NewClient;