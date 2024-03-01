import express, { Router } from "express";
import { auth } from "../../middleware/auth.js";
import roles from "../../utils/roles.js";
import {
  cancelOrder,
  createOrder,
  deliverdOrder,
  webHook,
} from "./controller/order.controller.js";
import validation from "../../middleware/validation.js";
import { cancelOrderSchema, createOrderSchema } from "./order.validation.js";

const orderRouter = Router();

orderRouter.post(
  "/",
  validation(createOrderSchema),
  auth(roles.User),
  createOrder
);
orderRouter.put(
  "/cancelOrder/:orderId",
  validation(cancelOrderSchema),
  auth(roles.User),
  cancelOrder
);
orderRouter.put(
  "/deliverdOrder/:orderId",
  validation(cancelOrderSchema),
  auth(roles.User),
  deliverdOrder
);

orderRouter.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  webHook
);

export default orderRouter;
