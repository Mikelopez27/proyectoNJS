const express = require("express");
const usuario = require("../controllers/usuarios.controller.js")
const middleware = require("../middleware.js")

const router = express.Router();

router.get("/verUsuario", middleware, usuario.ver)
router.get("/selectUsuario", middleware, usuario.select)
router.post("/agregarUsuario", middleware, usuario.agregar)
router.put("/editarUsuario/:usu_numctrl", middleware, usuario.editar)
router.delete("/eliminarUsuario/:usu_numctrl", middleware, usuario.eliminar);


module.exports = router;