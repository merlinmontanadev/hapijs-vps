const {handleTestSave, handleTestGet, handleTestGetByID, handleTestDelete, handleTestEdit} = require('../controllers/TestController');
const urlApi = '/api/v1';
const testRoutes = [
    {
        method: 'POST',
        path: urlApi + '/simpan',
        options: {
          payload: {
              maxBytes: 10485760, // 10 MB
              output: 'stream',
              allow: 'multipart/form-data',
              multipart: true
          }
      },
        handler: handleTestSave
      },
      {
        method: 'GET',
        path: urlApi + '/test',
        handler: handleTestGet
      },
      {
        method: 'GET',
        path: urlApi + '/test/{test_id}',
        handler: handleTestGetByID
      },
      {
        method: 'DELETE',
        path: urlApi + '/test/{test_id}',
        handler: handleTestDelete
      },
      {
        method: 'PATCH',
        path: urlApi + '/test/{test_id}',
        options: {
          payload: {
              maxBytes: 10485760, // 10 MB
              output: 'stream',
              allow: 'multipart/form-data',
              multipart: true
          }
      },
        handler: handleTestEdit
      }
];

module.exports = testRoutes;