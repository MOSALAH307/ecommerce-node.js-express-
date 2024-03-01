import categoryModel from "../../../../DB/models/CategoryModel.js";
import cloudinary from "../../../utils/cloudinary.js";
import slugify from "slugify";
import asyncHandler from "../../../utils/errorHandling.js";

//add category
//=======================
export const addCategory = asyncHandler(async (req, res, next) => {
  const { name } = req.body;
  //check id name is unique or already exists in DB
  const nameExist = await categoryModel.findOne({ name });
  if (nameExist) {
    return next(new Error("name already exists"), { cause: 409 });
  }
  //upload image
  const { public_id, secure_url } = await cloudinary.uploader.upload(
    req.file.path,
    { folder: `${process.env.APP_NAME}/category` }
  );
  if (!public_id) {
    return next(new Error("image is required", { cause: 400 }));
  }
  req.body.image = { public_id, secure_url };
  req.body.slug = slugify(name);
  const newCategory = await categoryModel.create(req.body);
  return res.status(201).json({ message: "done", newCategory });
});

//update category
//=======================
export const updateCategory = asyncHandler(async (req, res, next) => {
  const { categoryId } = req.params;
  const isCategoryExist = await categoryModel.findOne({ _id: categoryId });
  if (!isCategoryExist) {
    return next(new Error("inavalid category id", { cause: 400 }));
  }
  if (req.body.name) {
    const isNameExist = await categoryModel.findOne({ name: req.body.name });
    if (isNameExist) {
      return next(new Error("name already exists", { cause: 409 }));
    }
    req.body.slug = slugify(req.body.name);
  }
  if (req.file) {
    //upload image
    const { public_id, secure_url } = await cloudinary.uploader.upload(
      req.file.path,
      { folder: `${process.env.APP_NAME}/category`}
    );
    if (!public_id) {
      return next(new Error("image is required", { cause: 400 }));
    }
    req.body.image = { public_id, secure_url };
    await cloudinary.uploader.destroy(isCategoryExist.image.public_id);
  }
  const updatedCategory = await categoryModel.findOneAndUpdate(
    { _id: categoryId },
    req.body,
    { new: true }
  );
  return res.status(201).json({ msg: "done", category: updatedCategory });
});
//get all with all subCategories
//=======================
export const getAll = asyncHandler(async (req, res, next) => {
  const categories = await categoryModel.find()
    .populate([{ path: 'subCategory' }])
  return res.status(200).json({msg:"done",categories})
})
//get by id with all subCategories
//=======================
export const getById = asyncHandler(async (req, res, next) => {
  const category = await categoryModel
    .findById({ _id: req.params.categoryId })
    .populate([{ path: "subCategory" }]);
  if (!category) {
    return next(new Error("invalid category id", { cause: 400 }))
  }
  return res.status(200).json({msg:"done",category})
})