const express = require('express');
const config = require('./config');
const cors = require('cors');
const usuarioRouter = require('./routes/usuario.routes.js')
const authRouter = require('./routes/auth.routes.js')
const empresaRouter = require('./routes/empresa.routes.js')
const tipocliRouter = require('./routes/tipocli.routes.js')
const sucursalRouter = require('./routes/sucursal.routes.js')
const campanaRouter = require('./routes/campana.routes.js')
const clienteRouter = require('./routes/cliente.routes.js')
const visitaRouter = require('./routes/visita.routes.js')

const app = express();
app.use(express.json())
app.use(cors({
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));

app.set('port',config.app.port);

app.use(authRouter)

app.use(empresaRouter)
app.use(usuarioRouter)
app.use(tipocliRouter)
app.use(sucursalRouter)
app.use(campanaRouter)
app.use(clienteRouter)
app.use(visitaRouter)

module.exports = app;