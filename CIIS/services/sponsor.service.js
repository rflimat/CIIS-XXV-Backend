const Events = require("../models/Events");
const Sponsors = require("../models/Sponsors");
const { uploadImage, deleteImage } = require("../utils/upload.img");

const getSponsorsByEvent = async (id) => {
    return new Promise(async (resolve, reject) => {
        const event = await Events.findByPk(id);
        if (!event) {
            reject({ code: 404, message: "No se ha encontrado el evento" });
            return;
        }
        const sponsors = await Sponsors.findAll({
            include: [
                {
                    model: Events,
                    attributes: [],
                    where: {
                        id_event: id,
                    },
                },
            ],
        });
        if (sponsors.length == 0) {
            reject({ code: 404, message: "No se han encontrado auspiciadores para este evento" });
            return;
        }
        const sponsorsMap = sponsors.map((sponsor) => {
            return {
                id: sponsor.id_sponsor,
                name: sponsor.name_sponsor,
                img: sponsor.dir_img_sponsor
            };
        });
        resolve(sponsorsMap);
    })
}

const createSponsorsByEvent = async (sponsorObject, logo, transaction) => {
    return new Promise(async (resolve, reject) => {
        try {
            const event = await Events.findByPk(sponsorObject.event_id);
            if (!event) {
                reject({ code: 404, message: "No se ha encontrado el evento" });
                return;
            }
            let fileImagesponsor = "";
            fileImagesponsor = await uploadImage(logo, "public", "sponsors", [
                "jpg",
                "jpeg",
                "png",
            ]);
            sponsorObject.dir_img_sponsor = fileImagesponsor.filename;
            const sponsorBuild = await Sponsors.create(sponsorObject, { transaction });

            resolve(sponsorBuild)
        } catch (error) {
            reject(error);
            return;
        }

    })
}

const getSponsorsService = async (id = null) => {
    return new Promise(async (resolve, reject) => {
        try {

            const sponsors = id ? await Sponsors.findOne({ where: { id_sponsor: id } }) : await Sponsors.findAll()
            let dataFormatted = {}
            if (sponsors.length > 1) {
                dataFormatted = sponsors.map((sponsor) => {
                    return {
                        id: sponsor.id_sponsor,
                        name: sponsor.name_sponsor,
                        img: sponsor.dir_img_sponsor,
                        idEvent: sponsor.event_id
                    }
                })
            } else {
                dataFormatted = {
                    id: sponsors.id_sponsor,
                    name: sponsors.name_sponsor,
                    img: sponsors.dir_img_sponsor,
                    idEvent: sponsors.event_id
                }
            }
            resolve(dataFormatted);
        } catch (error) {
            reject(error);
        }
    });
}

const updateSponsorService = (id, sponsorObject, fileImage, transaction) => {
    return new Promise(async (resolve, reject) => {
        let pathTemp = '';
        try {
            const sponsorFind = await Sponsors.findByPk(id);
            if (!sponsorFind) {
                reject({ code: 404, message: "No se ha encontrado el sponsor" });
                return;
            }
            const dir_img_anterior = sponsorFind.dataValues.dir_img_sponsor
            const sponsorUpdate = await sponsorFind.update(sponsorObject, { transaction });
            if (Object.keys(fileImage).length > 0) {
                const fileImagesponsor = await uploadImage(fileImage, "public", "sponsors", [
                    "jpg",
                    "jpeg",
                    "png",
                ]);
                sponsorUpdate.dir_img_sponsor = fileImagesponsor.filename;
                await sponsorUpdate.save({ transaction });
                pathTemp = fileImagesponsor.filename;
            }
            await deleteImage("public", dir_img_anterior)
            resolve(sponsorUpdate);
        } catch (error) {
            if (error.file == "sponsors") {
                await deleteImage("public", pathTemp);
            }
            reject(error);
            return;
        }
    });
};
const deleteSponsorService = async (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const sponsor = await Sponsors.findOne({
                where: {
                    id_sponsor: id
                },
            });

            if (!sponsor) {
                reject({
                    code: 404,
                    message: "El sponsor no existe"
                });
                return;
            }
            if (sponsor.dataValues.dir_img_sponsor !== undefined) {
                await deleteImage("public", sponsor.dataValues.dir_img_sponsor)
            }
            await sponsor.destroy();
            resolve({ message: 'sponsor eliminado correctamente' });
        } catch (error) {
            reject({
                code: 500,
                message: "Error al eliminar el sponsor"
            });
        }
    });
};


module.exports = {
    getSponsorsByEvent,
    createSponsorsByEvent,
    getSponsorsService,
    updateSponsorService,
    deleteSponsorService
}; 