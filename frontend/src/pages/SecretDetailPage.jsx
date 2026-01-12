import React from "react";
import { useParams } from "react-router-dom";
import { revealSecret } from "../services/secrets.js";

export default function SecretDetailPage() {
  const { id } = useParams();
  const [password, setPassword] = React.useState("");
  const [status, setStatus] = React.useState("idle");

  async function handleReveal() {
    setStatus("loading");
    try {
      const result = await revealSecret(id);
      setPassword(result.password);
      setStatus("ready");
      setTimeout(() => {
        setPassword("");
        setStatus("idle");
      }, 10000);
    } catch (error) {
      setStatus("error");
    }
  }

  return (
    <main>
      <section className="card" style={{ maxWidth: 600, width: "100%", padding: 24 }}>
        <h1>Detalhe da senha</h1>
        <p style={{ color: "var(--color-muted)" }}>
          {password ? `Senha: ${password}` : "Senha oculta por padrao"}
        </p>
        {status === "error" ? <p style={{ color: "crimson" }}>Falha ao revelar senha.</p> : null}
        <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
          <button className="button-primary" onClick={handleReveal}>
            Revelar por 10s
          </button>
          <button
            className="button-secondary"
            type="button"
            onClick={() => navigator.clipboard?.writeText(password)}
          >
            Copiar
          </button>
        </div>
      </section>
    </main>
  );
}
