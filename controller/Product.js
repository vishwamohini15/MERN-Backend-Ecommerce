const { set } = require("mongoose")
const {Product} = require("../model/Product")

exports.createProduct=async (req, res)=>{
     //this product we have to get from  API body
     const product= new Product(req.body)
     try{
     const doc= await product.save()
          res.status(201).json(doc)
     }catch(err){
          res.status(400).json(err);
     }
     
}

//I WILL FIX IT  that deleted product show on user sitd 
exports.fetchAllProducts = async (req, res) => {
  let condition = {}
  if (!req.query.admin) {
    condition.deleted = {$ne:true}
  }
  try {
    let query = Product.find(condition);
    let totalProductsQuery = Product.find(condition)
    // Filtering
    if (req.query.category) {
      query = query.find({ category: req.query.category });
      totalProductsQuery=totalProductsQuery.find({
        category: req.query.category,
      })
    }

    if (req.query.brand) {
      query = query.find({ brand: req.query.brand });
    }

    // Sorting
    if (req.query._sort && req.query._order) {
      query = query.sort({ [req.query._sort]: req.query._order });
    }

    // Count total docs before pagination
    const totalDocs = await Product.countDocuments(query.getFilter());
    console.log({ totalDocs });

    // Pagination
    if (req.query._page && req.query._limit) {
      const pageSize = parseInt(req.query._limit);
      const page = parseInt(req.query._page);
      query = query.skip(pageSize * (page - 1)).limit(pageSize);
    }

    // Execute query correctly 👇
    const docs = await query.exec();
    res.status(200).json(docs);
  } catch (err) {
    res.status(400).json(err);
  }
};


exports.fetchProductsById = async (req, res) => {
  const {id} = req.params;

   try{
        const product= await Product.findById(id)
          res.status(200).json(product)
     }catch(err){
          res.status(400).json(err);
     }
};

exports.updateProduct = async (req, res) => {
  const {id} = req.params;

   try{
        const product= await Product.findByIdAndUpdate(id, req.body, {new:true})
          res.status(200).json(product)
     }catch(err){
          res.status(400).json(err);
     }
};