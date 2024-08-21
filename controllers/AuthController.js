const bcrypt = require('bcryptjs');
const Joi = require('joi');
const { TOKEN_SECRET, REFRESH_TOKEN_SECRET } = require('../constants')
const { sign } = require('jsonwebtoken')
const { db } = require("../models");
const { where } = require('sequelize');
const User = db.User;

const handleLogin = async (request, h) => {
    const {
      username,
      password
    } = request.payload;

    const userDataSchema = Joi.object({
      username: Joi.string().min(1).required().messages({
        'string.empty': 'Username tidak boleh kosong.',
        'any.required': 'Username tidak boleh kosong.'
      }),
      password: Joi.string().min(1).required().messages({
        'string.empty': 'Password tidak boleh kosong.',
        'any.required': 'Password tidak boleh kosong.'
      }),
    });

    const { error } = userDataSchema.validate(request.payload);

    if (error) {
      const formattedError = {
        message: error.details[0].message,
      };
      return h.response(formattedError).code(400);
    }

    const user = await User.findOne({
      where: {
        username: username
      }
    });

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

        const accessToken = await sign(jwtPayload, TOKEN_SECRET, {
          expiresIn: '15s'
        })
        const refreshToken = await sign(jwtPayload, REFRESH_TOKEN_SECRET, {
          expiresIn: '1d'
        })
        const token = {
          refreshToken: refreshToken
        }
        try {
          await User.update(token, {
            where: {
              user_id: user.user_id
            }
          });
        } catch (error) {
          return h.response({
            error: error.message
          }).code(error.statusCode || 500);
        }

        const response = h.response('Login successful');
        //Set Cookie
        response.state('refreshToken', refreshToken, {
          isHttpOnly: false,
          ttl: 24 * 60 * 60 * 1000, // Waktu kadaluarsa dalam milidetik
          sameSite: 'None', // Mengizinkan pengiriman cookie lintas domain
          secure: true // Mengirim cookie hanya melalui HTTPS
        });

        return h.response({
          accessToken,
          message: 'Login Berhasil'
        }).code(200);
        // Return response with status code 200 (OK)

      } else {
        // Password tidak valid
        return h.response({
          message: 'Password tidak valid.'
        }).code(404);
      }
    } else {
      // User tidak ditemukan
      return h.response({
        message: 'Username tidak ditemukan.'
      }).code(404);
    }
}
    
const handleLogout = async (request, h) => {
  try {
    // Mengambil refreshToken dari cookie
    const refreshToken = request.state.refreshToken;

    // Cek apakah refreshToken ada
    if (!refreshToken) {
      return h.response({ message: 'Unauthorized: No refresh token provided' }).code(401);
    }

    // Cari user berdasarkan refreshToken
    const user = await User.findOne({ where: { refreshToken } });

    // Cek apakah user dengan refreshToken tersebut ditemukan
    if (!user) {
      return h.response({ message: 'Forbidden: Invalid refresh token' }).code(403);
    }

    // Update kolom refreshToken menjadi null di database
    await User.update({ refreshToken: null }, { where: { user_id: user.user_id } });

    // Hapus cookie refreshToken dari state request
    const response = h.response({ message: 'Logged out successfully' });

    // Menghapus cookie dari sisi klien
    response.unstate('refreshToken');

    // Mengembalikan respon berhasil
    return response.code(200);
  } catch (error) {
    // Menangani kesalahan yang tidak terduga
    console.error('Logout error:', error);
    return h.response({ message: 'Internal Server Error' }).code(500);
  }
};





    module.exports = {handleLogin, handleLogout}; // Export fungsi