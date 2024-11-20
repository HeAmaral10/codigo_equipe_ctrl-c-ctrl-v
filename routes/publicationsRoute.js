import express from "express";

import {
    createPublicacao,
    listAllPublicacao,
    listAllUsuario,
    listOnePublicacao,
    deletePublicacao,
} from "../controllers/publicacaoController.js";

const router = express.Router();

// Rota para criar uma nova publicação
router.post("/publicacoes", createPublicacao);

// Rota para listar todas as publicações com informações do usuário
router.get("/publicacoes", listAllPublicacao);

// Rota para listar todas as publicações de um usuário específico
router.get("/publicacoes/de/:usuario_id", listAllUsuario);

// Rota para obter uma publicação específica com comentários e informações do usuário
router.get("/publicacoes/:publicacao_id", listOnePublicacao);

// Rota para deletar uma publicação
router.delete("/publicacoes", deletePublicacao);

export default router;