const { Router } = require("express");
const { getSponsors, getOneSponsor, updateSponsor, deleteSponsor } = require("../../controllers/v2/sponsor.controller");
const { isAtLeastOrganizer, isAdmin } = require("../../middlewares/v2/auth");
const routerSponsor = Router();

routerSponsor.route("/").get(getSponsors)
routerSponsor.route("/:idSponsor").get(isAtLeastOrganizer, getOneSponsor)
routerSponsor.route("/:idSponsor").put(isAtLeastOrganizer, updateSponsor)
routerSponsor.route("/:idSponsor").delete(isAdmin, deleteSponsor)
module.exports = routerSponsor