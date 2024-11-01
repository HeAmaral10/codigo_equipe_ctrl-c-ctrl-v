import express from "express";
import { Publicacao, sequelize, Usuario } from "./modelos.js";

const router = express.Router();

router.post("/publicacoes", async (req, res) => {

    const { usuario_id, publicacao } = req.body;
    const usuarioExiste = await Usuario.findByPk(usuario_id);

    try {

        if (!usuarioExiste) {
            return res.status(400).json({ error: "Usuário não encontrado"});
        }
        if (publicacao.trim() === "" || usuario_id.trim() === "") {
            return res.status(400).json({ error: "Todos os campos são obrigatórios"});
        }
    
        const novaPublicacao = await Publicacao.create({
            publicacao,
            usuario_id,
            publicacao_id,
        });

        return res.status(201).json(novaPublicacao);

    } catch (error) {
        return res.status(500).json({ error: "Erro ao criar publicação"});
    }
    
});

router.get("/publicacoes", async (req, res) => {

    try {
        const publicacoes = await Publicacao.findAll({
            include: [{
                model: Usuario,
                atributes: [ 'usuario_id', 'nick', 'imagem'],
            }],
        });

        const data = publicacoes.map(publicacao => ({
            publicacao_id: publicacao.publicacao_id,
            publicacao: publicacao.publicacao,
            usuario_id: publicacao.usuario_id,
            nick: publicacao.Usuario.nick,
            imagem : publicacao.Usuario.imagem,
            qtd_likes: publicacao.qtd_likes,
            criado_em: publicacao.criado_em,
        }));

        return res.status(200).json({
            data,
            total: data.lenght,
        });

    } catch (error) {
        return res.status(500).json({ error: "Erro ao buscar publicações"});
    }

});

router.get("/publicacoes/de/:usuario_id", async (req, res) => {

    const { usuario_id } = req.params;
    const usuarioExiste = await Usuario.findByPk(usuario_id);

    try {

        if (!usuarioExiste) {
            return res.status(404).json({ erro: "Usuário não encontrado" });
        }

        const publicacoes = await Publicacao.findAll({
            where: { usuario_id },
            atributes: [
                'publicacao_id',
                'publicacao',
                'usuario_id',
                'nick',
                'imagem',
                'criado_em',
                [sequelize.fn('COUNT', sequelize.col('Likes.publicacao_id')), 'qtd_likes'],
                [sequelize.fn('COUNT', sequelize.col('Comentarios.publicacao_id')), 'qtd_comentarios'],

            ],
            include: [
                {
                    model: Like,
                    atributes: []
                },
                {
                    model: Comentario,
                    atributes: []
                }
            ],
            group: ['Publicacao.publicacao_id']
        });

        return res.status(200).json({
            data: publicacoes,
            total: publicacoes.lenght
        });

    } catch (error) {}

});

router.get("/publicacoes/:publicacao_id", async (req, res) => {

    const { publicacao_id } = req.params;
    const publicacaoExiste = await Publicacao.findByPk(publicacao_id);

    try {
        if (!publicacaoExiste) {
            return res.status(404).json({ erro: "Publicação não encontrada"});
        }

        const publicacao = await Publicacao.findOne ({
            where: { publicacao_id },
            atributes: [
                'publicacao_id',
                'publicacao',
                'usuario_id',
                'nick',
                'imagem',
                'criado_em',
                [sequelize.fn('COUNT', sequelize.col('Likes.publicacao_id')), 'qtd_likes'],
            ],
            include: [
                {
                    model: Usuario,
                    atributes: ['nick']
                },
                {
                    model: Like,
                    atrbiutes: []
                },
                {
                    model: Comentario,
                    atributes: [
                        'comentario_id',
                        'comentario',
                        'usuario_id',
                        'nick',
                        'imagem',
                        'criado_em'
                    ],
                    include: [
                        {
                            model: Like,
                            atributes: [[sequelize.fn('COUNT', sequelize.col('Likes.comentario_id')), 'qtd_likes']]
                        }
                    ] 
                }
            ],
            group: ['Publicacao.publicacao_id', "Comentarios.comentario_id"]
        });
        
        return res.status(200).json(publicacao);

    } catch (erro) {}

});

router.delete("/publicacoes", async (req, res) => {

    const { publicacao_id, usuario_id } = req.body;
    const publicacao = await Publicacao.findByPk(publicacao_id);

    try {
        if (!publicacao) {
            return res.status(400).json({ erro: "Publicação não encontrada "});
        }
        if (!usuario_id) {
            return res.status(400).json({ erro: "Usuário não informado" });
        }

        if (publicacao.usuario_id !== usuario_id) {
            return res.status(403).json({ erro: "Usuário não autorizado" });
        }

        await publicacao.destroy();

        return res.status(200).json({ mensagem: "Publicação deletado com sucesso" });

    } catch (error) {}

});

export default router;