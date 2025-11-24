// src/pages/Romaneio/Romaneios.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { gerarPDFRomaneio } from '../../utils/RomaneioPDF';

import BottomMenu from '../../components/BottomMenu/BottomMenu';
import HeaderMain from '../../components/HeaderMain/HeaderMain';

import './Romaneio.css';

import iconPlus from '../../assets/icons/add.svg';
import iconPrint from '../../assets/icons/print.svg'; // ícone de compartilhar/print

import { db } from '../../firebase';
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  doc,
  getDoc,
} from 'firebase/firestore';

function Romaneios() {
  const navigate = useNavigate();

  const [romaneios, setRomaneios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [empresa, setEmpresa] = useState(null);

  // Carrega romaneios reais do Firestore
  useEffect(() => {
    const q = query(collection(db, 'romaneios'), orderBy('clienteNome'));

    const unsub = onSnapshot(
      q,
      (snap) => {
        const list = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));
        setRomaneios(list);
        setLoading(false);
      },
      (err) => {
        console.error('Erro ao buscar romaneios:', err);
        setLoading(false);
      }
    );

    return () => unsub();
  }, []);

  // Carrega dados da empresa (config/empresa)
  useEffect(() => {
    async function loadEmpresa() {
      try {
        const ref = doc(db, 'config', 'empresa');
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setEmpresa(snap.data());
        }
      } catch (err) {
        console.error('Erro ao carregar dados da empresa:', err);
      }
    }
    loadEmpresa();
  }, []);

  // Ordena por clienteNome → data desc
  const sortedRomaneios = [...romaneios].sort((a, b) => {
    const byClient = (a.clienteNome || '').localeCompare(b.clienteNome || '');
    if (byClient !== 0) return byClient;

    const dateA = new Date(a.data || '1970-01-01');
    const dateB = new Date(b.data || '1970-01-01');
    return dateB - dateA; // mais recente primeiro
  });

  // Gera uma sequência de "pedido" por cliente (1, 2, 3...)
  const withPedidoSeq = [];
  const contadorPorCliente = {};

  sortedRomaneios.forEach((r) => {
    const nome = r.clienteNome || '—';
    if (!contadorPorCliente[nome]) contadorPorCliente[nome] = 0;
    contadorPorCliente[nome] += 1;

    withPedidoSeq.push({
      ...r,
      pedidoSeq: contadorPorCliente[nome],
    });
  });

  return (
    <div className="page-container">
      <HeaderMain
        title="Romaneios"
        actionIcon={iconPlus}
        onActionClick={() => navigate('/novo-romaneio')}
      />

      <main className="romaneios-content">
        {loading && <p>Carregando romaneios...</p>}

        {!loading && withPedidoSeq.length === 0 && (
          <p>Nenhum romaneio cadastrado ainda.</p>
        )}

        {!loading && withPedidoSeq.length > 0 && (
          <div className="romaneios-table">
            {/* Cabeçalho */}
            <div className="romaneios-header-row">
              <span className="col-cliente">Cliente</span>
              <span className="col-pedido">Pedido</span>
              <span className="col-data">Data</span>
              <span className="col-acao"></span>
            </div>

            {/* Linhas */}
            {withPedidoSeq.map((r) => (
              <div key={r.id} className="romaneios-row">
                {/* Cliente clicável → editar romaneio */}
                <span
                  className="col-cliente col-cliente-clickable"
                  onClick={() => navigate(`/romaneios/editar/${r.id}`)}
                >
                  {r.clienteNome || '—'}
                </span>

                <span className="col-pedido">{r.pedidoSeq}</span>
                <span className="col-data">
                  {r.data
                    ? new Date(r.data).toLocaleDateString('pt-BR')
                    : '—'}
                </span>

                {/* Botão de ação: compartilhar/gerar PDF */}
                <span className="col-acao">
                  <button
                    className="romaneio-share-btn"
                    type="button"
                    onClick={() => empresa && gerarPDFRomaneio(r, empresa)}
                    title="Compartilhar romaneio"
                  >
                    <img
                      src={iconPrint}
                      alt="Compartilhar romaneio"
                      className="share-icon"
                    />
                  </button>
                </span>
              </div>
            ))}
          </div>
        )}

        <div style={{ height: '100px' }} />
      </main>

      <BottomMenu />
    </div>
  );
}

export default Romaneios;
