import cartModel from "../../../../DB/models/CartModel.js";
import { productModel } from "../../../../DB/models/ProductModel.js";
import asyncHandler from "../../../utils/errorHandling.js";

export const addToCart = asyncHandler(async (req, res, next) => {
  const { productId, quantity } = req.body;

  const product = await productModel.findOne({
    _id: productId,
    stock: { $gte: quantity },
  });
  if (!product) {
    return next(new Error("invalid product", { cause: 400 }));
  }
  const cart = await cartModel.findOne({ userId: req.user._id });
  if (!cart) {
    const cartCreated = await cartModel.create({
      userId: req.user._id,
      products: [{ productId, quantity }],
    });
    return res.status(201).json({ message: "done", cartCreated });
  }
  let match = false;
  for (const product of cart.products) {
    if (product.productId == productId) {
      product.quantity = quantity;
      match = true;
      break;
    }
  }
  if (!match) {
    cart.products.push({ productId, quantity });
  }
  await cart.save();
  return res.status(200).json({ message: "done", cart });
});

export const removeFromCart = asyncHandler(async(req,res,next)=>{
  const { productId } = req.params;
  const product = await productModel.findOne({ _id: productId });
  if (!product) {
    return next(new Error("invalid product", { cause: 400 }));
  }
  const cart = await cartModel.findOne({ userId: req.user._id });
  if (!cart) {
    return next(new Error("invalid cart", { cause: 404 }));
  }
  const updateCart = await cartModel.findOneAndUpdate(
    { userId: req.user._id },
    {
      $pull: {
        products: {
          productId: productId,
        },
      },
    },
    { new: true }
  );

  return res.status(200).json({ message: "done", updateCart });
})

export const clearCart = asyncHandler(async(req,re,next)=>{
  const cart = await cartModel.findOne({ userId: req.user._id });
  if (!cart) {
    return next(new Error("invalid cart", { cause: 404 }));
  }
  const updateCart = await cartModel.findOneAndUpdate(
    { userId: req.user._id },
    {
      products: [],
    },
    { new: true }
  );

  return res.status(200).json({ message: "done", updateCart });
})