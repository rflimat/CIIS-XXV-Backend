const Conferences = require("../models/Conferences");
const Events = require("../models/Events");
const Speakers = require("../models/Speakers");
const { uploadImage } = require("../utils/upload.img");

const getSpeakersByEvent = async (id) => {
  return new Promise(async (resolve, reject) => {
    const event = await Events.findByPk(id);
    if (!event) {
      reject({ code: 404, message: "No se ha encontrado el evento" });
      return;
    }
    const speakers = await Speakers.findAll({
      include: [
        {
          model: Conferences,
          attributes: [],
          where: {
            event_id: id,
          },
        },
      ],
      distinct: true,
    });
    if (speakers.length == 0) {
      reject({ code: 404, message: "No se han encontrado ponentes para este evento" });
      return;
    }
    const speakersMap = speakers.map((speaker) => {
      return {
        id: speaker.id_speaker,
        name: speaker.name_speaker,
        lastname: speaker.lastname_speaker,
        role: speaker.ocupation_speaker,
        workplace: speaker.work_place_speaker,
        nationality: speaker.nationality_speaker,
        description: speaker.about_profile_speaker,
        socialNetwork: speaker.linkedin_speaker,
        avatar: speaker.dir_img_speaker,
      };
    });
    resolve(speakersMap);
  })
}

const createSpeaker = (speakerObject, fileImage = {}, transaction) => {
  return new Promise(async (resolve, reject) => {
    try {
      const dataObject = {
        name_speaker: speakerObject.name,
        lastname_speaker: speakerObject.lastname,
        ocupation_speaker: speakerObject.role,
        work_place_speaker: speakerObject.workplace,
        nationality_speaker: speakerObject.nationality,
        about_profile_speaker: speakerObject.description,
        linkedin_speaker: speakerObject.socialNetwork,

        university_speaker: speakerObject.university,
        email_speaker: speakerObject.email,
        phone_speaker: speakerObject.phone,


        degree_speaker: speakerObject.degree,
        trajectory_speaker: speakerObject.trajectory,
        achievements_speaker: speakerObject.achievements,
        release_year_speaker: speakerObject.release_year,
        experience_years_speaker: speakerObject.experience_years
      };

      let fileImageSpeaker = {};
      const speakerBuild = Speakers.build(dataObject, {
        transaction,
      });
      if (Object.keys(fileImage).length !== 0) {
        fileImageSpeaker = await uploadImage(fileImage, "public", "speakers", [
          "jpg",
          "jpeg",
          "png",
        ]);
        speakerBuild.dir_img_speaker = fileImageSpeaker.filename;
      }
      const speakerCreated = await speakerBuild.save({ transaction });

      resolve(speakerCreated);
    } catch (error) {
      reject(error);
    }
  });
};

const createConferenceToSpeaker = async (conferenceObject, transaction) => {
  return new Promise(async (resolve, reject) => {
    try {
      const conferenceCreated = await Conferences.create(conferenceObject, {
        transaction,
      });
      resolve(conferenceCreated);
    } catch (error) {
      reject(error);
    }
  });
};

const updateSpeaker = (id, speakerObject, fileImage, transaction) => {
  return new Promise(async (resolve, reject) => {
    let pathTemp = '';
    try {
      const speakersFind = await Speakers.findByPk(id);
      if (!speakersFind) {
        reject({ code: 404, message: "No se ha encontrado el ponente" });
        return;
      }

      const speakersUpdate = await speakersFind.update(speakerObject, { transaction });
      if (Object.keys(fileImage).length > 0) {
        const fileImageSpeaker = await uploadImage(fileImage, "public", "speakers", [
          "jpg",
          "jpeg",
          "png",
        ]);
        speakersUpdate.dir_img_speaker = fileImageSpeaker.filename;
        await speakersUpdate.save({ transaction });
        pathTemp = fileImageSpeaker.filename;
      }

      resolve(speakersUpdate);
    } catch (error) {
      if (error.file == "speakers") {
        await deleteImage("public", pathTemp);
      }
      reject(error);
      return;
    }
  });
};

const getSpeakers = async () => {
  return new Promise(async (resolve, reject) => {
    const speakers = await Speakers.findAll({
      include: [
        {
          model: Conferences,
          attributes: [],
        },
      ],
      distinct: true,
    });
    const speakersMap = speakers.map((speaker) => {
      return {
        id: speaker.id_speaker,
        name: speaker.name_speaker,
        lastname: speaker.lastname_speaker,
        role: speaker.ocupation_speaker,
        university: speaker.university_speaker, //
        email: speaker.email_speaker,//
        phone: speaker.phone_speaker,//
        workplace: speaker.work_place_speaker,
        nationality: speaker.nationality_speaker,
        description: speaker.about_profile_speaker,
        socialNetwork: speaker.linkedin_speaker,
        avatar: speaker.dir_img_speaker,
        degree: speaker.degree_speaker,
        trajectory: speaker.trajectory_speaker,
        achievements: speaker.achievements_speaker,
        release_year: speaker.release_year_speaker,
        experience_years: speaker.experience_years_speaker,
      };
    });
    resolve(speakersMap);
  })
}

const deleteSpeaker = async (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const speaker = await Speakers.findOne({
        where: {
          id_speaker: id
        },
      });

      if (!speaker) {
        reject({
          code: 404,
          message: "El speaker no existe"
        });
        return;
      }

      await speaker.destroy();
      resolve({ message: 'Speaker eliminado correctamente' });
    } catch (error) {
      reject({
        code: 500,
        message: "Error al eliminar el speaker"
      });
    }
  });
};

const getSpeaker = async (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const speaker = await Speakers.findOne({
        where: {
          id_speaker: id
        },
      });

      if (!speaker) {
        reject({
          code: 404,
          message: "El speaker no existe"
        });
        return;
      }

      resolve(speaker);
    } catch (error) {
      reject({
        code: 500,
        message: "Error al obtener el speaker"
      });
    }
  });
};
module.exports = {
  getSpeakersByEvent,
  createSpeaker,
  createConferenceToSpeaker,
  updateSpeaker,
  getSpeakers,
  deleteSpeaker,
  getSpeaker
};
