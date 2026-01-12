import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/auth.js";

export default function LoginPage() {
  const navigate = useNavigate();
  const [login, setLogin] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [rememberMe, setRememberMe] = React.useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await loginUser({ login, password });
      navigate("/dashboard");
    } catch (err) {
      setError("Falha no login. Verifique os dados.");
    } finally {
      setLoading(false);
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
          <h2>Entrar</h2>
          <p className="login-subtitle">Use seu usuario corporativo para continuar.</p>
          <label className="login-field">
            <span>Usuario ou Email</span>
            <input
              type="text"
              placeholder="usuario@empresa.com.br"
              value={login}
              onChange={(event) => setLogin(event.target.value)}
              autoComplete="username"
            />
          </label>
          <label className="login-field">
            <span>Senha</span>
            <input
              type="password"
              placeholder="******"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
            />
          </label>
          <div className="login-meta">
            <label className="login-remember">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(event) => setRememberMe(event.target.checked)}
              />
              <span>Lembrar-me</span>
            </label>
            <Link to="/login">Esqueci minha senha</Link>
          </div>
          {error ? <p className="login-error">{error}</p> : null}
          <button className="button-primary login-submit" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
          <div className="login-links">
            <span>Novo por aqui?</span>
            <Link to="/register">Solicitar acesso</Link>
          </div>
        </form>
      </section>
    </main>
  );
}
