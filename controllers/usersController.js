import Usuario from "../models/Usuarios.js"; // Modelo de Usuário
import bcrypt from "bcrypt";
import { Op } from "sequelize"; // Para buscas parciais (filtro)

const MIN_AGE = 16;

// Função para criar um novo usuário
export const createUsuario = async (req, res) => {
    const { nome, email, senha, nascimento, nick, imagem } = req.body;

    try {
        // Verifica se todos os campos obrigatórios estão presentes
        if (!nome || !email || !senha || !nascimento || !nick || !imagem) {
            return res.status(400).json({ erro: "Todos os campos são obrigatórios" });
        }

        // Verifica se o usuário tem mais de 16 anos
        const idade = new Date().getFullYear() - new Date(nascimento).getFullYear();
        if (idade < MIN_AGE) {
            return res.status(400).json({ erro: "A idade deve ser maior que 16 anos" });
        }

        // Verifica se o email ou o nick já estão em uso
        const emailExiste = await Usuario.findOne({ where: { email } });
        if (emailExiste) {
            return res.status(400).json({ erro: "Email já está em uso" });
        }

        const nickExiste = await Usuario.findOne({ where: { nick } });
        if (nickExiste) {
            return res.status(400).json({ erro: "Nick já está em uso" });
        }

        // Criptografa a senha
        const senhaCriptografada = await bcrypt.hash(senha, 10);

        // Cria o novo usuário
        const novoUsuario = await Usuario.create({
            nome,
            email,
            senha: senhaCriptografada,
            nascimento,
            nick,
            imagem: "https://link-para-imagem.png", // URL de imagem padrão
        });

        // Retorna o usuário criado
        return res.status(201).json({
            id: novoUsuario.id,
            nome: novoUsuario.nome,
            email: novoUsuario.email,
            nick: novoUsuario.nick,
            imagem: novoUsuario.imagem,
            nascimento: novoUsuario.nascimento,
        });
    } catch (error) {
        return res.status(500).json({ erro: "Erro ao criar usuário" });
    }
};

// Função para listar usuários com filtro por nome ou nick
export const listUsuarios = async (req, res) => {
    const { search } = req.query;

    try {
        let where = {};

        // Aplica o filtro de busca se o parâmetro for fornecido
        if (search) {
            where = {
                [Op.or]: [
                    { nome: { [Op.iLike]: `%${search}%` } }, // Busca parcial por nome
                    { nick: { [Op.iLike]: `%${search}%` } }, // Busca parcial por nick
                ],
            };
        }

        const usuarios = await Usuario.findAll({
            where,
        });

        return res.status(200).json(
            usuarios.map(usuario => ({
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                nick: usuario.nick,
                imagem: usuario.imagem,
                nascimento: usuario.nascimento,
            }))
        );
    } catch (error) {
        return res.status(500).json({ erro: "Erro ao buscar usuários" });
    }
};

// Função para obter detalhes de um usuário
export const detailUsuario = async (req, res) => {
    const { usuario_id } = req.params;

    try {
        const usuario = await Usuario.findByPk(usuario_id);

        if (!usuario) {
            return res.status(404).json({ erro: "Usuário não encontrado" });
        }

        return res.status(200).json({
            nome: usuario.nome,
            email: usuario.email,
            nick: usuario.nick,
            imagem: usuario.imagem,
            nascimento: usuario.nascimento,
        });
    } catch (error) {
        return res.status(500).json({ erro: "Erro ao buscar usuário" });
    }
};

// Função para atualizar um usuário
export const updateUsuarios = async (req, res) => {
    const { usuario_id } = req.params;
    const { nome, email, nick } = req.body;

    try {
        const usuario = await Usuario.findByPk(usuario_id);

        if (!usuario) {
            return res.status(404).json({ erro: "Usuário não encontrado" });
        }

        // Se nenhum campo foi fornecido para atualização
        if (!nome && !email && !nick) {
            return res.status(400).json({ erro: "Pelo menos um campo deve ser fornecido para atualização" });
        }

        // Verifica se o email ou o nick já estão em uso
        if (email && email !== usuario.email) {
            const emailExiste = await Usuario.findOne({ where: { email } });
            if (emailExiste) {
                return res.status(400).json({ erro: "Email já está em uso" });
            }
        }

        if (nick && nick !== usuario.nick) {
            const nickExiste = await Usuario.findOne({ where: { nick } });
            if (nickExiste) {
                return res.status(400).json({ erro: "Nick já está em uso" });
            }
        }

        // Atualiza os campos fornecidos
        await usuario.update({ nome, email, nick });

        return res.status(200).json({
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
            nick: usuario.nick,
            imagem: usuario.imagem,
            nascimento: usuario.nascimento,
        });
    } catch (error) {
        return res.status(500).json({ erro: "Erro ao atualizar usuário" });
    }
};