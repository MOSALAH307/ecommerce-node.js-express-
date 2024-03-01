import * as dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve("./Config/.env") });
import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

export default cloudinary.v2;
