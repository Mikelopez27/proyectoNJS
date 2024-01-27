const express = require('express');
const config = require('./config');
const cors = require('cors');
// const usuarioRouter = require('./routes/usuario.routes.js')
const authRouter = require('./routes/auth.routes.js')
const empresaRouter = require('./routes/empresa.routes.js')


const app = express();
app.use(express.json())
app.use(cors({
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));

app.set('port',config.app.port);

//rutas
app.use(authRouter)

app.use(empresaRouter)

module.exports = app;