import mongoose from "mongoose";

const connection = async () => {
  return await mongoose
    .connect(process.env.DATABASE)
    .then(() => {
      console.log("connected to DB");
    })
    .catch((e) => {
      console.log("failed to connect to DB", e);
    });
};

export default connection;
