const knex = require('knex');
const config = require('../../knexfile');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto')

const db = knex(config);


exports.ver = async (req, res) => {
  try {
    const empresas = await db('empresa').select('*');

    res.send({
      result: empresas
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error de Servidor' });
  }
};

exports.verImagen = async (req, res) => {
  try {
    const { empresa } = req.body;
    const imagen = await db('empresa').select('emp_logo').where('emp_clave', empresa).first();

    if (imagen) {
      const imageData = imagen.emp_logo;
      res.writeHead(200, {
        'Content-Type': 'image/jpeg',
        'Content-Length': imageData.length
      });
      res.end(imageData);
    } else {
      res.status(404).json({ msg: 'Imagen no encontrada' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error de Servidor' });
  }
};

exports.agregar = async (req, res) => {
  try {
    let data;

    if (req.file == null) {
      data = fs.readFileSync(path.join(__dirname, '../../images/' + 'company.png'));
    }
    else {
      const type = req.file.mimetype;
      const name = req.file.originalname;
      data = fs.readFileSync(path.join(__dirname, '../../images/' + req.file.filename));
    }


    const { emp_nomcom, emp_razon, emp_cp, emp_calle, emp_col, emp_cd, emp_conta1, emp_cel1, emp_conta2, emp_cel2, emp_status } = req.body;

    const [emp_clave] = await db('empresa').insert({
      emp_nomcom,
      emp_logo: data,
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

    const key = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);

    let encryptedData = cipher.update(emp_clave.toString(), 'utf-8', 'base64');
    encryptedData += cipher.final('base64');
    encryptedData = encryptedData.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');

    let keyHex = key.toString('hex');
    let ivHex = iv.toString('hex');

    const link = `https://www.linknow.mx/LinkAgregarCliente/${encryptedData}=${keyHex}=${ivHex}`;


    const updatedRows = await db('empresa')
      .where('emp_clave', emp_clave)
      .update({
        emp_linkagc: link
      });

    if (req.file) {
      fs.unlinkSync(path.join(__dirname, '../../images/' + req.file.filename));
    }


    const insertedRow = await db('empresa').where('emp_clave', emp_clave).first();

    res.send({
      result: insertedRow
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error de Servidor' });
  }
};

exports.editar = async (req, res) => {
  try {

    let data;

    if (req.file == null) {
      data = fs.readFileSync(path.join(__dirname, '../../images/' + 'company.png'));
    }
    else {
      const type = req.file.mimetype;
      const name = req.file.originalname;
      data = fs.readFileSync(path.join(__dirname, '../../images/' + req.file.filename));
    }

    const { emp_clave } = req.params;
    const { emp_nomcom, emp_razon, emp_cp, emp_calle, emp_col, emp_cd, emp_conta1, emp_cel1, emp_conta2, emp_cel2, emp_status } = req.body;

    const updatedRows = await db('empresa')
      .where('emp_clave', emp_clave)
      .update({
        emp_nomcom,
        emp_logo: data,
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

exports.select = async (req, res) => {
  try {
    const empresaselec = await db('empresa').select('emp_clave', 'emp_nomcom');

    res.send({
      result: empresaselec
    });


  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error en el servidor' });
  }

};

exports.empresaUs = async (req, res) => {
  try {

    const { empresa } = req.body;

    const DatosEmp = await db('empresa').select('*').where('emp_clave', empresa);
    res.send({
      result: DatosEmp
    });


  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error en el servidor' });
  }

};

exports.DatosCVCS = async (req, res) => {
  try {

    const { empresa } = req.body;

    const CountCli = await db('cliente').count('cli_clave as contador').where('emp_clave', empresa).first();
    const CountVis = await db('visita').count('usuario.emp_clave as contador')
      .join('usuario', 'visita.usu_numctrl', '=', 'usuario.usu_numctrl')
      .where('usuario.emp_clave', empresa).first();
    const CountCam = await db('campana').count('emp_clave as contador').where('emp_clave', empresa).first();
    const CountSuc = await db('sucursal').count('emp_clave as contador').where('emp_clave', empresa).first();
    res.send({
      Clientes: CountCli.contador, Visitas: CountVis.contador, Campaña: CountCam.contador, Sucursal: CountSuc.contador
    });


  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error en el servidor' });
  }

};


exports.LinkAgCli = async (req, res) => {
  try {
    const { enc, key, iv } = req.params;

    const keyBuffer = Buffer.from(key, 'hex');
    const ivBuffer = Buffer.from(iv, 'hex');

    const decipher = crypto.createDecipheriv('aes-256-cbc', keyBuffer, ivBuffer);

    let decryptedData = decipher.update(enc, 'base64', 'utf-8');
    decryptedData += decipher.final('utf-8');

    const campana = await db('campana')
      .select('*').where('emp_clave', decryptedData).first();
    const tipocli = await db('tipocli')
      .select('*').where('emp_clave', decryptedData).first();
    const usuario = await db('usuario')
      .select('*').where('emp_clave', decryptedData).first();
    const sucursal = await db('sucursal')
      .select('*').where('emp_clave', decryptedData).first();


    res.json({ empresa: parseInt(decryptedData), campana: campana.cam_clave, tipocli: tipocli.tip_clave, usuario: usuario.usu_numctrl, sucursal: sucursal.suc_clave });


  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error en el servidor' });
  }

};

exports.empresaLinks = async (req, res) => {
  try {

    const { empresa } = req.body;

    const LinksEmp = await db('empresa').select('emp_linkagc', 'emp_linkv').where('emp_clave', empresa).first();
    res.send({
      result: LinksEmp
    });


  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error en el servidor' });
  }

};



