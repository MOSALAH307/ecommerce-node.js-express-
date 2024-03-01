import joi from "joi";
import { Types } from "mongoose";

export const validationId = (value, helper) => {
  return Types.ObjectId.isValid(value)
    ? true
    : helper.message("invalid format of id");
};

const generalFields = {
  email: joi.string().email().required(),
  password: joi.string().pattern(new RegExp("^[a-zA-Z0-9]{8,20}$")).required(),
  id: joi.string().custom(validationId).required(),
  _id:joi.string().custom(validationId),
  file: joi.object({
    size: joi.number().positive().required(),
    path: joi.string().required(),
    filename: joi.string().required(),
    destination: joi.string().required(),
    mimetype: joi.string().required(),
    encoding: joi.string().required(),
    originalname: joi.string().required(),
    fieldname: joi.string().required(),
  }),
};

export default generalFields;
