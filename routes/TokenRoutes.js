const {handleRefreshToken} = require('../controllers/RefreshTokenController');
const tokenRoutes = [
  {
    method: 'GET',
    path: '/token',
    handler : handleRefreshToken
  }
];

  
module.exports = tokenRoutes;