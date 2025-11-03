---
title: "Flexbox Complete Guide"
description: "Comprehensive guide to CSS Flexbox including container properties, item properties, alignment, justification, and practical layout examples"
tags:
  - flexbox
  - css
  - layout
  - flex-container
  - flex-items
  - alignment
date: 2024-11-03
lastUpdated: 2024-11-03
---

# Flexbox Complete Guide

Complete guide to CSS Flexbox - the modern way of laying out elements in a 1-dimensional row without using floats. Perfect for component layouts.

## Table of Contents

- [Introduction](#introduction)
- [Flex Container Properties](#flex-container-properties)
- [Flex Item Properties](#flex-item-properties)
- [Practical Examples](#practical-examples)
- [Common Patterns](#common-patterns)

## Introduction

Flexbox is started by setting a container to `display: flex`. Everything in the container is referred to as flex items.

```css
.container {
    display: flex;
}
```

### Main Axis vs Cross Axis

- **Main axis:** Left to right (default with `flex-direction: row`)
- **Cross axis:** Top to bottom

## Flex Container Properties

Properties applied to the flex container that control how items are laid out.

### flex-direction

Controls the direction of the main axis.

```css
flex-direction: row;              /* DEFAULT - left to right */
flex-direction: row-reverse;      /* right to left */
flex-direction: column;           /* top to bottom */
flex-direction: column-reverse;   /* bottom to top */
```

### flex-wrap

Controls whether items wrap to new lines.

```css
flex-wrap: nowrap;        /* DEFAULT - all items on one line */
flex-wrap: wrap;          /* items wrap to new lines */
flex-wrap: wrap-reverse;  /* items wrap in reverse order */
```

### justify-content

Aligns items along the **main axis** (horizontal if row, vertical if column).

```css
justify-content: flex-start;    /* DEFAULT - align to start */
justify-content: flex-end;      /* align to end */
justify-content: center;        /* center items */
justify-content: space-between; /* space between items, edges touch */
justify-content: space-around;  /* space around items, half space at edges */
justify-content: space-evenly;  /* equal space between and at edges */
```

### align-items

Aligns items along the **cross axis** (vertical if row, horizontal if column).

```css
align-items: stretch;     /* DEFAULT - stretch to fill container */
align-items: flex-start;  /* align to start of cross axis */
align-items: flex-end;    /* align to end of cross axis */
align-items: center;      /* center on cross axis */
align-items: baseline;    /* align baselines */
```

### align-content

Aligns multiple rows/columns. Only applies when there is more than one row of content.

```css
align-content: stretch;        /* DEFAULT */
align-content: flex-start;     /* pack rows to start */
align-content: flex-end;       /* pack rows to end */
align-content: center;         /* center rows */
align-content: space-between;  /* space between rows */
align-content: space-around;   /* space around rows */
```

## Flex Item Properties

Properties applied to individual flex items.

### align-self

Override `align-items` for individual items.

```css
align-self: auto;        /* DEFAULT - inherit from parent */
align-self: stretch;     /* stretch to fill */
align-self: flex-start;  /* align to start */
align-self: flex-end;    /* align to end */
align-self: center;      /* center */
align-self: baseline;    /* align baseline */
```

### order

Change the order of items. Default is 0.

```css
.item:nth-child(2) {
    order: -1;  /* moves to start */
}

.item:nth-child(3) {
    order: 2;   /* moves to end */
}
```

### flex-grow

Controls how much an item grows relative to others. Default is 0.

```css
.item {
    flex-grow: 0;  /* DEFAULT - don't grow */
}

.item-grow {
    flex-grow: 1;  /* grow to fill available space */
}

.item-grow-more {
    flex-grow: 2;  /* grow twice as much as flex-grow: 1 */
}
```

**Tip:** A simple way to get an item to occupy all available space is to set `flex-grow: 1`.

### flex-shrink

Controls how an item shrinks when space is limited. Default is 1.

```css
.item {
    flex-shrink: 1;  /* DEFAULT - can shrink */
}

.item-no-shrink {
    flex-shrink: 0;  /* won't shrink, may overflow */
}
```

### flex-basis

Sets the initial size of an item before growing/shrinking.

```css
.item {
    flex-basis: auto;   /* DEFAULT - based on content */
    flex-basis: 200px;  /* specific size */
    flex-basis: 50%;    /* percentage of container */
}
```

### flex (Shorthand)

Combines `flex-grow`, `flex-shrink`, and `flex-basis`.

```css
flex: 0 1 auto;     /* DEFAULT - don't grow, can shrink, auto basis */
flex: 1;            /* grow to fill, can shrink, 0 basis */
flex: 0 1 300px;    /* don't grow, can shrink, 300px basis */
```

## Practical Examples

### Basic Flex Container

```html
<div class="container">
    <div class="item">1</div>
    <div class="item">2</div>
    <div class="item">3</div>
    <div class="item">4</div>
    <div class="item">5</div>
</div>
```

```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

.container {
    background-color: #ccc;
    padding: 10px;
    display: flex;
}

.item {
    background-color: #f1425d;
    padding: 40px;
    margin: 30px;
    color: #fff;
    font-size: 40px;
}
```

### Centering Items

```css
.container {
    display: flex;
    justify-content: center;  /* center horizontally */
    align-items: center;      /* center vertically */
    height: 100vh;
}
```

### Space Between Items

```css
.container {
    display: flex;
    justify-content: space-between;  /* items at edges, space between */
}
```

### Column Layout

```css
.container {
    display: flex;
    flex-direction: column;
    align-items: center;  /* center items horizontally in column */
}
```

### Responsive Flex Items

```css
.container {
    display: flex;
    flex-wrap: wrap;  /* allow wrapping */
}

.item {
    flex: 1 1 300px;  /* grow, shrink, min 300px */
    margin: 10px;
}
```

### Item with Different Height

```html
<div class="container">
    <div class="item">1</div>
    <div class="item item-tall">2</div>
    <div class="item">3</div>
    <div class="item">4</div>
    <div class="item">5</div>
</div>
```

```css
.container {
    display: flex;
    justify-content: center;
    align-items: flex-start;  /* align to top */
}

.item {
    background-color: #f1425d;
    padding: 40px;
    margin: 30px;
    color: #fff;
    font-size: 40px;
}

.item-tall {
    height: 200px;
}
```

**Note:** Default `align-items: stretch` would make all items the height of the tallest item.

### Individual Item Alignment

```css
.container {
    display: flex;
    height: 300px;
}

.item:nth-child(2) {
    align-self: center;    /* center this item */
}

.item:nth-child(3) {
    align-self: flex-end;  /* align this item to bottom */
}
```

### Reordering Items

```css
.item:nth-child(1) {
    order: 3;  /* move to end */
}

.item:nth-child(3) {
    order: -1; /* move to start */
}
```

### Growing Items

```css
.container {
    display: flex;
}

.item {
    flex-grow: 1;  /* all items grow equally */
}

.item:nth-child(2) {
    flex-grow: 2;  /* this item grows twice as much */
}
```

## Common Patterns

### Navigation Bar

```css
.nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
}

.nav__logo {
    flex-shrink: 0;  /* don't shrink logo */
}

.nav__menu {
    display: flex;
    gap: 2rem;
}
```

### Card Layout

```css
.card-container {
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
}

.card {
    flex: 1 1 300px;  /* grow, shrink, min 300px */
    max-width: 400px;
}
```

### Holy Grail Layout

```css
.page {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

.header,
.footer {
    flex-shrink: 0;  /* don't shrink */
}

.main {
    flex-grow: 1;  /* take remaining space */
    display: flex;
}

.sidebar {
    flex: 0 0 200px;  /* don't grow/shrink, 200px wide */
}

.content {
    flex-grow: 1;  /* take remaining space */
}
```

### Sticky Footer

```css
.page {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

.content {
    flex-grow: 1;  /* push footer to bottom */
}

.footer {
    flex-shrink: 0;
}
```

## Best Practices

1. **Use Flexbox for 1-dimensional layouts** (row or column)
2. **Use CSS Grid for 2-dimensional layouts** (rows and columns)
3. **Avoid nesting too many flex containers** - can impact performance
4. **Use `gap` property** instead of margins when possible (better browser support now)
5. **Test with different content lengths** - flex items adapt to content
6. **Use `flex` shorthand** instead of individual properties
7. **Remember the main axis changes** with `flex-direction`

## Browser Support

Flexbox has excellent browser support:
- ✅ Chrome 29+
- ✅ Firefox 28+
- ✅ Safari 9+
- ✅ Edge (all versions)
- ⚠️ IE 11 (partial support, use prefixes)

---

**Related Guides:**
- [CSS Fundamentals](./css-fundamentals.md)
- [CSS Grid Guide](./css-grid-guide.md)
- [Responsive Design Guide](./responsive-design-guide.md)
