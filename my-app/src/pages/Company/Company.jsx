// src/pages/Company/Company.jsx
import React, { useState, useEffect } from 'react';
import BottomMenu from '../../components/BottomMenu/BottomMenu';
import HeaderMain from '../../components/HeaderMain/HeaderMain';
import './Company.css';

import { db } from '../../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

// Dados padrão locais (fallback)
const empresaInicial = {
  nome: 'Chopp 5Beer',
  cnpj: '00.000.000/0000-00',
  contato: '(15) 99999-9999',
  email: 'contato@chopp5beer.com',
  rua: 'Rua Exemplo',
  numero: '123',
  cep: '18000-000',
  cidade: 'Sorocaba',
  estado: 'SP',
};

function Company() {
  const [form, setForm] = useState(empresaInicial);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Carrega dados da empresa do Firestore ao abrir a tela
  useEffect(() => {
    async function loadEmpresa() {
      try {
        const ref = doc(db, 'config', 'empresa'); // coleção "config", doc "empresa"
        const snap = await getDoc(ref);

        if (snap.exists()) {
          const data = snap.data();
          // Mescla com empresaInicial para garantir todos os campos
          setForm({
            ...empresaInicial,
            ...data,
          });
        } else {
          // Se ainda não existir no Firestore, usa os valores padrão
          setForm(empresaInicial);
        }
      } catch (error) {
        console.error('Erro ao carregar dados da empresa:', error);
        alert('Erro ao carregar dados da empresa. Usando valores padrão.');
        setForm(empresaInicial);
      } finally {
        setLoading(false);
      }
    }

    loadEmpresa();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);

    try {
      const ref = doc(db, 'config', 'empresa');

      await setDoc(ref, {
        ...form,
        updatedAt: new Date(),
      });

      alert('Dados da empresa salvos com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar dados da empresa:', error);
      alert(`Erro ao salvar dados da empresa: ${error.message}`);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="page-container">
        <HeaderMain title="Meus dados" />
        <main className="company-content">
          <p>Carregando dados da empresa...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Header principal da aba */}
      <HeaderMain title="Meus dados" />

      <main className="company-content">
        <p className="company-description">
          Esses dados serão usados no cabeçalho dos romaneios gerados.
        </p>

        <form className="company-form" onSubmit={handleSubmit}>
          <label className="form-label">
            Nome/Razão Social
            <input
              name="nome"
              className="form-input"
              value={form.nome}
              onChange={handleChange}
              placeholder="Ex: Chopp 5Beer"
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
              className="form-input"
              value={form.email}
              onChange={handleChange}
              placeholder="contato@empresa.com"
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

          <div className="form-row">
            <label className="form-label">
              Cidade
              <input
                name="cidade"
                className="form-input"
                value={form.cidade}
                onChange={handleChange}
                placeholder="Sorocaba"
              />
            </label>

            <label className="form-label">
              Estado
              <input
                name="estado"
                className="form-input"
                value={form.estado}
                onChange={handleChange}
                placeholder="SP"
              />
            </label>
          </div>

          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Salvando...' : 'Salvar dados'}
          </button>

          <div style={{ height: '80px' }} />
        </form>
      </main>

      <BottomMenu />
    </div>
  );
}

export default Company;
