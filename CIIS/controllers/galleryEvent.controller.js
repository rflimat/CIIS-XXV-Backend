const sequelize = require("../config/database");
const { handleErrorResponse, handleHttpError } = require("../middlewares/handleError");
const GalleryEventService=require("../services/galleryEvent.service");
const getGalleryEvents=(req,res)=>{

}

const getOneGalleryEvent=(req,res)=>{

}

const createGalleryEvent=async(req,res)=>{
    const {formDataObject}=req;
    const {idEvent}=req.params;
    const transaction = await sequelize.transaction();
    try {
        await GalleryEventService.createGalleryEvent(idEvent,formDataObject,transaction);
        
        await transaction.commit();
        res.sendStatus(201);
    } catch (error) {
        await transaction.rollback();
        handleHttpError(res,error);
    }
}

const updateGalleryEvent=(req,res)=>{

}

const deleteGalleryEvent=(req,res)=>{
    
}

module.exports={
    getGalleryEvents,
    getOneGalleryEvent,
    createGalleryEvent,
    updateGalleryEvent,
    deleteGalleryEvent,
}