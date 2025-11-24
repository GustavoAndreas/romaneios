// src/pages/Clients/Clients.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import BottomMenu from '../../components/BottomMenu/BottomMenu';
import HeaderMain from '../../components/HeaderMain/HeaderMain';
import './Clients.css';

import iconUserAdd from '../../assets/icons/user-add.svg';
import iconTrash from '../../assets/icons/trash.svg';

import { db } from '../../firebase';
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  doc,
  deleteDoc,
} from 'firebase/firestore';

function Clients() {
  const navigate = useNavigate();

  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  // Busca os clientes reais do Firestore em tempo real
  useEffect(() => {
    const q = query(collection(db, 'clientes'), orderBy('nome'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map((docSnap) => ({
          id: docSnap.id, // id do documento no Firestore
          ...docSnap.data(), // nome, cnpj, etc.
        }));
        setClients(list);
        setLoading(false);
      },
      (error) => {
        console.error('Erro ao buscar clientes:', error);
        setLoading(false);
      }
    );

    // limpa o listener quando o componente desmontar
    return () => unsubscribe();
  }, []);

  async function handleDeleteClient(client) {
    const confirmado = window.confirm(
      `Tem certeza que deseja apagar o cliente "${client.nome}"? Essa ação não pode ser desfeita.`
    );

    if (!confirmado) return;

    try {
      await deleteDoc(doc(db, 'clientes', client.id));
      alert('Cliente apagado com sucesso!');
    } catch (err) {
      console.error('Erro ao apagar cliente:', err);
      alert('Erro ao apagar cliente. Veja o console.');
    }
  }

  return (
    <div className="page-container">
      {/* CABEÇALHO PRINCIPAL */}
      <HeaderMain
        title="Clientes"
        actionIcon={iconUserAdd}
        onActionClick={() => navigate('/clientes/novo')}
      />

      {/* LISTA DE CARDS */}
      <div className="client-list">
        {loading && <p>Carregando clientes...</p>}

        {!loading && clients.length === 0 && (
          <p>Nenhum cliente cadastrado ainda.</p>
        )}

        {!loading &&
          clients.map((client) => (
            <div key={client.id} className="client-card">
              <div
                className="client-info"
                onClick={() => navigate(`/clientes/editar/${client.id}`)}
              >
                <h3>{client.nome}</h3>
                {/* Mostra CNPJ se existir */}
                {client.cnpj && <p>{client.cnpj}</p>}
              </div>

              <button
                className="delete-btn"
                type="button"
                onClick={() => handleDeleteClient(client)}
              >
                <img src={iconTrash} alt="Apagar" className="delete-icon" />
              </button>
            </div>
          ))}

        {/* Espaçador para garantir que a lista role acima do menu */}
        <div className="spacer" style={{ height: '100px' }}></div>
      </div>

      <BottomMenu />
    </div>
  );
}

export default Clients;
