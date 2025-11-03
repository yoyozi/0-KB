---
title: "JavaScript Complete Guide"
description: "Comprehensive JavaScript guide covering fundamentals, ES6+, DOM manipulation, async programming, and modern JavaScript patterns"
tags:
  - javascript
  - es6
  - dom
  - async
  - arrays
  - objects
  - functions
  - promises
date: 2024-11-03
lastUpdated: 2024-11-03
---

# JavaScript Complete Guide

Complete guide to modern JavaScript covering fundamentals, ES6+ features, DOM manipulation, and asynchronous programming.

## Table of Contents

- [Basics](#basics)
- [Data Types](#data-types)
- [Operators](#operators)
- [Control Flow](#control-flow)
- [Functions](#functions)
- [Arrays](#arrays)
- [Objects](#objects)
- [DOM Manipulation](#dom-manipulation)
- [Async JavaScript](#async-javascript)
- [ES6+ Features](#es6-features)
- [Best Practices](#best-practices)

## Basics

### Variables

```javascript
// const - cannot be reassigned (preferred)
const name = 'John';

// let - can be reassigned
let age = 30;
age = 31;

// var - old way (avoid)
var city = 'New York';
```

### Comments

```javascript
// Single line comment

/*
  Multi-line
  comment
*/
```

### Console

```javascript
console.log('Hello World');
console.error('Error message');
console.warn('Warning message');
console.table([{name: 'John', age: 30}]);
```

## Data Types

### Primitives

```javascript
// String
const name = 'John';
const greeting = `Hello ${name}`; // Template literal

// Number
const age = 30;
const price = 99.99;

// Boolean
const isActive = true;

// Undefined
let x;
console.log(x); // undefined

// Null
const empty = null;

// BigInt
const bigNumber = 1234567890123456789012345678901234567890n;

// Symbol
const sym = Symbol('description');
```

### Type Checking

```javascript
typeof 'Hello'; // 'string'
typeof 42; // 'number'
typeof true; // 'boolean'
typeof undefined; // 'undefined'
typeof null; // 'object' (JavaScript bug)
typeof {}; // 'object'
typeof []; // 'object'
typeof function(){}; // 'function'
```

### Type Conversion

```javascript
// To String
String(123); // '123'
(123).toString(); // '123'

// To Number
Number('123'); // 123
parseInt('123'); // 123
parseFloat('123.45'); // 123.45
+'123'; // 123

// To Boolean
Boolean(1); // true
Boolean(0); // false
Boolean(''); // false
Boolean('hello'); // true
```

### Truthy and Falsy

```javascript
// Falsy values: false, 0, '', null, undefined, NaN
if (0) { /* won't run */ }
if ('') { /* won't run */ }

// Truthy values: everything else
if (1) { /* will run */ }
if ('hello') { /* will run */ }
if ([]) { /* will run */ }
if ({}) { /* will run */ }
```

## Operators

### Arithmetic

```javascript
let x = 10;
let y = 3;

x + y; // 13
x - y; // 7
x * y; // 30
x / y; // 3.333...
x % y; // 1 (remainder)
x ** y; // 1000 (exponentiation)

x++; // 11 (increment)
x--; // 10 (decrement)
```

### Comparison

```javascript
// Equality
5 == '5'; // true (loose equality)
5 === '5'; // false (strict equality)
5 != '5'; // false
5 !== '5'; // true

// Comparison
5 > 3; // true
5 < 3; // false
5 >= 5; // true
5 <= 3; // false
```

### Logical

```javascript
// AND
true && true; // true
true && false; // false

// OR
true || false; // true
false || false; // false

// NOT
!true; // false
!false; // true

// Nullish Coalescing
null ?? 'default'; // 'default'
0 ?? 'default'; // 0
'' ?? 'default'; // ''
```

### Short-Circuit Evaluation

```javascript
// OR returns first truthy value
const name = '' || 'Guest'; // 'Guest'

// AND returns first falsy value or last value
const user = isLoggedIn && getUserData();

// Nullish coalescing for 0 and ''
const count = 0 ?? 10; // 0
```

## Control Flow

### If/Else

```javascript
const age = 18;

if (age >= 18) {
  console.log('Adult');
} else if (age >= 13) {
  console.log('Teenager');
} else {
  console.log('Child');
}

// Ternary operator
const status = age >= 18 ? 'Adult' : 'Minor';
```

### Switch

```javascript
const day = 'Monday';

switch (day) {
  case 'Monday':
    console.log('Start of week');
    break;
  case 'Friday':
    console.log('End of week');
    break;
  default:
    console.log('Midweek');
}
```

### Loops

```javascript
// For loop
for (let i = 0; i < 5; i++) {
  console.log(i);
}

// While loop
let i = 0;
while (i < 5) {
  console.log(i);
  i++;
}

// Do-while loop
let j = 0;
do {
  console.log(j);
  j++;
} while (j < 5);

// For...of (arrays)
const arr = [1, 2, 3];
for (const num of arr) {
  console.log(num);
}

// For...in (objects)
const obj = {a: 1, b: 2};
for (const key in obj) {
  console.log(key, obj[key]);
}
```

## Functions

### Function Declaration

```javascript
function greet(name) {
  return `Hello, ${name}!`;
}

greet('John'); // 'Hello, John!'
```

### Function Expression

```javascript
const greet = function(name) {
  return `Hello, ${name}!`;
};
```

### Arrow Functions

```javascript
// Basic
const greet = (name) => {
  return `Hello, ${name}!`;
};

// Implicit return
const greet = name => `Hello, ${name}!`;

// Multiple parameters
const add = (a, b) => a + b;

// No parameters
const sayHi = () => 'Hi!';
```

### Default Parameters

```javascript
function greet(name = 'Guest') {
  return `Hello, ${name}!`;
}

greet(); // 'Hello, Guest!'
greet('John'); // 'Hello, John!'
```

### Rest Parameters

```javascript
function sum(...numbers) {
  return numbers.reduce((total, num) => total + num, 0);
}

sum(1, 2, 3, 4); // 10
```

### Higher-Order Functions

```javascript
// Function that returns a function
function multiplier(factor) {
  return function(number) {
    return number * factor;
  };
}

const double = multiplier(2);
double(5); // 10

// Function that takes a function
function applyOperation(a, b, operation) {
  return operation(a, b);
}

applyOperation(5, 3, (x, y) => x + y); // 8
```

### Closures

```javascript
function counter() {
  let count = 0;
  
  return {
    increment: () => ++count,
    decrement: () => --count,
    getCount: () => count
  };
}

const myCounter = counter();
myCounter.increment(); // 1
myCounter.increment(); // 2
myCounter.getCount(); // 2
```

## Arrays

### Creating Arrays

```javascript
const arr1 = [1, 2, 3];
const arr2 = new Array(1, 2, 3);
const arr3 = Array.of(1, 2, 3);
const arr4 = Array.from('hello'); // ['h', 'e', 'l', 'l', 'o']
```

### Array Methods

```javascript
const numbers = [1, 2, 3, 4, 5];

// Add/Remove
numbers.push(6); // Add to end
numbers.pop(); // Remove from end
numbers.unshift(0); // Add to start
numbers.shift(); // Remove from start

// Slice (non-destructive)
numbers.slice(1, 3); // [2, 3]

// Splice (destructive)
numbers.splice(1, 2); // Remove 2 items at index 1

// Find
numbers.indexOf(3); // 2
numbers.includes(3); // true
numbers.find(n => n > 3); // 4
numbers.findIndex(n => n > 3); // 3

// Transform
numbers.map(n => n * 2); // [2, 4, 6, 8, 10]
numbers.filter(n => n > 2); // [3, 4, 5]
numbers.reduce((sum, n) => sum + n, 0); // 15

// Iterate
numbers.forEach(n => console.log(n));

// Sort
numbers.sort((a, b) => a - b); // Ascending
numbers.sort((a, b) => b - a); // Descending

// Other
numbers.reverse();
numbers.concat([6, 7]);
numbers.join(', '); // '1, 2, 3, 4, 5'
```

### Destructuring

```javascript
const [first, second, ...rest] = [1, 2, 3, 4, 5];
// first = 1, second = 2, rest = [3, 4, 5]

// Skip elements
const [a, , c] = [1, 2, 3];
// a = 1, c = 3
```

### Spread Operator

```javascript
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];

// Combine arrays
const combined = [...arr1, ...arr2]; // [1, 2, 3, 4, 5, 6]

// Copy array
const copy = [...arr1];

// Function arguments
Math.max(...arr1); // 3
```

## Objects

### Creating Objects

```javascript
// Object literal
const person = {
  name: 'John',
  age: 30,
  greet() {
    return `Hello, I'm ${this.name}`;
  }
};

// Constructor
function Person(name, age) {
  this.name = name;
  this.age = age;
}

const john = new Person('John', 30);

// Object.create
const proto = {greet() { return 'Hello'; }};
const obj = Object.create(proto);
```

### Accessing Properties

```javascript
const person = {name: 'John', age: 30};

// Dot notation
person.name; // 'John'

// Bracket notation
person['age']; // 30

// Dynamic property
const prop = 'name';
person[prop]; // 'John'
```

### Object Methods

```javascript
const obj = {a: 1, b: 2, c: 3};

// Keys, values, entries
Object.keys(obj); // ['a', 'b', 'c']
Object.values(obj); // [1, 2, 3]
Object.entries(obj); // [['a', 1], ['b', 2], ['c', 3]]

// Assign (merge objects)
Object.assign({}, obj, {d: 4}); // {a: 1, b: 2, c: 3, d: 4}

// Freeze
Object.freeze(obj); // Make immutable
```

### Destructuring

```javascript
const person = {name: 'John', age: 30, city: 'NYC'};

// Basic
const {name, age} = person;

// Rename
const {name: fullName} = person;

// Default values
const {country = 'USA'} = person;

// Rest
const {name, ...rest} = person;
// rest = {age: 30, city: 'NYC'}
```

### Spread Operator

```javascript
const obj1 = {a: 1, b: 2};
const obj2 = {c: 3, d: 4};

// Merge objects
const merged = {...obj1, ...obj2}; // {a: 1, b: 2, c: 3, d: 4}

// Copy object
const copy = {...obj1};

// Override properties
const updated = {...obj1, b: 10}; // {a: 1, b: 10}
```

### This Keyword

```javascript
const person = {
  name: 'John',
  greet() {
    console.log(`Hello, I'm ${this.name}`);
  },
  // Arrow function doesn't have own 'this'
  greetArrow: () => {
    console.log(this); // Window or undefined
  }
};

person.greet(); // 'Hello, I'm John'
```

## DOM Manipulation

### Selecting Elements

```javascript
// Single element
document.getElementById('myId');
document.querySelector('.myClass');
document.querySelector('#myId');

// Multiple elements
document.getElementsByClassName('myClass');
document.getElementsByTagName('div');
document.querySelectorAll('.myClass');
```

### Modifying Elements

```javascript
const el = document.querySelector('#myId');

// Content
el.textContent = 'New text';
el.innerHTML = '<strong>Bold text</strong>';

// Attributes
el.getAttribute('href');
el.setAttribute('href', 'https://example.com');
el.removeAttribute('href');

// Classes
el.classList.add('active');
el.classList.remove('active');
el.classList.toggle('active');
el.classList.contains('active');

// Styles
el.style.color = 'red';
el.style.backgroundColor = 'blue';
```

### Creating Elements

```javascript
// Create
const div = document.createElement('div');
div.textContent = 'Hello';
div.classList.add('myClass');

// Append
document.body.appendChild(div);
document.body.append(div); // Can append multiple
document.body.prepend(div);

// Insert
el.insertAdjacentHTML('beforeend', '<p>Text</p>');

// Remove
div.remove();
```

### Event Listeners

```javascript
const button = document.querySelector('#myButton');

// Add event listener
button.addEventListener('click', function(e) {
  console.log('Clicked!');
  console.log(e.target); // Element that was clicked
});

// Remove event listener
function handleClick() {
  console.log('Clicked!');
}
button.addEventListener('click', handleClick);
button.removeEventListener('click', handleClick);

// Event delegation
document.body.addEventListener('click', function(e) {
  if (e.target.matches('.myClass')) {
    console.log('Clicked element with myClass');
  }
});
```

### Common Events

```javascript
// Mouse events
el.addEventListener('click', handler);
el.addEventListener('dblclick', handler);
el.addEventListener('mouseenter', handler);
el.addEventListener('mouseleave', handler);

// Keyboard events
el.addEventListener('keydown', handler);
el.addEventListener('keyup', handler);
el.addEventListener('keypress', handler);

// Form events
el.addEventListener('submit', handler);
el.addEventListener('input', handler);
el.addEventListener('change', handler);
el.addEventListener('focus', handler);
el.addEventListener('blur', handler);

// Window events
window.addEventListener('load', handler);
window.addEventListener('resize', handler);
window.addEventListener('scroll', handler);
```

## Async JavaScript

### Callbacks

```javascript
function fetchData(callback) {
  setTimeout(() => {
    callback('Data loaded');
  }, 1000);
}

fetchData((data) => {
  console.log(data);
});
```

### Promises

```javascript
// Creating a promise
const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    const success = true;
    if (success) {
      resolve('Success!');
    } else {
      reject('Error!');
    }
  }, 1000);
});

// Consuming a promise
promise
  .then(result => console.log(result))
  .catch(error => console.error(error))
  .finally(() => console.log('Done'));

// Chaining promises
fetch('https://api.example.com/data')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));
```

### Async/Await

```javascript
async function fetchData() {
  try {
    const response = await fetch('https://api.example.com/data');
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

fetchData();

// Multiple async operations
async function fetchMultiple() {
  const [data1, data2] = await Promise.all([
    fetch('url1').then(r => r.json()),
    fetch('url2').then(r => r.json())
  ]);
}
```

### Fetch API

```javascript
// GET request
fetch('https://api.example.com/data')
  .then(response => response.json())
  .then(data => console.log(data));

// POST request
fetch('https://api.example.com/data', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({name: 'John', age: 30})
})
  .then(response => response.json())
  .then(data => console.log(data));

// With async/await
async function postData() {
  const response = await fetch('https://api.example.com/data', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({name: 'John'})
  });
  const data = await response.json();
  return data;
}
```

## ES6+ Features

### Template Literals

```javascript
const name = 'John';
const age = 30;

// String interpolation
const greeting = `Hello, ${name}! You are ${age} years old.`;

// Multi-line strings
const multiline = `
  Line 1
  Line 2
  Line 3
`;

// Expression evaluation
const result = `2 + 2 = ${2 + 2}`;
```

### Destructuring

```javascript
// Array destructuring
const [a, b, c] = [1, 2, 3];

// Object destructuring
const {name, age} = {name: 'John', age: 30};

// Function parameters
function greet({name, age}) {
  console.log(`${name} is ${age}`);
}
```

### Classes

```javascript
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
  
  greet() {
    return `Hello, I'm ${this.name}`;
  }
  
  static species() {
    return 'Homo sapiens';
  }
}

class Employee extends Person {
  constructor(name, age, job) {
    super(name, age);
    this.job = job;
  }
  
  work() {
    return `${this.name} is working as ${this.job}`;
  }
}

const john = new Employee('John', 30, 'Developer');
```

### Modules

```javascript
// Export
export const name = 'John';
export function greet() { return 'Hello'; }
export default class Person {}

// Import
import Person, { name, greet } from './module.js';
import * as Utils from './utils.js';
```

### Optional Chaining

```javascript
const user = {
  name: 'John',
  address: {
    city: 'NYC'
  }
};

// Safe property access
user?.address?.city; // 'NYC'
user?.phone?.number; // undefined (no error)

// Safe method call
user?.greet?.(); // undefined (no error)

// Safe array access
const arr = [1, 2, 3];
arr?.[0]; // 1
```

## Best Practices

1. **Use const by default** - Only use let when reassignment is needed
2. **Use strict equality** - Always use `===` instead of `==`
3. **Use arrow functions** - For cleaner syntax and lexical this
4. **Use template literals** - For string interpolation
5. **Use destructuring** - For cleaner code
6. **Use async/await** - Instead of promise chains
7. **Handle errors** - Always use try/catch with async/await
8. **Use meaningful names** - Variables and functions should be descriptive
9. **Keep functions small** - One function, one purpose
10. **Avoid global variables** - Use modules and closures

---

**Related Topics:**
- TypeScript
- Node.js
- React
- Modern JavaScript Frameworks
- Testing with Jest
