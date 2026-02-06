const Product = require("../models/Product");
const redis = require("../config/redis");
const { fetchExternalProducts } = require("../services/externalService");

exports.getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    const skip = (page - 1) * limit;

    const products = await Product.find()
      .skip(skip)
      .limit(limit);

    const totalProducts = await Product.countDocuments();

    res.status(200).json({
      success: true,
      page,
      limit,
      totalProducts,
      totalPages: Math.ceil(totalProducts / limit),
      products
    });

  } catch (error) {
    console.error("Pagination Error:", error);
    res.status(500).json({ message: "Error fetching products" });
  }
};

exports.createProduct = async (req,res)=>{
  try{
    const product = await Product.create(req.body);

    if (redis) {
      const keys = await redis.keys("products:*");
      if (keys.length > 0) {
        await redis.del(keys);
      }
    }

    res.status(201).json(product);
  }catch(err){
    console.error(err);
    res.status(500).json({message:"Error creating product"});
  }
};
