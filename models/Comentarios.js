import { DataTypes, Model } from "sequelize"; 
// DataTypes- definições tipos de dados usados para criar as colunas no banco de dados
// Model- Uma classe base do Sequelize para representar tabelas do banco de dados como modelos no código da aplicação
import sequelize from "../config/database.js"; // Importa a instância configurada do Sequelize, que conecta o modelo ao banco de dados definido no arquivo database.js
import Usuarios from "./Usuarios.js";
import Publicacoes from "./Publicacoes.js"; 
// Importa outros modelos (Usuarios e Publicacoes) que serão usados para definir relacionamentos com o modelo Comentarios

class Comentarios extends Model {} 
// Definição da classe modelo (Comentarios)- extends permite herança de Model
// Essa classe representa a tabela no banco de dados e será usada para interagir com ela (CRUD- create, read, update e delete)
// A classe é definida no código por meio do Sequelize, permitindo usar Javascript para realizar operações e manipulações de dados na tabela que é referente ao BD mas sem lidar com SQL diretamente

Comentarios.init( // Inicialização da classe modelo (define as colunas e propriedades do modelo no BD)
  // Método obrigatório para que o Sequelize saiba como mapear o modelo para a tabela 
  {
    id: { // Coluna ID
      type: DataTypes.UUID, // Define o tipo de dado como UUID (identificador único universal)
      defaultValue: DataTypes.UUIDV4, // Gera automaticamente um UUID versão 4 para cada novo registro
      primaryKey: true, // Define id como a chave primária da tabela
      allowNull: false, // Campo não pode ser nulo
    },
    usuario_id: { // Armazena o ID do usuário que fez o comentário
      type: DataTypes.UUID, // UUID para coincidir com a chave primária do modelo Usuarios
      allowNull: false, // Não pode ser nulo
    },
    publicacao_id: { // Armazena o ID da publicação onde o comentário foi feito
      type: DataTypes.UUID, // UUID para coincidir com a chave primária do modelo publicação
      allowNull: false, // Obrigatório preencher
    },
    comentario: { // Coluna comentário
      type: DataTypes.STRING, // Define o campo como uma string de texto
      allowNull: false, // Obrigatório preencher
    },
    qtd_likes: { // Coluna quantidade de "likes" no comentário
      type: DataTypes.INTEGER, // Número inteiro
      allowNull: false, // Valor não pode ser nulo
      defaultValue: 0, // Inicializa com 0 por padrão
    },
  },

  // Configuração do modelo
  { 
    sequelize, // Conecta a classe modelo à instância do Sequelize configurada
    modelName: "Comentarios", // Nome do modelo como "Comentarios", que será usado internamente pelo Sequelize
  }
);

Comentarios.belongsTo(Usuarios, { foreignKey: "usuario_id" }); // Relacionamento com Usuarios
// Define que Comentarios pertence ao modelo Usuarios através da coluna usuario_id- um comentário é sempre feito por alguém (com id)
// Relacionamento belongsTo indica uma relação de "muitos para um" (muitos comentários pertencem a um usuário)
// foreignKey: Especifica qual coluna no Comentarios referencia a chave primária do modelo Usuarios para se relacionarem
Comentarios.belongsTo(Publicacoes, { foreignKey: "publicacao_id" }); 
// Relacionamento com Publicações- muitos comentários contidos em uma publicação

export default Comentarios; // Exporta o modelo Comentarios para ser usado em outros arquivos
// Exportação padrão- pode ser importado com qualquer nome