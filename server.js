const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('./config.json');
const Product = require('./models/products');
const User = require('./models/users');

mongoose.connect(`mongodb+srv://${config.MONGO_USER}:${config.MONGO_PASSWORD}@sophiecluster-lhxyp.mongodb.net/shop?retryWrites=true&w=majority`, {useNewUrlParser: true});

const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function() {
    console.log("we're connected!")
});

const allProducts = require('./data/products');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cors());

app.use(function(req, res, next){
    console.log(`${req.method} request for ${req.url}`);
    next();
});

app.get('/', function(req, res){
    res.send('Welcome to our Products API. Use endpoints to filter out the data');
});

app.post('/product',function(req,res){
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    user_id : req.body.userId
  });
  console.log(product);
  product.save().then(result => {
      res.send(result)
  }).catch(err => res.send(err))
});

app.get('/allProducts', function(req,res){
    // res.send(allProducts);
    Product.find().then(result => {
      res.send(result);
    });
});
//
app.post('/product/:id', function(req,res){
    const id = req.params.id;
    Product.findById(id, function(err, product){
        if (product['user_id'] == req.body.userId) {
            res.send(product);
        } else {
            res.send('401')
        }
    });
});

app.patch('/editProduct/:id', function(req,res){
   const id = req.params.id;
   Product.findById(id, function(err,product){
      if (product['user_id'] == req.body.userId) {
        const newProduct = {
          name: req.body.name,
          price: req.body.price
        }
        Product.updateOne({_id: id}, newProduct).then(result =>{
          res.send(result);
        }).catch(err => res.send(err));
      } else {
        res.send('401');
      }
   }).catch(err=> res.send('cannot find product with that id'));
});

app.delete('/products/:id',function(req,res){
   const id = req.params.id;
   Product.deleteOne({ _id: id }, function (err) {
     res.send('deleted')
   });
});


//login form
app.post('/users',function(req,res){
  // User - modal, findOne - function, result is result of findOne().
  User.findOne({ username: req.body.username }, function (err, result) {
    if (result) {
      res.send('Sorry, this username is already existed');
    } else {
      const hash = bcrypt.hashSync(req.body.password);
      // console.log(hash);
      const user = new User({
        _id: new mongoose.Types.ObjectId(),
        username: req.body.username,
        email: req.body.email,
        password: hash
      });
      user.save().then(result => {
        res.send(result)
      }).catch(err => res.send(err))
    }
  });
});

app.post('/getUser', function(req,res){
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({ username: username}, function(err,checkUser){
      if (checkUser) {
        if (bcrypt.compareSync(password, checkUser.password)) {
          console.log('password matches');
          res.send(checkUser);
        } else {
          console.log('password does not match');
          res.send('Invalid password');
        }
      } else {
        res.send('Invalid user');
      }
    });
});

const Message = require('./models/message');
app.post('/message',function(req,res){
  const message = new Message({
    name: req.body.name,
    email: req.body.email,
    message: req.body.message
  });
  console.log(message);
  message.save().then(result =>{
    res.send(result)
  }).catch(err => res.send(err))
});


app.listen(port, () => {
    console.clear();
    console.log(`application is running on port ${port}`);
});
