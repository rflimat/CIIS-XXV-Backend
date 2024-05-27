const CryptoJS = require('crypto-js');

const encryptToken=async(token,privateKey)=>{
    const tokenEncrypt=CryptoJS.AES.encrypt(token,privateKey).toString();
    return tokenEncrypt;
}

const decryptToken=async(tokenEncrypt,privateKey)=>{
    const decryptedBytes = CryptoJS.AES.decrypt(tokenEncrypt, privateKey);
    const decryptedToken = decryptedBytes.toString(CryptoJS.enc.Utf8);
    return decryptedToken;
}

module.exports={
    encryptToken,
    decryptToken
}