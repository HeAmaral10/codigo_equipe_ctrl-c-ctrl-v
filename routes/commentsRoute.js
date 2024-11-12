import express from "express";
import { Publicacao, sequelize, Usuario, Comentario } from "../models/models.js";

const router = express.Router();

// Rota para criar um novo comentário
router.post("/comentarios", async (req, res) => {
    const { publicacao_id, usuario_id, comentario } = req.body;

    // Verifica se o usuário e a publicação existem
    const usuarioExiste = await Usuario.findByPk(usuario_id);
    const publicacaoExiste = await Publicacao.findByPk(publicacao_id);

    try {
        // Valida se todos os campos obrigatórios foram preenchidos
        if (publicacao_id.trim() === "" || usuario_id.trim() === "" || comentario.trim() === "") {
            return res.status(400).json({ erro: "Todos os campos são obrigatórios" });
        }

        // Verifica se o usuário existe
        if (!usuarioExiste) {
            return res.status(400).json({ erro: "Usuário não encontrado" });
        }

        // Verifica se a publicação existe
        if (!publicacaoExiste) {
            return res.status(400).json({ erro: "Publicação não encontrada" });
        }

        // Cria o novo comentário
        const novoComentario = await Comentario.create({
            comentario,
            publicacao_id,
            usuario_id,
        });

        // Incrementa a contagem de comentários na publicação
        await publicacaoExiste.increment('qtd_comentarios');

        // Retorna o comentário criado com sucesso
        return res.status(201).json(novoComentario);

    } catch (error) {
        // Trata qualquer erro no processo
        return res.status(500).json({ erro: "Erro ao criar comentário" });
    }
});

// Rota para listar comentários de uma publicação específica
router.get("/comentarios", async (req, res) => {
    const { publicacao_id } = req.query;

    try {
        // Verifica se o ID da publicação foi informado
        if (!publicacao_id) {
            return res.status(400).json({ erro: "Publicação não informada" });
        }

        // Filtra os comentários pelo ID da publicação
        const comentariosFiltrados = await Comentario.findAll({
            where: { publicacao_id },
        });

        // Retorna os comentários encontrados e a quantidade total
        res.status(200).json({
            data: comentariosFiltrados,
            total: comentariosFiltrados.length,
        });
        
    } catch (error) {
        // Trata qualquer erro no processo
        return res.status(500).json({ erro: "Erro ao buscar comentários" });
    }
});

// Rota para deletar um comentário específico
router.delete("/comentarios", async (req, res) => {
    const { comentario_id, usuario_id } = req.body;

    // Verifica se o usuário e o comentário existem
    const usuarioExiste = await Usuario.findByPk(usuario_id);
    const comentario = await Comentario.findByPk(comentario_id);

    try {
        // Verifica se o usuário existe
        if (!usuarioExiste) {
            return res.status(400).json({ erro: "Usuário não encontrado" });
        }

        // Verifica se o comentário existe
        if (!comentario) {
            return res.status(400).json({ erro: "Comentário não encontrado" });
        }

        // Verifica se o comentário pertence ao usuário que solicitou a exclusão
        if (comentario.usuario_id !== usuario_id) {
            return res.status(403).json({ erro: "Usuário não autorizado" });
        }

        // Deleta o comentário
        await comentario.destroy();

        // Decrementa a contagem de comentários na publicação associada
        const publicacaoExiste = await Publicacao.findByPk(comentario.publicacao_id);
        await publicacaoExiste.decrement('qtd_comentarios');

        // Retorna sucesso sem conteúdo (código 204)
        return res.status(204).json({});

    } catch (error) {
        // Trata qualquer erro no processo
        return res.status(500).json({ erro: "Erro ao deletar o comentário" });
    }
});

export default router;