import React from "react";
import { Link } from "react-router-dom";

export default function DashboardPage() {
  const userName = "Usuario";
  const stats = [
    { label: "Total de senhas", value: "24" },
    { label: "Departamentos", value: "6" },
    { label: "Ultimas visualizadas", value: "5" }
  ];
  const recentSecrets = [
    { title: "VPN Corporativa", detail: "TI" },
    { title: "Banco Principal", detail: "Financeiro" },
    { title: "Painel Marketing", detail: "Marketing" },
    { title: "Servidor RH", detail: "RH" },
    { title: "Email Diretoria", detail: "Diretoria" }
  ];

  return (
    <main className="dashboard-page">
      <section className="dashboard-shell">
        <header className="dashboard-topbar">
          <div className="brand">Palin Guard</div>
          <nav className="dashboard-nav">
            <Link className="dashboard-nav-button" to="/secrets">
              Senhas
            </Link>
            <Link className="dashboard-nav-button" to="/secrets/new">
              Criar nova senha
            </Link>
            <Link className="dashboard-nav-button" to="/import">
              Importacao
            </Link>
            <Link className="dashboard-nav-button" to="/export">
              Exportacao
            </Link>
          </nav>
        </header>
        <div className="dashboard-hero">
          <div>
            <p className="dashboard-kicker">Bem-vindo</p>
            <h1>{userName}</h1>
          </div>
          <div className="dashboard-highlight card">
            <p>Visao geral do cofre</p>
            <strong>Seguranca e controle centralizado</strong>
          </div>
        </div>
        <div className="dashboard-cards">
          {stats.map((item) => (
            <div key={item.label} className="dashboard-card card">
              <p>{item.label}</p>
              <h2>{item.value}</h2>
            </div>
          ))}
        </div>
        <div className="dashboard-grid">
          <section className="card dashboard-panel">
            <h3>Ultimas senhas visualizadas</h3>
            <ul className="dashboard-list">
              {recentSecrets.map((item) => (
                <li key={item.title}>
                  <span>{item.title}</span>
                  <em>{item.detail}</em>
                </li>
              ))}
            </ul>
          </section>
          <section className="card dashboard-panel">
            <h3>Departamentos</h3>
            <ul className="dashboard-list">
              {[
                { name: "TI", count: 8 },
                { name: "Financeiro", count: 5 },
                { name: "RH", count: 4 },
                { name: "Marketing", count: 3 },
                { name: "Operacoes", count: 2 },
                { name: "Diretoria", count: 2 }
              ].map((item) => (
                <li key={item.name}>
                  <span>{item.name}</span>
                  <em>{item.count} senhas</em>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </section>
    </main>
  );
}
