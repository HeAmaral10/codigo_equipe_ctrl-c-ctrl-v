import express from "express";
import sequelize from "./config/database.js";
import publicationsRoute from "./routes/publicationsRoute.js";
import commentsRoute from "./routes/commentsRoute.js";
import likesRoute from "./routes/likesRoute.js";
import userRoute from "./routes/userRoute.js";

const app = express();

// Middleware para interpretar JSON
app.use(express.json());

// Usando as rotas de publicações, comentários e curtidas
app.use("/app", publicationsRoute);
app.use("/app", commentsRoute);
app.use("/app", likesRoute);
app.use("/app", userRoute);

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