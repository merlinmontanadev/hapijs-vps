const { v4: uuidv4 } = require('uuid');
const { hash } = require('bcryptjs')
const Joi = require('joi');
const { db } = require("../models");
const fs = require('fs');
const User = db.User;
const Guru = db.Guru  
const path = require('path');
const Test = db.Test;

const handlerGetUser = async (request, h) => {
  try {
    const newUser = await User.findAll();
    const total = newUser.length;
    const formattedData = {
        message: 'Success',
        total: total,
        data: newUser
    };
    return formattedData;
} catch (error) {
    const formattedError = ({
        message: error.message,
    });
    return h.response(formattedError).code(403);
}
}

const handlerGetUserID = async (request, h) => {
    try {
      const user_id = request.params.user_id; // Ambil ID pengguna dari parameter permintaan
      const user = await User.findByPk(user_id)
      if(user){
        const formattedData = {
          message: 'Success',
          data: user
        };
        return formattedData;
      }
      return h.response({
        message: 'User not found',
      }).code(404);
    } catch (error) {
      const formattedError = ({
        message: error.message,
      }).code(500);
      return formattedError;
    }
};

const handlerSaveUser = async (request, h) => {
  const { username, role, email, jk, nohp, file} = request.payload; // Ambil username dan password dari payload permintaan
  // Generate UUID
  const user_id = uuidv4();
  const password = "12345678";
  // Hasing Password
  const hashedPassword = await hash(password, 10)
  const status = "Inactive";
  const userDataSchema = Joi.object({
    user_id: Joi.string(),
    username: Joi.string().pattern(new RegExp('^[a-z0-9]{3,30}$')).required(),
    email: Joi.string().email({ minDomainSegments: 1, tlds: { allow: ['com'] } }).required(),
    jk: Joi.string().valid('Pria', 'Wanita').required(),
    nohp: Joi.string().pattern(new RegExp('^[0-9]*$')).min(10).max(13).required(),
    // password: Joi.string().pattern(new RegExp('^[a-z0-9]{3,30}$')).required(),
    file: Joi.any().required(),
    role: Joi.string().valid('Admin', 'User').required()
  });

  const { error } = userDataSchema.validate(request.payload);
  if (error) {
    const formattedError = {
      message: error.details[0].message,
    };
    return h.response(formattedError).code(400);
  }

    try {
      const checkUsername = await User.findOne({ where: { username: username } })
      const checkEmail = await User.findOne({ where: { email: email } })
      if (checkUsername || checkEmail) {
        // Username sudah terdaftar, kembalikan respons dengan pesan error
        const errorResponse = {
          message: 'Username atau Email sudah terdaftar',
        };
        return h.response(errorResponse).code(400);
      } else {

          // Jika tidak ada file yang diunggah
        if (!file) {
            return h.response({ message: 'No file uploaded' }).code(400);
        }

        const allowedMimeTypes = ['image/jpeg', 'image/png'];
        const fileMimeType = file.hapi.headers['content-type'];

        // Pastikan tipe konten file didukung
        if (!allowedMimeTypes.includes(fileMimeType)) {
            return h.response({ error: 'Unsupported file type. Only JPEG, and PNG images are allowed' }).code(415);
        }

        const fileData = file._data; // Ambil data file dari payload
        
        const userData = {
          username,
          email,
          file : fileData,
          fileMimeType: fileMimeType,
          jk,
          nohp,
          password: hashedPassword,
          role,
          status: status
        };
        const newUser = await User.create(userData);

        const formattedResponse = {
          message: 'User saved successfully',
          data: {
            user_id: user_id, // Mengembalikan UUID dari data yang disimpan
            id: newUser.insertId, // Mengembalikan ID dari data yang disimpan
            username: username,
            // email: email,
            // jk: jk,
            // nohp: nohp,
            // role: role,
            // status: status,
            // file : fileData,
            // fileMimeType: fileMimeType
          }
        };
        return h.response(formattedResponse).code(201); // Mengembalikan respons dengan kode status 201 (Created)
      }
    } catch (error) {
      // Tangani kesalahan saat melakukan validasi atau penyimpanan data
      console.error(error);
      const formattedError = {
        message: error.message,
      };
      return h.response(formattedError).code(500);
    }
}

