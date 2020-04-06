/* eslint-disable linebreak-style */
const Products = require('../models/products.model');

exports.getAll = async (req, res) => {
  try {
    res.json(await Products.find());
  } catch (err) {
    res.status(500).json({message: err});
  }
};

exports.getRandom = async (req, res) => {
  try {
    const count = await Products.countDocuments();
    const rand = Math.floor(Math.random() * count);
    const product = await Products.findOne().skip(rand);
    if (!product) res.status(404).json({message: 'Not found'});
    else res.json(product);
  } catch (err) {
    res.status(500).json({message: err});
  }
};

exports.getId = async (req, res) => {
  try {
    const product = await Products.findById(req.params.id);
    if (!product) res.status(404).json({message: 'Not found'});
    else res.json(product);
  } catch (err) {
    res.status(500).json({message: err});
  }
};

exports.post = async (req, res) => {
  try {
    const {name, client} = req.body;
    const newProduct = new Products({name: name, client: client});
    await newProduct.save();
    res.json(newProduct);
  } catch (err) {
    res.status(500).json({message: err});
  }
};

exports.put = async (req, res) => {
  const {name, client} = req.body;
  try {
    const product = await(Products.findById(req.params.id));
    if (product) {
      product.name = name;
      product.client = client;
      await product.save();
      res.json(product);
    } else res.status(404).json({message: 'Not found...'});
  } catch (err) {
    res.status(500).json({message: err});
  }
};

exports.delete = async (req, res) => {
  try {
    const product = await(Products.findById(req.params.id));
    if (product) {
      await Products.deleteOne({_id: req.params.id});
      res.json(product);
    } else res.status(404).json({message: 'Not found...'});
  } catch (err) {
    res.status(500).json({message: err});
  }
};

