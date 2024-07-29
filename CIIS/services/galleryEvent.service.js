const { ItemsGalleryDTO } = require("../DTO/events-gallery-type.dto");
const GalleryEvent = require("../models/GalleryEvents");
const { uploadImage, deleteImage } = require("../utils/upload.img");

const getGalleryEvent = async (idEvent) => {

    const images = await GalleryEvent.findAll({
        where: {
            eventId: idEvent
        }
    })
    imagesFormat = images.map((item) => {
        return {
            id: item.id_galleryPhoto,
            name: item.name,
            image: item.dir_photo
        }
    })
    return imagesFormat
}

const getOneGalleryEvent = (req, res) => {

}

const createGalleryEvent = async (event, dataObject, transaction) => {
    return new Promise(async (resolve, reject) => {
        let pathTemp = [];
        try {
            let galleryEvent = [];
            for (let index = 0; index < dataObject.lengthInputs; index++) {
                const imageSave = await uploadImage(dataObject.image[index], "public", "ciis-history", ["jpg", "jpeg", "png"]);
                galleryEvent.push({
                    name: dataObject.name[index],
                    priority_photo: dataObject.priority[index],
                    eventId: event,
                    dir_photo: imageSave.filename
                });
                pathTemp.push(imageSave.filename);
            }

            await GalleryEvent.bulkCreate(
                galleryEvent, { transaction }
            );
            resolve();
        } catch (error) {

            for (const img of pathTemp) {
                await deleteImage("public", img);
            }
            reject(error);
        }
    })
}

const updateGalleryEvent = async (req, res) => {
}

const deleteGalleryEventService = async (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const image = await GalleryEvent.findOne({
                where: {
                    id_galleryPhoto: id
                }
            })

            if (!image) {
                reject({
                    code: 404,
                    message: "La imagen que se desea eliminar no existe"
                });
                return;
            }
            //console.log(image.dataValues)
            await deleteImage("public", image.dataValues.dir_photo)
            await image.destroy();
            resolve({ message: 'Imagen eliminada correctamente' });
        } catch (error) {
            reject({
                code: 500,
                message: "Error al eliminar la imagen"
            });
        }
    });
}


module.exports = {
    getGalleryEvent,
    getOneGalleryEvent,
    createGalleryEvent,
    updateGalleryEvent,
    deleteGalleryEventService,
}