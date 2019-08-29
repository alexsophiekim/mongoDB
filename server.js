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
    res.send('dfadsfWelcome to our Products API. Use endpoints to filter out the data');
});

app.get('/allProducts', function(req,res){
    // res.send(allProducts);
    Product.find().then(result => {
      res.send(result);
    });
});

app.get('/product/:id', function(req,res){
    const id = req.params.id;
    // for (var i = 0; i < allProducts.length; i++) {
    //   if (allProducts[i].id.toString()==id) {
    //       res.send(allProducts[i])
    //       break;
    //   }
    // }
    Product.findById(id).then(result => {
      res.send(result);
    });
});

app.get('/product/name=:name',function(req,res){
  const name = req.params.name;
  let filteredData = [];
  for (var i = 0; i < allProducts.length; i++) {
    for (var j = 0; j < name.length; i++) {
      if (name.toString() < inputName) {
        console.log(name);
      }
    }
  }
  res.send(filteredData[0]);
})

app.post('/product',function(req,res){

  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price
  });
  console.log(product);
  product.save().then(result => {
      res.send(result)
  }).catch(err => res.send(err))
});


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

app.post('/getuser', function(req,res){
  // if (bcrypt.compareSync('password',hash)) {
  //     console.log('password matches');
  // } else {
  //     console.log('password does not match');
  // }
});


 app.patch('/editProduct/:id', function(req,res){
   const id = req.params.id;
   const newProduct = {
     name: req.body.name,
     price: req.body.price
   }
   Product.updateOne({_id: id}, newProduct).then(result =>{
     res.send(result);
   }).catch(err => res.send(err));
 })


app.delete('/products/:id',function(req,res){
  const id = req.params.id;
  Product.deleteOne({ _id: id }, function (err) {
    res.send('deleted')
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
