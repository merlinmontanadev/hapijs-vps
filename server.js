'use strict';
const Hapi = require('@hapi/hapi');
const connectToDatabase = require('./dbconfig');
const { config } = require('dotenv');
const userRoutes = require('./routes/UserRoutes');
const authRoutes = require('./routes/AuthRoutes');
const guruRoutes = require('./routes/GuruRoutes');
const muridRoutes = require('./routes/MuridRoutes');
const tokenRoutes = require('./routes/TokenRoutes');
const testRoutes = require('./routes/TestRoutes');
const navRoutes = require('./routes/NavRoutes');
const Inert = require('@hapi/inert');
const https = require('https');
const fs = require('fs');
const path = require('path');

config()

const init = async () => {
    const server = Hapi.server({
        port: 9000,
        host: 'localhost',
        //for cross-origin
        routes: {
            cors: {
                origin: ['http://localhost:3000', 'https://dharmawirawan.69dev.id'], // Ganti dengan URL frontend Anda
                credentials: true // Penting untuk pengaturan cookie
            }
        }
    });

    await server.register(Inert);

        // Inisialisasi Multer
    const now = new Date();
    const tanggal = now.getDate();
    const tanggalFormatted = tanggal < 10 ? '0' + tanggal : tanggal;
    const bulan = now.getMonth() + 1; // Ditambah 1 karena bulan dimulai dari 0 (Januari)
    const bulanFormatted = bulan < 10 ? '0' + bulan : bulan;
    const tahun = now.getFullYear();
    const jam = now.getHours();
    const menit = now.getMinutes();
    const menitFormatted = menit < 10 ? '0' + menit : menit;
    const amOrPm = jam >= 12 ? 'PM' : 'AM';
    // Ubah format jam jika diinginkan
    const jam12HourFormat = jam % 12 || 12;

    server.events.on('response', function (request) {
        // Informasi client IP dan lainnya
        const userAgent = request.headers['user-agent'];
        const remoteAddress = request.info.remoteAddress;
        const method = request.method.toUpperCase();
        const formattedMethod = method === 'GET' ? `\x1b[32m GET \x1b[0m` :
            method === 'POST' ? '\x1b[33m POST \x1b[0m' :
            method === 'PUT' ? 'PUT' :
            method === 'DELETE' ? '\x1b[31m DELETE \x1b[0m' :
            method === 'PATCH' ? '\x1b[35m PATCH \x1b[0m' : '---';
    
        const statusCode = request.response.statusCode;
    
        let formattedStatusCode;
        if (statusCode >= 200 && statusCode < 300) {
            formattedStatusCode = `\x1b[32m${statusCode}\x1b[0m`; // Green
        } else if (statusCode >= 300 && statusCode < 400) {
            formattedStatusCode = `\x1b[33m${statusCode}\x1b[0m`; // Yellow
        } else if (statusCode >= 400 && statusCode < 500) {
            formattedStatusCode = `\x1b[31m${statusCode}\x1b[0m`; // Red
        } else if (statusCode >= 500 && statusCode < 600) {
            formattedStatusCode = `\x1b[31m${statusCode}\x1b[0m`; // Red
        } else if (statusCode >= 100 && statusCode < 200) {
            formattedStatusCode = `\x1b[36m${statusCode}\x1b[0m`; // Cyan
        } else {
            formattedStatusCode = `\x1b[0m${statusCode}\x1b[0m`; // Default color
        }


        const textColors = [
            '\x1b[32m', // Hijau
            '\x1b[33m', // Kuning
            '\x1b[34m', // Biru
            '\x1b[35m', // Ungu
        ];

        function randomTextColor() {
            const randomIndex = Math.floor(Math.random() * textColors.length);
            return textColors[randomIndex];
        }

        const randomColor = randomTextColor();
    
        // Meminta IP publik server di dalam event handler
        https.get('https://api.ipify.org?format=json', (resp) => {
            let data = '';
    
            // Menerima chunk data
            resp.on('data', (chunk) => {
                data += chunk;
            });
    
            // Setelah seluruh data diterima
            resp.on('end', () => {
                const publicIP = JSON.parse(data).ip;
                
                // Asumsikan variabel tanggalFormatted, bulanFormatted, tahun, jam12HourFormat, menitFormatted, amOrPm sudah didefinisikan
                const logMessage = `${publicIP}|${method}|${request.path}|${statusCode}|${tanggalFormatted}/${bulanFormatted}/${tahun}|${jam12HourFormat}:${menitFormatted} ${amOrPm}|${userAgent}\n`;
    
                console.log(`${publicIP}|${formattedMethod}|${request.path}|${formattedStatusCode}|${randomColor}${tanggalFormatted}/${bulanFormatted}/${tahun}, ${jam12HourFormat}:${menitFormatted} ${amOrPm} \x1b[0m`);
    
                // Simpan log ke file jika perlu
                fs.appendFile(path.join(__dirname, 'log.txt'), logMessage, (err) => {
                    if (err) {
                        console.error('Failed to write to log file:', err);
                    }
                });
            });
    
        }).on("error", (err) => {
            console.log("Error: " + err.message);
        });
    });

    server.route(userRoutes);
    server.route(authRoutes);
    server.route(guruRoutes);
    server.route(muridRoutes);
    server.route(tokenRoutes);
    server.route(testRoutes);
    server.route(navRoutes)
    
    await server.start();
    console.log('Server running on %s', server.info.uri);
    try {
        const dbConnection = await connectToDatabase();
        // Lakukan sesuatu dengan dbConnection jika perlu
      } catch (error) {
        console.error('Gagal terhubung ke database:', error);
        process.exit(1); // Berhenti jika gagal terhubung ke database
    }

    const db = require("./models")

    db.sequelize.sync({alter: false, force: false}).then(() => {
    console.log("Berhasil Sinkronisasi dengan DB.");
    }).catch((err) => {
    console.log("Gagal Sinkronisasi DB" + err.message);
    });
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();