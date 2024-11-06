import express from "express";
import { Publicacao, sequelize, Comentario } from "./modelos.js";

const router = express.Router();

router.post("/curtidas/publicacao", async (req, res) => {

    const { publicacao_id } = req.body;
    const publicacaoExiste = await Publicacao.findByPk(publicacao_id);

    try {

        if (!publicacao_id) {
            return res.status(400).json({ erro: "Todos os campos são obrigatórios" });
        }
        if (!publicacaoExiste) {
            return res.status(400).json({ erro: "Publicação não encontrada" });
        }
        
        await publicacaoExiste.increment('qtd_likes');

        const publicacaoAtualizada = await Publicacao.findByPk(publicacao_id);

        return res.status(200).json({ qtd_likes: publicacaoAtualizada.qtd_likes });

    } catch (error) {
        return res.status(500).json({ erro: "Erro ao adicionar a curtida" });
    }

});

router.delete("/curtidas/publicacao", async (req, res) => {

    const { publicacao_id } = req.body;
    const publicacaoExiste = await Publicacao.findByPk(publicacao_id);

    try {

        if (!publicacao_id) {
            return res.status(400).json({ erro: "Todos os campos são obrigatórios" });
        }
        if (!publicacaoExiste) {
            return res.status(400).json({ erro: "Publicação não encontrada" });
        }

        if (publicacaoExiste.qtd_likes > 0) {
            await publicacaoExiste.decrement('qtd_likes');
        }

        const publicacaoAtualizada = await Publicacao.findByPk(publicacao_id);

        return res.status(200).json({ qtd_likes: publicacaoAtualizada.qtd_likes });

    } catch (error) {
        return res.status(500).json({ erro: "Erro ao retirar a curtida" });

    }
    
});

router.post("/curtidas/comentario", async (req, res) => {

    const { comentario_id } = req.body;
    const comentarioExiste = await Comentario.findByPk(comentario_id);

    try {

        if (!comentario_id) {
            return res.status(400).json({ erro: "Todos os campos são obrigatórios" });
        }
        if (!comentarioExiste) {
            return res.status(400).json({ erro: "Comentário não encontrado" });
        }

        await comentarioExiste.increment('qtd_likes');

        const comentarioAtualizado = await Comentario.findByPk(comentario_id);

        return res.status(200).json({ qtd_likes: comentarioAtualizado.qtd_likes });

    } catch (error) {
        return res.status(500).json({ erro: "Erro ao adicionar a curtida" });

    }

});

router.delete("/curtidas/comentario", async (req, res) => {

    const { comentario_id } = req.body;
    const comentarioExiste = await Comentario.findByPk(comentario_id);

    try {
        
        if (!comentario_id) {
            return res.status(400).json({ erro: "Todos os campos são obrigatórios" });
        }
        if (!comentarioExiste) {
            return res.status(400).json({ erro: "Comentário não encontrado" });
        }

        if (comentarioExiste.qtd_likes > 0) {
            await comentarioExiste.decrement('qtd_likes');
        }

        const comentarioAtualizado = await Comentario.findByPk(comentario_id);

        return res.status(200).json({ qtd_likes: comentarioAtualizado.qtd_likes });

    } catch (error) {
        return res.status(500).json({ erro: "Erro ao retirar a curtida" });

    }
});