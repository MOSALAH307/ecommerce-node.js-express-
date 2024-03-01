import { Router } from "express";
import {
  confirmEmail,
  forgetPassword,
  login,
  loginWithGmail,
  sendCode,
  signup,
} from "./controller/auth.controller.js";
import validation from "../../middleware/validation.js";
import {
  fogetPasswordSchema,
  loginSchema,
  sendCodeSchema,
  signupSchema,
  tokenSchema,
} from "./auth.validation.js";

const userRouter = Router();

userRouter.post("/signup", validation(signupSchema), signup);
userRouter.get("/confirmEmail/:token", validation(tokenSchema), confirmEmail);
userRouter.post("/login", validation(loginSchema), login);
userRouter.patch("/sendCode", validation(sendCodeSchema), sendCode);
userRouter.put(
  "/forgetPassword",
  validation(fogetPasswordSchema),
  forgetPassword
);
userRouter.post("/loginWithGmail", loginWithGmail);

export default userRouter;
