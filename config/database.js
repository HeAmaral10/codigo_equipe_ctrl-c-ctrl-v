import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
    host: "localhost",
    dialect: "sqlite",
    storage: "./banco.db"
});

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