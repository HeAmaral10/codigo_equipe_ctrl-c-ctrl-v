import Comentarios from "./Comentarios";
import Publicacoes from "./Publicacoes";

Publicacoes.hasMany(Comentarios, { foreignKey: "publicacao_id", as: "Comments", onDelete: "CASCADE", hooks: true });
// Define que Comentarios pertence ao modelo Usuarios através da coluna usuario_id- um comentário é sempre feito por alguém (com id)
// Relacionamento belongsTo indica uma relação de "muitos para um" (muitos comentários pertencem a um usuário)
// foreignKey: Especifica qual coluna no Comentarios referencia a chave primária do modelo Usuarios para se relacionarem
Comentarios.belongsTo(Publicacoes, { foreignKey: "publicacao_id", as: "Post" }); 

export {Publicacoes, Comentarios};