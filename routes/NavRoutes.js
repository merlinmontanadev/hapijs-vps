const {handletGetNav} = require('../controllers/NavController');

const corsOptions = {
  origin: ['http://localhost:3000', 'https://dharmawirawan.69dev.id'], // Ganti dengan domain frontend Anda
  credentials: true // Penting untuk pengaturan cookie
};


const navRoutes = [
   {
    method: 'GET',
    path: '/nav',
    handler: handletGetNav,
    options: {
      cors: corsOptions
    }
  },
];

  
module.exports = navRoutes;