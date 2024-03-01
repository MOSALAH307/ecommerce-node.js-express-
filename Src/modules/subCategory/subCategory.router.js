import { Router } from "express";
import * as subCategoryController from "./controller/subCategory.controller.js";
import uploadFileCloud, { validationTypes } from "../../utils/multer.js";
import validation from "../../middleware/validation.js";
import {
  addSubCategorySchema,
  getByIdSchema,
  updatesubCategorySchema,
} from "./subCategory.validation.js";

const subCategoryRouter = Router({ mergeParams: true });

//add category
//=======================
subCategoryRouter.post(
  "/add",
  uploadFileCloud(validationTypes.image).single("image"),
  validation(addSubCategorySchema),
  subCategoryController.addSubCategory
);
//update category
//=======================
subCategoryRouter.put(
  "/update/:subCategoryId",
  uploadFileCloud(validationTypes.image).single("image"),
  validation(updatesubCategorySchema),
  subCategoryController.updateSubCategory
);
//get all with all subCategories
//=======================
subCategoryRouter.get("/", subCategoryController.getAll);
//get by id with all subCategories
//=======================
subCategoryRouter.get(
  "/:subCategoryId",
  validation(getByIdSchema),
  subCategoryController.getById
);
export default subCategoryRouter;
