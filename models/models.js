import { Sequelize, DataTypes } from "sequelize";

// Inicializando a conexão com o banco de dados SQLite
const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "./database.sqlite", // Define o arquivo onde o SQLite irá armazenar o banco de dados
});

// Definindo o modelo Usuario
const Usuario = sequelize.define("Usuário", {
    usuario_id: {
        type: DataTypes.UUID, // Define que o ID do usuário será um UUID
        defaultValue: DataTypes.UUIDV4, // Gera automaticamente um UUID no formato V4
        primaryKey: true, // Define como chave primária
    },
    nome: { type: DataTypes.STRING, allowNull: false }, // Nome do usuário, obrigatório
    email: { type: DataTypes.STRING, allowNull: false }, // Email do usuário, obrigatório
    nick: { type: DataTypes.STRING, allowNull: false }, // Apelido do usuário, obrigatório
    imagem: { type: DataTypes.STRING, allowNull: false }, // Caminho ou URL da imagem do usuário, obrigatório
    nascimento: { type: DataTypes.DATE, allowNull: false }, // Data de nascimento do usuário, obrigatória
});

// Definindo o modelo Publicacao
const Publicacao = sequelize.define("Publicação", {
    publicacao_id: {
        type: DataTypes.UUID, // Define o ID da publicação como UUID
        defaultValue: DataTypes.UUIDV4, // Gera automaticamente um UUID V4 para a publicação
        primaryKey: true, // Define como chave primária
    },
    publicacao: { type: DataTypes.STRING, allowNull: false }, // Conteúdo da publicação, obrigatório
    qtd_likes: { type: DataTypes.INTEGER, allowNull: false }, // Número de "curtidas" da publicação, obrigatório
    criado_em: { type: DataTypes.DATE, allowNull: false }, // Data de criação da publicação, obrigatória
    qtd_comentarios: { type: DataTypes.INTEGER, allowNull: false }, // Número de comentários na publicação, obrigatório
});

// Definindo o modelo Comentario
const Comentario = sequelize.define("Comentário", {
    comentario_id: {
        type: DataTypes.UUID, // Define o ID do comentário como UUID
        defaultValue: DataTypes.UUIDV4, // Gera automaticamente um UUID V4 para o comentário
        primaryKey: true, // Define como chave primária
    },
    comentario: { type: DataTypes.STRING, allowNull: false }, // Conteúdo do comentário, obrigatório
    qtd_likes: { type: DataTypes.INTEGER, allowNull: false }, // Número de "curtidas" no comentário, obrigatório
});

// Relacionamento entre Publicacao e Usuario
Publicacao.belongsTo(Usuario, { foreignKey: 'usuario_id' }); // Cada publicação pertence a um único usuário (chave estrangeira `usuario_id`)
Usuario.hasMany(Publicacao, { foreignKey: 'usuario_id' }); // Um usuário pode ter várias publicações

// Relacionamento entre Comentario e Usuario
Comentario.belongsTo(Usuario, { foreignKey: 'usuario_id' }); // Cada comentário pertence a um único usuário (chave estrangeira `usuario_id`)
Usuario.hasMany(Comentario, { foreignKey: 'usuario_id' }); // Um usuário pode ter vários comentários

// Relacionamento entre Comentario e Publicacao
Comentario.belongsTo(Publicacao, { foreignKey: 'publicacao_id' }); // Cada comentário pertence a uma única publicação (chave estrangeira `publicacao_id`)
Publicacao.hasMany(Comentario, { foreignKey: 'publicacao_id' }); // Uma publicação pode ter vários comentários

// Exporta os modelos e a instância do Sequelize
export { Publicacao, Usuario, Comentario, sequelize };