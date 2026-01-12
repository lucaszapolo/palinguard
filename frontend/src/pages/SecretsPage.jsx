import React from "react";
import { Link } from "react-router-dom";
import { listSecrets } from "../services/secrets.js";
import { getToken } from "../services/auth.js";

export default function SecretsPage() {
  const [items, setItems] = React.useState([]);
  const [status, setStatus] = React.useState("idle");
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [filterQuery, setFilterQuery] = React.useState("");
  const token = getToken();

  React.useEffect(() => {
    if (!token) {
      setStatus("unauthenticated");
      return;
    }
    let active = true;
    setStatus("loading");
    listSecrets()
      .then((result) => {
        if (!active) {
          return;
        }
        setItems(result.data || []);
        setStatus("ready");
      })
      .catch(() => {
        if (!active) {
          return;
        }
        setStatus("error");
      });
    return () => {
      active = false;
    };
  }, [token]);

  const filteredItems = React.useMemo(() => {
    const query = filterQuery.trim().toLowerCase();
    if (!query) {
      return items;
    }
    return items.filter((item) => {
      return [item.title, item.email, item.group, item.group_id]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query));
    });
  }, [items, filterQuery]);

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
            <h1>Senhas</h1>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <Link className="button-primary" to="/secrets/new">
              Nova senha
            </Link>
            <button
              className="button-secondary"
              type="button"
              onClick={() => setFilterOpen((open) => !open)}
            >
              Filtro
            </button>
          </div>
        </div>
        {filterOpen ? (
          <div className="card" style={{ padding: 16 }}>
            <label style={{ display: "grid", gap: 8 }}>
              <span>Buscar</span>
              <input
                type="text"
                value={filterQuery}
                onChange={(event) => setFilterQuery(event.target.value)}
                placeholder="Titulo, email ou grupo"
              />
            </label>
          </div>
        ) : null}
        <div style={{ display: "grid", gap: 12 }}>
          {status === "unauthenticated" ? (
            <div className="card" style={{ padding: 16 }}>
              <p>Faca login para ver as senhas.</p>
            </div>
          ) : null}
          {status === "loading" ? (
            <div className="card" style={{ padding: 16 }}>
              <p>Carregando...</p>
            </div>
          ) : null}
          {status === "error" ? (
            <div className="card" style={{ padding: 16 }}>
              <p>Erro ao carregar senhas.</p>
            </div>
          ) : null}
          {status === "ready" &&
            filteredItems.map((item) => (
              <div key={item.id} className="card" style={{ padding: 16 }}>
                <strong>{item.title}</strong>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
                  <span>{item.group || item.group_id}</span>
                  <span>{item.email}</span>
                </div>
                <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                  <Link className="button-secondary" to={`/secrets/${item.id}`}>
                    Ver
                  </Link>
                  <button
                    className="button-secondary"
                    type="button"
                    onClick={() => navigator.clipboard?.writeText(item.email || "")}
                  >
                    Copiar
                  </button>
                </div>
              </div>
            ))}
        </div>
      </section>
    </main>
  );
}
