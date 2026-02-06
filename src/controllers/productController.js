const Product = require("../models/Product");
const redis = require("../config/redis");
const { fetchExternalProducts } = require("../services/externalService");

exports.getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Product.countDocuments();
    const products = await Product.find()
      .skip(skip)
      .limit(limit);

    if (total === 0) {
      const externalProducts = await fetchExternalProducts();
      const paginatedExternal = externalProducts.slice(skip, skip + limit);

      return res.status(200).json({
        source: "external",
        page,
        limit,
        total: externalProducts.length,
        products: paginatedExternal
      });
    }

    res.status(200).json({
      source: "database",
      page,
      limit,
      total,
      products
    });

  } catch (err) {
    console.error("Get Products Error:", err.message);
    res.status(500).json({ message: "Error fetching products" });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);

    if (redis) {
      const keys = await redis.keys("products:*");
      if (keys.length > 0) {
        await redis.del(keys);
      }
    }

    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating product" });
  }
};
