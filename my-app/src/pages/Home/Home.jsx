// src/pages/Home/Home.jsx
import React, { useState, useEffect } from 'react';
import './Home.css';
import bgImage from './homepic.png';
import BottomMenu from '../../components/BottomMenu/BottomMenu.jsx';

import { db } from '../../firebase';
import { collection, onSnapshot } from 'firebase/firestore';

// Contador animado
const AnimatedCounter = ({ target, duration = 2000 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    if (!target || target === 0) {
      setCount(0);
      return;
    }

    const totalMilSec = duration;
    const incrementTime = totalMilSec / target;

    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= target) clearInterval(timer);
    }, incrementTime);

    return () => clearInterval(timer);
  }, [target, duration]);

  return <span>+{count}</span>;
};

function Home() {
  const [stats, setStats] = useState({
    clients: 0,
    products: 0,
    romaneios: 0,
  });

  useEffect(() => {
    // ouvindo clientes
    const unsubClientes = onSnapshot(
      collection(db, 'clientes'),
      (snap) => {
        setStats((prev) => ({
          ...prev,
          clients: snap.size,
        }));
      },
      (err) => console.error('Erro ao carregar clientes na Home:', err)
    );

    // ouvindo produtos
    const unsubProdutos = onSnapshot(
      collection(db, 'produtos'),
      (snap) => {
        setStats((prev) => ({
          ...prev,
          products: snap.size,
        }));
      },
      (err) => console.error('Erro ao carregar produtos na Home:', err)
    );

    // ouvindo romaneios
    const unsubRomaneios = onSnapshot(
      collection(db, 'romaneios'),
      (snap) => {
        setStats((prev) => ({
          ...prev,
          romaneios: snap.size,
        }));
      },
      (err) => console.error('Erro ao carregar romaneios na Home:', err)
    );

    // limpa os listeners ao desmontar
    return () => {
      unsubClientes();
      unsubProdutos();
      unsubRomaneios();
    };
  }, []);

  return (
    <div className="home-container">
      <div
        className="bg-wrapper"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="overlay"></div>
      </div>

      <div className="content">
        <header className="header">
          <p>Olá,</p>
          <h1>Chopp 5Beer</h1>
        </header>

        <div className="stats-list">
          {/* Clientes */}
          <div className="stat-item">
            <div className="stat-number">
              <AnimatedCounter target={stats.clients} />
            </div>
            <div className="stat-label">
              clientes <br /> atendidos
            </div>
          </div>

          {/* Produtos */}
          <div className="stat-item">
            <div className="stat-number">
              <AnimatedCounter target={stats.products} />
            </div>
            <div className="stat-label">
              produtos <br /> registrados
            </div>
          </div>

          {/* Romaneios */}
          <div className="stat-item">
            <div className="stat-number">
              <AnimatedCounter target={stats.romaneios} />
            </div>
            <div className="stat-label">
              romaneios <br /> emitidos
            </div>
          </div>
        </div>
      </div>

      <BottomMenu />
    </div>
  );
}

export default Home;
