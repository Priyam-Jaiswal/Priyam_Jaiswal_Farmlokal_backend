const router = require("express").Router();
const { syncProducts } = require("../controllers/syncProducts");
const {getProducts,createProduct} = require("../controllers/productController");
const { fetchExternalProducts } = require("../services/externalService");

router.post("/sync", syncProducts);
router.get("/",getProducts);

router.post("/",createProduct);

router.get("/external", async (req,res)=>{
  try{
    const data = await fetchExternalProducts();
    res.json(data);
  }catch(err){
    res.status(500).json({message:"External API error"});
  }
});


module.exports = router;
