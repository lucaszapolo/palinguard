import React from "react";
import { Link } from "react-router-dom";
import { createSecret } from "../services/secrets.js";

export default function SecretFormPage() {
  const [form, setForm] = React.useState({
    title: "",
    type: "Senha",
    username: "",
    email: "",
    password: "",
    site: "",
    groupId: 1,
    visibility: "Privado",
    notes: ""
  });
  const [status, setStatus] = React.useState("idle");

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("loading");
    try {
      await createSecret(form);
      setStatus("saved");
    } catch (error) {
      setStatus("error");
    }
  }

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
            <h1>Nova senha</h1>
          </div>
        </div>
        <section className="card" style={{ maxWidth: 800, width: "100%", padding: 24 }}>
          <form style={{ display: "grid", gap: 12 }} onSubmit={handleSubmit}>
            <label>
              Titulo
              <input
                type="text"
                style={{ width: "100%", marginTop: 6 }}
                value={form.title}
                onChange={(event) => updateField("title", event.target.value)}
              />
            </label>
            <label>
              Usuario
              <input
                type="text"
                style={{ width: "100%", marginTop: 6 }}
                value={form.username}
                onChange={(event) => updateField("username", event.target.value)}
              />
            </label>
            <label>
              Email
              <input
                type="email"
                style={{ width: "100%", marginTop: 6 }}
                value={form.email}
                onChange={(event) => updateField("email", event.target.value)}
              />
            </label>
            <label>
              Senha
              <input
                type="password"
                style={{ width: "100%", marginTop: 6 }}
                value={form.password}
                onChange={(event) => updateField("password", event.target.value)}
              />
            </label>
            <label>
              Site
              <input
                type="text"
                style={{ width: "100%", marginTop: 6 }}
                value={form.site}
                onChange={(event) => updateField("site", event.target.value)}
              />
            </label>
            <div style={{ display: "flex", gap: 12 }}>
              <button className="button-primary" type="submit">
                Salvar
              </button>
              <button className="button-secondary" type="button">
                Cancelar
              </button>
            </div>
            {status === "saved" ? <p>Senha salva com sucesso.</p> : null}
            {status === "error" ? <p style={{ color: "crimson" }}>Erro ao salvar.</p> : null}
          </form>
        </section>
      </section>
    </main>
  );
}
