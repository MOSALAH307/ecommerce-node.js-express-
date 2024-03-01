import joi from "joi";
import generalFields from "../../utils/generalFields.js";

export const addbrandSchema = joi
  .object({
    name: joi.string().min(2).max(20).required(),
    file: generalFields.file.required(),
  })
  .required();

export const updatebrandSchema = joi
  .object({
    brandId: generalFields.id.required(),
    name: joi.string().min(2).max(20),
    file: generalFields.file,
  })
  .required();

export const getByIdSchema = joi
  .object({
    brandId: generalFields.id.required(),
  })
  .required();
