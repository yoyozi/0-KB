---
title: "React Complete Guide"
description: "Comprehensive guide to React including components, hooks, state management, routing, forms, performance optimization, and best practices"
tags:
  - react
  - javascript
  - hooks
  - components
  - jsx
  - state-management
  - frontend
  - ui
date: 2024-11-03
lastUpdated: 2024-11-03
---

# React Complete Guide

Complete guide to building modern web applications with React.

## Table of Contents

- [Introduction](#introduction)
- [Setup and Installation](#setup-and-installation)
- [JSX Basics](#jsx-basics)
- [Components](#components)
- [Props](#props)
- [State and Hooks](#state-and-hooks)
- [Event Handling](#event-handling)
- [Conditional Rendering](#conditional-rendering)
- [Lists and Keys](#lists-and-keys)
- [Forms](#forms)
- [Lifecycle and Effects](#lifecycle-and-effects)
- [Context API](#context-api)
- [React Router](#react-router)
- [Performance Optimization](#performance-optimization)
- [Best Practices](#best-practices)

## Introduction

React is a JavaScript library for building user interfaces, particularly single-page applications.

### Key Features

- **Component-Based** - Build encapsulated components
- **Declarative** - Design simple views for each state
- **Learn Once, Write Anywhere** - React Native for mobile
- **Virtual DOM** - Efficient updates and rendering
- **One-Way Data Flow** - Predictable data management

## Setup and Installation

### Create React App

```bash
# Create new React app
npx create-react-app my-app
cd my-app
npm start
```

### Vite (Faster Alternative)

```bash
# Create with Vite
npm create vite@latest my-app -- --template react
cd my-app
npm install
npm run dev
```

### Project Structure

```
my-app/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   ├── App.js
│   ├── App.css
│   └── index.js
├── package.json
└── README.md
```

## JSX Basics

JSX is a syntax extension for JavaScript that looks like HTML.

### Basic JSX

```jsx
function App() {
  const name = 'John';
  const isLoggedIn = true;

  return (
    <div className="container">
      <h1>Hello, {name}!</h1>
      <p>2 + 2 = {2 + 2}</p>
      <p>{isLoggedIn ? 'Welcome back!' : 'Please log in'}</p>
    </div>
  );
}
```

### JSX Rules

1. **Single Parent Element** - Must return one root element
2. **className** - Use `className` instead of `class`
3. **camelCase** - Use camelCase for attributes (`onClick`, `onChange`)
4. **Self-Closing Tags** - Must close all tags (`<img />`, `<input />`)
5. **JavaScript Expressions** - Use `{}` for JavaScript

### Fragments

```jsx
// Using Fragment
import { Fragment } from 'react';

function App() {
  return (
    <Fragment>
      <h1>Title</h1>
      <p>Paragraph</p>
    </Fragment>
  );
}

// Short syntax
function App() {
  return (
    <>
      <h1>Title</h1>
      <p>Paragraph</p>
    </>
  );
}
```

## Components

### Functional Components

```jsx
// Basic functional component
function Welcome() {
  return <h1>Hello, World!</h1>;
}

// Arrow function component
const Welcome = () => {
  return <h1>Hello, World!</h1>;
};

// Implicit return
const Welcome = () => <h1>Hello, World!</h1>;
```

### Component with Props

```jsx
function Greeting({ name, age }) {
  return (
    <div>
      <h1>Hello, {name}!</h1>
      <p>You are {age} years old.</p>
    </div>
  );
}

// Usage
<Greeting name="John" age={30} />
```

### Component File Structure

```jsx
// components/Button.jsx
import './Button.css';

function Button({ children, onClick, variant = 'primary' }) {
  return (
    <button 
      className={`btn btn-${variant}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;
```

## Props

Props are arguments passed to components.

### Passing Props

```jsx
function App() {
  return (
    <div>
      <User name="John" age={30} isAdmin={true} />
      <User name="Jane" age={25} isAdmin={false} />
    </div>
  );
}

function User({ name, age, isAdmin }) {
  return (
    <div>
      <h2>{name}</h2>
      <p>Age: {age}</p>
      {isAdmin && <span>Admin</span>}
    </div>
  );
}
```

### Default Props

```jsx
function Button({ text = 'Click me', color = 'blue' }) {
  return <button style={{ color }}>{text}</button>;
}

// Or using defaultProps
Button.defaultProps = {
  text: 'Click me',
  color: 'blue'
};
```

### Children Prop

```jsx
function Card({ children }) {
  return (
    <div className="card">
      {children}
    </div>
  );
}

// Usage
<Card>
  <h2>Title</h2>
  <p>Content goes here</p>
</Card>
```

### PropTypes

```jsx
import PropTypes from 'prop-types';

function User({ name, age, email }) {
  return <div>{name} - {email}</div>;
}

User.propTypes = {
  name: PropTypes.string.isRequired,
  age: PropTypes.number,
  email: PropTypes.string.isRequired
};
```

## State and Hooks

### useState Hook

```jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
      <button onClick={() => setCount(count - 1)}>
        Decrement
      </button>
      <button onClick={() => setCount(0)}>
        Reset
      </button>
    </div>
  );
}
```

### Multiple State Variables

```jsx
function Form() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState(0);

  return (
    <form>
      <input 
        value={name} 
        onChange={(e) => setName(e.target.value)} 
      />
      <input 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
      />
      <input 
        type="number"
        value={age} 
        onChange={(e) => setAge(Number(e.target.value))} 
      />
    </form>
  );
}
```

### State with Objects

```jsx
function UserForm() {
  const [user, setUser] = useState({
    name: '',
    email: '',
    age: 0
  });

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value
    });
  };

  return (
    <form>
      <input 
        name="name"
        value={user.name} 
        onChange={handleChange} 
      />
      <input 
        name="email"
        value={user.email} 
        onChange={handleChange} 
      />
    </form>
  );
}
```

### State with Arrays

```jsx
function TodoList() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');

  const addTodo = () => {
    setTodos([...todos, { id: Date.now(), text: input }]);
    setInput('');
  };

  const removeTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div>
      <input 
        value={input} 
        onChange={(e) => setInput(e.target.value)} 
      />
      <button onClick={addTodo}>Add</button>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            {todo.text}
            <button onClick={() => removeTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

## Event Handling

### Basic Events

```jsx
function EventExample() {
  const handleClick = () => {
    console.log('Button clicked!');
  };

  const handleChange = (e) => {
    console.log('Input value:', e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted!');
  };

  return (
    <div>
      <button onClick={handleClick}>Click Me</button>
      <input onChange={handleChange} />
      <form onSubmit={handleSubmit}>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
```

### Passing Arguments

```jsx
function ButtonList() {
  const handleClick = (id, name) => {
    console.log(`Clicked ${name} with id ${id}`);
  };

  return (
    <div>
      <button onClick={() => handleClick(1, 'Button 1')}>
        Button 1
      </button>
      <button onClick={() => handleClick(2, 'Button 2')}>
        Button 2
      </button>
    </div>
  );
}
```

## Conditional Rendering

### If/Else

```jsx
function Greeting({ isLoggedIn }) {
  if (isLoggedIn) {
    return <h1>Welcome back!</h1>;
  }
  return <h1>Please sign in.</h1>;
}
```

### Ternary Operator

```jsx
function Greeting({ isLoggedIn }) {
  return (
    <div>
      {isLoggedIn ? (
        <h1>Welcome back!</h1>
      ) : (
        <h1>Please sign in.</h1>
      )}
    </div>
  );
}
```

### Logical AND (&&)

```jsx
function Mailbox({ unreadMessages }) {
  return (
    <div>
      <h1>Hello!</h1>
      {unreadMessages.length > 0 && (
        <h2>You have {unreadMessages.length} unread messages.</h2>
      )}
    </div>
  );
}
```

## Lists and Keys

### Rendering Lists

```jsx
function UserList() {
  const users = [
    { id: 1, name: 'John', age: 30 },
    { id: 2, name: 'Jane', age: 25 },
    { id: 3, name: 'Bob', age: 35 }
  ];

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>
          {user.name} - {user.age} years old
        </li>
      ))}
    </ul>
  );
}
```

### Keys

Keys help React identify which items have changed.

```jsx
// Good - using unique ID
{items.map(item => (
  <div key={item.id}>{item.name}</div>
))}

// Bad - using index (only if no unique ID)
{items.map((item, index) => (
  <div key={index}>{item.name}</div>
))}
```

## Forms

### Controlled Components

```jsx
function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form data:', formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
      />
      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Password"
      />
      <button type="submit">Login</button>
    </form>
  );
}
```

### Form Validation

```jsx
function SignupForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!email.includes('@')) {
      setError('Invalid email address');
      return;
    }
    
    setError('');
    // Submit form
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit">Sign Up</button>
    </form>
  );
}
```

## Lifecycle and Effects

### useEffect Hook

```jsx
import { useState, useEffect } from 'react';

function DataFetcher() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Runs after component mounts
    fetch('https://api.example.com/data')
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      });
  }, []); // Empty array = run once on mount

  if (loading) return <div>Loading...</div>;

  return (
    <ul>
      {data.map(item => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}
```

### Effect with Dependencies

```jsx
function SearchResults({ query }) {
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (query) {
      fetch(`https://api.example.com/search?q=${query}`)
        .then(res => res.json())
        .then(data => setResults(data));
    }
  }, [query]); // Runs when query changes

  return (
    <ul>
      {results.map(result => (
        <li key={result.id}>{result.title}</li>
      ))}
    </ul>
  );
}
```

### Cleanup Function

```jsx
function Timer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);

    // Cleanup function
    return () => clearInterval(interval);
  }, []);

  return <div>Seconds: {seconds}</div>;
}
```

## Context API

Share data across components without prop drilling.

### Create Context

```jsx
import { createContext, useState, useContext } from 'react';

// Create context
const ThemeContext = createContext();

// Provider component
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook
function useTheme() {
  return useContext(ThemeContext);
}

// Usage
function App() {
  return (
    <ThemeProvider>
      <Header />
      <Content />
    </ThemeProvider>
  );
}

function Header() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <header className={theme}>
      <button onClick={toggleTheme}>
        Toggle Theme
      </button>
    </header>
  );
}
```

## React Router

### Installation

```bash
npm install react-router-dom
```

### Basic Routing

```jsx
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### Dynamic Routes

