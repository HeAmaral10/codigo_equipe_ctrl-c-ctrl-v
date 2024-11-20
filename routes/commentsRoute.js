import express from "express";

import {
    createComentario,
    listPublicacaoComentario,
    deleteComentario, 
} from "../controllers/commentController.js";

const router = express.Router();

// Rota para criar um novo comentário
router.post("/comentarios", createComentario);

// Rota para listar comentários de uma publicação específica
router.get("/comentarios", listPublicacaoComentario);

// Rota para deletar um comentário específico
router.delete("/comentarios", deleteComentario);

export default router;