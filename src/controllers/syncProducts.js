const axios = require("axios");
const Product = require("../models/Product");

exports.syncProducts = async (req, res) => {
  try {
    const { data } = await axios.get(process.env.FAKESTORE_API);

    let inserted = 0;

    for (const item of data.products) {
      const exists = await Product.findOne({ externalId: item.id });

      if (!exists) {
        await Product.create({
          externalId: item.id,
          name: item.name,
          price: item.price,
          category: item.category,
          description: item.description,
          image: item.image,
          stock: item.stock || 0
        });
        inserted++;
      }
    }

    res.status(200).json({
      success: true,
      message: "Products synced successfully",
      inserted
    });

  }catch (error) {
    console.error("SYNC ERROR 👉", error.response?.data || error.message);
    res.status(500).json({
      message: "Sync failed",
      error: error.message
    });
  }
  
};

