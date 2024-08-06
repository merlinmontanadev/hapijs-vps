const multer  = require('multer')
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const md5 = require('md5');
const { db } = require("../models");
const Test = db.Test;
const fs = require('fs');
const { removeTicks } = require('sequelize/lib/utils');

const handleTestGet = async (req, h) => {
    try {
        const tests = await Test.findAll();
        return h.response({
            total : tests.length,
            data : tests
         }).code(200);
    } catch (error) {
        console.error(error);
        return h.response({ msg: 'Terjadi kesalahan'}).code(500);
    }
};

const handleTestGetByID = async (req, h) => {
    try {
        const tests = await Test.findOne({
            where: {
                test_id: req.params.test_id
            }
        });
        return h.response({ 
            data : tests
         }).code(200);
    } catch (error) {
        console.error(error);
        return h.response({ msg: 'Terjadi kesalahan'}).code(500);
    }
};

const handleTestSave = async (req, h) => {
    try {
        // Cek jika file kosong
        if (!req.payload.file || !req.payload.file.hapi || !req.payload.file.hapi.filename || req.payload.file.hapi.error) {
            return h.response({ msg: 'File tidak ditemukan'}).code(403);
        }

        const username = req.payload.username
        const file = req.payload.file
        const fileSize = req.payload.file._data.length
        const fileExt = path.extname(file.hapi.filename)
        const letter = '1234567890';
        const random = () => {
            let result = '';
            for (let i = 0; i < 4; i++) {
                result += letter[Math.floor(Math.random() * letter.length)];
            }
            return result;
        }
        const md5FileName = md5(file) + random() + fileExt
        const allowedType = ['.png', '.jpg', '.jpeg'];
        const uploadPath = path.join(__dirname, '..', 'public', 'images', md5FileName);
        const urlPath = uploadPath.replace(/\\/g, '/');

        if(!allowedType.includes(fileExt.toLowerCase())){ {
            return h.response({ msg: 'File harus berupa gambar'}).code(422);
        }}

        if(fileSize > 500000){ {
            return h.response({ msg: 'File terlalu besar'}).code(422);
        }}

        if(!username){ {
            return h.response({ msg: 'Username tidak boleh kosong'}).code(422);
        }}
    
        try {
            await new Promise((resolve, reject) => {
                const fileStream = fs.createWriteStream(urlPath);
                file.pipe(fileStream);
                file.on('end', () => resolve());
                file.on('error', (err) => reject(err));
            });
    
            // Menyimpan informasi file ke database
            await Test.create({
                username: username,
                url: urlPath,
                image: md5FileName
            });

            const formattedResponse = {
                message: 'File berhasil diunggah',
                filename: req.payload.file.hapi.filename,
                statusCode: 200
            };
    
            return h.response(formattedResponse).code(200);
        } catch (error) {
            console.error(error);
            return h.response({ msg: 'Terjadi kesalahan'}).code(500);
        }

        // Lanjutkan dengan logika penyimpanan atau operasi lainnya jika file ditemukan


    } catch (error) {
        console.error(error);
        return h.response({ msg: 'Terjadi kesalahan'}).code(500);
    }
};

const handleTestEdit = async (req, h) => {
    try {
        // Cari entri berdasarkan test_id
        const test = await Test.findOne({
            where: {
                test_id: req.params.test_id
            }
        });

        // Jika entri tidak ditemukan, kembalikan respons 404
        if (!test) {
            return h.response({ msg: 'Data tidak ditemukan' }).code(404);
        }

        let md5FileName = '';
        const file = req.payload.file;

        // Jika file tidak ada dalam payload
        if (!file) {
            md5FileName = test.image;
            return h.response({ msg: 'File tidak ditemukan' }).code(403);
        }

        const fileSize = file._data.length;
        const fileExt = path.extname(file.hapi.filename);
        const allowedType = ['.png', '.jpg', '.jpeg'];

        // Validasi tipe file
        if (!allowedType.includes(fileExt.toLowerCase())) {
            return h.response({ msg: 'File harus berupa gambar' }).code(422);
        }

        // Validasi ukuran file
        if (fileSize > 500000) {
            return h.response({ msg: 'File terlalu besar' }).code(422);
        }

        // Fungsi untuk menghasilkan string acak
        const letter = '1234567890';
        const random = () => {
            let result = '';
            for (let i = 0; i < 4; i++) {
                result += letter[Math.floor(Math.random() * letter.length)];
            }
            return result;
        };

        // Buat nama file baru
        md5FileName = md5(file) + random() + fileExt;
        const uploadPath = path.join(__dirname, '..', 'public', 'images', md5FileName);
        const urlPath = uploadPath.replace(/\\/g, '/');

        // Hapus file lama
        const filepath = path.join(__dirname, '..', 'public', 'images', test.image);
        if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath);
        }

        // Simpan file baru
        try {
            await new Promise((resolve, reject) => {
                const fileStream = fs.createWriteStream(uploadPath);
                file.pipe(fileStream);
                file.on('end', () => resolve());
                file.on('error', (err) => reject(err));
            });
        } catch (error) {
            console.error('Error during file upload:', error);
            return h.response({ msg: 'Terjadi kesalahan saat mengunggah file' }).code(500);
        }

        try {
        // Perbarui entri database
        await Test.update({
            username: req.payload.username,
            url: urlPath,
            image: md5FileName
        }, {
            where: {
                test_id: req.params.test_id
            }
        });

        return h.response({ msg: 'Data berhasil diubah' }).code(200);
        } catch (error) {
            console.error('Error handling test edit:', error);
            return h.response({ msg: 'Terjadi kesalahan' }).code(500);
        }


    } catch (error) {
        console.error('Error handling test edit:', error);
        return h.response({ msg: 'Terjadi kesalahan' }).code(500);
    }
}

const handleTestDelete = async (req, h) => {
        const test = await Test.findOne({
            where: {
                test_id: req.params.test_id
            }
        });
        if (!test) {
            return h.response({ msg: 'Data tidak ditemukan'}).code(404);
        }
        try {
            const filepath = `./public/images/${test.image}`;
            fs.unlinkSync(filepath);
            await Test.destroy({
                where: {
                    test_id: req.params.test_id
                }
            });
            return h.response({ msg: 'Data berhasil dihapus'}).code(200);
        } catch (error) {
            console.error(error);
            return h.response({ msg: 'Terjadi kesalahan'}).code(500);
    
        }
}

module.exports = {handleTestSave, handleTestGet, handleTestGetByID, handleTestDelete, handleTestEdit}; // Export fungsi