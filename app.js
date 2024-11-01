import express from "express";
import sequelize from "./config/database.js";
import publicationsRouter from "./routes/publicationsRouter.js";
import commentsRouter from "./routes/commentsRouter.js";
import likesRouter from "./routes/likesRouter.js";

const app = express();

// Middleware para interpretar JSON
app.use(express.json());

// Usando as rotas de produtos
// localhost:3000/api/products
app.use("/app", publicationsRouter);
app.use("/app", commentsRouter);
app.use("/app", likesRouter);

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