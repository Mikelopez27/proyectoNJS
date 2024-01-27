const express = require("express");
const empresa = require("../controllers/empresa.controller.js")
const middleware = require("../middleware.js")

const router = express.Router();

router.get("/verEmpresa", empresa.ver)
router.post("/agregarEmpresa", empresa.agregar)
router.put("/editarEmpresa/:emp_clave", empresa.editar)
router.delete("/eliminarEmpresa/:emp_clave", empresa.eliminar);

module.exports = router;