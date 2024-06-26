const express = require("express");
const multer = require("multer");
const empresa = require("../controllers/empresa.controller.js")
const middleware = require("../middleware.js")
const path = require('path');

const router = express.Router();
const diskstorage = multer.diskStorage({
    destination: path.join(__dirname, '../../images'),
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-emp-' + file.originalname)
    }
})

const fileUpload = multer({
    storage: diskstorage
}).single('emp_logo')

router.get("/verEmpresa", middleware, empresa.ver)
router.get("/selectEmpresa", middleware, empresa.select)
router.post("/LinksEmpresa", middleware, empresa.empresaLinks)
router.post("/LinkAgregarCliente/:enc=:key=:iv", empresa.LinkAgCli)
router.post("/traerImg", empresa.verImagen)
router.post("/Empresa", middleware, empresa.empresaUs)
router.post("/CVCS", middleware, empresa.DatosCVCS)
router.post("/agregarEmpresa", fileUpload, middleware, empresa.agregar)
router.put("/editarEmpresa/:emp_clave", fileUpload, middleware, empresa.editar)
router.delete("/eliminarEmpresa/:emp_clave", middleware, empresa.eliminar);

module.exports = router;