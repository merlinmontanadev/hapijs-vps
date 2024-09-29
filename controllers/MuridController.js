const { v4: uuidv4 } = require('uuid');
const { hash } = require('bcryptjs')
const Joi = require('joi');
const { db } = require("../models");
const Murid = db.Murid;

const handlerGetMurid = async (request, h) => {
    try {
      const newMurid = await Murid.findAll({});
      const total = newMurid.length;
      const formattedData = {
          message: 'Success',
          statusCode: 200,
          total: total,
          data: newMurid
      };
      return formattedData;
  } catch (error) {
    const formattedError = ({
      message: error.message,
  });
  return h.response(formattedError).code(403);
  }
}

const handlerGetMuridID = async (request, h) => {
    try {
      const id_murid = request.params.id_murid; // Ambil ID pengguna dari parameter permintaan
      const murid = await Murid.findByPk(id_murid)
      if(murid){
        const formattedData = {
          message: 'Success',
          statusCode: 200,
          data: murid
        };
        return formattedData;
      }
      return h.response({
        message: 'Murid not found',
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

const handlerSaveMurid = async (request, h) => {
    const { 
nik_murid,
nis,
nisn,
file,
nama_lengkap,
jenis_kelamin,
tempat_lahir,
tanggal_lahir,
agama,
alamat,
kel_des,
kec,
kab,
prov,
telepon,
hp,
email,
asal_sekolah,
t_masuk,
t_lulus,
t_smp,
i_smp,
} = request.payload;
    const id_murid = uuidv4();
    const generate = uuidv4();
    const nipd = parseInt(generate.replace(/-/g, '').substring(0, 10), 16);
    const status = "Active";
    const muridDataSchema = Joi.object({
      id_murid: Joi.string(),
      nik_murid: Joi.string(),
      nis: Joi.string(),
      nisn: Joi.string(),
      file: Joi.any().required(),
      nama_lengkap: Joi.string(),
      jenis_kelamin: Joi.string(),
      tempat_lahir: Joi.string(),
      tanggal_lahir: Joi.date(),
      agama: Joi.string(),
      alamat: Joi.string(),
      kel_des: Joi.string(),
      kec: Joi.string(),
      kab: Joi.string(),
      prov: Joi.string(),
      telepon: Joi.string(),
      hp: Joi.string(),
      email: Joi.string(),
      asal_sekolah: Joi.string(),
      t_masuk: Joi.string(),
      t_lulus: Joi.string(),
      t_smp: Joi.string(),
      i_smp: Joi.string(),
    })

    const { error } = muridDataSchema.validate(request.payload);
    if (error) {
      const formattedError = {
        message: error.details[0].message,
        statusCode: 400
      };
      return h.response(formattedError).code(400);
    }

    try {
      const checkNikMurid = await Murid.findOne({ where: { nik_murid: nik_murid } })
      if (checkNikMurid) {
        const errorResponse = {
          message: 'NIK sudah terdaftar',
          statusCode: 400
        };
        return h.response(errorResponse).code(400);
      } 
      const checkNipdMurid = await Murid.findOne({ where: { nipd: nipd } })
      if (checkNipdMurid) {
        const errorResponse = {
          message: 'NIPD sudah terdaftar',
          statusCode: 400
        };
        return h.response(errorResponse).code(400);
      }

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
        const muridData = {
            id_murid,
            nik_murid,
            nis,
            nisn,
            file : fileData,
            fileMimeType: fileMimeType,
            nipd : nipd,
            nama_lengkap,
            jenis_kelamin,
            tempat_lahir,
            tanggal_lahir,
            agama,
            alamat,
            kel_des,
            kec,
            kab,
            prov,
            telepon,
            hp,
            email,
            asal_sekolah,
            t_masuk,
            t_lulus,
            t_smp,
            i_smp,
            status : status,
        };
        const newMurid = await Murid.create(muridData);
        const formattedResponse = {
          message: 'Murid saved successfully',
          statusCode: 201,
          data: {
            id_murid: id_murid, // Mengembalikan UUID dari data yang disimpan
            id: newMurid.insertId // Mengembalikan ID dari data yang disimpan
          }
        };
        return h.response(formattedResponse).code(201); // Mengembalikan respons dengan kode status 201 (Created)
    } catch (error) {
    console.error(error);
    const formattedError = {
      message: error.message,
      statusCode: error.statusCode || 500
    };
    return h.response(formattedError).code(formattedError.statusCode);
    }
};

const handleEditMurid = async (request, h) => {
    const { id_murid } = request.params; 
    const { 
        nik_murid,
        nipd,
        nama_lengkap,
        jenis_kelamin,
        tempat_lahir,
        tanggal_lahir,
        agama,
        alamat,
        kel_des,
        kec,
        kab,
        telepon,
        hp,
        email,
        asal_sekolah,
        tahun_masuk
    } = request.payload;

    const muridDataSchema = Joi.object({
        nik_murid: Joi.string(),
        nipd: Joi.string(),
        nama_lengkap: Joi.string(),
        jenis_kelamin: Joi.string(),
        tempat_lahir: Joi.string(),
        tanggal_lahir: Joi.string(),
        agama: Joi.string(),
        alamat: Joi.string(),
        kel_des: Joi.string(),
        kec: Joi.string(),
        kab: Joi.string(),
        telepon: Joi.string(),
        hp: Joi.string(),
        email: Joi.string(),
        asal_sekolah: Joi.string(),
        tahun_masuk: Joi.string(),        
    });

    const { error } = muridDataSchema.validate(request.payload);
    if (error) {
        const formattedError = {
          error: true,
          message: error.details[0].message,
          statusCode: 400
        };
        return h.response(formattedError).code(400);
      }
      
      try {
        const muridData = {
            nik_murid,
            nipd,
            nama_lengkap,
            jenis_kelamin,
            tempat_lahir,
            tanggal_lahir,
            agama,
            alamat,
            kel_des,
            kec,
            kab,
            jenis_tinggal,
            alat_transportasi,
            telepon,
            hp,
            email,
            kebutuhan_khusus,
            asal_sekolah,
            tahun_masuk
            
        };
         const updated = await Murid.update(muridData, { where: { id_murid: id_murid } });
        if (updated) {
            const formattedResponse = {
                message: 'Murid updated successfully',
                statusCode: 200,
                data: {
                    id_murid: id_murid, // Mengembalikan UUID dari data yang disimpan
                    id: updated.insertId // Mengembalikan ID dari data yang disimpan
                }
            };
            return h.response(formattedResponse).code(200); // Return response with status code 200 (OK)
        } else {
          const formattedResponse = {
            message: 'Murid data unchanged',
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

const handleDeleteMurid = async (request, h) => {
  const { id_murid } = request.params;
  try {
      const deleted = await Murid.destroy({ where: { id_murid: id_murid } });
      if (deleted) {
          // Jika baris berhasil dihapus, kembalikan respons sukses
          const formattedResponse = {
              message: 'Murid deleted successfully',
              statusCode: 200
          };
          return h.response(formattedResponse).code(200);
      } else {
          // Jika tidak ada baris yang terpengaruh (affected), kembalikan respons user not found
          const formattedResponse = {
            message: 'Murid not found',
            statusCode: 404
        };
        return h.response(formattedResponse).code(404);
      }
  } catch (error) {
      // Tangani kesalahan dengan mengembalikan respons sesuai dengan kode status kesalahan
      return h.response({ error: error.message }).code(error.statusCode || 500);
  } 
}

const handleChangeFoto = async (request, h) => {
  const { id_murid } = request.params;
  const { file } = request.payload;
  const murid = await Murid.findByPk(id_murid)
  if (!murid) {
    return h.response({
      message: 'Murid not found',
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

  const muridData = {
    file: fileData
  }

  const updated = await Murid.update(muridData, { where: { id_murid: id_murid } });
  if (updated) {
    const formattedResponse = {
      message: 'Murid foto updated successfully',
    };
    return h.response(formattedResponse).code(200);
  } else {
    const formattedResponse = {
      message: 'Murid not found',
    };
    return h.response(formattedResponse).code(404);
  }
}


  module.exports = {handleChangeFoto, handlerGetMurid, handlerGetMuridID, handlerSaveMurid, handleEditMurid, handleDeleteMurid}; // Export fungsi