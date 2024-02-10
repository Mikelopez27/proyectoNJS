const express = require("express");
const campana = require("../controllers/campana.controller.js")
const middleware = require("../middleware.js")

const router = express.Router();

router.get("/verCampana", middleware, campana.ver)
router.get("/selectCampana", middleware, campana.select)
router.get("/EmpCam", middleware, campana.empcam)
router.post("/agregarCampana", middleware, campana.agregar)
router.put("/editarCampana/:cam_clave", middleware, campana.editar)
router.delete("/eliminarCampana/:cam_clave", middleware, campana.eliminar);

module.exports = router;