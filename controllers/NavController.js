const { db } = require("../models");
const NavItem = db.NavItem;


const handletGetNav = async (request, h) => {
    try {
        const nav = await NavItem.findAll({})
        const formattedData = {
            message: 'Success',
            data: nav
        }
        return h.response(formattedData).code(200);
    } catch (error) {
        const formattedError = ({
            message: error.message,
        });
        return h.response(formattedError).code(403);
    }
}

module.exports = {handletGetNav}; // Export fungsi