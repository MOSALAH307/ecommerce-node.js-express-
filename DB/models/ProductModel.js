import { model, Schema, Types } from "mongoose";

const productSchama = new Schema({
  name: {
    type: String,
    required: [true, "name is required"],
    trim: true,
    lowercase: true,
    min: 3,
    max: 30,
  },
  slug: {
    type: String,
    required: [true, "slug is required"],
    trim: true,
    lowercase: true,
  },
  description: String,
  stock: {
    type: Number,
    min: 1,
    required: [true, "stock is required"],
  },
  price: {
    type: Number,
    min: 1,
    required: [true, "price is required"],
  },
  discount: {
    type: Number,
  },
  totalPrice: {
    type: Number,
    min: 1,
    required: [true, "totalprice is required"],
  },
  colors: [String],
  size: [String],
  mainImage: {
    type: Object,
    required: [true, "image is required"],
  },
  subImages: {
    type: Object,
  },
  createdBy: {
    type: Types.ObjectId,
    ref: "User",
    required: [true, "userId is required"],
  },
  updatedBy: {
    type: Types.ObjectId,
    ref: "User",
  },
  categoryId: {
    type: Types.ObjectId,
    ref: "Category",
    required: [true, "categoryId is required"],
  },
  subCategoryId: {
    type: Types.ObjectId,
    ref: "SubCategory",
    required: [true, "subCategoryId is required"],
  },
  brandId: {
    type: Types.ObjectId,
    ref: "Brand",
    required: [true, "brandId is required"],
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  customId: {
    type: String,
    required: true,
  },
});

export const productModel = model("Product", productSchama);
