const { handleErrorResponse, handleHttpError } = require("../../middlewares/handleError");
const speakerServices = require("../../services/speaker.service")
const sequelize = require("../../config/database");
const { getDateTime } = require("../../utils/getdate.utils");
const { createRecordAudit } = require("../../services/audit.log.service");
const fs = require("fs");

const CONTROLLER_SPEAKER = {};

// TODOS
CONTROLLER_SPEAKER.GET = async (req, res) => {
    try {
        const speakers = await speakerServices.getSpeakers();
        res.json(speakers);
    } catch (error) {
        if (typeof error.code === "number") {
            handleErrorResponse(res, error.message, error.code);
            return;
        }
        handleHttpError(res, error);
    }
}
CONTROLLER_SPEAKER.GET_JSON_BY_EVENT = async (req, res) => {
    try {
        const { idEvent } = req.params;
        const speakers = await speakerServices.getSpeakersByEvent(idEvent);
        //res.json(speakers);
        const jsonContent = JSON.stringify(speakers); // Convertir objeto a JSON con formato
        const path = "./uploads/public/reports/" + idEvent + "/";
        const fileName = 'speakers.json';

        if (!fs.existsSync(path)) {
            fs.mkdirSync(path, {recursive: true});
        }

        fs.writeFile(`${path}/${fileName}`, jsonContent, (err) => { 
            if (err) {
              console.log(err);
            } else {
              console.log(`${fileName} creado!`);
            }
        });

        res.setHeader('Content-Disposition', 'attachment; filename=' + fileName);
        res.setHeader('Content-Type', 'application/json');
        res.send(jsonContent);
    } catch (error) {
        if (typeof error.code === "number") {
            handleErrorResponse(res, error.message, error.code);
            return;
        }
        handleHttpError(res, error);
    }
}

// uno
CONTROLLER_SPEAKER.GETONE = async (req, res) => {
    try {
        const { id } = req.params;
        const speaker = await speakerServices.getSpeaker(id)
        const speakerFormat = {
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
            order: speaker.order_speaker
        };
        res.send(speakerFormat);
    } catch (error) {
        if (typeof error.code === "number") {
            handleErrorResponse(res, error.message, error.code);
            return;
        }
        handleHttpError(res, error);
    }
}

CONTROLLER_SPEAKER.PUT = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { id } = req.params;
        const { name,
            lastname,
            role,
            workplace,
            nationality,
            description,
            socialNetwork,
            university,
            email,
            phone,
            degree,
            trajectory,
            achievements,
            release_year,
            experience_years,
            order
        } = req.body;
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
            if (university !== undefined) speakerObject.university_speaker = university;
            if (email !== undefined) speakerObject.email_speaker = email;
            if (phone !== undefined) speakerObject.phone_speaker = phone;
            if (degree !== undefined) speakerObject.degree_speaker = degree;
            if (trajectory !== undefined) speakerObject.trajectory_speaker = trajectory;
            if (achievements !== undefined) speakerObject.achievements_speaker = achievements;
            if (release_year !== undefined) speakerObject.release_year_speaker = release_year;
            if (experience_years !== undefined) speakerObject.experience_years_speaker = experience_years;
            if (order !== undefined) speakerObject.order_speaker = order;

            let avatar = {}
            if (files && files.avatar != undefined) {
                avatar = files.avatar;
            }
            await speakerServices.updateSpeaker(id, speakerObject, avatar, transaction);

            const recordAuditObject = {
                table_name: "speaker",
                action_type: "update",
                action_date: getDateTime(),
                user_id: req.user.id,
                record_id: id,
                new_data: JSON.stringify(speakerObject)
            };

            await createRecordAudit(recordAuditObject, transaction);
        }
        await transaction.commit();
        res.sendStatus(200);
    } catch (error) {
        await transaction.rollback();
        if (typeof error.code === "number") {
            handleErrorResponse(res, error.message, error.code);
            return;
        }
        handleHttpError(res, error);
    }
}

CONTROLLER_SPEAKER.DELETE = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(id)
        const result = await speakerServices.deleteSpeaker(id);
        res.json(result);
    } catch (error) {
        if (typeof error.code === "number") {
            handleErrorResponse(res, error.message, error.code);
            return;
        }
        handleHttpError(res, error);
    }
}

module.exports = CONTROLLER_SPEAKER;
