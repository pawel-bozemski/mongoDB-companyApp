// post.routes.js

const express = require('express');
const router = express.Router();
const Products = require('../models/products.model');

router.get('/products', async (req, res) => {
  try {
    res.json(await Products.find());
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
});

router.get('/departments/random', async (req, res) => {

  try {
    const count = await Products.countDocuments();
    const rand = Math.floor(Math.random() * count);
    const product = await Products.findOne().skip(rand);
    if(!product) res.status(404).json({ message: 'Not found' });
    else res.json(product);
  }
  catch(err) {
    res.status(500).json({ message: err });
  }

});

router.get('/products/:id', async (req, res) => {

  try {
    const product = await Products.findById(req.params.id);
    if(!product) res.status(404).json({ message: 'Not found' });
    else res.json(product);
  }
  catch(err) {
    res.status(500).json({ message: err });
  }

});

router.post('/products', async (req, res) => {

  try {

    const { name, client } = req.body;
    const newProduct = new Products({ name: name, client: client });
    await newProduct.save();
    res.json(newProduct);

  } catch(err) {
    res.status(500).json({ message: err });
  }

});

router.put('/products/:id', async (req, res) => {
  const { name, client } = req.body;

  try {
    const product = await(Products.findById(req.params.id));
    if(product) {
      product.name = name;
      product.client = client;
      await product.save();
      res.json(product);
    }
    else res.status(404).json({ message: 'Not found...' });
  }
  catch(err) {
    res.status(500).json({ message: err });
  }

});

router.delete('/products/:id', async (req, res) => {

  try {
    const product = await(Department.findById(req.params.id));
    if(product) {
      await Products.deleteOne({ _id: req.params.id });
      res.json(product);
    }
    else res.status(404).json({ message: 'Not found...' });
  }
  catch(err) {
    res.status(500).json({ message: err });
  }

});
module.exports = router;
