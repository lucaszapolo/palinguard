import bcrypt from "bcryptjs";

const now = () => new Date().toISOString();

let userId = 1;
let groupId = 1;
let secretId = 1;

const users = [
  {
    id: userId,
    name: "Admin",
    email: "admin@local",
    username: "admin",
    password_hash: bcrypt.hashSync("admin123", 10),
    status: "active",
    role: "admin",
    created_at: now()
  }
];

const groups = [
  {
    id: groupId,
    name: "Geral",
    description: "Grupo padrao",
    created_at: now()
  }
];

const secrets = [
  {
    id: secretId,
    title: "Sistema Financeiro",
    type: "Senha",
    username: "financeiro",
    email: "financeiro@empresa.com.br",
    site: "https://sistema.exemplo.com",
    group_id: groupId,
    visibility: "Privado",
    notes: "",
    expires_at: null,
    password_iv: "",
    password_tag: "",
    password_ciphertext: Buffer.from("senha123", "utf8").toString("base64"),
    created_by: userId,
    created_at: now(),
    updated_at: now()
  }
];

const userGroups = [];

export const mockStore = {
  users,
  groups,
  secrets,
  userGroups,
  nextUserId() {
    userId += 1;
    return userId;
  },
  nextGroupId() {
    groupId += 1;
    return groupId;
  },
  nextSecretId() {
    secretId += 1;
    return secretId;
  }
};
