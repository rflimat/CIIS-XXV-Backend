const TallerSQL = require("../models/Taller/Taller")

const createTallerService = (TallerObject, transaction) => {
    return new Promise(async (resolve, reject) => {
        try {
            const dataObject = {
                name: TallerObject.name,
                price: TallerObject.price,
                tickets: TallerObject.tickets,
                avaible: TallerObject.avaible,
                start: TallerObject.start,
                end: TallerObject.end,
                date: TallerObject.date,
                place: TallerObject.place,
                createAt: new Date(),
                relatedSpeaker: TallerObject.idSpeaker,
                relatedEvent: TallerObject.idEvent
            }
            const tallerCreated = await TallerSQL.create(dataObject, { transaction })
            resolve(tallerCreated.toJSON());
        } catch (error) {
            reject(error)
        }
    })
}
const updateTaller = (id, TallerObject, transaction) => {
    return new Promise(async (resolve, reject) => {
        try {
            const tallerFind = await TallerSQL.findByPk(id);
            if (!tallerFind) {
                reject({ code: 404, message: "No se ha encontrado el taller" });
                return;
            }

            const tallerUpdate = await tallerFind.update(TallerObject, { transaction });

            resolve(tallerUpdate);
        } catch (error) {
            reject(error);
            return;
        }
    });
};

const deleteTaller = async (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const taller = await TallerSQL.findOne({
                where: {
                    id: id
                },
            });

            if (!taller) {
                reject({
                    code: 404,
                    message: "El taller no existe"
                });
                return;
            }

            await taller.destroy();
            resolve({ message: 'Taller eliminado correctamente' });
        } catch (error) {
            reject({
                code: 500,
                message: "Error al eliminar el taller"
            });
        }
    });
};

module.exports = {
    createTallerService,
    updateTaller,
    deleteTaller
}