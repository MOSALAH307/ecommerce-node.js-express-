import mongoose, { model, Schema, Types } from "mongoose";

const categorySchema = new Schema(
  {
    name: {
      type: String,
      unique: [true, "name must be unique"],
      required: [true, "name is required"],
      trim: true,
      lowercase: true,
    },
    image: {
      type: Object,
      required: [true, "image is required"],
    },
    slug: {
      type: String,
      unique: [true, "slug must be unique"],
      required: [true, "slug is required"],
      trim: true,
      lowercase: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
      required: [false, "userId is required"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

categorySchema.virtual("subCategory", {
  ref: "subCategory",
  localField: "_id",
  foreignField: "categoryId",
});

const categoryModel = model("Category", categorySchema);

export default categoryModel;
