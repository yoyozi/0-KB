---
title: "TypeScript Complete Guide"
description: "Comprehensive guide to TypeScript including types, interfaces, classes, generics, and integration with React and Node.js"
tags:
  - typescript
  - javascript
  - types
  - interfaces
  - classes
  - generics
  - react
  - nodejs
date: 2024-11-03
lastUpdated: 2024-11-03
---

# TypeScript Complete Guide

Complete guide to TypeScript - a typed superset of JavaScript that compiles to plain JavaScript.

## Table of Contents

- [Introduction](#introduction)
- [Setup and Configuration](#setup-and-configuration)
- [Basic Types](#basic-types)
- [Advanced Types](#advanced-types)
- [Functions](#functions)
- [Interfaces](#interfaces)
- [Classes](#classes)
- [Generics](#generics)
- [Type Assertions](#type-assertions)
- [Utility Types](#utility-types)
- [TypeScript with React](#typescript-with-react)
- [TypeScript with Node.js](#typescript-with-nodejs)
- [Best Practices](#best-practices)

## Introduction

TypeScript adds static typing to JavaScript, providing better tooling, error detection, and code documentation.

### Key Benefits

- **Type Safety** - Catch errors at compile time
- **Better IDE Support** - Autocomplete and IntelliSense
- **Code Documentation** - Types serve as documentation
- **Refactoring** - Safer code refactoring
- **Modern JavaScript** - Use latest JS features

## Setup and Configuration

### Installation

```bash
# Global installation
npm install -g typescript

# Check version
tsc -v

# Project installation
npm install --save-dev typescript
```

### Initialize TypeScript

```bash
# Create tsconfig.json
tsc --init
```

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES6",
    "module": "commonjs",
    "lib": ["ES6", "DOM"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### Compile TypeScript

```bash
# Compile single file
tsc index.ts

# Compile all files
tsc

# Watch mode
tsc --watch

# Compile with specific config
tsc --project tsconfig.json
```

## Basic Types

### Primitive Types

```typescript
// Number
let age: number = 30;
let price: number = 99.99;

// String
let firstName: string = 'John';
let message: string = `Hello, ${firstName}`;

// Boolean
let isActive: boolean = true;
let isComplete: boolean = false;

// Any (avoid when possible)
let data: any = 'Hello';
data = 42;
data = true;

// Unknown (safer than any)
let value: unknown = 'Hello';
if (typeof value === 'string') {
  console.log(value.toUpperCase());
}

// Void
function logMessage(message: string): void {
  console.log(message);
}

// Null and Undefined
let n: null = null;
let u: undefined = undefined;

// Never (function never returns)
function throwError(message: string): never {
  throw new Error(message);
}
```

### Arrays

```typescript
// Array of numbers
let numbers: number[] = [1, 2, 3, 4, 5];

// Array of strings
let names: string[] = ['John', 'Jane', 'Bob'];

// Generic array syntax
let scores: Array<number> = [90, 85, 88];

// Mixed types
let mixed: any[] = ['Hello', 42, true];

// Readonly array
let readonlyNumbers: readonly number[] = [1, 2, 3];
```

### Tuples

```typescript
// Fixed-length array with specific types
let person: [number, string, boolean] = [1, 'John', true];

// Tuple array
let employees: [number, string][] = [
  [1, 'John'],
  [2, 'Jane'],
  [3, 'Bob']
];

// Optional tuple elements
let point: [number, number, string?] = [10, 20];
```

### Enums

```typescript
// Numeric enum
enum Direction {
  Up,      // 0
  Down,    // 1
  Left,    // 2
  Right    // 3
}

let dir: Direction = Direction.Up;
console.log(dir); // 0

// String enum
enum Status {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
  Pending = 'PENDING'
}

let status: Status = Status.Active;
console.log(status); // 'ACTIVE'

// Const enum (more efficient)
const enum Color {
  Red = '#FF0000',
  Green = '#00FF00',
  Blue = '#0000FF'
}

let color: Color = Color.Red;
```

## Advanced Types

### Union Types

```typescript
// Variable can be multiple types
let id: number | string;
id = 123;
id = 'ABC123';

// Function parameter
function printId(id: number | string) {
  console.log(`ID: ${id}`);
}

// Array with union
let data: (number | string)[] = [1, 'two', 3, 'four'];
```

### Intersection Types

```typescript
interface Person {
  name: string;
  age: number;
}

interface Employee {
  employeeId: number;
  department: string;
}

type Staff = Person & Employee;

const staff: Staff = {
  name: 'John',
  age: 30,
  employeeId: 12345,
  department: 'IT'
};
```

### Literal Types

```typescript
// String literal
let direction: 'left' | 'right' | 'up' | 'down';
direction = 'left'; // OK
// direction = 'forward'; // Error

// Numeric literal
let diceRoll: 1 | 2 | 3 | 4 | 5 | 6;

// Boolean literal
let isTrue: true = true;
```

### Type Aliases

```typescript
// Simple alias
type ID = number | string;

// Object type
type User = {
  id: ID;
  name: string;
  email: string;
  age?: number; // Optional
};

const user: User = {
  id: 1,
  name: 'John',
  email: 'john@example.com'
};

// Function type
type MathOperation = (a: number, b: number) => number;

const add: MathOperation = (a, b) => a + b;
const subtract: MathOperation = (a, b) => a - b;
```

## Functions

### Function Types

```typescript
// Named function
function add(x: number, y: number): number {
  return x + y;
}

// Arrow function
const multiply = (x: number, y: number): number => x * y;

// Optional parameters
function greet(name: string, greeting?: string): string {
  return `${greeting || 'Hello'}, ${name}`;
}

// Default parameters
function power(base: number, exponent: number = 2): number {
  return Math.pow(base, exponent);
}

// Rest parameters
function sum(...numbers: number[]): number {
  return numbers.reduce((total, n) => total + n, 0);
}
```

### Function Overloads

```typescript
function combine(a: string, b: string): string;
function combine(a: number, b: number): number;
function combine(a: any, b: any): any {
  return a + b;
}

console.log(combine('Hello', ' World')); // 'Hello World'
console.log(combine(5, 10)); // 15
```

## Interfaces

### Basic Interface

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  age?: number; // Optional
  readonly createdAt: Date; // Readonly
}

const user: User = {
  id: 1,
  name: 'John',
  email: 'john@example.com',
  createdAt: new Date()
};

// user.createdAt = new Date(); // Error: readonly
```

### Interface Methods

```typescript
interface Calculator {
  add(a: number, b: number): number;
  subtract(a: number, b: number): number;
}

const calc: Calculator = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b
};
```

### Extending Interfaces

```typescript
interface Person {
  name: string;
  age: number;
}

interface Employee extends Person {
  employeeId: number;
  department: string;
}

const employee: Employee = {
  name: 'John',
  age: 30,
  employeeId: 12345,
  department: 'IT'
};
```

### Interface vs Type

```typescript
// Interface - can be extended
interface Animal {
  name: string;
}

interface Dog extends Animal {
  breed: string;
}

// Type - uses intersection
type Animal2 = {
  name: string;
};

type Dog2 = Animal2 & {
  breed: string;
};

// Use interface for objects, type for unions/primitives
```

## Classes

### Basic Class

```typescript
class Person {
  // Properties
  private id: number;
  public name: string;
  protected age: number;

  // Constructor
  constructor(id: number, name: string, age: number) {
    this.id = id;
    this.name = name;
    this.age = age;
  }

  // Method
  greet(): string {
    return `Hello, I'm ${this.name}`;
  }
}

const person = new Person(1, 'John', 30);
console.log(person.greet());
// console.log(person.id); // Error: private
```

### Constructor Shorthand

```typescript
class User {
  constructor(
    private id: number,
    public name: string,
    protected email: string
  ) {}

  getInfo(): string {
    return `${this.name} (${this.email})`;
  }
}
```

### Inheritance

```typescript
class Animal {
  constructor(public name: string) {}

  move(distance: number): void {
    console.log(`${this.name} moved ${distance}m`);
  }
}

class Dog extends Animal {
  constructor(name: string, public breed: string) {
    super(name);
  }

  bark(): void {
    console.log('Woof! Woof!');
  }
}

const dog = new Dog('Buddy', 'Golden Retriever');
dog.move(10);
dog.bark();
```

### Abstract Classes

```typescript
abstract class Shape {
  constructor(public color: string) {}

  abstract area(): number;

  describe(): string {
    return `A ${this.color} shape with area ${this.area()}`;
  }
}

class Circle extends Shape {
  constructor(color: string, public radius: number) {
    super(color);
  }

  area(): number {
    return Math.PI * this.radius ** 2;
  }
}

const circle = new Circle('red', 5);
console.log(circle.describe());
```

### Implementing Interfaces

```typescript
interface Printable {
  print(): void;
}

interface Saveable {
  save(): void;
}

class Document implements Printable, Saveable {
  constructor(public content: string) {}

  print(): void {
    console.log(this.content);
  }

  save(): void {
    console.log('Saving document...');
  }
}
```

## Generics

### Generic Functions

```typescript
// Generic function
function identity<T>(arg: T): T {
  return arg;
}

let output1 = identity<string>('Hello');
let output2 = identity<number>(42);

// Generic array function
function getArray<T>(items: T[]): T[] {
  return new Array<T>().concat(items);
}

let numArray = getArray<number>([1, 2, 3]);
let strArray = getArray<string>(['a', 'b', 'c']);
```

### Generic Interfaces

```typescript
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

interface User {
  id: number;
  name: string;
}

const response: ApiResponse<User> = {
  data: { id: 1, name: 'John' },
  status: 200,
  message: 'Success'
};
```

### Generic Classes

```typescript
class DataStore<T> {
  private data: T[] = [];

  add(item: T): void {
    this.data.push(item);
  }

  getAll(): T[] {
    return this.data;
  }

  find(predicate: (item: T) => boolean): T | undefined {
    return this.data.find(predicate);
  }
}

const numberStore = new DataStore<number>();
numberStore.add(1);
numberStore.add(2);

const stringStore = new DataStore<string>();
stringStore.add('hello');
stringStore.add('world');
```

### Generic Constraints

```typescript
interface Lengthwise {
  length: number;
}

function logLength<T extends Lengthwise>(arg: T): void {
  console.log(arg.length);
}

logLength('Hello'); // OK
logLength([1, 2, 3]); // OK
// logLength(42); // Error: number doesn't have length
```

## Type Assertions

### As Syntax

```typescript
let someValue: unknown = 'Hello World';
let strLength: number = (someValue as string).length;

// DOM example
const input = document.getElementById('email') as HTMLInputElement;
input.value = 'test@example.com';
```

### Angle Bracket Syntax

```typescript
let someValue: unknown = 'Hello World';
let strLength: number = (<string>someValue).length;
```

### Non-null Assertion

```typescript
function getValue(key: string): string | null {
  return key === 'name' ? 'John' : null;
}

// Tell TypeScript this won't be null
let name = getValue('name')!;
console.log(name.toUpperCase());
```

## Utility Types

### Partial

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

// All properties optional
type PartialUser = Partial<User>;

function updateUser(id: number, updates: Partial<User>) {
  // Update only provided fields
}

updateUser(1, { name: 'Jane' });
```

### Required

```typescript
interface User {
  id?: number;
  name?: string;
}

// All properties required
type RequiredUser = Required<User>;
```

### Readonly

```typescript
interface User {
  id: number;
  name: string;
}

const user: Readonly<User> = {
  id: 1,
  name: 'John'
};

// user.name = 'Jane'; // Error: readonly
```

### Pick and Omit

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

// Pick specific properties
type UserPreview = Pick<User, 'id' | 'name'>;

// Omit specific properties
type UserWithoutPassword = Omit<User, 'password'>;
```

### Record

```typescript
type Role = 'admin' | 'user' | 'guest';

const permissions: Record<Role, string[]> = {
  admin: ['read', 'write', 'delete'],
  user: ['read', 'write'],
  guest: ['read']
};
```

## TypeScript with React

### Function Component

```typescript
import React from 'react';

interface Props {
  title: string;
  count: number;
  onIncrement: () => void;
}

const Counter: React.FC<Props> = ({ title, count, onIncrement }) => {
  return (
    <div>
      <h2>{title}</h2>
      <p>Count: {count}</p>
      <button onClick={onIncrement}>Increment</button>
    </div>
  );
};

export default Counter;
```

### useState Hook

```typescript
import { useState } from 'react';

function App() {
  const [count, setCount] = useState<number>(0);
  const [user, setUser] = useState<User | null>(null);
  
  return <div>Count: {count}</div>;
}
```

### useRef Hook

```typescript
import { useRef } from 'react';

function TextInput() {
  const inputRef = useRef<HTMLInputElement>(null);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  return <input ref={inputRef} />;
}
```

### Event Handlers

```typescript
function Form() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log('Clicked');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input onChange={handleChange} />
      <button onClick={handleClick}>Submit</button>
    </form>
  );
}
```

## TypeScript with Node.js

### Express Setup

```typescript
import express, { Request, Response, NextFunction } from 'express';

const app = express();

app.get('/users/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  res.json({ id });
});

app.post('/users', (req: Request, res: Response) => {
  const user = req.body;
  res.status(201).json(user);
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

### Custom Types

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

interface ApiResponse<T> {
  data: T;
  message: string;
}

app.get('/users', async (req: Request, res: Response<ApiResponse<User[]>>) => {
  const users: User[] = await getUsers();
  res.json({
    data: users,
    message: 'Success'
  });
});
```

## Best Practices

1. **Enable Strict Mode** - Use `"strict": true` in tsconfig.json
2. **Avoid Any** - Use `unknown` or specific types instead
3. **Use Interfaces for Objects** - Better for extending
4. **Use Type for Unions** - More flexible for complex types
5. **Leverage Type Inference** - Let TypeScript infer when obvious
6. **Use Readonly** - Prevent accidental mutations
7. **Use Const Assertions** - `as const` for literal types
8. **Organize Types** - Keep types in separate files
9. **Use Utility Types** - Leverage built-in utility types
10. **Document Complex Types** - Add JSDoc comments

---

**Related Topics:**
- TypeScript with Next.js
- TypeScript Decorators
- Advanced TypeScript Patterns
- Type Guards
- Conditional Types
