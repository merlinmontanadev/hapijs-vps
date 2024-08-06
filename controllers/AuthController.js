const bcrypt = require('bcryptjs');
const Joi = require('joi');
const { TOKEN_SECRET, REFRESH_TOKEN_SECRET } = require('../constants')
const { sign } = require('jsonwebtoken')
const { db } = require("../models");
const { where } = require('sequelize');
const User = db.User;

const handleLogin = async (request, h) =>{
    try {
      const { username, password } = request.payload;
      const ipAddress = request.info.remoteAddress;
      
      console.log(ipAddress)

      const userDataSchema = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required(),
      });
  
      const { error } = userDataSchema.validate(request.payload);
      if (error) {
        const formattedError = {
          message: error.details[0].message,
          statusCode: 400
        };
        return h.response(formattedError).code(400);
      }
      
      const user = await User.findOne({ where: { username: username } });
      
      if (user) {
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (isPasswordValid) {
          // User berhasil login
        let jwtPayload = {
          user_id: user.user_id,
          username: user.username,
          email: user.email,
          role: user.role
        }
    
        const accessToken = await sign(jwtPayload, TOKEN_SECRET, { expiresIn: '15s' })
        const refreshToken = await sign(jwtPayload, REFRESH_TOKEN_SECRET, { expiresIn: '1d' })
        const token = {
          refreshToken: refreshToken
        }
        try {
          await User.update(token, {where : { user_id: user.user_id}} );
        } catch (error) {
          return h.response({ error: error.message }).code(error.statusCode || 500);
        }   
        const response = h.response('Login successful');

        //Set Cookie
        response.state('refreshToken', refreshToken, {
          isHttpOnly: true,
          ttl: 24 * 60 * 60 * 1000, // Waktu kadaluarsa dalam milidetik
        });

        return h.response({ accessToken }).code(200);
            // Return response with status code 200 (OK)
    
      } else {
          // Password tidak valid
          return h.response({ message: 'Password is not valid' }).code(404);
        }
      } else {
        // User tidak ditemukan
        return h.response({ message: 'User not found' }).code(404);
      }
    } catch (error) {
      return h.response({ error: error.message }).code(error.statusCode || 500);
    }
    }
    
    const handleLogout = async (request, h) => {
      const refreshToken = request.state.refreshToken;
      console.log(refreshToken)
      
      if (!refreshToken) return h.response('Unauthorized').code(401);
  
      // Cari user berdasarkan refreshToken
      const user = await User.findOne({ where: { refreshToken: refreshToken } });
      if (!user) return h.response('Forbidden').code(403);
  
      // Update kolom refreshToken menjadi null
      await User.update({ refreshToken: null }, { where: { user_id: user.user_id } });
  
      // Hapus cookie refreshToken dari state request
      const response = h.response('Logged out successfully');
      response.unstate('refreshToken');
      return response.code(200);
  };





    module.exports = {handleLogin, handleLogout}; // Export fungsi