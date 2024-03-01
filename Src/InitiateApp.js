import connection from "../DB/connection.js";
import userRouter from "./modules/auth/auth.router.js";
import brandRouter from "./modules/brand/brand.router.js";
import cartRouter from "./modules/cart/cart.router.js";
import categoryRouter from "./modules/category/category.router.js";
import couponRouter from "./modules/cupon/cupon.router.js";
import orderRouter from "./modules/order/order.router.js";
import productRouter from "./modules/product/product.router.js";
import subCategoryRouter from "./modules/subCategory/subCategory.router.js";
import globalError from "./utils/globalError.js";
import cors from "cors";

const initiateApp = (app, express) => {
  var whitelist = ["http://example1.com", "http://example2.com"];
  if (process.env.MOOD == "DEV") {
    app.use(cors());
  } else {
    app.use(async (req, res, next) => {
      if (!whitelist.includes(req.header("origin"))) {
        return next(new Error("Not allowed by CORS", { cause: 502 }));
      }
      await res.header("Access-Control-Allow-Origin", "*");
      await res.header("Access-Control-Allow-Header", "*");
      await res.header("Access-Control-Allow-Private-Network", "true");
      await res.header("Access-Control-Allow-Method", "*");
      next();
    });
  }

  connection();
  //convert Buffer Data
  app.use((req, res, next) => {
    if (req.originalUrl == "/order/webhook") {
      return next();
    } else {
      express.json()(req, res, next);
    }
  });
  //Routes
  app.use("/category", categoryRouter);
  app.use("/subCategory", subCategoryRouter);
  app.use("/brand", brandRouter);
  app.use("/coupon", couponRouter);
  app.use("/auth", userRouter);
  app.use("/product", productRouter);
  app.use("/cart", cartRouter);
  app.use("/order", orderRouter);
  //handling routes error
  app.all("*", (req, res) => {
    return res.json({ msg: "catch error in routing" });
  });
  //error handling
  app.use(globalError);
};

export default initiateApp;
