const GalleryEvent=require("../models/GalleryEvents");
const {uploadImage,deleteImage}=require("../utils/upload.img");
const getGalleryEvents=(req,res)=>{

}

const getOneGalleryEvent=(req,res)=>{

}

const createGalleryEvent=async(event,dataObject,transaction)=>{
    return new Promise(async(resolve, reject) => {  
        let pathTemp=[];
        try {
            let galleryEvent=[];
            for (let index = 0; index < dataObject.lengthInputs; index++) {
                const imageSave=await uploadImage(dataObject.image[index],"public","ciis-history",["jpg", "jpeg", "png"]);
                galleryEvent.push({
                    name:dataObject.name[index],
                    priority_photo:dataObject.priority[index],
                    eventId:event,
                    dir_photo:imageSave.filename
                });
                pathTemp.push(imageSave.filename);
            }

            await GalleryEvent.bulkCreate(
                galleryEvent,{transaction}
            );
            resolve();
        } catch (error) {

            for (const img of pathTemp) {
                await deleteImage("public",img);
            }
            reject(error);
        }
    })
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