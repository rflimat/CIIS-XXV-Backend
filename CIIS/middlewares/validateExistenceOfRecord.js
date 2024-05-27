const { searchEventActive, getOneEvent } = require("../services/event.service");
const {
  searchTypeAttendeByReservation,
  searchTypeAttendeByEvent
} = require("../services/priceTypeAttendee.service");
const { validateExtensionsToFile } = require("../utils/upload.img");
const { handleErrorResponse, handleHttpError } = require("./handleError");
const { getUserByDniOrCode,getUserByEmail } = require("../services/user.service");
const {uploadFile} = require("./upload.file");
// Valida que el evento exista y que el tipo de asistente este relacionado con este
const validateKeyTypeAttende = async (req, res, next) => {
  if (!req.query || Object.keys(req.query).length === 0 || !req.query.event) {
    handleErrorResponse(res, "No se ha especificado el evento", 404);
    return;
  }

  const { typeattendee } = req.body;
  const { event } = req.query;

  const existEvent = await searchEventActive(event);
  if (!existEvent) {
    handleErrorResponse(res, "No se ha encontrado el evento", 404);
    return;
  }

  // verify exists a price for type attendee and the event
  const existTypeAttendee = await searchTypeAttendeByEvent(typeattendee, event);

  if (!existTypeAttendee) {
    handleErrorResponse(
      res,
      "No se ha encontrado un precio válido para este evento",
      404
    );
    return;
  }

  req.priceTypeAttendee = existTypeAttendee.id_price_type_attendee;

  const { isuniversity } = existTypeAttendee.type_attendee;

  if (!isuniversity) {
    req.attendeeuniversity = false;
    next();
    return;
  }

  /** Al ser un asistente universitario se valida que exista
   * el file de su documento universitario
   **/

  if (
    !req.files ||
    Object.keys(req.files).length === 0 ||
    !req.files["fileuniversity"]
  )
    return handleErrorResponse(
      res,
      "Carnet o ficha de matrícula requerida",
      400
    );

  if (
    !validateExtensionsToFile(
      ["jpg", "jpeg", "png"],
      req.files["fileuniversity"]
    )
  ) {
    return handleErrorResponse(
      res,
      "La extensión del archivo no es válida",
      400
    );
  }
  req.attendeeuniversity = true;
  next();
};

const validateFileVoucher = async (req, res, next) => {
	if (!req.files) {
		next();
  }
  else if (!req.files["filevoucher"]) {
		next();
	} else {
    if (!validateExtensionsToFile(["jpg","jpeg","png"], req.files["filevoucher"])) {
      return handleErrorResponse(
        res,
        "La extensión del archivo no es válido",
        400
      );
    }
    next();
  }
}

const validateFileUniversity = async (req, res, next) => {
  try {
    if (!req.files) {
      next();
    }
    else if (!req.files["fileuniversity"]) {
      next();
    } else {
      const { isuniversity } = await searchTypeAttendeByReservation(req.params.idReserve);
      // if (!existTypeAttendee) {
      //   handleErrorResponse(res, "No se ha encontrado el tipo de asistente", 404);
      //   return;
      // }
      
      // const { isuniversity } = existTypeAttendee;
      if (!isuniversity) {
        if (req.files["fileuniversity"]) {
          return handleErrorResponse(res, "No debe enviarse una matrícula si es público general", 400);
        }
      } else {
        if (!validateExtensionsToFile(["jpg","jpeg","png"], req.files["fileuniversity"])) {
          return handleErrorResponse(res, "La extensión del archivo no es válido", 400);
        }
      }
      req.attendeeuniversity = isuniversity;
      next();
    }
  } catch (error) {
    if (typeof error.code === "number") {
      handleErrorResponse(res, error.message, error.code);
      return;
    }
    handleHttpError(res, error);
  }
}

const validateExistUser = async (req, res, next) => {
  try {
    const { user } = req.query;

    const userFound = await getUserByDniOrCode(user);

    req.idUser = userFound.id_user;

    next();
  } catch (error) {
    if (error.code) {
      return handleErrorResponse(res, error.message, error.code);
    }
    return handleHttpError(res, error);
  }
};

const validateFileOptional =
  (nameFile, allowedExtensions) => (req, res, next) => {
    if (
      !req.files ||
      Object.keys(req.files).length === 0 ||
      !req.files[nameFile]
    ) {
      next();
      return;
    }
    uploadFile(nameFile, allowedExtensions)(req, res, next);
  };

const validateExistEvent = async (req, res, next) => {
  try {
    const { idEvent } = req.params;

    let regex = /^[0-9]+$/;

    if (!regex.test(idEvent)) {
      handleErrorResponse(res, "El id del evento no es válido", 400);
      return;
    }

    await getOneEvent(idEvent);

    next();
    return;
  } catch (error) {
    if (error.code) {
      handleErrorResponse(res, error.message, error.code);
      return;
    }

    handleHttpError(res, error);
  }
};

const validateFormDataToUploadImages =
(nameInputs = ["fields"]) =>
(req, res, next) => {
  const bodyObject = req.body;
  let { image = [] } = req.files;
  
  //check that values of the body are array
  for (const [key, value] of Object.entries(bodyObject)) {
    if(!Array.isArray(value)){
      bodyObject[key]=[value]; //convert to array
    }
  }

  if(!Array.isArray(image)){
    image=[image]; //convert to array
  }

    const dataObject = { ...bodyObject,image };
    const keysObject = Object.keys(dataObject);

    //check that key of the body are valid    
    const isFieldMatch = keysObject.every((key) => nameInputs.includes(key));

    if (!isFieldMatch) {
      handleErrorResponse(res, "El formato no es válido", 400);
      return;
    }

    //check the size of the object elements
    const lengthInputs = Object.values(dataObject).map((arr) => arr.length);
    const isEqual = lengthInputs.every((len) => len === lengthInputs[0]);

    if (!isEqual) {
      handleErrorResponse(res, "La cantidad de inputs no son iguales", 400);
      return;
    }

    dataObject.lengthInputs=lengthInputs[0];

    req.formDataObject=dataObject;
    next();
  };

const validateExistAccountUser=async(req,res,next)=>{
  try {
    const {email}=req.body;

    const userFound=await getUserByEmail(email);

    if(!userFound || !userFound.password_user){
      req.user=(userFound)?{exist:true,id:userFound.id_user}:{exist:false};
      next();
      return;
    }

    handleErrorResponse(res,"El usuario ya existe",400);

  } catch (error) {
    handleHttpError(res,error);
  }
}

module.exports = {
  validateFileVoucher,
  validateFileUniversity,
  validateKeyTypeAttende,
  validateExistUser,
  validateFileOptional,
  validateExistEvent,
  validateFormDataToUploadImages,
  validateExistAccountUser
};
