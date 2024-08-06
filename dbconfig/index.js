const { config } = require('dotenv')
config()
const mysql = require('mysql2/promise');

const dbConfig = {
    host: process.env.DB_HOST, // Ganti dengan alamat IP MySQL
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    // waitForConnections: true,
    // maxIdle: 100, // mengijinkan pool menunggu koneksi yang tersedia jika false, error akan dilempar jika tidak ada koneksi yang tersedia
    // connectionLimit: 100000, // batas maksimum koneksi dalam pool
    // queueLimit: 0, // batas maksimum jumlah koneksi dalam antrian (0 = tanpa batas)
    // enableKeepAlive: true,
    // keepAliveInitialDelay: 0,
    // idleTimeout: 3600000, //8 jam menit
  };

  let pool; // Declare the pool variable

  async function connectToDatabase() {
    try {
      if (!pool) { // Check if pool is not already created
        pool = await mysql.createPool(dbConfig); // Create the pool

        // const now = new Date();
        // const tanggal = now.getDate();
        // const tanggalFormatted = tanggal < 10 ? '0' + tanggal : tanggal;
        // const bulan = now.getMonth() + 1; // Ditambah 1 karena bulan dimulai dari 0 (Januari)
        // const bulanFormatted = bulan < 10 ? '0' + bulan : bulan;
        // const tahun = now.getFullYear();
        // const jam = now.getHours();
        // const menit = now.getMinutes();
        // const menitFormatted = menit < 10 ? '0' + menit : menit;
        // const amOrPm = jam >= 12 ? 'PM' : 'AM';
        // // Ubah format jam jika diinginkan
        // const jam12HourFormat = jam % 12 || 12;

        // console.log( `Koneksi database berhasil,  Pada : \x1b[32m${tanggalFormatted}/${bulanFormatted}/${tahun}, ${jam12HourFormat}:${menitFormatted } ${amOrPm} \x1b[0m`); // Print the message only when pool is created

      }

      // async function keepAliveConnection() {
      //   try {
      //     const connection = await pool.getConnection();
      //     await connection.query('SELECT 1');
      //     connection.release();
      //     console.log('Koneksi tetap aktif.');
      //   } catch (error) {
      //     console.log('Gagal menjaga koneksi tetap aktif:', error);
      //   }
      // }
      // setInterval(keepAliveConnection, 28800000);
    
      return pool;
    } catch (error) {
      console.error('Koneksi database gagal:', error);
      throw error;
    }
  }


  
  module.exports = connectToDatabase;