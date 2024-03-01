import { Router } from "express";
import subCategoryRouter from "../subCategory/subCategory.router.js";
import * as categoryController from "./controller/category.controller.js";
import uploadFileCloud, { validationTypes } from "../../utils/multer.js";
import validation from "../../middleware/validation.js";
import {
  addCategorySchema,
  getByIdSchema,
  updateCategorySchema,
} from "./cetegory.validation.js";

const categoryRouter = Router();
categoryRouter.use("/:categoryId/subCategory", subCategoryRouter);
//add category
//=======================
categoryRouter.post(
  "/addCategory",
  uploadFileCloud(validationTypes.image).single("image"),
  validation(addCategorySchema),
  categoryController.addCategory
);
//update category
//=======================
categoryRouter.put(
  "/update/:categoryId",
  uploadFileCloud(validationTypes.image).single("image"),
  validation(updateCategorySchema),
  categoryController.updateCategory
);
//get all with all subCategories
//=======================
categoryRouter.get("/", categoryController.getAll);
//get by id with all subCategories
//=======================
categoryRouter.get(
  "/:categoryId",
  validation(getByIdSchema),
  categoryController.getById
);

export default categoryRouter;
