const Conferences = require("../models/Conferences");
const { getOneEvent } = require("./event.service");
const { getSpeaker } = require("./speaker.service");


const getConferencesService = async (id = null) => {
    return new Promise(async (resolve, reject) => {
        try {

            const conferences = id ? await Conferences.findOne({ where: { id_conference: id } }) : await Conferences.findAll()
            let dataFormatted = {}
            if (conferences.length > 1) {
                dataFormatted = conferences.map((conference) => {
                    return {
                        id: conference.id_conference,
                        topic: conference.topic_conference,
                        starDateTime: conference.start_date_conference,
                        expDateTime: conference.exp_date_conference,
                        isActive: conference.is_active,
                        isMorning: conference.is_morning,
                        idEvent: conference.event_id,
                        idSpeaker: conference.speaker_id
                    }
                })
            } else {
                dataFormatted = {
                    id: conferences.id_conference,
                    topic: conferences.topic_conference,
                    starDateTime: conferences.start_date_conference,
                    expDateTime: conferences.exp_date_conference,
                    isActive: conferences.is_active,
                    isMorning: conferences.is_morning,
                    idEvent: conferences.event_id,
                    idSpeaker: conferences.speaker_id
                }
            }
            resolve(dataFormatted);
        } catch (error) {
            reject(error);
        }
    });
}

const createConferenceService = async (conferenceObj, transaction) => {
    return new Promise(async (resolve, reject) => {
        try {

            const conferenceCreated = await Conferences.create(conferenceObj, { transaction })

            resolve(conferenceCreated.toJSON());
        } catch (error) {
            reject(error);
        }
    });
}

const updateConferenceService = async (idConference, conferenceObj, transaction) => {
    return new Promise(async (resolve, reject) => {
        try {
            const conferenceFind = await Conferences.findByPk(idConference)
            if (!conferenceFind) {
                reject({ code: 404, message: "No se ha encontrado la conferencia" });
                return;
            }

            const conferenceUpdate = await conferenceFind.update(conferenceObj, { transaction });
            resolve(conferenceUpdate);
        } catch (error) {
            reject(error);
            return;
        }
    });
}

const deleteConferenceService = async (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const conference = await Conferences.findOne({
                where: {
                    id_conference: id
                },
            });

            if (!conference) {
                reject({
                    code: 404,
                    message: "La conferencia no existe"
                });
                return;
            }
            await conference.destroy();
            resolve({ message: 'Confernecia eliminada correctamente' });
        } catch (error) {
            reject({
                code: 500,
                message: "Error al eliminar la conferencia"
            });
        }
    });
};
module.exports = {
    createConferenceService,
    getConferencesService,
    updateConferenceService,
    deleteConferenceService
}