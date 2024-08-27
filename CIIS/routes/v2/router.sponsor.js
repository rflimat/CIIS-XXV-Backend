const { Router } = require("express");
const { getSponsors, getOneSponsor, updateSponsor, deleteSponsor } = require("../../controllers/v2/sponsor.controller");
const { isAdmin, isAtLeastContentManager } = require("../../middlewares/v2/auth");
const routerSponsor = Router();

routerSponsor.route("/").get(getSponsors)
routerSponsor.route("/:idSponsor").get(isAtLeastContentManager, getOneSponsor)
routerSponsor.route("/:idSponsor").put(isAtLeastContentManager, updateSponsor)
routerSponsor.route("/:idSponsor").delete(isAdmin, deleteSponsor)
module.exports = routerSponsor