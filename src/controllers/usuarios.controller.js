const knex = require('knex');
const config = require('../../knexfile');

const db = knex(config);

const tipoTexto = {
  1: 'Supervisor',
  2: 'Empresa',
  3: 'Empleado'
};
const actividad = {
  0: 'Inactivo',
  1: 'Activo'
};


exports.ver = async (req, res) => {
  try {
    const usuariosRaw = await db('usuario')
      .select('usuario.usu_numctrl', 'usuario.usu_correo', 'usuario.usu_nombre', 'usuario.usu_contra', 'usuario.usu_estatus', 'usuario.usu_tipo', 'empresa.emp_nomcom')
      .join('empresa', 'usuario.emp_clave', '=', 'empresa.emp_clave');

    const usuarios = usuariosRaw.map(usuario => ({
      usu_numctrl: usuario.usu_numctrl,
      usu_correo: usuario.usu_correo,
      usu_nombre: usuario.usu_nombre,
      usu_contra: usuario.usu_contra,
      usu_estatus: actividad[usuario.usu_estatus],
      usu_tipo: tipoTexto[usuario.usu_tipo],
      emp_nomcom: usuario.emp_nomcom
    }));

    res.send({
      result: usuarios
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error en el servidor');
  }


};

exports.agregar = async (req, res) => {
  try {
    const { emp_clave, usu_correo, usu_nombre, usu_contra, usu_estatus, usu_tipo } = req.body;

    const [usu_numctrl] = await db('usuario').insert({
      emp_clave,
      usu_correo,
      usu_nombre,
      usu_contra,
      usu_estatus,
      usu_tipo
    });

    const insertedRow = await db('usuario')
      .select('usuario.usu_numctrl', 'usuario.usu_correo', 'usuario.usu_nombre', 'usuario.usu_contra', 'usuario.usu_estatus', 'usuario.usu_tipo', 'empresa.emp_nomcom')
      .join('empresa', 'usuario.emp_clave', '=', 'empresa.emp_clave')
      .where('usuario.usu_numctrl', usu_numctrl).first();
    // console.log(insertedRow);

    const usuarioInsert = {
      usu_numctrl: insertedRow.usu_numctrl,
      usu_correo: insertedRow.usu_correo,
      usu_nombre: insertedRow.usu_nombre,
      usu_contra: insertedRow.usu_contra,
      usu_estatus: actividad[insertedRow.usu_estatus],
      usu_tipo: tipoTexto[insertedRow.usu_tipo],
      emp_nomcom: insertedRow.emp_nomcom
    };


    res.send({
      result: usuarioInsert
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error en el servidor' });
  }
};


exports.editar = async (req, res) => {
  try {
    const { usu_numctrl } = req.params;
    const { emp_clave, usu_correo, usu_nombre, usu_contra, usu_estatus, usu_tipo } = req.body;

    const updatedRows = await db('usuario')
      .where('usu_numctrl', usu_numctrl)
      .update({
        emp_clave,
        usu_correo,
        usu_nombre,
        usu_contra,
        usu_estatus,
        usu_tipo
      });

    if (updatedRows > 0) {
      const updatedRow = await db('usuario')
        .select('usuario.usu_numctrl', 'usuario.usu_correo', 'usuario.usu_nombre', 'usuario.usu_contra', 'usuario.usu_estatus', 'usuario.usu_tipo', 'empresa.emp_nomcom')
        .join('empresa', 'usuario.emp_clave', '=', 'empresa.emp_clave')
        .where('usuario.usu_numctrl', usu_numctrl).first()

      const usuarioEdit = {
        usu_numctrl: updatedRow.usu_numctrl,
        usu_correo: updatedRow.usu_correo,
        usu_nombre: updatedRow.usu_nombre,
        usu_contra: updatedRow.usu_contra,
        usu_estatus: actividad[updatedRow.usu_estatus],
        usu_tipo: tipoTexto[updatedRow.usu_tipo],
        emp_nomcom: updatedRow.emp_nomcom
      };

      res.json({ result: usuarioEdit });
    } else {
      res.status(404).json({ msg: 'Usuario no encontrado o no se pudo actualizar' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error en el servidor' });
  }
};

exports.eliminar = async (req, res) => {
  try {
    const { usu_numctrl } = req.params;

    const deletedRows = await db('usuario')
      .where('usu_numctrl', usu_numctrl)
      .del();

    if (deletedRows > 0) {
      res.json({ msg: 'Usuario eliminada exitosamente' });
    } else {
      res.status(404).json({ msg: 'Usuario no encontrado o no se pudo eliminar' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error en el servidor' });
  }
};

exports.select = async (req, res) => {
  try {
    const usuarioselec = await db('usuario').select('usu_numctrl', 'usu_nombre');

    res.send({
      result: usuarioselec
    });


  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error en el servidor' });
  }

};

exports.selectXemp = async (req, res) => {
  try {
    const {empresa} = req.body
    const usuarioselec = await db('usuario').select('usu_numctrl', 'usu_nombre').where("emp_clave", empresa);

    res.send({
      result: usuarioselec
    });


  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error en el servidor' });
  }

};

exports.empusu = async (req, res) => {
  try {
    const {empresa} = req.body
    const usuarioBusqueda = await db('usuario')
        .select('usuario.usu_numctrl', 'usuario.usu_correo', 'usuario.usu_nombre', 'usuario.usu_contra', 'usuario.usu_estatus', 'usuario.usu_tipo', 'empresa.emp_nomcom')
        .join('empresa', 'usuario.emp_clave', '=', 'empresa.emp_clave')
        .where('usuario.emp_clave', empresa);

        const usuarios = usuarioBusqueda.map(usuario => ({
          usu_numctrl: usuario.usu_numctrl,
          usu_correo: usuario.usu_correo,
          usu_nombre: usuario.usu_nombre,
          usu_contra: usuario.usu_contra,
          usu_estatus: actividad[usuario.usu_estatus],
          usu_tipo: tipoTexto[usuario.usu_tipo],
          emp_nomcom: usuario.emp_nomcom
        }));

    res.send({
      result: usuarios
    });


  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error en el servidor' });
  }

};
