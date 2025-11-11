const express = require('express')
const server= express();
const mongoose=require('mongoose');
const cors= require('cors')

const { createProduct } = require('./controller/Product');
const productsRouter= require('./routes/Products')
const brandssRouter= require('./routes/Brands')
const categoriesRouter= require('./routes/Categories')
const userRouter = require('./routes/Users')
const authRouter = require('./routes/Auth')
const cartRouter = require('./routes/Cart')
const ordersRouter = require('./routes/Order')



//middlewares

server.use(cors({
  exposedHeaders:['X-Total-Count']
}))
server.use(express.json()) //to parse req.body
server.use('/products', productsRouter.router)
server.use('/categories', categoriesRouter.router)
server.use('/brands', brandssRouter.router)
server.use('/users', userRouter.router)
server.use('/auth', authRouter.router)
server.use('/cart', cartRouter.router)
server.use('/orders', ordersRouter.router)




main().catch(err=> console.log(err))

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/ecommerceoo');
  console.log('database connected');
  
} 

server.get('/', (req, res)=>{
    res.json({status:'success'})
})

// server.post('/products', createProduct);

server.listen(8080, ()=>{
     console.log('server started');
     
})