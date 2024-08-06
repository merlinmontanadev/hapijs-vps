const { v4: uuidv4 } = require('uuid');
const { hash } = require('bcryptjs')
const Joi = require('joi');
const { db } = require("../models");
const Guru = db.Guru;

const handlerGetGuru = async (request, h) => {
    try {
      const newGuru = await Guru.findAll({});
  
      const total = newGuru.length;
      const formattedData = {
          message: 'Success',
          statusCode: 200,
          total: total,
          data: newGuru
      };
      return formattedData;
  } catch (error) {
      const formattedError = ({
          message: error.message,
          statusCode: error.statusCode || 500,
      }).code(500);
      return formattedError;
  }
}

const handlerGetGuruID = async (request, h) => {
    try {
      const id_guru = request.params.id_guru; // Ambil ID pengguna dari parameter permintaan
      const guru = await Guru.findByPk(id_guru)
      if(guru){
        const formattedData = {
          message: 'Success',
          statusCode: 200,
          data: guru
        };
        return formattedData;
      }
      return h.response({
        message: 'Guru not found',
        statusCode: 404,
      }).code(404);
    } catch (error) {
      const formattedError = ({
        message: error.message,
        statusCode: error.statusCode || 500,
      }).code(500);
      return formattedError;
    }
};

const handlerSaveGuru = async (request, h) => {
    const { nip, pangkat_gol, jabatan, nama_lengkap, tempat_lahir, tanggal_lahir, alamat, desa_kel, kecamatan, kabupaten, agama} = request.payload;
    const id_guru = uuidv4();
    const generate = uuidv4();
    const nutpk = parseInt(generate.replace(/-/g, '').substring(0, 10), 16);
    const status = "Active";
    const guruDataSchema = Joi.object({
      id_guru: Joi.string(),
      nip: Joi.string().required(),
      pangkat_gol: Joi.string().required(),
      jabatan: Joi.string().required(),
      nama_lengkap: Joi.string().required(),
      tempat_lahir: Joi.string().required(),
      tanggal_lahir: Joi.string().required(),
      alamat: Joi.string().required(),
      desa_kel: Joi.string().required(),
      kecamatan: Joi.string().required(),
      kabupaten: Joi.string().required(),
      agama: Joi.string().required(),
    })

    const { error } = guruDataSchema.validate(request.payload);
    if (error) {
      const formattedError = {
        message: error.details[0].message,
        statusCode: 400
      };
      return h.response(formattedError).code(400);
    }

    try {
      const checkGuru = await Guru.findOne({ where: { nip: nip } })
      if (checkGuru) {
        // Username sudah terdaftar, kembalikan respons dengan pesan error
        const errorResponse = {
          message: 'NIP sudah terdaftar',
          statusCode: 400
        };
        return h.response(errorResponse).code(400);
      } else {

        const guruData = {
            id_guru,
            nip,
            nutpk: nutpk,
            pangkat_gol,
            jabatan,
            nama_lengkap,
            tempat_lahir,
            tanggal_lahir,
            alamat,
            desa_kel,
            kecamatan,
            kabupaten,
            agama,
            status: status
        };
        const newGuru = await Guru.create(guruData);
        const formattedResponse = {
          message: 'User saved successfully',
          statusCode: 201,
          data: {
            id_guru: id_guru, // Mengembalikan UUID dari data yang disimpan
            id: newGuru.insertId // Mengembalikan ID dari data yang disimpan
          }
        };
        return h.response(formattedResponse).code(201); // Mengembalikan respons dengan kode status 201 (Created)
      }
    } catch (error) {
    console.error(error);
    const formattedError = {
      message: error.message,
      statusCode: error.statusCode || 500
    };
    return h.response(formattedError).code(formattedError.statusCode);
    }
};

const handleEditGuru = async (request, h) => {
    const { id_guru } = request.params; // Ambil id_guru dari route parameter
    const { pangkat_gol, jabatan, nama_lengkap, tempat_lahir, tanggal_lahir, alamat, desa_kel, kecamatan, kabupaten, agama} = request.payload;
    const guruDataSchema = Joi.object({
      pangkat_gol: Joi.string(),
      jabatan: Joi.string(),
      nama_lengkap: Joi.string(),
      tempat_lahir: Joi.string(),
      tanggal_lahir: Joi.string(),
      alamat: Joi.string(),
      desa_kel: Joi.string(),
      kecamatan: Joi.string(),
      kabupaten: Joi.string(),
      agama: Joi.string(),
      status: Joi.string()
    });

    const { error } = guruDataSchema.validate(request.payload);
    if (error) {
        const formattedError = {
          error: true,
          message: error.details[0].message,
          statusCode: 400
        };
        return h.response(formattedError).code(400);
      }
      
      try {
        const guruData = {
            pangkat_gol,
            jabatan,
            nama_lengkap,
            tempat_lahir,
            tanggal_lahir,
            alamat,
            desa_kel,
            kecamatan,
            kabupaten,
            agama
        };
        // Lakukan operasi edit data pengguna di database berdasarkan id_guru
         const updated = await Guru.update(guruData, { where: { id_guru: id_guru } });
        if (updated) {
            const formattedResponse = {
                message: 'Guru updated successfully',
                statusCode: 200,
                data: {
                    id_guru: id_guru, // Mengembalikan UUID dari data yang disimpan
                    id: updated.insertId // Mengembalikan ID dari data yang disimpan
                }
            };
            return h.response(formattedResponse).code(200); // Return response with status code 200 (OK)
        } else {
          const formattedResponse = {
            message: 'User data unchanged',
            statusCode: 200
        };
        return h.response(formattedResponse).code(200);
        }

      } catch (error) {
        console.error(error);
        const formattedError = {
            message: error.message,
            statusCode: error.statusCode || 500
        };
        return h.response(formattedError).code(formattedError.statusCode);
      }
}


const handleDeleteGuru = async (request, h) => {
  const { id_guru } = request.params;
  try {
      const deleted = await Guru.destroy({ where: { id_guru: id_guru } });
      if (deleted) {
          // Jika baris berhasil dihapus, kembalikan respons sukses
          const formattedResponse = {
              message: 'Guru deleted successfully',
              statusCode: 200
          };
          return h.response(formattedResponse).code(200);
      } else {
          // Jika tidak ada baris yang terpengaruh (affected), kembalikan respons user not found
          const formattedResponse = {
            message: 'Guru not found',
            statusCode: 404
        };
        return h.response(formattedResponse).code(404);
      }
  } catch (error) {
      // Tangani kesalahan dengan mengembalikan respons sesuai dengan kode status kesalahan
      return h.response({ error: error.message }).code(error.statusCode || 500);
  } 
}


  module.exports = {handlerGetGuru, handlerGetGuruID, handlerSaveGuru, handleEditGuru, handleDeleteGuru}; // Export fungsi