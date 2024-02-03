const express = require("express");
const auth = require("../controllers/auth.controller.js")
const middleware = require("../middleware.js")

const router = express.Router();

router.post("/login", auth.autenticacion)
router.post("/logout", middleware, auth.logout)

module.exports = router;