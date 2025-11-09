const express = require('express');
const { fetchCategory, createCategory } = require('../controller/Category');

const router= express.Router();
//categoryes is already added in base file
router.get('/', fetchCategory).post('/', createCategory)

exports.router=router;