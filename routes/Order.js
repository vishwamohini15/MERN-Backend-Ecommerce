const express = require('express');
const { createOrder, updateOrder, fetchOrdersByUser, deleteOrder } = require('../controller/Order');

const router= express.Router();

router.post('/', createOrder)
router.get('/', fetchOrdersByUser);
router.delete('/:id', deleteOrder);
router.patch('/:id', updateOrder)


exports.router=router;