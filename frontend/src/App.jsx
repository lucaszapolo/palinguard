import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import SecretsPage from "./pages/SecretsPage.jsx";
import SecretDetailPage from "./pages/SecretDetailPage.jsx";
import SecretFormPage from "./pages/SecretFormPage.jsx";
import ImportPage from "./pages/ImportPage.jsx";
import ExportPage from "./pages/ExportPage.jsx";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/secrets" element={<SecretsPage />} />
        <Route path="/secrets/new" element={<SecretFormPage />} />
        <Route path="/secrets/:id" element={<SecretDetailPage />} />
        <Route path="/import" element={<ImportPage />} />
        <Route path="/export" element={<ExportPage />} />
      </Routes>
    </>
  );
}
