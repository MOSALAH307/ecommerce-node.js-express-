import { Router } from "express";
import { createProduct, getAllProducts, getProduct, updateProduct } from "./controller/product.controller.js";
import { auth } from "../../middleware/auth.js";
import uploadFileCloud, { validationTypes } from "../../utils/multer.js";
import validation from "../../middleware/validation.js";
import { createProductSchema, getProductSchema, updateProductSchema } from "./product.validation.js";
import roles from "../../utils/roles.js";

const productRouter = Router();

productRouter.post(
  "/createProduct",
  auth(roles.Admin),
  uploadFileCloud(validationTypes.image).fields([
    {
      name: "mainImage",
      maxCount: 1,
    },
    {
      name: "subImages",
      maxCount: 5,
    },
  ]),
  validation(createProductSchema),
  createProduct
);

productRouter.get("/",getAllProducts)
productRouter.get("/:productId",validation(getProductSchema),getProduct);
productRouter.put(
  "/:productId",
  auth(roles.Admin),
  uploadFileCloud(validationTypes.image).fields([
    {
      name: "mainImage",
      maxCount: 1,
    },
    {
      name: "subImages",
      maxCount: 5,
    },
    validation(updateProductSchema),
  ]),
  updateProduct
);

export default productRouter;
