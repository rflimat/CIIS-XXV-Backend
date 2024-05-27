const {compare}=require("../utils/password.utils");
const Users = require("../models/Users");

const authByEmailPwd = async (email, password) => {
    const user = await Users.findOne({
        where: { email_user: email },
    });

    let iserror = 0;
    if (!user) 
        iserror = 1
    else if (!await compare(password, user.password_user)) 
        iserror = 2;
    
    return { user, iserror };
};

const authTokenById = async (code) => {
    const user = await Users.findOne({
        attributes: ['id_user', 'name_user', 'email_user', 'role_id'],
        where: { code_user: code },
    });

    let iserror = 0;
    if (!user) 
        iserror = 1
    
    return { user, iserror };
};

module.exports = { authByEmailPwd, authTokenById };