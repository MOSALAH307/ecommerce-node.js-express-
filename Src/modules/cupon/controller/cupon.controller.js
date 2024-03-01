import couponModel from "../../../../DB/models/CuponModel.js";
import cloudinary from "../../../utils/cloudinary.js";
import asyncHandler from "../../../utils/errorHandling.js";

//create
export const createCoupon = asyncHandler(async(req,res,next)=>{
  if(await couponModel.findOne({name:req.body.name})){
    return next(new Error("name already exists",{cause:409}))
  }
  if(req.file){
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      { folder: `${process.env.APP_NAME}/coupon` }
    );
    req.body.image = { secure_url, public_id };
  }
  const newCoupon = await couponModel.create(req.body)
  return res.status(201).json({msg:"done",newCoupon})
})
//getAll
export const getAllCoupons = asyncHandler(async(req,res,next)=>{
  const coupons = await couponModel.find()
  return res.status(200).json({msg:"done",coupons})
})
//getOne
export const getOne = asyncHandler(async(req,res,next)=>{
  const coupon = await couponModel.findById(req.params.couponId);
  if(!coupon){
    return next(new Error("invalid coupon id",{cause:404}))
  }
  return res.status(200).json({msg:"done",coupon})
})
//update
export const updateCoupon = asyncHandler(async(req,res,next)=>{
  const coupon = await couponModel.findById(req.params.couponId)
  if(!coupon){
    return next(new Error("invalid coupon id",{cause:404}))
  }
  if(req.body.name){
    if(await couponModel.findOne({name:req.body.name})){
      return next(new Error("name already exists",{cause:409}))
    }
  }
  if(req.file){
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      { folder: `${process.env.APP_NAME}/coupon` }
    );
    req.body.image = { secure_url, public_id };
    if(coupon.image){
      await cloudinary.uploader.destroy(coupon.image.public_id)
    }
  }
  const updatedCoupon = await couponModel.findByIdAndUpdate({_id:req.params.couponId},req.body,{new:true})
  return res.status(200).json({msg:"done",updatedCoupon})
})