const handleResetPassowrd = async (request, h) => {
  const { user_id } = request.params; // Ambil user_id dari route parameter
  const  password  = '12345678'; // Ambil password dari payload permintaan
  // Hasing Password 
  const hashedPassword = await hash(password, 10)
  const userDataSchema = Joi.string().required()

  const { error } = userDataSchema.validate(password);
  if (error) {
    const formattedError = {
      error: true,
      message: error.details[0].message,
    };
    return h.response(formattedError).code(400);
  }
  // Pastikan untuk melakukan validasi data pengguna di sini sebelum mengedit data di database

  try {
    const userData = {
      password: hashedPassword
    };
    const updatedUser = await User.update(userData, { where: { user_id: user_id } });
    if (updatedUser) {
      const formattedResponse = {
        message: 'Password updated successfully'
      };
      return h.response(formattedResponse).code(200);
    } else {
      const formattedResponse = {
        message: 'User not found',
      };
      return h.response(formattedResponse).code(404);
    }
  } catch (error) {
    // Tangani kesalahan saat melakukan validasi atau penyimpanan data
    console.error(error);
    const formattedError = {
      message: error.message,
    };
    return h.response(formattedError).code(500);
  }
}

const handleChangeStatus = async (request, h) => {
  const { user_id } = request.params;
  const user = await User.findByPk(user_id)
  if (!user) {
    return h.response({
      message: 'User not found',
    }).code(404);
  }

  let status;

  if (user.status === 'Active') {
    status = 'Inactive';
  } else if (user.status === 'Inactive') {
    status = 'Active';
  }

  console.log(user.status)

  const userData = {
    status : status
  }

  const updated = await User.update(userData, { where: { user_id: user_id } });
  if (updated) {
    const formattedResponse = {
      message: 'User status updated successfully',
    };
    return h.response(formattedResponse).code(200);
  } else {
    const formattedResponse = {
      message: 'User not found',
    };
    return h.response(formattedResponse).code(404);
  }
}

const handleChangeFoto = async (request, h) => {
  const { user_id } = request.params;
  const { file } = request.payload;
  const user = await User.findByPk(user_id)
  if (!user) {
    return h.response({
      message: 'User not found',
    }).code(404);
  }

  if (!file) {
    return h.response({ message: 'No file uploaded' }).code(400);
}

const allowedMimeTypes = ['image/jpeg','image/jpg', 'image/png'];
const fileMimeType = file.hapi.headers['content-type'];
console.log(fileMimeType)

        // Pastikan tipe konten file didukung
        if (!allowedMimeTypes.includes(fileMimeType)) {
          return h.response({ error: 'Unsupported file type. Only JPEG, and PNG images are allowed' }).code(415);
      }
      const fileData = file._data; // Ambil data file dari payload

  const userData = {
    file: fileData
  }

  const updated = await User.update(userData, { where: { user_id: user_id } });
  if (updated) {
    const formattedResponse = {
      message: 'User foto updated successfully',
    };
    return h.response(formattedResponse).code(200);
  } else {
    const formattedResponse = {
      message: 'User not found',
    };
    return h.response(formattedResponse).code(404);
  }
}

