const { handleHttpError, handleErrorResponse } = require("../middlewares/handleError");
const sponsorService = require("../services/sponsor.service");
const sequelize = require("../config/database");
const { getDateTime } = require("../utils/getdate.utils");
const { createRecordAudit } = require("../services/audit.log.service");

const getSponsorsByEvent = async (req, res) => {
    try {
        const { idEvent } = req.params;
        const sponsors = await sponsorService.getSponsorsByEvent(idEvent);
        res.json(sponsors);
    } catch (error) {
        if (typeof error.code === "number") {
            handleErrorResponse(res, error.message, error.code);
            return;
        }
        handleHttpError(res, error);
    }
}
const createSponsorsByEvent = async (req,res) =>{
    const transaction = await sequelize.transaction();
    try{
        const {idEvent} =req.params;
        const {name} = req.body;
        const {files} = req;
        const sponsorObject ={ 
            name_sponsor : name ,
            event_id : idEvent
        }
        let logo={}
        if(files && files.logo != undefined)
            logo=files.logo;
        const sponsor = await sponsorService.createSponsorsByEvent(sponsorObject,logo,transaction);
        
        const recordAuditObject = {
            table_name: "sponsor",
            action_type: "create",
            action_date: getDateTime(),
            user_id: req.iduser,
            record_id: sponsor.id_sponsor,
            new_data: JSON.stringify(sponsorObject)
        };

        await createRecordAudit(recordAuditObject, transaction);
        await transaction.commit();
        res.status(201).json(sponsor);
    } catch(error){
        await transaction.rollback();
        if (typeof error.code === "number") {
            handleErrorResponse(res, error.message, error.code);
            return;
        }
        handleHttpError(res, error);
    }
}
module.exports = {
    getSponsorsByEvent,
    createSponsorsByEvent
};