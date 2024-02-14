const express = require("express");
const sucursal = require("../controllers/sucursal.controller.js")
const middleware = require("../middleware.js")

const router = express.Router();

router.get("/verSucursal", middleware, sucursal.ver)
router.get("/selectSucursal", middleware, sucursal.select)
router.post("/selectXempsuc", middleware, sucursal.selectXemp)
router.post("/EmpSuc", middleware, sucursal.empsuc)
router.post("/agregarSucursal", middleware, sucursal.agregar)
router.put("/editarSucursal/:suc_clave", middleware, sucursal.editar)
router.delete("/eliminarSucursal/:suc_clave", middleware, sucursal.eliminar);

module.exports = router;