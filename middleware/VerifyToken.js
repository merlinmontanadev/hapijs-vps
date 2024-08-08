const jwt = require('jsonwebtoken');
const { TOKEN_SECRET } = require('../constants');
const Boom = require('@hapi/boom');

const verifyToken = async (request, h) => {
   const authHeader = request.headers.authorization;
   
   if (!authHeader) {
      // Mengembalikan respons dengan status kode 403 (Forbidden)
      throw Boom.unauthorized('Missing authentication token');
   }

   const token = authHeader && authHeader.split(' ')[1];
   try {
      const decoded = jwt.verify(token, TOKEN_SECRET);
      // Attach the user data to the request object
      request.auth = { credentials: { user: decoded } };
      return h.continue;
   } catch (err) {
      throw Boom.unauthorized('Invalid token');
   }
};

module.exports = verifyToken;