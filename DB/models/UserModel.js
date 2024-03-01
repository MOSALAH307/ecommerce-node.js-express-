import { model, Schema } from "mongoose";

const userShama = new Schema(
  {
    userName: {
      type: String,
      required: [true, "userName is required"],
      min: [2, "min length is 2 chars"],
      max: [20, "max length is 20 chars"],
    },
    email: {
      type: String,
      unique: [true, "email must be unique"],
      required: [true, "email is required"],
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
    phone: String,
    role: { type: String, default: "Admin", enum: ["User", "Admin"] },
    confirmEmail: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    status: { type: String, default: "Offline", enum: ["Offline", "Online"] },
    gender: { type: String, default: "Female", enum: ["Male", "Female"] },
    address: String,
    image: Object,
    DOB: String,
    code: String,
    provider: {
      type: String,
      enum: ["System", "Google"],
      default: "System",
    },
  },
  { timestamps: true }
);

const userModel = model("User", userShama);

export default userModel;
