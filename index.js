import express from "express";
import path from "path";
import dotenv from "dotenv";
dotenv.config({ path: path.resolve("./Config/.env") });
import initiateApp from "./Src/InitiateApp.js";

const app = express()
initiateApp(app,express)

app.listen(process.env.PORT, () =>
  console.log(`Example app listening on port ${process.env.PORT}!`)
);
