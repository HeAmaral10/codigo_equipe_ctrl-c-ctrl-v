import express from "express";
import sequelize from "./config/database.js";
import comentarios from "./routes/comentarios.js";
import publicacoes from "./routes/publicacoes.js";
import curtidas from "./routes/curtidas.js";
import usuarios from "./routes/usuarios.js";

const app = express();

// Middleware para interpretar JSON
app.use(express.json());

// Usando as rotas de publicações, comentários e curtidas
app.use("/app", publicacoes);
app.use("/app", comentarios);
app.use("/app", curtidas);
app.use("/app", usuarios);

// Sincronizar o banco de dados e iniciar o servidor
const startServer = async () => {
  try {
    await sequelize.sync(); // Isso cria as tabelas se elas não existirem
    app.listen(3000, () => {
      console.log("Servidor rodando na porta 3000");
    });
  } catch (error) {
    console.error("Erro ao iniciar o servidor:", error);
  }
};

startServer();