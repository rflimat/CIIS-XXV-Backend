const AuditLog=require("../models/AuditLog");

const createRecordAudit=async(dataObject,transaction)=>{
    return new Promise(async(resolve, reject) => {
        try {
            await AuditLog.create(dataObject,{transaction});
            resolve();
        } catch (error) {
            reject(error);
        }
    });
};

module.exports={
    createRecordAudit
}
