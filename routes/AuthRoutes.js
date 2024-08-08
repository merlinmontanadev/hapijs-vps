const {handleLogin, handleLogout} = require('../controllers/AuthController');
const corsOptions = {
  origin: ['http://localhost:3000', 'https://dharmawirawan.69dev.id'], // Ganti dengan domain frontend Anda
  credentials: true // Penting untuk pengaturan cookie
};


const authRoutes = [
   {
    method: 'POST',
    path: '/login',
    handler: handleLogin,
    options: {
      cors: corsOptions
    }
  },
  {
    method: 'DELETE',
    path: '/logout',
    handler: handleLogout,
  }
];

  
module.exports = authRoutes;