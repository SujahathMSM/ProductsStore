import mongoose from "mongoose";
import Product from "../models/product.model.js"

//@GET ALL PRODUCTS
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    return res.status(201).json({ success: true, data: products });
  } catch {
    return res
      .status(500)
      .json({ success: false, message: "internal server error" });
  }
};

//@CREATE A PRODUCT
export const createProduct = async (req, res) => {
  const product = req.body;
  if (!product.name || !product.price || !product.image) {
    return res
      .status(400)
      .send({ success: false, message: "All fields are required" });
  }
  const newProduct = new Product(product);

  try {
    await newProduct.save();
    res.status(201).send({ success: true, data: newProduct });
  } catch (error) {
    console.error("Error in create product: ", error.message);
    res.status(500).send({ success: false, message: "Internal Server Error" });
  }
};

//@UPDATE A PRODUCT
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const product = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ success: false, message: "invalid product id" });
  }

  const check = await Product.findById(id);
  console.log(check);

  if (check) {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(id, product, {
        new: true,
      });
      res.status(201).json({ success: true, message: updatedProduct });
    } catch {
      res
        .status(500)
        .json({ success: false, message: "internal server error" });
    }
  } else {
    res
      .status(400)
      .json({ success: false, message: "product not found in the databases" });
  }
};

//@DELETE A PRODUCT
export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  console.log("ID " + id);

  try {
    await Product.findByIdAndDelete(id);
    res.status(201).send({ success: true, message: "Product Deleted" });
  } catch (error) {
    console.error("Error in delete product: ", error.message);
    res.status(500).send({ success: false, message: "Internal Server Error" });
  }
};
