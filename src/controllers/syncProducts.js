const axios = require("axios");
const Product = require("../models/Product");
const redis = require("../config/redis");

exports.syncProducts = async (req, res) => {
  try {
    const { data } = await axios.get(process.env.FAKESTORE_API);
    const products = Array.isArray(data) ? data : data.products;
    let syncedCount = 0;
    for (const item of products) {
      await Product.updateOne(
        { externalId: item.id },
        {
          $set: {
            externalId: item.id,
            name: item.title,          
            price: item.price,
            category: item.category,
            description: item.description,
            image: item.image,
            stock: item.rating?.count || 0
          }
        },
        { upsert: true }
      );
      syncedCount++;
    }

    if (redis) {
      const keys = await redis.keys("products:*");
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    }

    res.status(200).json({
      success: true,
      message: "Products synced successfully",
      synced: syncedCount
    });

  } catch (error) {
    console.error("SYNC ERROR", error.response?.data || error.message);
    res.status(500).json({
      message: "Sync failed",
      error: error.message
    });
  }

};

