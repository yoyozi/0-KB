---
title: "Node.js and Express Complete Guide"
description: "Comprehensive guide to Node.js and Express.js including server setup, routing, middleware, MongoDB integration, authentication, security, and best practices"
tags:
  - nodejs
  - express
  - javascript
  - backend
  - api
  - rest
  - mongodb
  - authentication
  - middleware
date: 2024-11-03
lastUpdated: 2024-11-03
---

# Node.js and Express Complete Guide

Complete guide to building backend applications with Node.js and Express.js.

## Table of Contents

- [Node.js Basics](#nodejs-basics)
- [NPM Package Management](#npm-package-management)
- [Modules and Exports](#modules-and-exports)
- [Async Programming](#async-programming)
- [Express Setup](#express-setup)
- [Routing](#routing)
- [Middleware](#middleware)
- [Error Handling](#error-handling)
- [MongoDB Integration](#mongodb-integration)
- [Authentication](#authentication)
- [Security Best Practices](#security-best-practices)
- [API Best Practices](#api-best-practices)

## Node.js Basics

### Node REPL

```bash
# Start Node REPL
node

# Tab to see available methods
String. [TAB]

# Exit REPL
Ctrl+D
```

### Basic HTTP Server

```javascript
const http = require('http');

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n');
});

server.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

### File System Operations

```javascript
const fs = require('fs');

// Synchronous
const data = fs.readFileSync('file.txt', 'utf-8');

// Asynchronous
fs.readFile('file.txt', 'utf-8', (err, data) => {
  if (err) throw err;
  console.log(data);
});

// Write file
fs.writeFile('output.txt', 'Hello World', (err) => {
  if (err) throw err;
  console.log('File written!');
});
```

## NPM Package Management

### Package Versioning

```
^1.18.11  - Updates to latest minor and patch (1.x.x)
~1.18.11  - Updates to latest patch only (1.18.x)
*1.18.11  - Updates to any version (x.x.x)
1.18.11   - Exact version only
```

### Common Commands

```bash
# Initialize project
npm init -y

# Install package
npm install express

# Install dev dependency
npm install nodemon --save-dev

# Check outdated packages
npm outdated

# Update packages
npm update

# Install specific version
npm install express@4.18.0

# Uninstall package
npm uninstall express
```

### Package.json Scripts

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "jest"
  }
}
```

## Modules and Exports

### Module Wrapper

Every module is wrapped in a function:

```javascript
(function(exports, require, module, __filename, __dirname) {
  // Module code
});
```

### Export Single Class

```javascript
// calculator.js
class Calculator {
  add(a, b) {
    return a + b;
  }
  
  multiply(a, b) {
    return a * b;
  }
}

module.exports = Calculator;
```

```javascript
// app.js
const Calculator = require('./calculator');
const calc = new Calculator();
console.log(calc.add(2, 3)); // 5
```

### Export Multiple Functions

```javascript
// utils.js
exports.add = (a, b) => a + b;
exports.multiply = (a, b) => a * b;
exports.divide = (a, b) => a / b;
```

```javascript
// app.js
const { add, multiply } = require('./utils');
console.log(add(2, 3)); // 5
```

### Export Object

```javascript
// config.js
module.exports = {
  port: 3000,
  dbUrl: 'mongodb://localhost:27017/mydb',
  jwtSecret: 'secret'
};
```

## Async Programming

### Callbacks

```javascript
const fs = require('fs');

fs.readFile('file.txt', 'utf-8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(data);
});
```

### Promises

```javascript
const fs = require('fs').promises;

fs.readFile('file.txt', 'utf-8')
  .then(data => console.log(data))
  .catch(err => console.error(err));
```

### Async/Await

```javascript
const fs = require('fs').promises;

async function readFile() {
  try {
    const data = await fs.readFile('file.txt', 'utf-8');
    console.log(data);
  } catch (err) {
    console.error(err);
  }
}

readFile();
```

### Promisify

```javascript
const { promisify } = require('util');
const fs = require('fs');

const readFileAsync = promisify(fs.readFile);

async function main() {
  const data = await readFileAsync('file.txt', 'utf-8');
  console.log(data);
}
```

## Express Setup

### Installation

```bash
npm install express
```

### Basic Server

```javascript
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

### Middleware Setup

```javascript
const express = require('express');
const morgan = require('morgan');
const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(morgan('dev'));

// Static files
app.use(express.static('public'));

// Routes
app.use('/api/users', userRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## Routing

### Basic Routes

```javascript
// GET request
app.get('/api/users', (req, res) => {
  res.json({ users: [] });
});

// POST request
app.post('/api/users', (req, res) => {
  const user = req.body;
  res.status(201).json({ user });
});

// PUT request
app.put('/api/users/:id', (req, res) => {
  const { id } = req.params;
  res.json({ message: `User ${id} updated` });
});

// DELETE request
app.delete('/api/users/:id', (req, res) => {
  const { id } = req.params;
  res.json({ message: `User ${id} deleted` });
});
```

### Route Parameters

```javascript
// URL parameters
app.get('/api/users/:id', (req, res) => {
  const { id } = req.params;
  res.json({ id });
});

// Query parameters
app.get('/api/search', (req, res) => {
  const { q, page, limit } = req.query;
  res.json({ q, page, limit });
});
```

### Router

```javascript
// routes/userRoutes.js
const express = require('express');
const router = express.Router();

router.get('/', getAllUsers);
router.post('/', createUser);
router.get('/:id', getUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
```

```javascript
// app.js
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);
```

### Route Chaining

```javascript
router
  .route('/')
  .get(getAllUsers)
  .post(createUser);

router
  .route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);
```

## Middleware

### Custom Middleware

```javascript
// Logging middleware
const logger = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
};

app.use(logger);
```

### Error Handling Middleware

```javascript
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: err.message
  });
});
```

### Param Middleware

```javascript
router.param('id', (req, res, next, id) => {
  // Validate ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid ID' });
  }
  next();
});
```

### Authentication Middleware

```javascript
const protect = async (req, res, next) => {
  try {
    let token;
    
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
      return res.status(401).json({ error: 'Not authorized' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (err) {
    res.status(401).json({ error: 'Not authorized' });
  }
};

// Usage
router.get('/profile', protect, getProfile);
```

## Error Handling

### Operational Errors

```javascript
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
```

### Global Error Handler

```javascript
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  
  if (process.env.NODE_ENV === 'development') {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  } else {
    // Production
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
    } else {
      console.error('ERROR:', err);
      res.status(500).json({
        status: 'error',
        message: 'Something went wrong'
      });
    }
  }
};

module.exports = errorHandler;
```

### Async Error Wrapper

```javascript
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

// Usage
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.json({ users });
});
```

### Unhandled Routes

```javascript
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl}`, 404));
});
```

## MongoDB Integration

### Mongoose Setup

```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

module.exports = connectDB;
```

### Schema and Model

```javascript
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: 'Invalid email'
    }
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 8,
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
```

### CRUD Operations

```javascript
// Create
const user = await User.create({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'password123'
});

// Read
const users = await User.find();
const user = await User.findById(id);
const user = await User.findOne({ email: 'john@example.com' });

// Update
const user = await User.findByIdAndUpdate(
  id,
  { name: 'Jane Doe' },
  { new: true, runValidators: true }
);

// Delete
await User.findByIdAndDelete(id);
```

### Query Features

```javascript
// Filtering
const users = await User.find({ role: 'admin' });

// Sorting
const users = await User.find().sort('-createdAt'); // Descending

// Pagination
const page = req.query.page * 1 || 1;
const limit = req.query.limit * 1 || 10;
const skip = (page - 1) * limit;

const users = await User.find()
  .skip(skip)
  .limit(limit);

// Field limiting
const users = await User.find().select('name email');

// Populate
const posts = await Post.find().populate('author');
```

## Authentication

### JWT Setup

```bash
npm install jsonwebtoken bcryptjs
```

### Password Hashing

```javascript
const bcrypt = require('bcryptjs');

// Hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};
```

### Generate JWT

```javascript
const jwt = require('jsonwebtoken');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

// Usage
const token = signToken(user._id);
res.json({ token });
```

### Register User

```javascript
exports.register = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;
  
  const user = await User.create({
    name,
    email,
    password
  });
  
  const token = signToken(user._id);
  
  res.status(201).json({
    status: 'success',
    token,
    data: { user }
  });
});
```

### Login User

```javascript
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }
  
  const user = await User.findOne({ email }).select('+password');
  
  if (!user || !(await user.comparePassword(password))) {
    return next(new AppError('Incorrect email or password', 401));
  }
  
  const token = signToken(user._id);
  
  res.json({
    status: 'success',
    token
  });
});
```

## Security Best Practices

### Environment Variables

```bash
# .env
NODE_ENV=development
PORT=3000
MONGO_URI=mongodb://localhost:27017/mydb
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=90d
```

```javascript
require('dotenv').config();

const port = process.env.PORT || 3000;
```

### Security Packages

```bash
npm install helmet express-rate-limit express-mongo-sanitize xss-clean hpp cors
```

```javascript
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');

// Set security HTTP headers
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests'
});
app.use('/api', limiter);

// Data sanitization against NoSQL injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(hpp({
  whitelist: ['duration', 'price']
}));

// Enable CORS
app.use(cors());
```

## API Best Practices

### RESTful API Structure

```
GET    /api/v1/users       - Get all users
POST   /api/v1/users       - Create user
GET    /api/v1/users/:id   - Get user
PUT    /api/v1/users/:id   - Update user
DELETE /api/v1/users/:id   - Delete user
```

### Response Format

```javascript
// Success
res.status(200).json({
  status: 'success',
  results: users.length,
  data: { users }
});

// Error
res.status(404).json({
  status: 'fail',
  message: 'User not found'
});
```

### API Versioning

```javascript
app.use('/api/v1/users', userRoutesV1);
app.use('/api/v2/users', userRoutesV2);
```

---

**Related Topics:**
- Express Middleware
- MongoDB Aggregation
- WebSockets
- GraphQL
- Microservices
- Docker Deployment
