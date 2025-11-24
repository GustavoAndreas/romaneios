// src/pages/NewRomaneio/NewRomaneio.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import BottomMenu from '../../components/BottomMenu/BottomMenu';
import HeaderSub from '../../components/HeaderSub/HeaderSub';
import './NewRomaneio.css';

import iconTrash from '../../assets/icons/trash.svg';

import { db } from '../../firebase';
import {
  collection,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  onSnapshot,
  orderBy,
  query,
  deleteDoc,
} from 'firebase/firestore';

function NewRomaneio() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  // Estados básicos
  const [clienteId, setClienteId] = useState('');
  const [data, setData] = useState('');
  const [itens, setItens] = useState([{ id: 1, produtoId: '', quantidade: '' }]);

  // Dados reais do Firestore
  const [clientes, setClientes] = useState([]);
  const [produtos, setProdutos] = useState([]);

  const [loadingRomaneio, setLoadingRomaneio] = useState(isEdit);
  const [loadingClientes, setLoadingClientes] = useState(true);
  const [loadingProdutos, setLoadingProdutos] = useState(true);
  const [saving, setSaving] = useState(false);

  // Carrega clientes reais
  useEffect(() => {
    const q = query(collection(db, 'clientes'), orderBy('nome'));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setClientes(list);
        setLoadingClientes(false);
      },
      (err) => {
        console.error('Erro ao carregar clientes:', err);
        setLoadingClientes(false);
      }
    );
    return () => unsub();
  }, []);

  // Carrega produtos reais
  useEffect(() => {
    const q = query(collection(db, 'produtos'), orderBy('nome'));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setProdutos(list);
        setLoadingProdutos(false);
      },
      (err) => {
        console.error('Erro ao carregar produtos:', err);
        setLoadingProdutos(false);
      }
    );
    return () => unsub();
  }, []);

  // Carrega romaneio ao editar
  useEffect(() => {
    if (!isEdit) {
      // no modo "novo", preenche data com hoje
      const hoje = new Date().toISOString().slice(0, 10);
      setData(hoje);
      return;
    }

    async function loadRomaneio() {
      try {
        const ref = doc(db, 'romaneios', id);
        const snap = await getDoc(ref);
        if (!snap.exists()) {
          alert('Romaneio não encontrado.');
          navigate('/romaneios');
          return;
        }

        const dataDoc = snap.data();
        setClienteId(dataDoc.clienteId || '');
        setData(dataDoc.data || '');

        if (Array.isArray(dataDoc.itens) && dataDoc.itens.length > 0) {
          setItens(
            dataDoc.itens.map((item, index) => ({
              id: index + 1,
              produtoId: item.produtoId || '',
              quantidade: String(item.quantidade || ''),
            }))
          );
        } else {
          setItens([{ id: 1, produtoId: '', quantidade: '' }]);
        }
      } catch (err) {
        console.error('Erro ao carregar romaneio:', err);
        alert('Erro ao carregar romaneio. Veja o console.');
      } finally {
        setLoadingRomaneio(false);
      }
    }

    loadRomaneio();
  }, [id, isEdit, navigate]);

  // Handlers de itens
  function handleChangeItem(index, campo, valor) {
    setItens((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, [campo]: valor } : item
      )
    );
  }

  function handleAddItem() {
    setItens((prev) => [
      ...prev,
      { id: Date.now(), produtoId: '', quantidade: '' },
    ]);
  }

  function handleRemoveItem(index) {
    setItens((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);

    try {
      const cliente = clientes.find((c) => c.id === clienteId);

      const itensEnriquecidos = itens
        .filter((item) => item.produtoId && item.quantidade)
        .map((item) => {
          const produto = produtos.find((p) => p.id === item.produtoId);
          const qtd = Number(item.quantidade) || 0;
          const precoUnit = produto?.preco || 0;
          return {
            produtoId: item.produtoId,
            nomeProduto: produto?.nome || '',
            quantidade: qtd,
            precoUnitario: precoUnit,
            total: qtd * precoUnit,
          };
        });

      const totalGeral = itensEnriquecidos.reduce(
        (acc, item) => acc + item.total,
        0
      );

      const romaneioDoc = {
        clienteId,
        clienteNome: cliente?.nome || '',
        clienteCnpj: cliente?.cnpj || '',
        data,
        itens: itensEnriquecidos,
        totalGeral,
      };

      if (isEdit) {
        const ref = doc(db, 'romaneios', id);
        await updateDoc(ref, {
          ...romaneioDoc,
          updatedAt: new Date(),
        });
        alert('Romaneio atualizado com sucesso!');
      } else {
        await addDoc(collection(db, 'romaneios'), {
          ...romaneioDoc,
          createdAt: new Date(),
        });
        alert('Romaneio criado com sucesso!');
      }

      navigate('/romaneios');
    } catch (err) {
      console.error('Erro ao salvar romaneio:', err);
      alert(`Erro ao salvar romaneio: ${err.message}`);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!isEdit) return;

    const confirmado = window.confirm(
      'Tem certeza que deseja apagar este romaneio? Essa ação não pode ser desfeita.'
    );

    if (!confirmado) return;

    try {
      const ref = doc(db, 'romaneios', id);
      await deleteDoc(ref);
      alert('Romaneio apagado com sucesso!');
      navigate('/romaneios');
    } catch (err) {
      console.error('Erro ao apagar romaneio:', err);
      alert('Erro ao apagar romaneio. Veja o console.');
    }
  }

  const carregandoAlgumaCoisa =
    loadingClientes || loadingProdutos || (isEdit && loadingRomaneio);

  if (carregandoAlgumaCoisa) {
    return (
      <div className="page-container">
        <HeaderSub
          title={isEdit ? 'Editar romaneio' : 'Novo romaneio'}
          backPath="/romaneios"
        />
        <main className="new-romaneio-content">
          <p>Carregando dados...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="page-container">
      <HeaderSub
        title={isEdit ? 'Editar romaneio' : 'Novo romaneio'}
        backPath="/romaneios"
      />

      <main className="new-romaneio-content">
        <form className="new-romaneio-form" onSubmit={handleSubmit}>
          <label className="form-label">
            Data do pedido
            <input
              type="date"
              className="form-input"
              value={data}
              onChange={(e) => setData(e.target.value)}
              required
            />
          </label>

          <label className="form-label">
            Cliente
            <select
              className="form-input"
              value={clienteId}
              onChange={(e) => setClienteId(e.target.value)}
              required
            >
              <option value="">Selecione um cliente</option>
              {clientes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </select>
          </label>

          <h3 className="section-title">Produtos</h3>

          {itens.map((item, index) => (
            <div className="romaneio-item-row" key={item.id}>
              <select
                className="form-input"
                value={item.produtoId}
                onChange={(e) =>
                  handleChangeItem(index, 'produtoId', e.target.value)
                }
              >
                <option value="">Selecione um produto</option>
                {produtos.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nome}
                  </option>
                ))}
              </select>

              <input
                type="number"
                className="form-input quantidade-input"
                placeholder="Qtd"
                min="1"
                value={item.quantidade}
                onChange={(e) =>
                  handleChangeItem(index, 'quantidade', e.target.value)
                }
              />

              {itens.length > 1 && (
                <button
                  type="button"
                  className="remove-item-btn"
                  onClick={() => handleRemoveItem(index)}
                >
                  ×
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            className="btn-secondary"
            onClick={handleAddItem}
          >
            Adicionar produto
          </button>

          <button type="submit" className="btn-primary" disabled={saving}>
            {saving
              ? isEdit
                ? 'Salvando...'
                : 'Gerando...'
              : isEdit
                ? 'Salvar alterações'
                : 'Gerar romaneio'}
          </button>

          {isEdit && (
            <button
              type="button"
              className="btn-danger"
              onClick={handleDelete}
            >
              <img src={iconTrash} alt="Apagar" className="icon-trash" />
              Apagar romaneio
            </button>
          )}

          <div style={{ height: '80px' }} />
        </form>
      </main>

      <BottomMenu />
    </div>
  );
}

export default NewRomaneio;
