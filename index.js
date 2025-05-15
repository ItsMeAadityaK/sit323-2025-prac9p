const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;

// MongoDB connection
const uri = process.env.MONGO_URI || 'mongodb://localhost:27017';
const client = new MongoClient(uri);
let db;

// Middleware to validate numbers
const Numbers = (req, res, next) => {
  const { num1, num2 } = req.query;

  if (num1 === undefined || num2 === undefined) {
    return res.status(400).json({ error: "Missing parameters. Please provide both 'num1' and 'num2'." });
  }

  if (isNaN(num1) || isNaN(num2)) {
    return res.status(400).json({ error: "Invalid input. Please provide two valid numbers." });
  }

  next();
};

// Log operation to MongoDB
const logOperation = async (operation, operands, result) => {
  if (!db) return;
  await db.collection('history').insertOne({
    operation,
    operands,
    result,
    timestamp: new Date()
  });
};

// Routes
app.get('/add', Numbers, async (req, res) => {
  const num1 = parseFloat(req.query.num1);
  const num2 = parseFloat(req.query.num2);
  const result = num1 + num2;
  await logOperation('add', [num1, num2], result);
  res.json({ result });
});

app.get('/subtract', Numbers, async (req, res) => {
  const num1 = parseFloat(req.query.num1);
  const num2 = parseFloat(req.query.num2);
  const result = num1 - num2;
  await logOperation('subtract', [num1, num2], result);
  res.json({ result });
});

app.get('/multiply', Numbers, async (req, res) => {
  const num1 = parseFloat(req.query.num1);
  const num2 = parseFloat(req.query.num2);
  const result = num1 * num2;
  await logOperation('multiply', [num1, num2], result);
  res.json({ result });
});

app.get('/divide', Numbers, async (req, res) => {
  const num1 = parseFloat(req.query.num1);
  const num2 = parseFloat(req.query.num2);

  if (num2 === 0) {
    return res.status(400).json({ error: "Cannot divide by zero." });
  }

  const result = num1 / num2;
  await logOperation('divide', [num1, num2], result);
  res.json({ result });
});

app.get('/power', async (req, res) => {
  const { base, exponent } = req.query;

  if (base === undefined || exponent === undefined || isNaN(base) || isNaN(exponent)) {
    return res.status(400).json({ error: "Provide valid 'base' and 'exponent'." });
  }

  const result = Math.pow(parseFloat(base), parseFloat(exponent));
  await logOperation('power', [parseFloat(base), parseFloat(exponent)], result);
  res.json({ result });
});

app.get('/sqrt', async (req, res) => {
  const { num } = req.query;

  if (num === undefined || isNaN(num)) {
    return res.status(400).json({ error: "Provide a valid number." });
  }

  const number = parseFloat(num);
  if (number < 0) {
    return res.status(400).json({ error: "Cannot compute square root of a negative number." });
  }

  const result = Math.sqrt(number);
  await logOperation('sqrt', [number], result);
  res.json({ result });
});

app.get('/modulo', Numbers, async (req, res) => {
  const num1 = parseFloat(req.query.num1);
  const num2 = parseFloat(req.query.num2);

  if (num2 === 0) {
    return res.status(400).json({ error: "Cannot perform modulo with divisor zero." });
  }

  const result = num1 % num2;
  await logOperation('modulo', [num1, num2], result);
  res.json({ result });
});

// Get recent history
app.get('/history', async (req, res) => {
  const history = await db.collection('history')
    .find()
    .sort({ timestamp: -1 })
    .limit(10)
    .toArray();
  res.json(history);
});

// Start server
app.listen(port, async () => {
  try {
    await client.connect();
    db = client.db('calculatorDB');
    console.log(`Connected to MongoDB. Server running at http://localhost:${port}`);
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  }
});
