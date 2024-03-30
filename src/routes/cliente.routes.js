const express = require("express");
const cliente = require("../controllers/cliente.controller.js")
const middleware = require("../middleware.js")

const router = express.Router();

router.get("/verCliente", middleware, cliente.ver)
router.get("/selectCliente", middleware, cliente.select)
router.post("/agregarLinkC", cliente.agregarLinkC)
router.post("/busquedaXcel", middleware, cliente.busqedaxcel)
router.post("/selectXempcli", middleware, cliente.selectXemp)
router.post("/EmpCli", middleware, cliente.empcli)
router.post("/ContTipCli", middleware, cliente.conttipocli)
router.post("/agregarCliente", middleware, cliente.agregar)
router.put("/editarCliente/:cli_clave", middleware, cliente.editar)
router.delete("/eliminarCliente/:cli_clave", middleware, cliente.eliminar);

module.exports = router;