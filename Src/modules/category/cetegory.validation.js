import joi from "joi";
import generalFields from "../../utils/generalFields.js";

export const addCategorySchema = joi
  .object({
    name: joi.string().min(2).max(20).required(),
    file: generalFields.file.required(),
  })
  .required();

export const updateCategorySchema = joi
  .object({
    categoryId: generalFields.id.required(),
    name: joi.string().min(2).max(20),
    file: generalFields.file,
  })
  .required();

export const getByIdSchema = joi
  .object({
    categoryId: generalFields.id.required(),
  })
  .required();
