const { Router } = require('express');
const router = Router();
const sessionRouter = require("./session.routes");
const registrationRouter = require("./registration.routes");
const eventRoute = require("./event.routes");
const galleryEventRoute = require("./galleryEvent.routes");
const typeEventRoute = require("./typeEvent.routes");
const userRoute = require("./user.routes");
const reservationRoute = require("./reservation.routes");
const reportsRoute = require("./reports.routes");
const speakerRoute = require("./speaker.routes");
const configRoute = require("./config.routes");
const conferenceRoute = require("./conferences.routes");

const handleGet = (req, res) => res.send('<h1>Hey buddy! this is an api...<br>here we do not provide user interfaces 🥴</h1>')

router.get('/', handleGet)
router.use('/sessions', sessionRouter);
router.use('/registrations', registrationRouter);
router.use('/events', eventRoute);
router.use(galleryEventRoute);
router.use('/types-event', typeEventRoute);
router.use('/users', userRoute);
router.use('/register', reservationRoute);
router.use('/reports', reportsRoute);
router.use('/speakers', speakerRoute);
router.use('/config', configRoute);
router.use('/conferences', conferenceRoute);

module.exports = router;