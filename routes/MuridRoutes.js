const {handlerGetMurid, handlerGetMuridID, handlerSaveMurid, handleEditMurid, handleDeleteMurid, handleChangeFoto} = require('../controllers/MuridController');
const verifyToken = require('../middleware/VerifyToken');

const urlApi = '/api/v1';
const muridRoutes = [
  {
    method: 'GET',
    path: urlApi + '/murid',
    handler: handlerGetMurid,
    options: {
      pre: [verifyToken]
    }
  },
  {
    method: 'GET',
    path: urlApi + '/murid/{id_murid}',
    handler: handlerGetMuridID,
    options: {
      pre: [verifyToken]
    }
  },
  {
    method: 'POST',
    path: urlApi + '/simpan/murid',
    options: {
      payload: {
          maxBytes: 10485760, // 10 MB
          output: 'stream',
          allow: 'multipart/form-data',
          multipart: true
      }
  },
    handler: handlerSaveMurid,
  },
  {
    method: 'PATCH',
    path: urlApi + '/edit/murid/{id_murid}',
    handler: handleEditMurid
  },
  {
    method: 'PATCH',
    path: urlApi + '/edit/murid/foto/{id_murid}',
    options: {
      payload: {
          maxBytes: 10485760, // 10 MB
          output: 'stream',
          allow: 'multipart/form-data',
          multipart: true
      }
  },
    handler: handleChangeFoto
  },
  {
    method: 'DELETE',
    path: urlApi + '/hapus/murid/{id_murid}',
    handler: handleDeleteMurid
  }
];

module.exports = muridRoutes;