const handleEditUser = async (request, h) => {
    const { user_id } = request.params; // Ambil user_id dari route parameter
    const { password, role, email, jk, nohp, file, status, username} = request.payload; // Ambil role dan password dari payload permintaan
    // Hasing Password
    const hashedPassword = await hash(password, 10)
    const userDataSchema = Joi.object({
      password: Joi.string().pattern(new RegExp('^[a-z0-9]{3,30}$')).required(),
      role: Joi.string().valid('Super Admin', 'Admin', 'User').required()
    });

    const { error } = userDataSchema.validate(request.payload);
    if (error) {
      const formattedError = {
        error: true,
        message: error.details[0].message,
      };
      return h.response(formattedError).code(400);
    }
    // Pastikan untuk melakukan validasi data pengguna di sini sebelum mengedit data di database

    try {
        const userData = {
            password: hashedPassword,
            role: role
        };
        // Lakukan operasi edit data pengguna di database berdasarkan user_id
         const updated = await User.update(userData, { where: { user_id: user_id } });
        if (updated) {
            const formattedResponse = {
                message: 'User updated successfully',
                data: {
                  user_id: user_id, // Mengembalikan UUID dari data yang disimpan
                  role: role // Mengembalikan ID dari data yang disimpan
                }
            };
            return h.response(formattedResponse).code(200); // Return response with status code 200 (OK)
        } else {
          const formattedResponse = {
            message: 'User data unchanged',
        };
        return h.response(formattedResponse).code(200);
        }

    } catch (error) {
        console.error(error);
        const formattedError = {
            message: error.message
        };
        return h.response(formattedError).code(500);
    }
}

const handleDeleteUser = async (request, h) => {
    const { user_id } = request.params;
    const { user_logged_id } = request.payload;
    
    try {
      const getUserRole = await User.findByPk(user_id);
      const userRole = getUserRole.role;
      if (userRole === 'Admin') {
        // Menampilkan pesan kesalahan jika pengguna adalah Super Admin
        const formattedResponse = {
          message: 'Admin cannot be deleted',
        };
        return h.response(formattedResponse).code(403);
      }

      const getLoggedUserID = await User.findByPk(user_logged_id);
      const loggedRole = getLoggedUserID.role;
      if (loggedRole === 'User') {
        const formattedResponse = {
          message: '(Forbidden) role user cannot deleted another user',
        };
        return h.response(formattedResponse).code(403);
      }

        // Lakukan operasi DELETE dari tabel users berdasarkan user_id
        const deleted = await User.destroy({ where: { user_id: user_id } });
        if (deleted) {
            // Jika baris berhasil dihapus, kembalikan respons sukses
            const formattedResponse = {
                message: 'User deleted successfully',
            };
            return h.response(formattedResponse).code(200);
        } else {
            // Jika tidak ada baris yang terpengaruh (affected), kembalikan respons user not found
            const formattedResponse = {
              message: 'User not found',
          };
          return h.response(formattedResponse).code(404);
        }
    } catch (error) {
        // Tangani kesalahan dengan mengembalikan respons sesuai dengan kode status kesalahan
        return h.response({ error: error.message }).code(500);
    } 
}

const handleTest = async (request, h) => {
  try {
    const { file, username } = request.payload;

    // Jika tidak ada file yang diunggah
    if (!file) {
        return h.response({ message: 'No file uploaded' }).code(400);
    }

    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const fileMimeType = file.hapi.headers['content-type'];

    // Pastikan tipe konten file didukung
    if (!allowedMimeTypes.includes(fileMimeType)) {
        return h.response({ error: 'Unsupported file type. Only JPEG, PNG, and GIF images are allowed' }).code(415);
    }
    const fileData = file._data; // Ambil data file dari payload

    const userData = {
      username,
      file: fileData,
      fileMimeType: fileMimeType // Kolom untuk menyimpan data file sebagai blob
  };

  const dataTest = await Test.create(userData);

    return h.response({ message: 'File uploaded successfully', data: dataTest }).code(200);
} catch (error) {
    return h.response({ error: 'Failed to upload file', details: error.message }).code(500);
}

}

const handleGetTest = async (request, h) => {
  try {
    // Dapatkan ID gambar dari parameter URL
    const allImageData = await Test.findAll();

    // Jika tidak ada data gambar yang ditemukan
    if (!allImageData || allImageData.length === 0) {
        return h.response({ error: 'No images found' }).code(404);
    }

    // Kirim data gambar sebagai respons dengan tipe konten yang sesuai
    return h.response(allImageData).code(200);
} catch (error) {
    return h.response({ error: 'Failed to retrieve image', details: error.message }).code(500);
}
}


module.exports = {handlerGetUser, handlerGetUserID, handlerSaveUser, handleEditUser, handleDeleteUser, handleResetPassowrd, handleChangeStatus, handleTest, handleGetTest, handleChangeFoto}; // Export fungsi