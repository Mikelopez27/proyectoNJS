const express = require("express");
const visita = require("../controllers/visita.controller.js")
const middleware = require("../middleware.js")

const router = express.Router();

router.get("/verVisita", middleware, visita.ver)
router.post("/agregarVisita", middleware, visita.agregar)
router.post("/agregarVCCXC", middleware, visita.insercionmulti)
router.post("/agregarLinkV", visita.agregarLinkV)
router.post("/ExportarReporte", middleware, visita.ExpRep)
router.post("/ReporteUsu", middleware, visita.ReporteUsu)
router.post("/GraficaVis", middleware, visita.GrafVis)
router.put("/editarVisita/:visfecha", middleware, visita.editar)
router.delete("/eliminarVisita/:vis_fecha", middleware, visita.eliminar)

module.exports = router;