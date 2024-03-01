import { model, Schema, Types } from "mongoose";

const couponShema = new Schema(
  {
    name: {
      type: String,
      unique: [true, "name must be unique"],
      required: [true, "name is required"],
      trim: true,
      lowercase: true,
    },
    amount: {
      type: Number,
      required: [true, "amount is required"],
      min: 1,
      max: 100,
    },
    image: Object,
    createdby: {
      type: Types.ObjectId,
      ref: "User",
      // required: true,
    },
    usedby: {
      type: Types.ObjectId,
      ref: "User",
    },
    expiresIn: {
      type: Date,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const couponModel = model("Coupon", couponShema);

export default couponModel;
