const {handlerGetGuru, handlerGetGuruID, handlerSaveGuru, handleEditGuru, handleDeleteGuru} = require('../controllers/GuruController');

const urlApi = '/api/v1';
const guruRoutes = [
  {
    method: 'GET',
    path: urlApi + '/guru',
    handler: handlerGetGuru,
  },
  {
    method: 'GET',
    path: urlApi + '/guru/{id_guru}',
    handler: handlerGetGuruID,
  },
  {
    method: 'POST',
    path: urlApi + '/simpan/guru',
    handler: handlerSaveGuru
  },
  {
    method: 'PATCH',
    path: urlApi + '/edit/guru/{id_guru}',
    handler: handleEditGuru
  },
  {
    method: 'DELETE',
    path: urlApi + '/hapus/guru/{id_guru}',
    handler: handleDeleteGuru
  }
];

module.exports = guruRoutes;