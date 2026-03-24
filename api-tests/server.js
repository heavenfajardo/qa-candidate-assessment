const express = require('express');
const app = express();

app.use(express.json());

let products = [
  { id: 1, name: 'TestApple', price: 2 },
  { id: 2, name: 'TestMilk', price: 3 },
  { id: 3, name: 'TestBread', price: 1.5 }
];

let orders = [];

app.post('/auth', (req, res) => {
  const { username, password } = req.body;

  if (username && password) {
    return res.json({ token: 'test_token' });
  }

  res.status(401).json({ message: 'Invalid credentials' });
});

app.get('/products', (req, res) => {
  res.json(products);
});

app.post('/orders', (req, res) => {
  const { product_id, quantity } = req.body;

  const product = products.find(p => p.id === product_id);

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  const order = {
    order_id: orders.length + 1,
    product_id,
    quantity,
    total_price: product.price * quantity
  };

  orders.push(order);

  res.status(201).json(order);
});

app.get('/orders/:id', (req, res) => {
  const order = orders.find(o => o.order_id == req.params.id);

  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  res.json(order);
});

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});