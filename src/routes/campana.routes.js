const express = require("express");
const multer = require("multer");
const campana = require("../controllers/campana.controller.js")
const middleware = require("../middleware.js")
const path = require('path');

const router = express.Router();
const diskstorage = multer.diskStorage({
    destination: path.join(__dirname, '../../images'),
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-cam-' + file.originalname)
    }
})

const fileUpload = multer({
    storage: diskstorage
}).single('cam_imagen')

router.get("/verCampana", middleware, campana.ver)
router.get("/selectCampana", middleware, campana.select)
router.post("/selectXempcam", middleware, campana.selectXemp)
router.post("/EmpCam", middleware, campana.empcam)
router.post("/AnalisisCamp", middleware, campana.anacamp)
router.post("/agregarCampana", fileUpload, campana.agregar)
router.put("/editarCampana/:cam_clave", middleware, campana.editar)
router.delete("/eliminarCampana/:cam_clave", middleware, campana.eliminar);

module.exports = router;