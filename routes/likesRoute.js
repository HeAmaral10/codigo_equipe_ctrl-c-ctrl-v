import express from "express";
import { Publicacao } from "../models/Publicacoes";
import { Comentario } from "../models/Comentarios";

const router = express.Router();

// Rota para adicionar uma curtida a uma publicação
router.post("/curtidas/publicacao", async (req, res) => {
    const { publicacao_id } = req.body;

    // Verifica se a publicação existe no banco de dados
    const publicacaoExiste = await Publicacao.findByPk(publicacao_id);

    try {
        // Valida se o campo `publicacao_id` foi preenchido
        if (!publicacao_id) {
            return res.status(400).json({ erro: "Todos os campos são obrigatórios" });
        }

        // Verifica se a publicação foi encontrada
        if (!publicacaoExiste) {
            return res.status(400).json({ erro: "Publicação não encontrada" });
        }

        // Incrementa o número de curtidas da publicação
        await publicacaoExiste.increment('qtd_likes');

        // Busca a publicação atualizada para retornar o número de curtidas atualizado
        const publicacaoAtualizada = await Publicacao.findByPk(publicacao_id);

        // Retorna o número atualizado de curtidas
        return res.status(200).json({ qtd_likes: publicacaoAtualizada.qtd_likes });

    } catch (error) {
        // Trata qualquer erro no processo
        return res.status(500).json({ erro: "Erro ao adicionar a curtida" });
    }
});

// Rota para remover uma curtida de uma publicação
router.delete("/curtidas/publicacao", async (req, res) => {
    const { publicacao_id } = req.body;

    // Verifica se a publicação existe no banco de dados
    const publicacaoExiste = await Publicacao.findByPk(publicacao_id);

    try {
        // Valida se o campo `publicacao_id` foi preenchido
        if (!publicacao_id) {
            return res.status(400).json({ erro: "Todos os campos são obrigatórios" });
        }

        // Verifica se a publicação foi encontrada
        if (!publicacaoExiste) {
            return res.status(400).json({ erro: "Publicação não encontrada" });
        }

        // Se o número de curtidas for maior que zero, decrementa o número de curtidas
        if (publicacaoExiste.qtd_likes > 0) {
            await publicacaoExiste.decrement('qtd_likes');
        }

        // Busca a publicação atualizada para retornar o número de curtidas atualizado
        const publicacaoAtualizada = await Publicacao.findByPk(publicacao_id);

        // Retorna o número atualizado de curtidas
        return res.status(200).json({ qtd_likes: publicacaoAtualizada.qtd_likes });

    } catch (error) {
        // Trata qualquer erro no processo
        return res.status(500).json({ erro: "Erro ao retirar a curtida" });
    }
});

// Rota para adicionar uma curtida a um comentário
router.post("/curtidas/comentario", async (req, res) => {
    const { comentario_id } = req.body;

    // Verifica se o comentário existe no banco de dados
    const comentarioExiste = await Comentario.findByPk(comentario_id);

    try {
        // Valida se o campo `comentario_id` foi preenchido
        if (!comentario_id) {
            return res.status(400).json({ erro: "Todos os campos são obrigatórios" });
        }

        // Verifica se o comentário foi encontrado
        if (!comentarioExiste) {
            return res.status(400).json({ erro: "Comentário não encontrado" });
        }

        // Incrementa o número de curtidas do comentário
        await comentarioExiste.increment('qtd_likes');

        // Busca o comentário atualizado para retornar o número de curtidas atualizado
        const comentarioAtualizado = await Comentario.findByPk(comentario_id);

        // Retorna o número atualizado de curtidas
        return res.status(200).json({ qtd_likes: comentarioAtualizado.qtd_likes });

    } catch (error) {
        // Trata qualquer erro no processo
        return res.status(500).json({ erro: "Erro ao adicionar a curtida" });
    }
});

// Rota para remover uma curtida de um comentário
router.delete("/curtidas/comentario", async (req, res) => {
    const { comentario_id } = req.body;

    // Verifica se o comentário existe no banco de dados
    const comentarioExiste = await Comentario.findByPk(comentario_id);

    try {
        // Valida se o campo `comentario_id` foi preenchido
        if (!comentario_id) {
            return res.status(400).json({ erro: "Todos os campos são obrigatórios" });
        }

        // Verifica se o comentário foi encontrado
        if (!comentarioExiste) {
            return res.status(400).json({ erro: "Comentário não encontrado" });
        }

        // Se o número de curtidas for maior que zero, decrementa o número de curtidas
        if (comentarioExiste.qtd_likes > 0) {
            await comentarioExiste.decrement('qtd_likes');
        }

        // Busca o comentário atualizado para retornar o número de curtidas atualizado
        const comentarioAtualizado = await Comentario.findByPk(comentario_id);

        // Retorna o número atualizado de curtidas
        return res.status(200).json({ qtd_likes: comentarioAtualizado.qtd_likes });

    } catch (error) {
        // Trata qualquer erro no processo
        return res.status(500).json({ erro: "Erro ao retirar a curtida" });
    }
});

export default router;