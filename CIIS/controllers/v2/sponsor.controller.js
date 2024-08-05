const sequelize = require("../../config/database");
const { handleErrorResponseV2, handleHttpErrorV2 } = require("../../middlewares/handleError");
const { getSponsorsService, updateSponsorService, deleteSponsorService } = require("../../services/sponsor.service");
const eventService = require("../../services/event.service")

const getSponsors = async (req, res) => {
    try {
        const sponsors = await getSponsorsService()
        res.json(sponsors)
    } catch (error) {
        if (typeof error.code == "number") {
            handleErrorResponseV2(res, error.message, error.code);
            return;
        }
        handleHttpErrorV2(res, error);
    }
}


const getOneSponsor = async (req, res) => {
    try {
        const { idSponsor } = req.params
        const sponsor = await getSponsorsService(idSponsor)
        if (!sponsor) {
            handleErrorResponseV2(
                res,
                "El Sponsor no existente",
                404
            );
            return;
        }
        res.json(sponsor)
    } catch (error) {
        if (typeof error.code == "number") {
            handleErrorResponseV2(res, error.message, error.code);
            return;
        }
        handleHttpErrorV2(res, error);
    }
}
const updateSponsor = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { name, idEvent } = req.body
        const { idSponsor } = req.params
        const { files } = req

        let sponsorObj = {}
        if (name !== undefined) sponsorObj.name_sponsor = name;
        let logo = {}
        if (files && files.logo != undefined) {
            logo = files.logo;
        }
        if (idEvent !== undefined) {
            const event = await eventService.getOneEvent(idEvent)
            sponsorObj.event_id = event.id_event
        }

        result = await updateSponsorService(idSponsor, sponsorObj, logo, transaction)

        await transaction.commit();
        res.send({
            message: "Sponsor actualizado",
        });
    } catch (error) {
        await transaction.rollback();
        if (typeof error.code == "number") {
            handleErrorResponseV2(res, error.message, error.code);
            return;
        }
        handleHttpErrorV2(res, error);
    }
}
const deleteSponsor = async (req, res) => {
    try {
        const { idSponsor } = req.params;
        const result = await deleteSponsorService(idSponsor);
        res.json(result);
    } catch (error) {
        if (typeof error.code === "number") {
            handleErrorResponseV2(res, error.message, error.code);
            return;
        }
        handleErrorResponseV2(res, error);
    }
}

module.exports = {
    getSponsors,
    getOneSponsor,
    updateSponsor,
    deleteSponsor
}