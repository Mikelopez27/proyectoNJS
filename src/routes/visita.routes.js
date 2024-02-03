const express = require("express");
const visita = require("../controllers/visita.controller.js")
const middleware = require("../middleware.js")

const router = express.Router();

router.get("/verVisita", middleware, visita.ver)
router.post("/agregarVisita", middleware, visita.agregar)
router.put("/editarVisita/:visfecha", middleware, visita.editar)
router.delete("/eliminarVisita/:vis_fecha", visita.eliminar);

module.exports = router;