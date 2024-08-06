const jwt = require('jsonwebtoken');
const { db } = require("../models");
const { where } = require('sequelize');
const User = db.User;
const { REFRESH_TOKEN_SECRET, TOKEN_SECRET } = require('../constants');


const handleRefreshToken = async (request, h) =>{   
    try {
        const refreshToken = request.state.refreshToken;
        if (!refreshToken) return h.response('Unauthorized').code(401);
        const user = await User.findAll({ where: { refreshToken: refreshToken } });
        if (!user[0]) return h.response('Forbidden').code(403);

        const decoded = await jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
        const user_id = user[0].user_id;
        const username = user[0].username;
        const email = user[0].email;
        const role = user[0].role;
        const accessToken = jwt.sign({ user_id: user_id, username: username, email: email, role: role }, TOKEN_SECRET, { expiresIn: '20s' });

        return h.response({ accessToken: accessToken }).header('Access-Control-Allow-Credentials', 'true') .code(200);
    } catch (err) {
        console.log(err);
        return h.response('Forbidden').code(403);
    }
}


module.exports = { handleRefreshToken }; // Export fungsi