---
title: "MongoDB Complete Guide"
description: "Comprehensive guide to MongoDB including installation on Ubuntu, authentication setup, user management, CRUD operations, Mongoose integration, and backup/restore procedures"
tags:
  - mongodb
  - database
  - nosql
  - mongoose
  - nodejs
  - ubuntu
  - authentication
  - backup
date: 2024-11-03
lastUpdated: 2024-11-03
---

# MongoDB Complete Guide

Comprehensive guide to MongoDB installation, configuration, authentication, and operations.

## Table of Contents

- [Installation](#installation)
- [Authentication Setup](#authentication-setup)
- [User Management](#user-management)
- [MongoDB Commands](#mongodb-commands)
- [CRUD Operations](#crud-operations)
- [Querying](#querying)
- [Mongoose Integration](#mongoose-integration)
- [Backup and Restore](#backup-and-restore)

## Installation

### Install MongoDB 6.0 on Ubuntu 20.04

#### Install Required Packages

```bash
sudo apt install wget curl gnupg2 software-properties-common apt-transport-https ca-certificates lsb-release
```

#### Import MongoDB Public Key

```bash
curl -fsSL https://www.mongodb.org/static/pgp/server-6.0.asc | sudo gpg --dearmor -o /etc/apt/trusted.gpg.d/mongodb-6.gpg
```

#### Configure MongoDB Repository

```bash
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
```

#### Install MongoDB (Recommended Method)

```bash
# Download libssl1.1 dependency
wget http://archive.ubuntu.com/ubuntu/pool/main/o/openssl/libssl1.1_1.1.1f-1ubuntu2.16_amd64.deb

# Install dependency
sudo dpkg -i ./libssl1.1_1.1.1f-1ubuntu2.16_amd64.deb

# Update package list
sudo apt update

# Install MongoDB
sudo apt install mongodb-org

# Reboot system
sudo reboot
```

#### Start and Enable MongoDB

```bash
# Enable and start MongoDB
sudo systemctl enable --now mongod

# Check status
systemctl status mongod

# Check version
mongod --version
```

## Authentication Setup

### Configuration File

MongoDB configuration file location: `/etc/mongod.conf`

### Enable Authentication

Edit `/etc/mongod.conf`:

```yaml
security:
  authorization: enabled
```

Restart MongoDB:

```bash
sudo systemctl restart mongod
```

### Create Admin User

Connect to MongoDB without authentication (first time):

```bash
mongosh --port 27017
```

Switch to admin database and create admin user:

```javascript
use admin

db.createUser({
  user: "mongoAdmin",
  pwd: passwordPrompt(),  // Will prompt for password
  roles: [
    { role: "userAdminAnyDatabase", db: "admin" },
    { role: "readWriteAnyDatabase", db: "admin" }
  ]
})
```

**Note:** The `passwordPrompt()` method prompts for password securely. Alternatively, specify password directly: `pwd: "your_password"` (not recommended for production).

### Admin User Capabilities

The `userAdminAnyDatabase` role allows:
- Create users
- Grant or revoke roles from users
- Create or modify custom roles

### Change User Password

```javascript
use admin
db.changeUserPassword("mongoAdmin", "new_password")
```

### View Users

```javascript
use admin
db.getUsers()
```

**Output example:**

```javascript
{
  users: [
    {
      _id: 'admin.mongoAdmin',
      userId: UUID('80951dff-a187-4679-9162-c6c18fa2900c'),
      user: 'mongoAdmin',
      db: 'admin',
      roles: [
        { role: 'userAdminAnyDatabase', db: 'admin' },
        { role: 'readWriteAnyDatabase', db: 'admin' }
      ],
      mechanisms: [ 'SCRAM-SHA-1', 'SCRAM-SHA-256' ]
    }
  ],
  ok: 1
}
```

## User Management

### Login as Admin

```bash
mongo -u mongoAdmin -p --authenticationDatabase admin
```

Or with mongosh:

```bash
mongosh -u mongoAdmin -p --authenticationDatabase admin
```

### Create Database-Specific Users

#### Node.js Application User (Recommended)

```javascript
use your_database_name

db.createUser({
  user: "your_node_user",
  pwd: "your_password",
  roles: [
    { role: "readWrite", db: "your_database_name" },
    { role: "dbAdmin", db: "your_database_name" }
  ]
})
```

#### Multiple User Examples

```javascript
// User with admin rights on specific database
db.createUser({
  user: "adlocaladmin",
  pwd: "password",
  roles: [{ role: "userAdmin", db: "adlocal" }]
})

// User with different rights on multiple databases
db.createUser({
  user: "Mohan",
  pwd: "password",
  roles: [
    { role: "read", db: "Marketing" },
    { role: "readWrite", db: "Sales" }
  ]
})

// MERN app user
db.createUser({
  user: "mernadmin",
  pwd: "mernpassword",
  roles: [{ role: "userAdmin", db: "merndev" }]
})
```

### User Roles

| Role | Description |
|------|-------------|
| `read` | Read data from database |
| `readWrite` | Read and write data |
| `dbAdmin` | Database administration tasks |
| `userAdmin` | Create and modify users and roles |
| `dbOwner` | Full access to database |
| `readAnyDatabase` | Read from any database |
| `readWriteAnyDatabase` | Read/write to any database |
| `userAdminAnyDatabase` | User admin on any database |
| `dbAdminAnyDatabase` | DB admin on any database |

## MongoDB Commands

### Database Operations

```javascript
// Show all databases
show dbs

// Show current database
db

// Create or switch to database
use acme

// Drop database
db.dropDatabase()
```

### Collection Operations

```javascript
// Create collection
db.createCollection('posts')

// Show collections
show collections

// Drop collection
db.posts.drop()
```

## CRUD Operations

### Create (Insert)

#### Insert One Document

```javascript
db.posts.insertOne({
  title: 'Post One',
  body: 'Body of post one',
  category: 'News',
  tags: ['news', 'events'],
  user: {
    name: 'John Doe',
    status: 'author'
  },
  date: Date()
})
```

#### Insert Multiple Documents

```javascript
db.posts.insertMany([
  {
    title: 'Post Two',
    body: 'Body of post two',
    category: 'Technology',
    date: Date()
  },
  {
    title: 'Post Three',
    body: 'Body of post three',
    category: 'News',
    date: Date()
  },
  {
    title: 'Post Four',
    body: 'Body of post four',
    category: 'Entertainment',
    date: Date()
  }
])
```

### Read (Find)

```javascript
// Find all documents
db.posts.find()

// Find all (formatted)
db.posts.find().pretty()

// Find with filter
db.posts.find({ category: 'News' })

// Find one document
db.posts.findOne({ category: 'News' })

// Find specific fields
db.posts.find(
  { title: 'Post One' },
  { title: 1, author: 1 }
)
```

### Update

#### Update Entire Document

```javascript
db.posts.update(
  { title: 'Post Two' },
  {
    title: 'Post Two',
    body: 'New body for post 2',
    date: Date()
  },
  { upsert: true }
)
```

#### Update Specific Fields

```javascript
db.posts.update(
  { title: 'Post Two' },
  {
    $set: {
      body: 'Body for post 2',
      category: 'Technology'
    }
  }
)
```

#### Increment Field

```javascript
db.posts.update(
  { title: 'Post Two' },
  {
    $inc: {
      likes: 5
    }
  }
)
```

#### Rename Field

```javascript
db.posts.update(
  { title: 'Post Two' },
  {
    $rename: {
      likes: 'views'
    }
  }
)
```

### Delete

```javascript
// Delete one document
db.posts.deleteOne({ title: 'Post Four' })

// Delete many documents
db.posts.deleteMany({ category: 'News' })

// Old method (still works)
db.posts.remove({ title: 'Post Four' })
```

## Querying

### Comparison Operators

```javascript
// Greater than
db.posts.find({ views: { $gt: 2 } })

// Greater than or equal
db.posts.find({ views: { $gte: 7 } })

// Less than
db.posts.find({ views: { $lt: 7 } })

// Less than or equal
db.posts.find({ views: { $lte: 7 } })

// Not equal
db.posts.find({ category: { $ne: 'News' } })
```

### Logical Operators

#### AND

```javascript
db.tours.find({
  price: { $lt: 500 },
  rating: { $gte: 4.8 }
})
```

#### OR

```javascript
db.tours.find({
  $or: [
    { price: { $lt: 500 } },
    { rating: { $gte: 4.8 } }
  ]
})
```

### Projection (Select Specific Fields)

```javascript
// Include only name field (and _id by default)
db.tours.find(
  { price: { $lt: 500 } },
  { name: 1 }
)

// Exclude _id
db.tours.find(
  { price: { $lt: 500 } },
  { name: 1, _id: 0 }
)
```

### Sorting

```javascript
// Ascending
db.posts.find().sort({ title: 1 })

// Descending
db.posts.find().sort({ title: -1 })
```

### Limiting and Counting

```javascript
// Limit results
db.posts.find().limit(2)

// Count documents
db.posts.find().count()
db.posts.find({ category: 'News' }).count()
```

### Chaining

```javascript
db.posts.find()
  .limit(2)
  .sort({ title: 1 })
  .pretty()
```

### Iteration

```javascript
db.posts.find().forEach(function(doc) {
  print("Blog Post: " + doc.title)
})
```

## Advanced Queries

### Sub-Documents

```javascript
// Add sub-documents
db.posts.update(
  { title: 'Post One' },
  {
    $set: {
      comments: [
        {
          body: 'Comment One',
          user: 'Mary Williams',
          date: Date()
        },
        {
          body: 'Comment Two',
          user: 'Harry White',
          date: Date()
        }
      ]
    }
  }
)
```

### Find by Element in Array

```javascript
db.posts.find({
  comments: {
    $elemMatch: {
      user: 'Mary Williams'
    }
  }
})
```

### Text Search

```javascript
// Create text index
db.posts.createIndex({ title: 'text' })

// Search
db.posts.find({
  $text: {
    $search: "\"Post One\""
  }
})
```

## Mongoose Integration

### Install Mongoose

```bash
npm install mongoose dotenv
```

### Connection Code

```javascript
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const mongoose = require("mongoose");

// Mongoose configuration
mongoose.set("strictQuery", false);

const Connect = async () => {
  const url = process.env.DB_URL;

  try {
    await mongoose.connect(url, {
      authSource: process.env.DB_AUTHSOURCE,
      user: process.env.DB_USERNAME,
      pass: process.env.DB_PASSWORD,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Database is connected!");
  } catch (error) {
    console.error(error.stack);
    process.exit(1);
  }
};

Connect();
```

### Environment Variables (config.env)

```env
DB_URL=mongodb://localhost:27017/your_database
DB_AUTHSOURCE=admin
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

**Security Note:** Never commit `config.env` to version control. Add it to `.gitignore`.

## Backup and Restore

### Backup Database

```bash
# Backup specific database
mongodump --host=localhost --port=27017 --db=your_database --out=./backup/

# Backup with authentication
mongodump --host=localhost --port=27017 --username=admin --password=password --authenticationDatabase=admin --db=your_database --out=./backup/

# Backup all databases
mongodump --host=localhost --port=27017 --out=./backup/
```

### Restore Database

```bash
# Restore specific database
mongorestore --host localhost --port 27017 --db your_database ./backup/your_database

# Restore with authentication
mongorestore --host localhost --port 27017 --username myuser --password mypassword --authenticationDatabase admin --db your_database ./backup/your_database

# Restore and drop existing collections
mongorestore --host localhost --port 27017 --db your_database ./backup/your_database --drop
```

## MongoDB Concepts

### MongoDB vs SQL

| MongoDB | SQL |
|---------|-----|
| Database | Database |
| Collection | Table |
| Document | Row |
| Field | Column |

### BSON

- MongoDB uses BSON (Binary JSON) as its data format
- BSON is like JSON but **typed**
- Supports embedded documents
- More efficient for storage and querying

### Example Structure

```
Database: blog
  └── Collection: posts (documents)
  └── Collection: users (documents)

Database: ecommerce
  └── Collection: products (documents)
  └── Collection: orders (documents)
```

## Useful Commands

### Server Management

```bash
# Start MongoDB
sudo systemctl start mongod

# Stop MongoDB
sudo systemctl stop mongod

# Restart MongoDB
sudo systemctl restart mongod

# Check status
sudo systemctl status mongod

# Enable on boot
sudo systemctl enable mongod
```

### Shell Commands

```javascript
// Exit mongo shell
exit

// Shutdown server
db.adminCommand({ shutdown: 1 })

// Get server status
db.serverStatus()

// Get database stats
db.stats()

// Get collection stats
db.posts.stats()
```

## Troubleshooting

### Connection Issues

```bash
# Check if MongoDB is running
sudo systemctl status mongod

# Check MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log

# Check port
sudo netstat -tulpn | grep 27017
```

### Authentication Issues

```bash
# Verify user exists
mongo -u admin -p --authenticationDatabase admin
use admin
db.getUsers()

# Check authorization in config
cat /etc/mongod.conf | grep authorization
```

### Permission Issues

```bash
# Fix MongoDB data directory permissions
sudo chown -R mongodb:mongodb /var/lib/mongodb
sudo chown mongodb:mongodb /tmp/mongodb-27017.sock
```

## Quick Reference

```javascript
// Database
show dbs
use database_name
db.dropDatabase()

// Collections
show collections
db.createCollection('name')
db.collection.drop()

// Insert
db.collection.insertOne({})
db.collection.insertMany([])

// Find
db.collection.find()
db.collection.findOne()
db.collection.find().pretty()

// Update
db.collection.updateOne()
db.collection.updateMany()
db.collection.update()

// Delete
db.collection.deleteOne()
db.collection.deleteMany()
db.collection.remove()

// Count
db.collection.countDocuments()

// Sort
db.collection.find().sort({ field: 1 })  // asc
db.collection.find().sort({ field: -1 }) // desc

// Limit
db.collection.find().limit(5)
```

---

**Related Topics:**
- Mongoose ODM
- MongoDB Atlas (Cloud)
- MongoDB Compass (GUI)
- Aggregation Pipeline
- Indexing Strategies
