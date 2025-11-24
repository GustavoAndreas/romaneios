// src/pages/NewClient/NewClient.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import BottomMenu from '../../components/BottomMenu/BottomMenu';
import HeaderSub from '../../components/HeaderSub/HeaderSub';
import { db } from '../../firebase';

import {
  collection,
  addDoc,
  doc,
  getDoc,
  updateDoc,
} from 'firebase/firestore';

import './NewClient.css';

function NewClient() {
  const navigate = useNavigate();
  const { id } = useParams();          // /clientes/editar/:id
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    nome: '',
    cnpj: '',
    contato: '',
    email: '',
    rua: '',
    numero: '',
    cep: '',
  });

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  // Carrega dados do cliente ao editar
  useEffect(() => {
    if (!isEdit) return;

    async function loadClient() {
      try {
        const ref = doc(db, 'clientes', id);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          const data = snap.data();
          setForm({
            nome: data.nome || '',
            cnpj: data.cnpj || '',
            contato: data.contato || '',
            email: data.email || '',
            rua: data.rua || '',
            numero: data.numero || '',
            cep: data.cep || '',
          });
        } else {
          alert('Cliente não encontrado.');
          navigate('/clientes');
        }
      } catch (err) {
        console.error('Erro ao carregar cliente:', err);
        alert('Erro ao carregar cliente.');
      } finally {
        setLoading(false);
      }
    }

    loadClient();
  }, [id, isEdit, navigate]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);

    try {
      if (isEdit) {
        // Atualiza cliente existente
        const ref = doc(db, 'clientes', id);
        await updateDoc(ref, {
          ...form,
          updatedAt: new Date(),
        });
        alert('Cliente atualizado com sucesso!');
      } else {
        // Cria novo cliente
        await addDoc(collection(db, 'clientes'), {
          ...form,
          createdAt: new Date(),
        });
        alert('Cliente criado com sucesso!');
      }

      navigate('/clientes');
    } catch (err) {
      console.error('Erro ao salvar cliente:', err);
      alert('Erro ao salvar cliente. Veja o console.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="page-container">
        <HeaderSub title="Carregando..." backPath="/clientes" />
        <main className="new-client-content">
          <p>Carregando dados do cliente...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="page-container">
      <HeaderSub
        title={isEdit ? 'Editar cliente' : 'Novo cliente'}
        backPath="/clientes"
      />

      <main className="new-client-content">
        <form className="new-client-form" onSubmit={handleSubmit}>
          <label className="form-label">
            Nome/Razão Social
            <input
              name="nome"
              className="form-input"
              value={form.nome}
              onChange={handleChange}
              placeholder="Ex: Bar do Zé"
              required
            />
          </label>

          <label className="form-label">
            CNPJ
            <input
              name="cnpj"
              className="form-input"
              value={form.cnpj}
              onChange={handleChange}
              placeholder="00.000.000/0000-00"
            />
          </label>

          <label className="form-label">
            Contato
            <input
              name="contato"
              className="form-input"
              value={form.contato}
              onChange={handleChange}
              placeholder="(15) 99999-9999"
            />
          </label>

          <label className="form-label">
            E-mail
            <input
              name="email"
              type="email"
              className="form-input"
              value={form.email}
              onChange={handleChange}
              placeholder="contato@exemplo.com"
            />
          </label>

          <h3 className="section-title">Endereço</h3>

          <label className="form-label">
            Rua
            <input
              name="rua"
              className="form-input"
              value={form.rua}
              onChange={handleChange}
              placeholder="Rua / Avenida"
            />
          </label>

          <div className="form-row">
            <label className="form-label">
              Número
              <input
                name="numero"
                className="form-input"
                value={form.numero}
                onChange={handleChange}
                placeholder="123"
              />
            </label>

            <label className="form-label">
              CEP
              <input
                name="cep"
                className="form-input"
                value={form.cep}
                onChange={handleChange}
                placeholder="00000-000"
              />
            </label>
          </div>

          <button type="submit" className="btn-primary" disabled={saving}>
            {saving
              ? isEdit
                ? 'Salvando...'
                : 'Criando...'
              : isEdit
              ? 'Salvar alterações'
              : 'Adicionar cliente'}
          </button>

          <div style={{ height: '80px' }} />
        </form>
      </main>

      <BottomMenu />
    </div>
  );
}

export default NewClient;
