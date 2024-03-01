import userModel from "../../DB/models/UserModel.js";
import asyncHandler from "../utils/errorHandling.js";
import { verifyToken } from "../utils/generarteAndVerifyToken.js";

export const auth = (role) => {
  return asyncHandler(async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
      return next(new Error("pleae log in", { cause: 400 }));
    }
    if (!authorization.startsWith(process.env.AUTH_KEYWORD)) {
      return next(new Error("invalid token key", { cause: 400 }));
    }
    const token = authorization.split(process.env.AUTH_KEYWORD)[1];
    if (!token) {
      return next(new Error("invalid token", { cause: 400 }));
    }
    const decoded = verifyToken({token, signature:process.env.SIGNATURE});
    if (!decoded.id) {
      return next(new Error("invalid id", { cause: 400 }));
    }
    const user = await userModel
      .findById(decoded.id)
      .select("userName email status role");
    if (!user) {
      return next(new Error("Not register account", { cause: 404 }));
    }
    if (user.status == "Offline") {
      return next(new Error("please login", { cause: 400 }));
    }
    if (!role.includes(user.role)) {
      return next(
        new Error("do not have access to do this action", { cause: 401 })
      );
    }
    req.user = user;
    return next();
  })
};
