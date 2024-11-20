import  Publicacao  from "../models/Publicacoes.js";
import  Usuario  from "../models/Usuarios.js";
import  Comentario  from "../models/Comentarios.js";

export const createPublicacao = async (req, res) => {

    const { usuario_id, publicacao } = req.body;

    const usuarioExiste = await Usuario.findByPk(usuario_id);

    try {
        // Verifica se o usuário existe
        if (!usuarioExiste) {
            return res.status(400).json({ error: "Usuário não encontrado" });
        }

        // Valida se os campos foram preenchidos
        if (!publicacao || !usuario_id) {
            return res.status(400).json({ error: "Todos os campos são obrigatórios" });
        }

        // Cria uma nova publicação associada ao usuário
        const novaPublicacao = await Publicacao.create({
            publicacao,
            usuario_id,
        });

        // Retorna a publicação criada
        return res.status(201).json(novaPublicacao);

    } catch (error) {
        // Trata erros na criação da publicação
        return res.status(500).json({ error: "Erro ao criar publicação" });
    }

};

export const listAllPublicacao = async (res) => {

    try {
        const publicacoes = await Publicacao.findAll({
            include: [{
                model: Usuario,
                attributes: ['usuario_id', 'nick', 'imagem'],
            }],
        });

        // Formata os dados das publicações
        const data = publicacoes.map(publicacao => ({
            publicacao_id: publicacao.publicacao_id,
            publicacao: publicacao.publicacao,
            usuario_id: publicacao.usuario_id,
            nick: publicacao.Usuario.nick,
            imagem: publicacao.Usuario.imagem,
            qtd_likes: publicacao.qtd_likes,
            criado_em: publicacao.criado_em,
        }));

        // Retorna as publicações e o total
        return res.status(200).json({
            data,
            total: data.length,
        });

    } catch (error) {
        // Trata erros na listagem das publicações
        return res.status(500).json({ error: "Erro ao buscar publicações" });
    }
};

export const listAllUsuario = async (req, res) => {

    const { usuario_id } = req.params;

    const usuarioExiste = await Usuario.findByPk(usuario_id);

    try {
        // Verifica se o usuário existe
        if (!usuarioExiste) {
            return res.status(404).json({ erro: "Usuário não encontrado" });
        }

        // Busca publicações do usuário
        const publicacoes = await Publicacao.findAll({
            where: { usuario_id },
            attributes: [
                'publicacao_id',
                'publicacao',
                'usuario_id',
                'criado_em',
                'qtd_likes',
                'qtd_comentarios'
            ],
            include: [
                {
                    model: Comentario,
                    attributes: []
                }
            ],
        });

        // Retorna as publicações e o total
        return res.status(200).json({
            data: publicacoes,
            total: publicacoes.length
        });

    } catch (error) {
        // Trata erros na listagem das publicações do usuário
        return res.status(500).json({ erro: "Erro ao listar" });
    }
    
};

export const listOnePublicacao = async (req, res) => {

    const { publicacao_id } = req.params;

    const publicacaoExiste = await Publicacao.findByPk(publicacao_id);

    try {
        // Verifica se a publicação existe
        if (!publicacaoExiste) {
            return res.status(404).json({ erro: "Publicação não encontrada" });
        }

        // Busca a publicação específica e inclui dados do usuário e comentários
        const publicacao = await Publicacao.findOne({
            where: { publicacao_id },
            attributes: [
                'publicacao_id',
                'publicacao',
                'usuario_id',
                'qtd_likes',
                'criado_em'
            ],
            include: [
                {
                    model: Usuario,
                    attributes: ['nick', 'imagem']
                },
                {
                    model: Comentario,
                    attributes: [
                        'comentario_id',
                        'comentario',
                        'usuario_id',
                        'qtd_likes',
                        'criado_em'
                    ],
                }
            ],
        });
        
        // Retorna a publicação e seus detalhes
        return res.status(200).json(publicacao);

    } catch (erro) {
        // Trata erros ao buscar a publicação
        return res.status(500).json({ erro: "Erro ao listar" });
    }

};

export const deletePublicacao = async (req, res) => {

    const { publicacao_id, usuario_id } = req.body;
    
    const publicacao = await Publicacao.findByPk(publicacao_id);

    try {
        // Verifica se a publicação existe
        if (!publicacao) {
            return res.status(400).json({ erro: "Publicação não encontrada " });
        }

        // Verifica se o usuário foi informado
        if (!usuario_id) {
            return res.status(400).json({ erro: "Usuário não informado" });
        }

        // Verifica se o usuário é o autor da publicação
        if (publicacao.usuario_id !== usuario_id) {
            return res.status(403).json({ erro: "Usuário não autorizado" });
        }

        // Deleta a publicação
        await publicacao.destroy();

        // Retorna uma mensagem de sucesso
        return res.status(200).json({ mensagem: "Publicação deletado com sucesso" });

    } catch (error) {
        // Trata erros ao deletar a publicação
        return res.status(500).json({ erro: "Erro ao deletar a publicação" });
    }

}