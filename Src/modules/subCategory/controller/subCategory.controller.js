import subCategoryModel from "../../../../DB/models/subCategoryModel.js";
import cloudinary from "../../../utils/cloudinary.js";
import slugify from "slugify";
import asyncHandler from "../../../utils/errorHandling.js";
import categoryModel from "../../../../DB/models/CategoryModel.js";

//add subCategory
//=======================
export const addSubCategory = asyncHandler(async (req, res, next) => {
  const { categoryId } = req.params;
  const isCategoryExist = await categoryModel.findById(categoryId);
  if (!isCategoryExist) {
    return next(new Error("invalid category id", { cause: 400 }));
  }
  const isNameExist = await subCategoryModel.findOne({ name: req.body.name });
  if (isNameExist) {
    return next(new Error("name already exists", { cause: 409 }));
  }
  req.body.slug = slugify(req.body.name);
  const { public_id, secure_url } = await cloudinary.uploader.upload(
    req.file.path,
    { folder: `${process.env.APP_NAME}/subCategory` }
  );
  if (!public_id) {
    return next(new Error("image is required", { cause: 400 }));
  }
  req.body.image = { public_id, secure_url };
  req.body.categoryId = categoryId;
  const newSubCategory = await subCategoryModel.create(req.body);
  return res.status(201).json({ msg: "done", newSubCategory });
});

//update subCategory
//=======================
export const updateSubCategory = asyncHandler(async (req, res, next) => {
  const { subCategoryId } = req.params;
  const isSubCategoryExist = await subCategoryModel.findOne({
    _id: subCategoryId,
  });
  if (!isSubCategoryExist) {
    return next(new Error("inavalid subCategory id", { cause: 400 }));
  }
  if (req.body.name) {
    const isNameExist = await subCategoryModel.findOne({ name: req.body.name });
    if (isNameExist) {
      return next(new Error("name already exists", { cause: 409 }));
    }
    req.body.slug = slugify(req.body.name);
  }
  if (req.file) {
    //upload image
    const { public_id, secure_url } = await cloudinary.uploader.upload(
      req.file.path,
      { folder: `${process.env.APP_NAME}/subCategory` }
    );
    if (!public_id) {
      return next(new Error("image is required", { cause: 400 }));
    }
    req.body.image = { public_id, secure_url };
    await cloudinary.uploader.destroy(isSubCategoryExist.image.public_id);
  }
  const updatedSubCategory = await subCategoryModel.findOneAndUpdate(
    { _id: subCategoryId },
    req.body,
    { new: true }
  );
  return res.status(201).json({ msg: "done", subCategory: updatedSubCategory });
});

//get all with all subCategories
//=======================
export const getAll = asyncHandler(async (req, res, next) => {
  const subCategories = await subCategoryModel
    .find()
    .populate([{ path: "categoryId" }]);
  return res.status(200).json({ msg: "done", subCategories });
});

//get by id with all subCategories
//=======================
export const getById = asyncHandler(async (req, res, next) => {
  const subCategory = await subCategoryModel
    .findById({
      _id: req.params.subCategoryId,
    })
    .populate([{ path: "categoryId" }]);
  if (!subCategory) {
    return next(new Error("invalid category id", { cause: 400 }));
  }
  return res.status(200).json({ msg: "done", subCategory });
});
