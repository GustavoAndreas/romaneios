// src/pages/NewProduct/NewProduct.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import BottomMenu from '../../components/BottomMenu/BottomMenu';
import HeaderSub from '../../components/HeaderSub/HeaderSub';
import './NewProduct.css';

import { db } from '../../firebase';
import {
  collection,
  addDoc,
  doc,
  getDoc,
  updateDoc,
} from 'firebase/firestore';

function NewProduct() {
  const navigate = useNavigate();
  const { id } = useParams();        // /produtos/editar/:id
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    nome: '',
    preco: '',
  });

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  // Carrega dados ao editar
  useEffect(() => {
    if (!isEdit) return;

    async function loadProduct() {
      try {
        const ref = doc(db, 'produtos', id);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
          alert('Produto não encontrado.');
          navigate('/produtos');
          return;
        }

        const data = snap.data();
        setForm({
          nome: data.nome || '',
          // garante que o preço apareça como string no input
          preco: data.preco != null ? String(data.preco) : '',
        });
      } catch (error) {
        console.error('Erro ao carregar produto:', error);
        alert('Erro ao carregar produto. Veja o console.');
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [id, isEdit, navigate]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);

    try {
      const precoNumber = parseFloat(form.preco.replace(',', '.')) || 0;

      if (isEdit) {
        const ref = doc(db, 'produtos', id);
        await updateDoc(ref, {
          nome: form.nome,
          preco: precoNumber,
          updatedAt: new Date(),
        });
        alert('Produto atualizado com sucesso!');
      } else {
        await addDoc(collection(db, 'produtos'), {
          nome: form.nome,
          preco: precoNumber,
          createdAt: new Date(),
        });
        alert('Produto criado com sucesso!');
      }

      navigate('/produtos');
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      alert(`Erro ao salvar produto: ${error.message}`);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="page-container">
        <HeaderSub title="Carregando..." backPath="/produtos" />
        <main className="new-product-content">
          <p>Carregando dados do produto...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="page-container">
      <HeaderSub
        title={isEdit ? 'Editar produto' : 'Novo produto'}
        backPath="/produtos"
      />

      <main className="new-product-content">
        <form className="new-product-form" onSubmit={handleSubmit}>
          <label className="form-label">
            Nome
            <input
              name="nome"
              className="form-input"
              value={form.nome}
              onChange={handleChange}
              placeholder="Ex: Chopp Pilsen"
              required
            />
          </label>

          <label className="form-label">
            Preço unitário
            <input
              name="preco"
              className="form-input"
              value={form.preco}
              onChange={handleChange}
              placeholder="14.90"
              required
            />
          </label>

          <button type="submit" className="btn-primary" disabled={saving}>
            {saving
              ? isEdit
                ? 'Salvando...'
                : 'Criando...'
              : isEdit
              ? 'Salvar alterações'
              : 'Adicionar produto'}
          </button>

          <div style={{ height: '80px' }} />
        </form>
      </main>

      <BottomMenu />
    </div>
  );
}

export default NewProduct;
