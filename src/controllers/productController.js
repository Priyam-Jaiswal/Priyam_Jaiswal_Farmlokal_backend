const Product = require("../models/Product");
const redis = require("../config/redis");

exports.getProducts = async (req,res)=>{
  try{
    const {page=1, limit=10, category} = req.query;
    const cacheKey = `products:${page}:${limit}:${category}`;

    if (redis) {
      const cache = await redis.get(cacheKey);
      if (cache) return res.json(JSON.parse(cache));
    }

    const query = category ? {category} : {};
    const products = await Product.find(query)
      .skip((page-1)*limit)
      .limit(parseInt(limit));

    if (redis) {
      await redis.set(cacheKey, JSON.stringify(products), { EX: 60 });
    }
    res.json(products);

  }catch(err){
    console.error(err);
    res.status(500).json({message:"Error fetching products"});
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
