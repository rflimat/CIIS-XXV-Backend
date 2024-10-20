const ScholarCodes = require("../models/ScholarCodes")


const createDelegacion = (Objeto, transaction) => {
    return new Promise(async (resolve, reject) => {
        try {
            const dataObject = {
                year: Objeto.year,
                code: Objeto.code,
                institution: Objeto.institution
            }
            const scholarCreated = await ScholarCodes.create(dataObject, { transaction })
            resolve(scholarCreated.toJSON());
        } catch (error) {
            reject(error)
        }
    })
}
const updateDelegacion = (id, Objeto, transaction) => {
    return new Promise(async (resolve, reject) => {
        try {

            const scholarFind = await ScholarCodes.findByPk(id);
            if (!scholarFind) {
                reject({ code: 404, message: "No se ha encontrado la delegacion" });
                return;
            }

            const scholarUpdate = await scholarFind.update(Objeto, { transaction });

            resolve(scholarUpdate);
        } catch (error) {
            reject(error);
            return;
        }
    });
};

const deleteDelegacion = async (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const scholar = await ScholarCodes.findOne({
                where: {
                    id_sc: id
                },
            });

            if (!scholar) {
                reject({
                    code: 404,
                    message: "La delegacion no existe"
                });
                return;
            }

            await scholar.destroy();
            resolve({ message: 'Delegacion eliminado correctamente' });
        } catch (error) {
            reject({
                code: 500,
                message: "Error al eliminar la delegacion"
            });
        }
    });
}; module.exports = {
    createDelegacion,
    updateDelegacion,
    deleteDelegacion
}