import { Sequelize } from "sequelize";
import dotenv from "dotenv";

const sequelize = new Sequelize({
    host: "localhost",
    dialect: "sqlite",
    storage: "./banco.db"
});

// Função para fazer o teste de conexão com o banco de dados
const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log("Banco de dados no ar");
    } catch (err) {
        console.error("Não foi possível conectar ao banco de dados:", err);
    }
};

testConnection();

export default sequelize;