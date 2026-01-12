import React from "react";
import { Link } from "react-router-dom";
import { registerUser } from "../services/auth.js";

export default function RegisterPage() {
  const [form, setForm] = React.useState({
    name: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: ""
  });
  const [status, setStatus] = React.useState("idle");

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (form.password !== form.confirmPassword) {
      setStatus("mismatch");
      return;
    }
    setStatus("loading");
    try {
      await registerUser({
        name: form.name,
        email: form.email,
        username: form.username,
        password: form.password
      });
      setStatus("sent");
    } catch (error) {
      setStatus("error");
    }
  }

  return (
    <main className="login-page">
      <section className="login-shell">
        <div className="login-hero">
          <div className="login-hero-inner">
            <span className="login-kicker">Palin Guard</span>
            <h1>Bem-vindo de volta</h1>
            <p>Acesse o cofre de senhas com seguranca e rastreabilidade.</p>
            <ul className="login-highlights">
              <li>Criptografia ponta a ponta</li>
              <li>Auditoria de acessos</li>
              <li>Compartilhamento por grupos</li>
            </ul>
          </div>
          <div className="login-hero-ornament" aria-hidden="true" />
        </div>
        <form className="login-card card" onSubmit={handleSubmit}>
          <h2>Criar conta</h2>
          <p className="login-subtitle">Solicite acesso ao cofre de senhas.</p>
          <label className="login-field">
            <span>Nome completo</span>
            <input
              type="text"
              placeholder="Seu nome"
              value={form.name}
              onChange={(event) => updateField("name", event.target.value)}
              autoComplete="name"
            />
          </label>
          <label className="login-field">
            <span>Email</span>
            <input
              type="email"
              placeholder="usuario@empresa.com.br"
              value={form.email}
              onChange={(event) => updateField("email", event.target.value)}
              autoComplete="email"
            />
          </label>
          <label className="login-field">
            <span>Usuario</span>
            <input
              type="text"
              placeholder="usuario"
              value={form.username}
              onChange={(event) => updateField("username", event.target.value)}
              autoComplete="username"
            />
          </label>
          <label className="login-field">
            <span>Senha</span>
            <input
              type="password"
              placeholder="******"
              value={form.password}
              onChange={(event) => updateField("password", event.target.value)}
              autoComplete="new-password"
            />
          </label>
          <label className="login-field">
            <span>Confirmar senha</span>
            <input
              type="password"
              placeholder="******"
              value={form.confirmPassword}
              onChange={(event) => updateField("confirmPassword", event.target.value)}
              autoComplete="new-password"
            />
          </label>
          <p className="login-subtitle">Sua solicitacao sera avaliada pelo administrador.</p>
          {status === "mismatch" ? <p className="login-error">As senhas nao conferem.</p> : null}
          {status === "sent" ? <p>Solicitacao enviada.</p> : null}
          {status === "error" ? <p className="login-error">Falha ao enviar.</p> : null}
          <button className="button-primary login-submit" type="submit">
            Solicitar acesso
          </button>
          <div className="login-links">
            <span>Ja tem conta?</span>
            <Link to="/login">Voltar ao login</Link>
          </div>
        </form>
      </section>
    </main>
  );
}
