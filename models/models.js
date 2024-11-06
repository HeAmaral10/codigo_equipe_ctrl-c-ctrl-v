import { Sequelize, DataTypes } from "sequelize";

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "./database.sqlite",
});

const Usuario = sequelize.define("Usuário", {
    usuario_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    nome: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    nick: { type: DataTypes.STRING, allowNull: false },
    imagem: { type: DataTypes.STRING, allowNull: false },
    nascimento: { type: DataTypes.DATE, allowNull: false },
});

const Publicacao = sequelize.define("Publicação", {
    publicacao_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    publicacao: { type: DataTypes.STRING, allowNull: false },
    qtd_likes: { type: DataTypes.INTEGER, allowNull: false },
    criado_em: { type: DataTypes.DATE, allowNull: false },
    qtd_comentarios: { type: DataTypes.INTEGER, allowNull: false },
});

const Comentario = sequelize.define("Comentário", {
    comentario_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    comentario: { type: DataTypes.STRING, allowNull: false },
    qtd_likes: { type: DataTypes.INTEGER, allowNull: false },
});

Publicacao.belongsTo(Usuario, { foreignKey: 'usuario_id' });
Usuario.hasMany(Publicacao, { foreignKey: 'usuario_id' });
Comentario.belongsTo(Usuario, { foreignKey: 'usuario_id' });
Usuario.hasMany(Comentario, { foreignKey: 'usuario_id' });
Comentario.belongsTo(Publicacao, { foreignKey: 'publicacao_id' });
Publicacao.hasMany(Comentario, { foreignKey: 'publicacao_id' });

export { Publicacao, Usuario, Comentario, sequelize };