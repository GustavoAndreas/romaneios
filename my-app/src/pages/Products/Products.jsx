// src/pages/Products/Products.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import BottomMenu from '../../components/BottomMenu/BottomMenu';
import HeaderMain from '../../components/HeaderMain/HeaderMain';

import './Products.css';

import iconPlus from '../../assets/icons/add.svg';
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

function Products() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Buscar produtos reais do Firestore em tempo real
  useEffect(() => {
    const q = query(collection(db, 'produtos'), orderBy('nome'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));
        setProducts(list);
        setLoading(false);
      },
      (error) => {
        console.error('Erro ao buscar produtos:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  async function handleDeleteProduct(prod) {
    const confirmado = window.confirm(
      `Tem certeza que deseja excluir o produto "${prod.nome}"?`
    );

    if (!confirmado) return;

    try {
      await deleteDoc(doc(db, 'produtos', prod.id));
      alert('Produto apagado com sucesso!');
    } catch (err) {
      console.error('Erro ao apagar produto:', err);
      alert('Erro ao apagar produto. Veja o console.');
    }
  }

  return (
    <div className="page-container">
      <HeaderMain
        title="Produtos"
        actionIcon={iconPlus}
        onActionClick={() => navigate('/produtos/novo')}
      />

      <div className="products-list">
        {loading && <p>Carregando produtos...</p>}

        {!loading && products.length === 0 && (
          <p>Nenhum produto cadastrado ainda.</p>
        )}

        {!loading &&
          products.map((prod) => (
            <div key={prod.id} className="product-row">
              {/* Card clicável */}
              <div
                className="product-info"
                onClick={() => navigate(`/produtos/editar/${prod.id}`)}
                style={{ cursor: 'pointer' }}
              >
                <p className="product-name">{prod.nome}</p>
                <p className="product-price">
                  R$ {Number(prod.preco || 0).toFixed(2)}
                </p>
              </div>

              {/* Botão de lixeira */}
              <button
                className="delete-button"
                onClick={() => handleDeleteProduct(prod)}
              >
                <img src={iconTrash} alt="Apagar" className="delete-icon" />
              </button>
            </div>
          ))}

        <div style={{ height: '100px' }}></div>
      </div>

      <BottomMenu />
    </div>
  );
}

export default Products;