```jsx
import { useParams } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path="/users/:id" element={<UserProfile />} />
    </Routes>
  );
}

function UserProfile() {
  const { id } = useParams();
  
  return <div>User ID: {id}</div>;
}
```

### Programmatic Navigation

```jsx
import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Login logic
    navigate('/dashboard');
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

## Performance Optimization

### React.memo

```jsx
import { memo } from 'react';

const ExpensiveComponent = memo(function ExpensiveComponent({ data }) {
  // Only re-renders if data changes
  return <div>{data}</div>;
});
```

### useMemo

```jsx
import { useMemo } from 'react';

function DataList({ items }) {
  const sortedItems = useMemo(() => {
    return items.sort((a, b) => a.value - b.value);
  }, [items]);

  return (
    <ul>
      {sortedItems.map(item => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}
```

### useCallback

```jsx
import { useCallback } from 'react';

function Parent() {
  const [count, setCount] = useState(0);

  const handleClick = useCallback(() => {
    console.log('Button clicked');
  }, []); // Function only created once

  return <Child onClick={handleClick} />;
}
```

## Best Practices

1. **Component Structure** - Keep components small and focused
2. **Naming** - Use PascalCase for components, camelCase for functions
3. **Props** - Destructure props for cleaner code
4. **State** - Keep state as local as possible
5. **Keys** - Always use unique keys in lists
6. **Effects** - Specify dependencies correctly
7. **Fragments** - Use fragments to avoid extra DOM nodes
8. **PropTypes** - Validate props in development
9. **Error Boundaries** - Catch errors in components
10. **Code Splitting** - Use lazy loading for large apps

### Folder Structure

```
src/
├── components/
│   ├── common/
│   │   ├── Button.jsx
│   │   └── Input.jsx
│   └── features/
│       ├── User/
│       │   ├── UserList.jsx
│       │   └── UserProfile.jsx
│       └── Post/
│           ├── PostList.jsx
│           └── PostDetail.jsx
├── hooks/
│   ├── useAuth.js
│   └── useFetch.js
├── context/
│   └── AuthContext.jsx
├── utils/
│   └── helpers.js
├── App.jsx
└── index.js
```

---

**Related Topics:**
- Redux/Zustand (State Management)
- React Query (Data Fetching)
- React Testing Library
- TypeScript with React
- Next.js (React Framework)
