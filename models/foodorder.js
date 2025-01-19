const mongoose = require('mongoose');

// Define a schema for the food order
const foodOrderSchema = new mongoose.Schema({
  foodItem: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  }
});

// Create the model
const FoodOrder = mongoose.model('FoodOrder', foodOrderSchema);

module.exports = FoodOrder;

