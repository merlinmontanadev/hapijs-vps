const {handlerGetUser, handlerGetUserID, handlerSaveUser, handleChangeContactInformation, handleEditUser, handleDeleteUser, handleResetPassowrd, handleChangeStatus, handleTest, handleGetTest, handleChangeFoto, handleChangeRole} = require('../controllers/UserController');
const verifyToken = require('../middleware/VerifyToken');

const urlApi = '/api/v1';
const userRoutes = [
  {
    method: 'GET',
    path: urlApi + '/user',
    handler: handlerGetUser,
    options: {
      pre: [verifyToken]
    }
  },  
  {
    method: 'GET',
    path: urlApi + '/user/{user_id}',
    handler: handlerGetUserID,
    options: {
      pre: [verifyToken]
    }
  },
  {
    method: 'POST',
    path: urlApi + '/simpan/user',
    options: {
      payload: {
          maxBytes: 10485760, // 10 MB
          output: 'stream',
          allow: 'multipart/form-data',
          multipart: true
      }
  },
    handler: handlerSaveUser
  },
  {
    method: 'PATCH',
    path: urlApi + '/edit/user/{user_id}',
    handler: handleEditUser
  },
  {
    method: 'PATCH',
    path: urlApi + '/edit/user/contact/{user_id}',
    handler: handleChangeContactInformation
  },
  {
    method: 'PATCH',
    path: urlApi + '/edit/user/reset/{user_id}',
    handler: handleResetPassowrd
  },
  {
    method: 'PATCH',
    path: urlApi + '/edit/user/status/{user_id}',
    handler: handleChangeStatus
  },
  {
    method: 'PATCH',
    path: urlApi + '/edit/user/role/{user_id}',
    handler: handleChangeRole
  },
  {
    method: 'PATCH',
    path: urlApi + '/edit/user/foto/{user_id}',
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
    path: urlApi + '/hapus/user/{user_id}',
    handler: handleDeleteUser    
  },
  {
    method: 'POST',
    path: '/upload',
    options: {
        payload: {
            maxBytes: 10485760, // 10 MB
            output: 'stream',
            allow: 'multipart/form-data',
            multipart: true
        }
    },
    handler: handleTest
},
{
    method: 'GET',
    path: '/test',
    handler: handleGetTest
}
];

module.exports = userRoutes;