const Events = require("../models/Events");
const Sponsors = require("../models/Sponsors");
const { uploadImage } = require("../utils/upload.img");

const getSponsorsByEvent = async (id) => {
    return new Promise (async (resolve, reject) => {
        const event = await Events.findByPk(id);
        if (!event) {
            reject({code: 404, message: "No se ha encontrado el evento"});
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
            reject({code: 404, message: "No se han encontrado auspiciadores para este evento"});
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

const createSponsorsByEvent = async (sponsorObject,logo,transaction) => {
    return new Promise (async (resolve, reject) => {    
        try{
            const event = await Events.findByPk(sponsorObject.event_id);
            if (!event) {
                reject({code: 404, message: "No se ha encontrado el evento"});
                return;
            }
            let fileImagesponsor="";          
                fileImagesponsor = await uploadImage(logo,"public", "sponsors", [
                "jpg",
                "jpeg",
                "png",
                ]);
                sponsorObject.dir_img_sponsor = fileImagesponsor.filename;
            const sponsorBuild = await Sponsors.create(sponsorObject,{transaction});

            resolve(sponsorBuild)
        }catch (error) {
            reject(error);
            return;
        }  

    })
}



module.exports = {
    getSponsorsByEvent,
    createSponsorsByEvent
}; 