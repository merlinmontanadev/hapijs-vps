const { config } = require('dotenv')
config()

module.exports = {
  TOKEN_SECRET: process.env.TOKEN_SECRET,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET
}
