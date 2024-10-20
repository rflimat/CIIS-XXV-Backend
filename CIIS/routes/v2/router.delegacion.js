const { Router } = require("express");
const DelegacionesRouter = Router();

const {
    authMid,
    isAtLeastOrganizer,
    isAdmin,
    isAtLeastContentManager,
} = require("../../middlewares/v2/auth");
const CONTROLLER_DELEGACIONES = require("../../controllers/v2/delegaciones.controller");
DelegacionesRouter.route('/').get(CONTROLLER_DELEGACIONES.GET)
DelegacionesRouter.route('/').post(CONTROLLER_DELEGACIONES.POST)
DelegacionesRouter.route('/json').get(CONTROLLER_DELEGACIONES.GET_JSON)
DelegacionesRouter.route('/:id').put(CONTROLLER_DELEGACIONES.PUT)
DelegacionesRouter.route('/:id').delete(CONTROLLER_DELEGACIONES.DELETE)
DelegacionesRouter.route('/:id').get(CONTROLLER_DELEGACIONES.GET_ONE)

module.exports = DelegacionesRouter;
