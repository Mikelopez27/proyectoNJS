const knex = require('knex');
const config = require('../../knexfile');

const db = knex(config);


exports.ver = async (req, res) => {
  try {
    const empresas = await db('empresa').select('*');

    res.send({
      result: empresas
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error en el servidor');
  }
};

exports.agregar = async (req, res) => {
  try {
    const { emp_nomcom, emp_razon, emp_cp, emp_calle, emp_col, emp_cd, emp_conta1, emp_cel1, emp_conta2, emp_cel2, emp_status } = req.body;

    const [emp_clave] = await db('empresa').insert({
      emp_nomcom,
      emp_razon,
      emp_cp,
      emp_calle,
      emp_col,
      emp_cd,
      emp_conta1,
      emp_cel1,
      emp_conta2,
      emp_cel2,
      emp_status
    });

    const insertedRow = await db('empresa').where('emp_clave', emp_clave).first();

    res.send({
      result: insertedRow
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Token no válido' });
  }
};


exports.editar = async (req, res) => {
  try {
    const { emp_clave } = req.params; 
    const { emp_nomcom, emp_razon, emp_cp, emp_calle, emp_col, emp_cd, emp_conta1, emp_cel1, emp_conta2, emp_cel2, emp_status } = req.body;

    const updatedRows = await db('empresa')
      .where('emp_clave', emp_clave)
      .update({
        emp_nomcom,
        emp_razon,
        emp_cp,
        emp_calle,
        emp_col,
        emp_cd,
        emp_conta1,
        emp_cel1,
        emp_conta2,
        emp_cel2,
        emp_status
      });

    if (updatedRows > 0) {
      const updatedRow = await db('empresa').where('emp_clave', emp_clave).first();
      res.json({ result: updatedRow });
    } else {
      res.status(404).json({ msg: 'Empresa no encontrada o no se pudo actualizar' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error en el servidor' });
  }
};

exports.eliminar = async (req, res) => {
  try {
    const { emp_clave } = req.params; 

    const deletedRows = await db('empresa')
      .where('emp_clave', emp_clave)
      .del();

    if (deletedRows > 0) {
      res.json({ msg: 'Empresa eliminada exitosamente' });
    } else {
      res.status(404).json({ msg: 'Empresa no encontrada o no se pudo eliminar' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error en el servidor' });
  }
};
