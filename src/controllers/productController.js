const Product = require("../models/Product");
const redis = require("../config/redis");
const { fetchExternalProducts } = require("../services/externalService");

exports.getProducts = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 5);
    const skip = (page - 1) * limit;

    const cacheKey = `products:page=${page}:limit=${limit}`;

    if (redis) {
      const cachedData = await redis.get(cacheKey);
      if (cachedData) {
        return res.status(200).json(cachedData);
      }
    }

    const products = await Product.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalProducts = await Product.countDocuments();

    const response = {
      success: true,
      page,
      limit,
      totalProducts,
      totalPages: Math.ceil(totalProducts / limit),
      products
    };

    if (redis) {
      await redis.set(cacheKey, response, { ex: 60 });
    }

    res.status(200).json(response);

  } catch (error) {
    console.error("PRODUCT FETCH ERROR", error.message);
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
