const Conferences = require("../models/Conferences");
const Speakers = require("../models/Speakers");
const { getOneEvent } = require("./event.service");
const { getSpeaker } = require("./speaker.service");

const getConferencesService = async (id) => {
    return new Promise(async (resolve, reject) => {
        try {

            const conferences = await Conferences.findAll()
            let dataFormatted = {}
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
            resolve(dataFormatted);
        } catch (error) {
            reject(error);
        }
    });
}

const getConferenceService = async (id = null) => {
    return new Promise(async (resolve, reject) => {
        try {

            const conferences = await Conferences.findOne({ where: { id_conference: id } })
            let dataFormatted = {}
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
            resolve(dataFormatted);
        } catch (error) {
            reject(error);
        }
    });
}

const getConferenceByEvent = async (idEvent) => {
    return new Promise(async (resolve, reject) => {
        try {
            const conferences = await Conferences.findAll({
                order: [['start_date_conference', 'ASC']],
                where: { event_id: idEvent } 
            });
            let dataFormatted = {}
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
            resolve(dataFormatted);
        } catch (error) {
            reject(error);
        }
    });
}
const getConferenceByEventOrder = async (idEvent) => {
    return new Promise(async (resolve, reject) => {
        try {

            const conferences = await Conferences.findAll({
                where: { event_id: idEvent, is_active: 1 },
                order: [
                    ['start_date_conference', 'ASC'],
                ],
                include: [{
                    model: Speakers,
                    attributes: ['id_speaker', 'name_speaker', 'lastname_speaker', 'nationality_speaker', 'dir_img_speaker', 'about_profile_speaker']
                }]
            })
            let dataFormatted = {}
            dataFormatted = conferences.map((conference) => {
                return {
                    id: conference.id_conference,
                    topic: conference.topic_conference,
                    start: conference.start_date_conference,
                    end: conference.exp_date_conference,
                    type: "Ponencia",
                    isMorning: conference.is_morning,
                    speaker: `${conference.speaker.name_speaker} ${conference.speaker.lastname_speaker}`,
                    idSpeaker: conference.speaker_id,
                    country: conference.speaker.nationality_speaker,
                    description: conference.speaker.about_profile_speaker,
                    avatar: conference.speaker.dir_img_speaker
                }
            })
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
    getConferenceService,
    updateConferenceService,
    deleteConferenceService,
    getConferenceByEvent,
    getConferenceByEventOrder
}