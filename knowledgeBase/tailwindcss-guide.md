---
title: "Tailwind CSS Complete Guide"
description: "Comprehensive guide to Tailwind CSS including installation, utility classes, responsive design, customization, and best practices"
tags:
  - tailwindcss
  - css
  - styling
  - frontend
  - utility-first
  - responsive-design
date: 2024-11-03
lastUpdated: 2024-11-03
---

# Tailwind CSS Complete Guide

Complete guide to Tailwind CSS - a utility-first CSS framework for rapidly building custom designs.

## Table of Contents

- [Introduction](#introduction)
- [Installation](#installation)
- [Core Concepts](#core-concepts)
- [Layout](#layout)
- [Typography](#typography)
- [Colors](#colors)
- [Spacing](#spacing)
- [Sizing](#sizing)
- [Flexbox](#flexbox)
- [Grid](#grid)
- [Responsive Design](#responsive-design)
- [Customization](#customization)
- [Best Practices](#best-practices)

## Introduction

### What is Tailwind CSS?

Tailwind CSS is a utility-first CSS framework that provides low-level utility classes to build custom designs without writing CSS.

### Key Benefits

- **Utility-First** - Build designs with utility classes
- **Responsive** - Mobile-first responsive design
- **Customizable** - Fully configurable
- **No Context Switching** - Style in your markup
- **Smaller CSS** - Purge unused styles in production

## Installation

### With Create React App

```bash
# Create React app
npx create-react-app my-app
cd my-app

# Install Tailwind
npm install -D tailwindcss postcss autoprefixer

# Initialize Tailwind
npx tailwindcss init -p
```

### With Next.js

```bash
# Create Next.js app with Tailwind
npx create-next-app@latest my-app --typescript --tailwind

# Or add to existing project
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### With Vite

```bash
# Create Vite app
npm create vite@latest my-app -- --template react
cd my-app

# Install Tailwind
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Configuration

**tailwind.config.js:**

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

**Add Tailwind directives to CSS:**

```css
/* src/index.css or styles/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### CDN (Development Only)

```html
<script src="https://cdn.tailwindcss.com"></script>
```

## Core Concepts

### Utility-First

Instead of writing custom CSS, use utility classes:

```html
<!-- Traditional CSS -->
<style>
  .btn {
    background-color: blue;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
  }
</style>
<button class="btn">Click me</button>

<!-- Tailwind CSS -->
<button class="bg-blue-500 text-white px-4 py-2 rounded">
  Click me
</button>
```

### Responsive Design

Mobile-first breakpoints:

```html
<div class="text-sm md:text-base lg:text-lg">
  Responsive text
</div>
```

### State Variants

Style different states:

```html
<button class="bg-blue-500 hover:bg-blue-700 focus:ring-2">
  Hover me
</button>
```

## Layout

### Display

```html
<!-- Block -->
<div class="block">Block element</div>

<!-- Inline Block -->
<span class="inline-block">Inline block</span>

<!-- Flex -->
<div class="flex">Flex container</div>

<!-- Grid -->
<div class="grid">Grid container</div>

<!-- Hidden -->
<div class="hidden">Hidden element</div>
```

### Container

```html
<!-- Centered container with max-width -->
<div class="container mx-auto px-4">
  Content
</div>
```

### Position

```html
<!-- Static (default) -->
<div class="static">Static</div>

<!-- Relative -->
<div class="relative">Relative</div>

<!-- Absolute -->
<div class="absolute top-0 left-0">Absolute</div>

<!-- Fixed -->
<div class="fixed top-0 left-0">Fixed</div>

<!-- Sticky -->
<div class="sticky top-0">Sticky</div>
```

### Z-Index

```html
<div class="z-0">z-index: 0</div>
<div class="z-10">z-index: 10</div>
<div class="z-50">z-index: 50</div>
```

## Typography

### Font Family

```html
<p class="font-sans">Sans-serif font</p>
<p class="font-serif">Serif font</p>
<p class="font-mono">Monospace font</p>
```

### Font Size

```html
<p class="text-xs">Extra small</p>
<p class="text-sm">Small</p>
<p class="text-base">Base</p>
<p class="text-lg">Large</p>
<p class="text-xl">Extra large</p>
<p class="text-2xl">2X large</p>
<p class="text-3xl">3X large</p>
<p class="text-4xl">4X large</p>
```

### Font Weight

```html
<p class="font-thin">Thin (100)</p>
<p class="font-light">Light (300)</p>
<p class="font-normal">Normal (400)</p>
<p class="font-medium">Medium (500)</p>
<p class="font-semibold">Semibold (600)</p>
<p class="font-bold">Bold (700)</p>
<p class="font-extrabold">Extra bold (800)</p>
```

### Text Alignment

```html
<p class="text-left">Left aligned</p>
<p class="text-center">Center aligned</p>
<p class="text-right">Right aligned</p>
<p class="text-justify">Justified</p>
```

### Text Transform

```html
<p class="uppercase">UPPERCASE</p>
<p class="lowercase">lowercase</p>
<p class="capitalize">Capitalize</p>
<p class="normal-case">Normal Case</p>
```

### Line Height

```html
<p class="leading-none">Line height: 1</p>
<p class="leading-tight">Line height: 1.25</p>
<p class="leading-normal">Line height: 1.5</p>
<p class="leading-loose">Line height: 2</p>
```

## Colors

### Text Color

```html
<p class="text-black">Black text</p>
<p class="text-white">White text</p>
<p class="text-gray-500">Gray text</p>
<p class="text-red-500">Red text</p>
<p class="text-blue-500">Blue text</p>
<p class="text-green-500">Green text</p>
```

### Background Color

```html
<div class="bg-white">White background</div>
<div class="bg-gray-100">Light gray</div>
<div class="bg-blue-500">Blue background</div>
<div class="bg-red-500">Red background</div>
```

### Color Shades

Colors come in shades from 50 (lightest) to 950 (darkest):

```html
<div class="bg-blue-50">Lightest blue</div>
<div class="bg-blue-500">Medium blue</div>
<div class="bg-blue-900">Darkest blue</div>
```

### Border Color

```html
<div class="border border-gray-300">Gray border</div>
<div class="border-2 border-blue-500">Blue border</div>
```

## Spacing

### Padding

```html
<!-- All sides -->
<div class="p-4">Padding all sides</div>

<!-- Horizontal and Vertical -->
<div class="px-4 py-2">Padding x and y</div>

<!-- Individual sides -->
<div class="pt-4">Padding top</div>
<div class="pr-4">Padding right</div>
<div class="pb-4">Padding bottom</div>
<div class="pl-4">Padding left</div>
```

### Margin

```html
<!-- All sides -->
<div class="m-4">Margin all sides</div>

<!-- Horizontal and Vertical -->
<div class="mx-auto">Center horizontally</div>
<div class="my-4">Margin y</div>

<!-- Individual sides -->
<div class="mt-4">Margin top</div>
<div class="mr-4">Margin right</div>
<div class="mb-4">Margin bottom</div>
<div class="ml-4">Margin left</div>

<!-- Negative margins -->
<div class="-mt-4">Negative margin top</div>
```

### Space Between

```html
<!-- Space between children -->
<div class="space-y-4">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>

<div class="space-x-4">
  <span>Item 1</span>
  <span>Item 2</span>
</div>
```

## Sizing

### Width

```html
<div class="w-full">100% width</div>
<div class="w-1/2">50% width</div>
<div class="w-1/3">33.333% width</div>
<div class="w-64">16rem (256px)</div>
<div class="w-auto">Auto width</div>

<!-- Min/Max width -->
<div class="min-w-0">Min width 0</div>
<div class="max-w-md">Max width medium</div>
<div class="max-w-screen-xl">Max width XL screen</div>
```

### Height

```html
<div class="h-full">100% height</div>
<div class="h-screen">100vh height</div>
<div class="h-64">16rem (256px)</div>
<div class="h-auto">Auto height</div>

<!-- Min/Max height -->
<div class="min-h-screen">Min height 100vh</div>
<div class="max-h-64">Max height 16rem</div>
```

## Flexbox

### Flex Container

```html
<div class="flex">
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

### Flex Direction

```html
<div class="flex flex-row">Row (default)</div>
<div class="flex flex-col">Column</div>
<div class="flex flex-row-reverse">Row reverse</div>
<div class="flex flex-col-reverse">Column reverse</div>
```

### Justify Content

```html
<div class="flex justify-start">Start</div>
<div class="flex justify-center">Center</div>
<div class="flex justify-end">End</div>
<div class="flex justify-between">Space between</div>
<div class="flex justify-around">Space around</div>
<div class="flex justify-evenly">Space evenly</div>
```

### Align Items

```html
<div class="flex items-start">Start</div>
<div class="flex items-center">Center</div>
<div class="flex items-end">End</div>
<div class="flex items-stretch">Stretch</div>
<div class="flex items-baseline">Baseline</div>
```

### Flex Wrap

```html
<div class="flex flex-wrap">Wrap</div>
<div class="flex flex-nowrap">No wrap</div>
```

### Flex Grow/Shrink

```html
<div class="flex">
  <div class="flex-1">Grow equally</div>
  <div class="flex-1">Grow equally</div>
</div>

<div class="flex">
  <div class="flex-grow">Grow</div>
  <div class="flex-shrink">Shrink</div>
  <div class="flex-none">No grow/shrink</div>
</div>
```

### Gap

```html
<div class="flex gap-4">Gap between items</div>
<div class="flex gap-x-4">Horizontal gap</div>
<div class="flex gap-y-4">Vertical gap</div>
```

## Grid

### Grid Container

```html
<div class="grid grid-cols-3 gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>
```

### Grid Columns

```html
<div class="grid grid-cols-1">1 column</div>
<div class="grid grid-cols-2">2 columns</div>
<div class="grid grid-cols-3">3 columns</div>
<div class="grid grid-cols-4">4 columns</div>
<div class="grid grid-cols-12">12 columns</div>
```

### Grid Rows

```html
<div class="grid grid-rows-3">3 rows</div>
```

### Column Span

```html
<div class="grid grid-cols-3">
  <div class="col-span-2">Spans 2 columns</div>
  <div>1 column</div>
</div>
```

### Row Span

```html
<div class="grid grid-rows-3">
  <div class="row-span-2">Spans 2 rows</div>
  <div>1 row</div>
</div>
```

### Responsive Grid

```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
  <div>Item 4</div>
</div>
```

## Responsive Design

### Breakpoints

```
sm: 640px   - Small devices
md: 768px   - Medium devices
lg: 1024px  - Large devices
xl: 1280px  - Extra large devices
2xl: 1536px - 2X large devices
```

### Responsive Utilities

```html
<!-- Hidden on mobile, visible on desktop -->
<div class="hidden md:block">
  Desktop only
</div>

<!-- Visible on mobile, hidden on desktop -->
<div class="block md:hidden">
  Mobile only
</div>

<!-- Responsive text size -->
<h1 class="text-2xl md:text-4xl lg:text-6xl">
  Responsive heading
</h1>

<!-- Responsive padding -->
<div class="p-4 md:p-8 lg:p-12">
  Responsive padding
</div>

<!-- Responsive grid -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
  Responsive grid
</div>
```

## Customization

### Extend Theme

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'brand': '#1E40AF',
        'brand-light': '#3B82F6',
      },
      spacing: {
        '128': '32rem',
      },
      fontFamily: {
        'custom': ['Custom Font', 'sans-serif'],
      },
    },
  },
}
```

### Custom Utilities

```css
/* src/index.css */
@layer utilities {
  .text-shadow {
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
}
```

### Plugins

```bash
npm install @tailwindcss/forms @tailwindcss/typography
```

```javascript
// tailwind.config.js
module.exports = {
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
```

## Best Practices

### 1. Use @apply for Repeated Patterns

```css
@layer components {
  .btn-primary {
    @apply bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700;
  }
}
```

### 2. Extract Components

```jsx
// Button.jsx
export default function Button({ children, variant = 'primary' }) {
  const baseClasses = 'px-4 py-2 rounded font-semibold';
  const variants = {
    primary: 'bg-blue-500 text-white hover:bg-blue-700',
    secondary: 'bg-gray-500 text-white hover:bg-gray-700',
  };
  
  return (
    <button className={`${baseClasses} ${variants[variant]}`}>
      {children}
    </button>
  );
}
```

### 3. Use Consistent Spacing Scale

Stick to Tailwind's spacing scale (4, 8, 12, 16, etc.)

### 4. Mobile-First Approach

Start with mobile styles, then add responsive variants

### 5. Purge Unused CSS

Ensure your `content` paths are correct in `tailwind.config.js`

### 6. Use Semantic HTML

```html
<!-- Good -->
<nav class="flex items-center">
  <a href="/">Home</a>
</nav>

<!-- Avoid -->
<div class="flex items-center">
  <div onclick="goHome()">Home</div>
</div>
```

## Common Patterns

### Card Component

```html
<div class="bg-white rounded-lg shadow-md p-6">
  <h2 class="text-2xl font-bold mb-4">Card Title</h2>
  <p class="text-gray-600">Card content goes here</p>
</div>
```

### Navigation Bar

```html
<nav class="bg-white shadow-md">
  <div class="container mx-auto px-4">
    <div class="flex items-center justify-between h-16">
      <div class="text-xl font-bold">Logo</div>
      <div class="flex space-x-4">
        <a href="#" class="hover:text-blue-500">Home</a>
        <a href="#" class="hover:text-blue-500">About</a>
        <a href="#" class="hover:text-blue-500">Contact</a>
      </div>
    </div>
  </div>
</nav>
```

### Hero Section

```html
<section class="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-20">
  <div class="container mx-auto px-4 text-center">
    <h1 class="text-5xl font-bold mb-4">Welcome</h1>
    <p class="text-xl mb-8">Build amazing things with Tailwind CSS</p>
    <button class="bg-white text-blue-500 px-8 py-3 rounded-full font-semibold hover:bg-gray-100">
      Get Started
    </button>
  </div>
</section>
```

---

**Related Topics:**
- Tailwind UI Components
- Headless UI
- DaisyUI
- Flowbite
- shadcn/ui
