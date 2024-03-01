import brandModel from "../../../../DB/models/brandModel.js";
import cloudinary from "../../../utils/cloudinary.js";
import slugify from "slugify";
import asyncHandler from "../../../utils/errorHandling.js";

//add brand
//=======================
export const addbrand = asyncHandler(async (req, res, next) => {
  const isNameExist = await brandModel.findOne({ name: req.body.name });
  if (isNameExist) {
    return next(new Error("name already exists", { cause: 409 }));
  }
  req.body.slug = slugify(req.body.name);
  const { public_id, secure_url } = await cloudinary.uploader.upload(
    req.file.path,
    { folder: `${process.env.APP_NAME}/brand` }
  );
  if (!public_id) {
    return next(new Error("image is required", { cause: 400 }));
  }
  req.body.image = { public_id, secure_url };
  const newbrand = await brandModel.create(req.body);
  return res.status(201).json({ msg: "done", newbrand });
});

//update brand
//=======================
export const updatebrand = asyncHandler(async (req, res, next) => {
  const { brandId } = req.params;
  const isbrandExist = await brandModel.findOne({
    _id: brandId,
  });
  if (!isbrandExist) {
    return next(new Error("inavalid brand id", { cause: 404 }));
  }
  if (req.body.name) {
    const isNameExist = await brandModel.findOne({ name: req.body.name });
    if (isNameExist) {
      return next(new Error("name already exists", { cause: 409 }));
    }
    req.body.slug = slugify(req.body.name);
  }
  if (req.file) {
    //upload image
    const { public_id, secure_url } = await cloudinary.uploader.upload(
      req.file.path,
      { folder: `${process.env.APP_NAME}/brand` }
    );
    if (!public_id) {
      return next(new Error("image is required", { cause: 400 }));
    }
    req.body.image = { public_id, secure_url };
    await cloudinary.uploader.destroy(isbrandExist.image.public_id);
  }
  const updatedbrand = await brandModel.findOneAndUpdate(
    { _id: brandId },
    req.body,
    { new: true }
  );
  return res.status(201).json({ msg: "done", brand: updatedbrand });
});

//get all
//=======================
export const getAll = asyncHandler(async (req, res, next) => {
  const brands = await brandModel.find();
  return res.status(200).json({ msg: "done", brands });
});

//get by id
//=======================
export const getById = asyncHandler(async (req, res, next) => {
  const brand = await brandModel.findById({
    _id: req.params.brandId,
  });
  if (!brand) {
    return next(new Error("invalid brand id", { cause: 400 }));
  }
  return res.status(200).json({ msg: "done", brand });
});
