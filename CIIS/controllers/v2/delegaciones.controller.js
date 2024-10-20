
const sequelize = require("../../config/database");
const { handleErrorResponseV2, handleHttpErrorV2 } = require("../../middlewares/handleError");
const ScholarCodes = require("../../models/ScholarCodes");
const { createDelegacion, updateDelegacion, deleteDelegacion } = require("../../services/delegacion.service");
const CONTROLLER_DELEGACIONES = {};

CONTROLLER_DELEGACIONES.POST = async (req, res) => {
    const transaction = await sequelize.transaction()
    try {
        const {
            year, code, institution } = req.body

        const object = {
            year,
            code,
            institution
        }
        result = await createDelegacion(object, transaction)
        await transaction.commit();
        res.send({
            message: "Delegacion creada",
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

CONTROLLER_DELEGACIONES.PUT = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { id } = req.params;
        const {
            year, code, institution } = req.body

        const Object = {};
        if (year !== undefined) Object.year = year;
        if (code !== undefined) Object.code = code;
        if (institution !== undefined) Object.institution = institution;

        await updateDelegacion(id, Object, transaction)
        await transaction.commit();
        res.sendStatus(200);
    } catch (error) {
        await transaction.rollback();
        if (typeof error.code == "number") {
            handleErrorResponseV2(res, error.message, error.code);
            return;
        }
        handleHttpErrorV2(res, error);
    }
}
CONTROLLER_DELEGACIONES.DELETE = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await deleteDelegacion(id)
        res.json(result);
    } catch (error) {
        //await transaction.rollback();
        if (typeof error.code == "number") {
            handleErrorResponseV2(res, error.message, error.code);
            return;
        }
        handleHttpErrorV2(res, error);
    }
}
CONTROLLER_DELEGACIONES.GET_JSON = async (req, res) => {
    try {
        const delegaciones = await ScholarCodes.findAll()

        const jsonContent = JSON.stringify(delegaciones); // Convertir objeto a JSON con formato
        const path = "./uploads/public/reports/";
        const fileName = 'delegaciones.json';

        if (!fs.existsSync(path)) {
            fs.mkdirSync(path, { recursive: true });
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
            handleErrorResponseV2(res, error.message, error.code);
            return;
        }
        handleHttpErrorV2(res, error);
    }
}

CONTROLLER_DELEGACIONES.GET = async (_req, res) => {
    try {
        let delegaciones = await ScholarCodes.findAll();
        res.send(delegaciones);
    } catch (err) {
        console.log(err);
        res.status(500).send(http["500"]);
    }
};

CONTROLLER_DELEGACIONES.GET_ONE = async (req, res) => {
    try {
        const { id} = req.params
        let taller = ScholarCodes.findByPk(id)
        res.send(taller);
    } catch (err) {
        console.log(err);
        res.status(500).send(http["500"]);
    }
};

module.exports = CONTROLLER_DELEGACIONES