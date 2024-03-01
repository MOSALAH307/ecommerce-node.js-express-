import { Router } from "express";
import {
  createCoupon,
  getAllCoupons,
  getOne,
  updateCoupon,
} from "./controller/cupon.controller.js";
import uploadFileCloud, { validationTypes } from "../../utils/multer.js";
import {
  createCouponSchema,
  getOneSchema,
  updateCouponSchema,
} from "./coupon.validation.js";
import validation from "../../middleware/validation.js";

const couponRouter = Router();

couponRouter.get("/", getAllCoupons);
couponRouter.get("/:couponId", validation(getOneSchema), getOne);
couponRouter.post(
  "/add-coupon",
  uploadFileCloud(validationTypes.image).single("image"),
  validation(createCouponSchema),
  createCoupon
);
couponRouter.put(
  "/:couponId",
  uploadFileCloud(validationTypes.image).single("image"),
  validation(updateCouponSchema),
  updateCoupon
);

export default couponRouter;
