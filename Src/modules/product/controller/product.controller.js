import slugify from "slugify";
import categoryModel from "../../../../DB/models/CategoryModel.js";
import brandModel from "../../../../DB/models/brandModel.js";
import subCategoryModel from "../../../../DB/models/subCategoryModel.js";
import asyncHandler from "../../../utils/errorHandling.js";
import { nanoid } from "nanoid";
import cloudinary from "../../../utils/cloudinary.js";
import { productModel } from "../../../../DB/models/ProductModel.js";
import ApiFeatures from "../../../utils/apiFeatures.js";

export const createProduct = asyncHandler(async (req, res, next) => {
  const { categoryId, subCategoryId, brandId } = req.body;
  if (!(await categoryModel.findOne({ _id: categoryId, isDeleted: false }))) {
    return next(new Error("invalid category id", { cause: 404 }));
  }
  if (
    !(await subCategoryModel.findOne({
      _id: subCategoryId,
      isDeleted: false,
      categoryId,
    }))
  ) {
    return next(new Error("invalid subCategory id", { cause: 404 }));
  }
  if (!(await brandModel.findOne({ _id: brandId, isDeleted: false }))) {
    return next(new Error("invalid brand id", { cause: 404 }));
  }
  req.body.slug = slugify(req.body.name, {
    trim: true,
    lower: true,
  });
  req.body.totalPrice =
    req.body.price - (req.body.price * req.body.discount || 0) / 100;
  req.body.customId = nanoid();
  const { public_id, secure_url } = await cloudinary.uploader.upload(
    req.files.mainImage[0].path,
    {
      folder: `${process.env.APP_NAME}/category/${categoryId}/subCategory/${subCategoryId}/products/${req.body.customId}/mainImage`,
    }
  );
  if (!public_id) {
    return next(new Error("main image is required", { cause: 400 }));
  }
  req.body.mainImage = { public_id, secure_url };
  let images = [];
  if (req.files?.subImages?.length) {
    for (const image of req.files.subImages) {
      const { public_id, secure_url } = await cloudinary.uploader.upload(
        image.path,
        {
          folder: `${process.env.APP_NAME}/category/${categoryId}/subCategory/${subCategoryId}/products/${req.body.customId}/subImages`,
        }
      );
      if (!public_id) {
        return res.status(400).json({ message: "image is required" });
      }
      images.push({ public_id, secure_url });
    }
    req.body.subImages = images;
  }
  req.body.createdBy = req.user._id;
  const product = await productModel.create(req.body);
  return res.status(201).json({ message: "done", product });
});

export const getAllProducts = asyncHandler(async(req,res,next)=>{
  const apiFeatures = new ApiFeatures(productModel.find(), req.query)
    .paginate()
    .filter()
    .sort()
    .fields()
    .search();

  const products = await apiFeatures.mongooseQuery;
  return res.status(200).json({ message: "done", products });
})

export const getProduct = asyncHandler(async (req, res, next) => {
  const product = await productModel.findById({ _id: req.params.productId });
  return res.status(200).json({ message: "done", product });
});

export const updateProduct = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  const { categoryId, subCategoryId, brandId } = req.body;
  const product = await productModel.findOne({
    _id: productId,
    isDeleted: false,
  });
  if (!product) {
    return next(new Error("invalid product id", { cause: 404 }));
  }
  if (
    categoryId &&
    !(await categoryModel.findOne({ _id: categoryId, isDeleted: false }))
  ) {
    return next(new Error("invalid category id", { cause: 404 }));
  }
  if (
    subCategoryId &&
    !(await subCategoryModel.findOne({ _id: subCategoryId, isDeleted: false }))
  ) {
    return next(new Error("invalid subCategory id", { cause: 404 }));
  }
  if (
    brandId &&
    !(await brandModel.findOne({ _id: brandId, isDeleted: false }))
  ) {
    return next(new Error("invalid brand id", { cause: 404 }));
  }
  if (req.body.name) {
    req.body.slug = slugify(req.body.name, {
      trim: true,
      lower: true,
    });
  }
  req.body.totalPrice =
    (req.body.price || product.price) -
    ((req.body.price || product.price) *
      (req.body.discount || product.discount || 0)) /
      100;
  if (req.files?.mainImage?.length) {
    const { public_id, secure_url } = await cloudinary.uploader.upload(
      req.files.mainImage[0].path,
      {
        folder: `${process.env.APP_NAME}/category/${
          categoryId || product.categoryId
        }/subCategory/${subCategoryId || product.subCategoryId}/products/${
          product.customId
        }/mainImage`,
      }
    );
    if (!public_id) {
      return res.status(400).json({ message: "image is required" });
    }
    req.body.mainImage = { public_id, secure_url };
    await cloudinary.uploader.destroy(product.mainImage.public_id);
  }
  if (req.files?.subImages?.length) {
    for (const image of req.files.subImages) {
      const { public_id, secure_url } = await cloudinary.uploader.upload(
        image.path,
        {
          folder: `${process.env.APP_NAME}/category/${categoryId}/subCategory/${subCategoryId}/products/${req.body.customId}/subImages`,
        }
      );
      if (!public_id) {
        return res.status(400).json({ message: "image is required" });
      }
      if (!product.subImages) {
        product.subImages = [];
      }
      product.subImages.push({ public_id, secure_url });
    }
    req.body.subImages = product.subImages;
  }
  
  req.body.updatedBy = req.user._id;
  const updateProduct = await productModel.findByIdAndUpdate(
    { _id: productId },
    req.body,
    { new: true }
  );
  return res.status(201).json({ message: "done", product: updateProduct });
});
