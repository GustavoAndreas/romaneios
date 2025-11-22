import React, { useState, useEffect } from 'react';
import './Home.css';
import bgImage from './homepic.png';
// Importamos o menu que criamos no passo 1
import BottomMenu from '../../components/BottomMenu/BottomMenu.jsx';

// Lógica do contador animado
const AnimatedCounter = ({ target, duration = 2000 }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let start = 0;
        if (target === 0) return;

        const totalMilSec = duration;
        const incrementTime = (totalMilSec / target);

        let currentTimer = setInterval(() => {
            start += 1;
            setCount(start);
            if (start === target) clearInterval(currentTimer);
        }, incrementTime);

        return () => clearInterval(currentTimer);
    }, [target, duration]);

    return <span>+{count}</span>;
};

function Home() {
    const [stats, setStats] = useState({
        clients: 0,
        products: 0,
        romaneios: 0
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            // Simulação de dados
            setTimeout(() => {
                setStats({
                    clients: 40,
                    products: 12,
                    romaneios: 88
                });
            }, 500);
        };
        fetchDashboardData();
    }, []);

    return (
        <div className="home-container">
            <div className="bg-wrapper" style={{ backgroundImage: `url(${bgImage})` }}>
                <div className="overlay"></div>
            </div>

            <div className="content">
                <header className="header">
                    <p>Olá,</p>
                    <h1>Chopp 5Beer</h1>
                </header>

                <div className="stats-list">
                    {/* Item 1 */}
                    <div className="stat-item">
                        <div className="stat-number">
                            <AnimatedCounter target={stats.clients} />
                        </div>
                        <div className="stat-label">
                            clientes <br /> atendidos
                        </div>
                    </div>

                    {/* Item 2 */}
                    <div className="stat-item">
                        <div className="stat-number">
                            <AnimatedCounter target={stats.products} />
                        </div>
                        <div className="stat-label">
                            produtos <br /> registrados
                        </div>
                    </div>

                    {/* Item 3 */}
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

            {/* AQUI CHAMAMOS O COMPONENTE DO MENU */}
            <BottomMenu />
        </div>
    );
}

export default Home;