const express = require('express');
const { createProduct, fetchAllProducts, fetchProductsById, updateProduct } = require('../controller/Product');

const router= express.Router();

router.post('/', createProduct)
router.get('/', fetchAllProducts);
router.get('/:id', fetchProductsById);
router.patch('/:id', updateProduct)


exports.router=router;