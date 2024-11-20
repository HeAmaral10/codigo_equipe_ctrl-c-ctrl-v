import express from "express";

import {
  createUsuario, 
  listUsuarios,
  detailUsuario,
  updateUsuarios,
} from "../controllers/userController.js"; // Importa de outro arquivo

const router = express.Router(); //pacote de desenvolvimento web- conecta frontend e backend

// Rota para criar um novo usuario
router.post("/usuarios", createUsuario); // Cria um recurso/produto por uma solicitação

//rota para listar usuario
router.get("/usuarios", listUsuarios); // Pega a informação

// Rota para detalhar um usuario
router.get("/usuarios/:id", detailUsuario);// pega o ID do usuario a ser detalhado 

//rota para atualizar um usuario
router.patch("/usuarios/:id", updateUsuarios); // Patch atualiza se existe, caso contrário não atualiza

export default router; // Exportar o arquivo (não precisa usar chave para especificar o valor exportado)