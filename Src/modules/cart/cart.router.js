import { Router } from "express";
import { addToCart, clearCart, removeFromCart } from "./controller/cart.controller.js";
import { auth } from "../../middleware/auth.js";
import roles from "../../utils/roles.js";
import validation from "../../middleware/validation.js";
import { addToCartSchema } from "./cart.validation.js";

const cartRouter = Router();

cartRouter.post(
  "/addToCart",
  validation(addToCartSchema),
  auth(roles.User),
  addToCart
);
cartRouter.patch(
  "/productId",
  validation(),
  auth(roles.User),
  removeFromCart
);
cartRouter.patch("/", auth(roles.User), clearCart);
export default cartRouter;
