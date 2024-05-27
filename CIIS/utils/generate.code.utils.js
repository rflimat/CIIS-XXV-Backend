const { customAlphabet }=require("nanoid/async");

const createCode=async(length=5)=>{
    const nanoid = customAlphabet('1234567890', length)
    const coderandom=await nanoid();

    return coderandom;
}

module.exports={
    createCode
}