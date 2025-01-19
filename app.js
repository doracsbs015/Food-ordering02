console.log("Welcome to Dora's Food order billing system");

// Importing mongoose and FoodOrder model
const mongoose = require('mongoose');
const FoodOrder = require('./models/foodorder'); // Importing the model you just created

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/foodorderbilling', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected...'))
  .catch((err) => console.log('MongoDB connection error:', err));

const express = require('express');
const app = express();

// Middleware
app.use(express.json()); // To parse JSON requests

// Home Route
app.get('/', (req, res) => {
  res.send('Welcome to Food Order Billing API!');
});

// POST endpoint to add a new food order
app.post('/foodorder', async (req, res) => {
  try {
    const { foodItem, quantity, price } = req.body;

    // Calculate the total price
    const total = quantity * price;

    // Create a new food order document
    const newOrder = new FoodOrder({
      foodItem,
      quantity,
      price,
      total
    });

    // Save the order to the database
    await newOrder.save();

    // Return a success response
    res.status(201).json({
      message: 'Food order added successfully!',
      order: newOrder
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add food order', error: err.message });
  }
});
//_____________________________________________________________________________________________________________________________________
// GET route - Fetch all food orders (with optional query parameters)
app.get('/orders', async (req, res) => {
  try {
    const filters = req.query; // Query parameters for filtering
    const orders = await FoodOrder.find(filters); // Fetch orders based on filters (if any)
    res.json(orders); // Send the orders as a JSON response
  } catch (error) {
    res.status(500).json({ message: error.message }); // Error handling
  }
});
// NOTE: Query parameters (`req.query`) are used here for filtering.
// Example: GET /orders?price=250 retrieves all orders with a price of 250.
//__________________________________________________________________________________________________________________________________
// GET route - Fetch a single food order by ID (Path parameter)
app.get('/orders/:id', async (req, res) => {
  try {
    const order = await FoodOrder.findById(req.params.id); // Find the order by its ID (Path parameter)
    if (!order) {
      return res.status(404).json({ message: "Order not found" }); // If no order found
    }
    res.json(order); // Send the order as a JSON response
  } catch (error) {
    res.status(500).json({ message: error.message }); // Error handling
  }
});
// NOTE: Path parameters (`req.params`) are used here to fetch a specific record by ID.
// Example: GET /orders/123 fetches the order with the ID "123".
//_________________________________________________________________________________________________________________________________ 
// PUT route - Update a food order by ID with path parameter
app.put('/orders/:id', async (req, res) => {
    try {
      const { foodItem, quantity, price } = req.body;
  
      // Calculate the total price if necessary
      const total = quantity * price;
  
      // Find the order by ID and update it with new values
      const updatedOrder = await FoodOrder.findByIdAndUpdate(
        req.params.id,
        { foodItem, quantity, price, total },
        { new: true } // Return the updated document
      );
  
      if (!updatedOrder) {
        return res.status(404).json({ message: "Order not found" });
      }
  
      res.json({
        message: "Food order updated successfully!",
        order: updatedOrder
      });
    } catch (err) {
      res.status(500).json({ message: "Failed to update food order", error: err.message });
    }
  });
  
//________________________________________________________________________________________________________________________________ 
// DELETE route - Remove a food order by ID
app.delete('/orders/:id', async (req, res) => {
    try {
      // Delete the order by its ID
      const deletedOrder = await FoodOrder.findByIdAndDelete(req.params.id);
  
      if (!deletedOrder) {
        return res.status(404).json({ message: "Order not found" }); // If the order doesn't exist
      }
  
      res.json({ message: "Order deleted successfully!", order: deletedOrder });
    } catch (error) {
      res.status(500).json({ message: error.message }); // Error handling
    }
  });
  
//________________________________________________________________________________________________________________________________
// Port for server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
