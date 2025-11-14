const express = require('express')
const server= express();
const mongoose=require('mongoose');
const cors= require('cors')
const session = require('express-session');
const passport = require('passport');
const LocalStrategy=require('passport-local').Strategy
const crypto = require('crypto')
const jwt = require('jsonwebtoken');

const JwtStrategy = require('passport-jwt').Strategy;
const  ExtractJwt = require('passport-jwt').ExtractJwt;

const { createProduct } = require('./controller/Product');
const productsRouter= require('./routes/Products')
const brandssRouter= require('./routes/Brands')
const categoriesRouter= require('./routes/Categories')
const userRouter = require('./routes/Users')
const authRouter = require('./routes/Auth')
const cartRouter = require('./routes/Cart')
const ordersRouter = require('./routes/Order');
const { User } = require('./model/User');
const { isAuth, sanitizerUser } = require('./services/common');
const SECRET_KEY='SECRET_KEY';

//JWT options
const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = SECRET_KEY;

//passport strategies
passport.use('local',
  new LocalStrategy(
    {usernameField: 'email'},
  async function (email, password, done) {
    try {
      const user = await User.findOne({ email: email })
      console.log("Password entered:", password);
      if (!user) {
        return done(null, false, { message: 'Invalid credentials (no user)' });
      }
        crypto.pbkdf2(
          password,
           user.salt,
            310000,
            32,
             'sha256',
              async function(err, hashedPassword) {
               if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
              return done(null, false, { message: 'Invalid credentials (wrong password)' });
              } 
              const token = jwt.sign(sanitizerUser(user), SECRET_KEY);
                done(null, token);
              })
    } catch (err) {
       done(err);
    }
  }
));

passport.use('jwt',new JwtStrategy(opts, async function(jwt_payload, done) {
  console.log({jwt_payload});
  try{
 const user=  await  User.findOne({id: jwt_payload.sub})
if (user) {
            return done(null, sanitizerUser(user));
        } else {
            return done(null, false);
            // or you could create a new account
        }
  }catch(err){
       return done(err, false);
  }
 
}));


//this creates session variable req.user on being called from callback
passport.serializeUser(function(user, cb) {
  console.log('seriallize', user);
  
  process.nextTick(function() {
    return cb(null, {id: user.id, role: user.role})
     
  });
});

//this  change session variable req.user when called from authorised request
passport.deserializeUser(function(user, cb) {
  console.log('DE-seriallize', user);

  process.nextTick(function() {
    return cb(null, user);
  });
});


//middlewares



server.use(cors({
  exposedHeaders:['X-Total-Count']
}))
server.use(express.json()) //to parse req.body
server.use(session({
  secret: 'keyboard cat',
  resave: false, // don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
}));
server.use(passport.authenticate('session'));

server.use('/products', isAuth(), productsRouter.router)
server.use('/categories', isAuth(), categoriesRouter.router)
server.use('/brands', isAuth(), brandssRouter.router)
server.use('/users', isAuth(), userRouter.router)
server.use('/auth',  authRouter.router)
server.use('/cart', isAuth(), cartRouter.router)
server.use('/orders', isAuth(), ordersRouter.router)




main().catch(err=> console.log(err))

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/ecommerceoo');
  console.log('database connected');
  
} 

// server.get('/', (req, res)=>{
//     res.json({status:'success'})
// })



// server.post('/products', createProduct);

server.listen(8080, ()=>{
     console.log('server started');
     
})