---
title: "CSS Grid Complete Guide"
description: "Comprehensive guide to CSS Grid including container properties, item properties, grid template areas, alignment, auto-fill, auto-fit, and complex grid layouts"
tags:
  - css-grid
  - css
  - layout
  - grid-container
  - grid-items
  - grid-template-areas
  - responsive-grid
date: 2024-11-03
lastUpdated: 2024-11-03
---

# CSS Grid Complete Guide

Complete guide to CSS Grid - the modern way of laying out elements in a 2-dimensional grid. Perfect for page layouts and complex components.

## Table of Contents

- [Introduction](#introduction)
- [Grid Container Properties](#grid-container-properties)
- [Grid Item Properties](#grid-item-properties)
- [Alignment](#alignment)
- [Grid Template Areas](#grid-template-areas)
- [Explicit and Implicit Grids](#explicit-and-implicit-grids)
- [Auto-fill and Auto-fit](#auto-fill-and-auto-fit)
- [Responsive Grid](#responsive-grid)
- [Complex Grid Examples](#complex-grid-examples)

## Introduction

In a grid setup:
- **Column axis:** Up and down
- **Row axis:** Left to right
- **Grid track/row:** Runs left to right
- **Grid track/column:** Runs up and down

```css
.container {
    display: grid;
}
```

### Basic Setup

```html
<div class="container">
    <div class="item">Item 1</div>
    <div class="item">Item 2</div>
    <div class="item">Item 3</div>
    <div class="item">Item 4</div>
    <div class="item">Item 5</div>
    <div class="item">Item 6</div>
</div>
```

```css
.container {
    max-width: 960px;
    margin: 100px auto;
    padding: 10px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.7rem;
}
```

## Grid Container Properties

### grid-template-columns

Define column widths.

```css
/* Fixed widths */
grid-template-columns: 200px 200px 200px;

/* Percentages */
grid-template-columns: 20% 20% auto;

/* Fractional units (fr) */
grid-template-columns: 1fr 1fr;           /* Two equal columns */
grid-template-columns: 1fr 1fr 2fr;       /* Third column twice as wide */
grid-template-columns: repeat(3, 1fr);    /* Three equal columns */

/* Mixed units */
grid-template-columns: 200px 1fr 2fr;
```

### grid-template-rows

Define row heights.

```css
grid-template-rows: 100px 200px 300px;
grid-template-rows: repeat(3, 1fr);
grid-template-rows: 10rem 10rem 30rem;
```

### gap (grid-gap)

Space between grid items.

```css
gap: 1rem;                    /* Same for rows and columns */
gap: 1rem 2rem;              /* row-gap column-gap */
row-gap: 1rem;
column-gap: 2rem;
```

### grid-auto-rows / grid-auto-columns

Set size for implicitly created rows/columns.

```css
grid-auto-rows: 100px;
grid-auto-rows: minmax(100px, auto);
grid-auto-columns: 200px;
```

### grid-auto-flow

Control how auto-placed items flow.

```css
grid-auto-flow: row;       /* DEFAULT - add new rows */
grid-auto-flow: column;    /* Add new columns */
grid-auto-flow: dense;     /* Fill gaps */
```

## Grid Item Properties

### grid-column

Span columns horizontally.

```css
/* Long form */
grid-column-start: 1;
grid-column-end: 3;

/* Shorthand */
grid-column: 1 / 3;        /* From line 1 to line 3 */
grid-column: 1 / span 2;   /* Start at 1, span 2 columns */
grid-column: span 2;       /* Span 2 columns from current position */
```

### grid-row

Span rows vertically.

```css
grid-row: 2 / 4;           /* From row line 2 to 4 */
grid-row: 1 / span 3;      /* Start at 1, span 3 rows */
```

### grid-area

Shorthand for row-start / column-start / row-end / column-end.

```css
grid-area: 1 / 1 / 3 / 3;  /* row-start / col-start / row-end / col-end */
```

Or use with named areas (see Grid Template Areas section).

### Example: Spanning Items

```css
.item:nth-of-type(1) {
    grid-column: 1 / 3;    /* Span 2 columns */
}

.item:nth-of-type(3) {
    grid-row: 2 / 4;       /* Span 2 rows */
}
```

## Alignment

### Vertical Alignment (align-items / align-self)

Moves items up and down within their grid cell.

```css
/* Container property - affects all items */
.container {
    align-items: stretch;    /* DEFAULT - fill cell height */
    align-items: start;      /* Align to top */
    align-items: end;        /* Align to bottom */
    align-items: center;     /* Center vertically */
}

/* Item property - affects single item */
.item {
    align-self: center;
}
```

### Horizontal Alignment (justify-items / justify-self)

Moves items left and right within their grid cell.

```css
/* Container property - affects all items */
.container {
    justify-items: stretch;  /* DEFAULT - fill cell width */
    justify-items: start;    /* Align to left */
    justify-items: end;      /* Align to right */
    justify-items: center;   /* Center horizontally */
}

/* Item property - affects single item */
.item {
    justify-self: center;
}
```

### Place Items/Self (Shorthand)

Combines align and justify in one property.

```css
/* Container */
place-items: center;              /* center center */
place-items: start end;           /* align justify */

/* Item */
place-self: center;
```

### Track Positioning (align-content / justify-content)

Position the entire grid within the container.

```css
.container {
    align-content: start;
    align-content: end;
    align-content: center;
    align-content: stretch;        /* DEFAULT */
    align-content: space-around;
    align-content: space-between;
    align-content: space-evenly;
    
    justify-content: start;
    justify-content: end;
    justify-content: center;
    justify-content: stretch;
    justify-content: space-around;
    justify-content: space-between;
    justify-content: space-evenly;
}

/* Shorthand */
place-content: center;
```

### Example: Sizing and Positioning

```css
.item:nth-of-type(2) {
    height: 10rem;
    width: 10rem;
    align-self: center;
    justify-self: center;
}
```

## Grid Template Areas

Create named grid areas for intuitive layouts.

### HTML

```html
<body>
    <header>Header</header>
    <nav>Navigation</nav>
    <main>Content</main>
    <aside>Sidebar</aside>
    <footer>Footer</footer>
</body>
```

### CSS

```css
body {
    display: grid;
    
    /* Define the layout */
    grid-template-areas: 
        'header header header'
        'nav content sidebar'
        'nav footer footer';
    
    /* Set column widths */
    grid-template-columns: 1fr 4fr 1fr;
    
    /* Set row heights */
    grid-template-rows: 2.5rem auto 2.5rem;
}

/* Assign areas to elements */
header {
    grid-area: header;
}

nav {
    grid-area: nav;
}

main {
    grid-area: content;
}

aside {
    grid-area: sidebar;
}

footer {
    grid-area: footer;
}
```

## Explicit and Implicit Grids

**Explicit grid:** Defined with `grid-template-columns` and `grid-template-rows`  
**Implicit grid:** Automatically created when you have more items than cells

### Example

```css
.container {
    display: grid;
    grid-template-rows: repeat(2, 150px);    /* 2 explicit rows */
    grid-template-columns: repeat(2, 1fr);   /* 2 explicit columns */
    gap: 20px;
}
```

If you have 8 items but only defined 4 cells (2×2), the last 4 items are added implicitly.

### Control Implicit Grid

```css
/* Control direction of new items */
grid-auto-flow: row;        /* Add new rows (default) */
grid-auto-flow: column;     /* Add new columns */

/* Set size of implicit tracks */
grid-auto-rows: 80px;
grid-auto-columns: 0.5fr;
```

## Auto-fill and Auto-fit

Let the browser decide how many columns to create.

### auto-fill

Creates as many tracks as will fit, even if empty.

```css
.container {
    display: grid;
    grid-template-columns: repeat(auto-fill, 100px);
}
```

### auto-fit

Creates tracks but collapses empty ones.

```css
.container {
    display: grid;
    grid-template-columns: repeat(auto-fit, 100px);
}
```

### Responsive Grid with minmax

```css
.container {
    display: grid;
    /* Columns: min 250px, max 1fr, as many as fit */
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
}
```

This creates a responsive grid without media queries!

## Responsive Grid

### With Media Queries

```css
.container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.7rem;
}

@media (max-width: 768px) {
    .container {
        grid-template-columns: 1fr 1fr;  /* 2 columns on tablet */
    }   
}

@media (max-width: 500px) {
    .container {
        grid-template-columns: 1fr;      /* 1 column on mobile */
    }   
}
```

### Without Media Queries

```css
.container {
    display: grid;
    /* Minimum column width 10rem, fill available space */
    grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
    gap: 0.7rem;
}
```

## min-content, max-content, and minmax

### max-content

Column width based on longest content without wrapping.

```css
grid-template-columns: max-content 1fr 1fr;
```

### min-content

Column width based on longest word (allows wrapping).

```css
grid-template-columns: min-content 1fr 1fr;
```

### minmax()

Set minimum and maximum size.

```css
/* Minimum 100px, maximum 1fr */
grid-template-columns: repeat(3, minmax(100px, 1fr));

/* Minimum based on content, maximum 14rem */
grid-template-columns: repeat(8, minmax(min-content, 14rem));

/* Rows: minimum 150px, maximum based on content */
grid-template-rows: repeat(2, minmax(150px, min-content));
```

### fit-content()

Grow to fit content but never exceed specified size.

```css
grid-template-columns: fit-content(200px) fit-content(400px);
```

## Complex Grid Examples

### Named Grid Lines

```css
.container {
    display: grid;
    grid-template-columns: 
        [sidebar-start] 8rem 
        [sidebar-end full-start] minmax(6rem, 1fr) 
        [center-start] repeat(8, [col-start] minmax(min-content, 14rem) [col-end]) 
        [center-end] minmax(6rem, 1fr) 
        [full-end];
}

/* Use named lines */
.item {
    grid-column: sidebar-start / sidebar-end;
}
```

### Complex Layout Example

```css
.container {
    display: grid;
    
    /* 6 rows with varying heights */
    grid-template-rows: 70vh min-content 40vh repeat(3, min-content);
    
    /* 11 columns with named lines */
    grid-template-columns: 
        [sidebar-start] 8rem 
        [sidebar-end full-start] minmax(6rem, 1fr) 
        [center-start] repeat(8, [col-start] minmax(min-content, 14rem) [col-end]) 
        [center-end] minmax(6rem, 1fr) 
        [full-end];
}
```

## Best Practices

1. **Use Grid for 2-dimensional layouts** (rows and columns)
2. **Use Flexbox for 1-dimensional layouts** (single row or column)
3. **Use `fr` units** for flexible sizing
4. **Use `minmax()`** for responsive columns without media queries
5. **Use `auto-fit` with `minmax()`** for truly responsive grids
6. **Name grid lines** for complex layouts
7. **Use `grid-template-areas`** for intuitive layouts
8. **Use `gap`** instead of margins for spacing
9. **Test with varying content** - grid adapts to content size

## Browser Support

CSS Grid has excellent browser support:
- ✅ Chrome 57+
- ✅ Firefox 52+
- ✅ Safari 10.1+
- ✅ Edge 16+
- ⚠️ IE 11 (partial support with `-ms-` prefix)

---

**Related Guides:**
- [CSS Fundamentals](./css-fundamentals.md)
- [Flexbox Guide](./flexbox-guide.md)
- [Responsive Design Guide](./responsive-design-guide.md)
