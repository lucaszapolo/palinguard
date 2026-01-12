import React from "react";
import { Link } from "react-router-dom";

export default function ImportPage() {
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
            <p className="dashboard-kicker">Cofre</p>
            <h1>Importacao</h1>
          </div>
        </div>
        <section className="card" style={{ maxWidth: 700, width: "100%", padding: 24 }}>
          <p>Disponivel no desktop.</p>
          <button className="button-primary">Selecionar arquivo</button>
        </section>
      </section>
    </main>
  );
}
