import express from "express";

import {
    likePublicacao,
    deslikePublicacao,
    likeComentario,
    deslikeComentario,
} from "../controllers/likeController.js";

const router = express.Router();

// Rota para adicionar uma curtida a uma publicação
router.post("/curtidas/publicacao", likePublicacao);

// Rota para adicionar uma curtida a um comentário
router.post("/curtidas/comentario", likeComentario);

// Rota para remover uma curtida de um comentário
router.delete("/curtidas/comentario", deslikeComentario);

// Rota para remover uma curtida de uma publicação
router.delete("/curtidas/publicacao", deslikePublicacao);

export default router;