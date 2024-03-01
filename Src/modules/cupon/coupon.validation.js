import joi from "joi";
import generalFields from "../../utils/generalFields.js";

export const createCouponSchema = joi
  .object({
    name: joi.string().min(3).max(15).trim().required(),
    amount: joi.number().positive().min(1).max(100).required(),
    expiresIn: joi.date().greater(new Date()).required(),
    file: generalFields.file,
  })
  .required();

export const updateCouponSchema = joi
  .object({
    name: joi.string().min(3).max(15).trim(),
    amount: joi.number().positive().min(1).max(100),
    expiresIn: joi.date().greater(new Date()),
    file: generalFields.file,
    couponId: generalFields.id,
  })
  .required();

export const getOneSchema = joi
  .object({
    couponId: generalFields.id,
  })
  .required();
