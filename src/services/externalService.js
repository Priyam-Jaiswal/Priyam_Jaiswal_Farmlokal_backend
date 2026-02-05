const axios = require("axios");

exports.fetchExternalProducts = async ()=>{
  let attempts = 3;
  while(attempts){
    try{
      const res = await axios.get(process.env.FAKESTORE_API);
      return res.data;
    }catch(err){
      attempts--;
      if(attempts===0) throw err;
    }
  }
};
