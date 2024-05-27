const sequelize = require("../config/database");
const {handleErrorResponse,handleHttpError}=require("../middlewares/handleError");
const speakerServices=require("../services/speaker.service");
const { getDateTime } = require("../utils/getdate.utils");
const { createRecordAudit } = require("../services/audit.log.service");

const getSpeakersByEvent = async (req, res) => {
    try {
        const { idEvent } = req.params;
        const speakers = await speakerServices.getSpeakersByEvent(idEvent);
        res.json(speakers);
    } catch (error) {
        if (typeof error.code === "number") {
            handleErrorResponse(res, error.message, error.code);
            return;
        }
        handleHttpError(res, error);
    }
}

const createSpeaker=async(req,res)=>{
    const transaction=await sequelize.transaction();
    try {
        let avatar={};
        if(req.files && req.files.avatar!=undefined){
            avatar=req.files.avatar;
        }
        const speakerObject=req.body;
        const speaker=await speakerServices.createSpeaker(speakerObject,avatar,transaction);
        await transaction.commit();
        res.status(201).json(speaker);
    } catch (error) {
        await transaction.rollback();
        handleHttpError(res,error);
    }
}

const updateSpeaker = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { idSpeaker } = req.params;
        const { name, lastname, role, workplace, nationality, description, socialNetwork } = req.body;
        const { files } = req;
        
        if (Object.keys(req.body).length > 0 || files) {
            const speakerObject = {};
            if (name !== undefined) speakerObject.name_speaker = name;
            if (lastname !== undefined) speakerObject.lastname_speaker = lastname;
            if (role !== undefined) speakerObject.ocupation_speaker = role;
            if (workplace !== undefined) speakerObject.work_place_speaker = workplace;
            if (nationality !== undefined) speakerObject.nationality_speaker = nationality;
            if (description !== undefined) speakerObject.about_profile_speaker = description;
            if (socialNetwork !== undefined) speakerObject.linkedin_speaker = socialNetwork;
            let avatar = {}
            if (files && files.avatar != undefined) {
                avatar = files.avatar;
            }
            await speakerServices.updateSpeaker(idSpeaker, speakerObject, avatar, transaction);
      
            const recordAuditObject = {
                table_name: "speaker",
                action_type: "update",
                action_date: getDateTime(),
                user_id: req.iduser,
                record_id: idSpeaker,
                new_data: JSON.stringify(speakerObject)
            };
    
            await createRecordAudit(recordAuditObject, transaction);  
        }
        await transaction.commit();
        res.sendStatus(204);
    } catch (error) {
        await transaction.rollback();
        if (typeof error.code === "number") {
            handleErrorResponse(res, error.message, error.code);
            return;
        }
        handleHttpError(res, error);
    }
}

module.exports={
  getSpeakersByEvent,
  createSpeaker,
  updateSpeaker
}
