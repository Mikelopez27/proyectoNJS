const express = require("express");
const tipocli = require("../controllers/tipocli.controller.js")
const middleware = require("../middleware.js")

const router = express.Router();

router.get("/verTipoCli", middleware, tipocli.ver)
router.get("/selectTipoCli", middleware, tipocli.select)
router.post("/selectXempct", middleware, tipocli.selectXemp)
router.post("/EmpTipCli", middleware, tipocli.emptipocli)
router.post("/agregarTipoCli", middleware, tipocli.agregar)
router.put("/editarTipoCli/:tip_clave", middleware, tipocli.editar)
router.delete("/eliminarTipoCli/:tip_clave", middleware, tipocli.eliminar);

module.exports = router;