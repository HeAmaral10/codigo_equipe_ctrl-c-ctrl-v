import Publicacao from "../models/Publicacoes.js";
import Usuario from "../models/Usuarios.js";
import Comentario from "../models/Comentarios.js";

// Função para criar um novo comentário
export const createComentario = async (req, res) => {

    const { publicacao_id, usuario_id, comentario } = req.body;

    const usuarioExiste = await Usuario.findByPk(usuario_id);
    const publicacaoExiste = await Publicacao.findByPk(publicacao_id);

    try {

        if (!publicacao_id || !usuario_id || !comentario) {
            return res.status(400).json({ erro: "Todos os campos são obrigatórios" });
        }

        if (!usuarioExiste) {
            return res.status(400).json({ erro: "Usuário não encontrado" });
        }

        if (!publicacaoExiste) {
            return res.status(400).json({ erro: "Publicação não encontrada" });
        }

        const novoComentario = await Comentario.create({
            comentario,
            publicacao_id,
            usuario_id,
        });

        await publicacaoExiste.increment('qtd_comentarios');

        return res.status(201).json(novoComentario);

    } catch (error) {
        return res.status(500).json({ erro: "Erro ao criar comentário" });
    }
};

// Função para listar os comentários de uma publicação
export const listPublicacaoComentario = async (req, res) => {

    const { publicacao_id } = req.query;

    try {

        if (!publicacao_id) {
            return res.status(400).json({ erro: "Publicação não informada" });
        }

        const comentariosFiltrados = await Comentario.findAll({
            where: { publicacao_id },
        });

        res.status(200).json({
            data: comentariosFiltrados,
            total: comentariosFiltrados.length,
        });

    } catch (error) {
        return res.status(500).json({ erro: "Erro ao buscar comentários" });
    }
};

// Função para deletar um comentário
export const deleteComentario = async (req, res) => {
    
    const { comentario_id, usuario_id } = req.body;

    const usuarioExiste = await Usuario.findByPk(usuario_id);
    const comentario = await Comentario.findByPk(comentario_id);

    try {

        if (!usuarioExiste) {
            return res.status(400).json({ erro: "Usuário não encontrado" });
        }

        if (!comentario) {
            return res.status(400).json({ erro: "Comentário não encontrado" });
        }

        if (comentario.usuario_id !== usuario_id) {
            return res.status(403).json({ erro: "Usuário não autorizado" });
        }

        await comentario.destroy();

        const publicacaoExiste = await Publicacao.findByPk(comentario.publicacao_id);

        await publicacaoExiste.decrement('qtd_comentarios');

        return res.status(204).json({});

    } catch (error) {
        return res.status(500).json({ erro: "Erro ao deletar o comentário" });
    }
};