const express = require("express");
const empresa = require("../controllers/empresa.controller.js")
const middleware = require("../middleware.js")

const router = express.Router();

router.get("/verEmpresa",  empresa.ver)
router.get("/selectEmpresa", middleware, empresa.select)
router.post("/traerImg",  empresa.verImagen)
router.post("/agregarEmpresa", middleware, empresa.agregar)
router.put("/editarEmpresa/:emp_clave", middleware, empresa.editar)
router.delete("/eliminarEmpresa/:emp_clave", middleware, empresa.eliminar);

module.exports = router;