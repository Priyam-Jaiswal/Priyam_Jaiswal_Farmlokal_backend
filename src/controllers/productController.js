const Product = require("../models/Product");
const redis = require("../config/redis");
const { fetchExternalProducts } = require("../services/externalService");

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();

    if (products.length === 0) {
      const externalProducts = await fetchExternalProducts();
      return res.status(200).json(externalProducts);
    }

    res.status(200).json(products);

  } catch (err) {
    console.error("Get Products Error:", err.message);
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
