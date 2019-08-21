const express = require('express');
const app = express();
const port = 3000;

const allProducts = require('./data/products');

app.use(function(req, res, next){
    console.log(`${req.method} request for ${req.url}`);
    next();
});

app.get('/', function(req, res){
    res.send('Welcome to our Products API. Use endpoints to filter out the data');
});

app.get('/allProducts', function(req,res){
    res.send(allProducts);
});

app.get('/product/:id', function(req,res){
    const id = req.params.id;
    let filteredData = [];
    for (var i = 0; i < allProducts.length; i++) {
      if (allProducts[i].id.toString()===id) {
          filteredData.push(allProducts[i]);
          console.log(filteredData[0]);
      }
    }
    res.send(filteredData[0])
});

app.get('/product/name=:name',function(req,res){
  const name = req.params.name;
  let filteredData = [];
  for (var i = 0; i < allProducts.length; i++) {
    for (var j = 0; j < name.length; i++) {
      if (name.toString() == inputName) {
        console.log(name);
      }
    }
  }
  res.send(filteredData[0]);
})

app.get('/product/edit:id',function(req,res){

});

app.get('/product/delete/:id',function(req,res){

});
app.listen(port, () => {
    console.clear();
    console.log(`application is running on port ${port}`)
});
