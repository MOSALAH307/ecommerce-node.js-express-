import { Router } from "express";
import * as brandController from "./controller/brand.controller.js";
import uploadFileCloud, { validationTypes } from "../../utils/multer.js";
import validation from "../../middleware/validation.js";
import {
  addbrandSchema,
  getByIdSchema,
  updatebrandSchema,
} from "./brand.validation.js";

const brandRouter = Router();

//add brand
//=======================
brandRouter.post(
  "/addBrand",
  uploadFileCloud(validationTypes.image).single("image"),
  validation(addbrandSchema),
  brandController.addbrand
);
//update brand
//=======================
brandRouter.put(
  "/updatebrand/:brandId",
  uploadFileCloud(validationTypes.image).single("image"),
  validation(updatebrandSchema),
  brandController.updatebrand
);
//get all
//=======================
brandRouter.get("/", brandController.getAll);
//get by id
//=======================
brandRouter.get(
  "/:brandId",
  validation(getByIdSchema),
  brandController.getById
);
export default brandRouter;
