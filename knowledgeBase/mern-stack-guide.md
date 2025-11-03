---
title: "MERN Stack Development Guide"
description: "Complete guide to building full-stack applications with MongoDB, Express.js, React, and Node.js including authentication, API routes, models, and deployment"
tags:
  - mern
  - mongodb
  - express
  - react
  - nodejs
  - full-stack
  - javascript
  - api
  - authentication
  - jwt
date: 2024-11-03
lastUpdated: 2024-11-03
---

# MERN Stack Development Guide

Complete guide to building full-stack applications using MongoDB, Express.js, React, and Node.js.

## Table of Contents

- [Project Setup](#project-setup)
- [Backend Setup](#backend-setup)
- [Database Configuration](#database-configuration)
- [Authentication](#authentication)
- [API Routes](#api-routes)
- [Models](#models)
- [Frontend Setup](#frontend-setup)
- [React Components](#react-components)
- [State Management](#state-management)
- [Deployment](#deployment)

## Project Setup

### Initialize Project

```bash
# Create project directory
mkdir mern-app
cd mern-app

# Initialize Node.js project
npm init -y
```

### .gitignore

```gitignore
# Dependencies
node_modules/

# Environment variables
.env
.config.env

# Build output
build/
dist/

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*

# Documentation (if needed)
00-MERN-KB-01.md
00-Node-Express-KB-05.md
settings.json
.eslintrc.json
.prettierrc
```

### Install Dependencies

**Production dependencies:**

```bash
npm i express express-validator bcryptjs config gravatar jsonwebtoken mongoose request
```

**Development dependencies:**

```bash
npm i -D nodemon concurrently
```

### Package.json Scripts

```json
{
  "scripts": {
    "start": "node server",
    "server": "nodemon server",
    "client": "npm start --prefix client",
    "dev": "concurrently \"npm run server\" \"npm run client\""
  }
}
```

## Backend Setup

### Entry File: server.js

```javascript
const express = require('express');
const connectDB = require('./config/db');

const app = express();

// Connect to Database
connectDB();

// Init Middleware
app.use(express.json());

// Test route
app.get('/', (req, res) => res.send('API running'));

// Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
```

### Start Development Server

```bash
npm run server
```

## Database Configuration

### MongoDB Setup

**Local MongoDB:**

```bash
# Log in as admin
mongo -u mongoadmin -p --authenticationDatabase admin

# Switch to admin database
use admin

# Create database user
db.createUser({
  user: "madmin",
  pwd: "mernpassword",
  roles: [{role: "userAdmin", db: "merndev"}]
})
```

### Database Connection: config/db.js

```javascript
const mongoose = require('mongoose');
const config = require('config');

const db = config.get('mongoURI');
const user = config.get('mongoUser');
const pass = config.get('mongoPw');
const authSource = config.get('mongoSource');

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      authSource,
      user,
      pass,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
```

### Configuration: config/default.json

```json
{
  "mongoURI": "mongodb://localhost:27017/merndev",
  "mongoSource": "admin",
  "mongoUser": "madmin",
  "mongoPw": "mernpassword",
  "jwtSecret": "your_jwt_secret_key_here"
}
```

**Note:** Never commit `default.json` with real credentials. Use environment variables in production.

## Authentication

### User Model: models/User.js

```javascript
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('user', UserSchema);
```

### Auth Middleware: middleware/auth.js

```javascript
const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req, res, next) {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if no token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, config.get('jwtSecret'));
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
```

### User Registration: routes/api/users.js

```javascript
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const User = require('../../models/User');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

// @route   POST api/users
// @desc    Register user
// @access  Public
router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters')
      .isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      // Check if user exists
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
      }

      // Get user's gravatar
      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm'
      });

      user = new User({
        name,
        email,
        avatar,
        password
      });

      // Encrypt password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      // Return JWT
      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
```

### User Login: routes/api/auth.js

```javascript
const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');

// @route   GET api/auth
// @desc    Get user by token
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/auth
// @desc    Authenticate user & get token
// @access  Public
router.post(
  '/',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // Check if user exists
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
      }

      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
      }

      // Return JWT
      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
```

## Models

### Post Model: models/Post.js

```javascript
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  text: {
    type: String,
    required: true
  },
  name: {
    type: String
  },
  avatar: {
    type: String
  },
  likes: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
      }
    }
  ],
  comments: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
      },
      text: {
        type: String,
        required: true
      },
      name: {
        type: String
      },
      avatar: {
        type: String
      },
      date: {
        type: Date,
        default: Date.now
      }
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('post', PostSchema);
```

### Profile Model: models/Profile.js

```javascript
const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  company: {
    type: String
  },
  website: {
    type: String
  },
  location: {
    type: String
  },
  status: {
    type: String,
    required: true
  },
  skills: {
    type: [String],
    required: true
  },
  bio: {
    type: String
  },
  githubusername: {
    type: String
  },
  experience: [
    {
      title: {
        type: String,
        required: true
      },
      company: {
        type: String,
        required: true
      },
      location: {
        type: String
      },
      from: {
        type: Date,
        required: true
      },
      to: {
        type: Date
      },
      current: {
        type: Boolean,
        default: false
      },
      description: {
        type: String
      }
    }
  ],
  education: [
    {
      school: {
        type: String,
        required: true
      },
      degree: {
        type: String,
        required: true
      },
      fieldofstudy: {
        type: String,
        required: true
      },
      from: {
        type: Date,
        required: true
      },
      to: {
        type: Date
      },
      current: {
        type: Boolean,
        default: false
      },
      description: {
        type: String
      }
    }
  ],
  social: {
    youtube: {
      type: String
    },
    twitter: {
      type: String
    },
    facebook: {
      type: String
    },
    linkedin: {
      type: String
    },
    instagram: {
      type: String
    }
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('profile', ProfileSchema);
```

## Frontend Setup

### Create React App

```bash
npx create-react-app client
cd client
npm start
```

### Install Frontend Dependencies

```bash
npm i axios react-router-dom redux react-redux redux-thunk redux-devtools-extension moment react-moment
```

### Proxy Configuration

Add to `client/package.json`:

```json
{
  "proxy": "http://localhost:5000"
}
```

## React Components

### Functional Component with Hooks

```javascript
import React, { useState, useEffect } from 'react';

const MyComponent = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data on component mount
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/data');
      const json = await res.json();
      setData(json);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {data.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
};

export default MyComponent;
```

### Component with Props

```javascript
import PropTypes from 'prop-types';

const Button = ({ color, text, onClick }) => {
  return (
    <button
      onClick={onClick}
      style={{ backgroundColor: color }}
      className="btn"
    >
      {text}
    </button>
  );
};

Button.defaultProps = {
  color: 'steelblue',
};

Button.propTypes = {
  text: PropTypes.string,
  color: PropTypes.string,
  onClick: PropTypes.func,
};

export default Button;
```

## API Testing with Postman

### Register User

```
POST http://localhost:5000/api/users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Login User

```
POST http://localhost:5000/api/auth
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Get User (Protected Route)

```
GET http://localhost:5000/api/auth
x-auth-token: <your_jwt_token>
```

## Best Practices

### Security

1. **Never commit sensitive data** - Use environment variables
2. **Hash passwords** - Always use bcrypt
3. **Validate input** - Use express-validator
4. **Protect routes** - Use JWT middleware
5. **Set token expiration** - Don't use long-lived tokens in production
6. **Use HTTPS** in production
7. **Implement rate limiting** - Prevent brute force attacks

### Code Organization

```
project/
├── client/                 # React frontend
│   ├── public/
│   └── src/
│       ├── components/
│       ├── actions/
│       ├── reducers/
│       └── App.js
├── config/                 # Configuration files
│   ├── db.js
│   └── default.json
├── middleware/             # Custom middleware
│   └── auth.js
├── models/                 # Mongoose models
│   ├── User.js
│   ├── Post.js
│   └── Profile.js
├── routes/                 # API routes
│   └── api/
│       ├── auth.js
│       ├── users.js
│       ├── posts.js
│       └── profile.js
├── .gitignore
├── package.json
└── server.js
```

### Error Handling

```javascript
// Centralized error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    msg: 'Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});
```

## Deployment

### Prepare for Production

```javascript
// server.js
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}
```

### Build React App

```bash
cd client
npm run build
```

### Environment Variables

Create `.env` file:

```env
NODE_ENV=production
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=5000
```

### Deploy to Heroku

```bash
# Install Heroku CLI
heroku login

# Create Heroku app
heroku create your-app-name

# Set environment variables
heroku config:set MONGO_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_jwt_secret

# Deploy
git push heroku main
```

## Quick Reference

### Common Commands

```bash
# Start development server
npm run dev

# Start backend only
npm run server

# Start frontend only
npm run client

# Build for production
npm run build

# Run tests
npm test
```

### MongoDB Commands

```bash
# Start MongoDB
mongod

# Connect to MongoDB
mongo

# Show databases
show dbs

# Use database
use merndev

# Show collections
show collections

# Find documents
db.users.find()
```

---

**Related Topics:**
- Node.js
- Express.js
- React
- MongoDB
- JWT Authentication
- REST API Design
- Redux State Management
