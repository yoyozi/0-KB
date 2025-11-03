---
title: "Responsive Design Complete Guide"
description: "Comprehensive guide to responsive web design including fluid layouts, media queries, breakpoints, responsive images, and mobile-first vs desktop-first approaches"
tags:
  - responsive-design
  - media-queries
  - breakpoints
  - mobile-first
  - responsive-images
  - fluid-layouts
date: 2024-11-03
lastUpdated: 2024-11-03
---

# Responsive Design Complete Guide

Complete guide to creating responsive websites that adapt to different screen sizes and devices.

## Table of Contents

- [Essential Meta Tag](#essential-meta-tag)
- [Principles of Responsive Design](#principles-of-responsive-design)
- [Layout Types](#layout-types)
- [Float Layout System](#float-layout-system)
- [Media Queries and Breakpoints](#media-queries-and-breakpoints)
- [Responsive Images](#responsive-images)

## Essential Meta Tag

**IMPORTANT:** This meta tag must be in your HTML for responsive design to work properly:

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

This allows the webpage to adapt to the viewport size.

## Principles of Responsive Design

### 1. Fluid Layouts

- Allow webpage to adapt to viewport width or height
- Use `%`, `vh`, or `vw` units instead of `px` for elements that should adapt
- Use `max-width` instead of `width`

```css
.container {
    max-width: 1140px;
    width: 90%;
    margin: 0 auto;
}
```

### 2. Responsive Units

- Use `rem` unit instead of pixels for most lengths
- Makes it easy to scale the entire layout automatically

```css
html {
    font-size: 62.5%; /* 1rem = 10px */
}

.heading {
    font-size: 4.5rem; /* 45px */
    margin-bottom: 3rem; /* 30px */
}
```

### 3. Flexible Images

- Images don't scale automatically as viewport changes
- Always use `%` for image dimensions with `max-width` property

```css
img {
    max-width: 100%;
    height: auto;
}
```

### 4. Media Queries

- Change CSS styles at certain widths called breakpoints

```css
@media only screen and (max-width: 768px) {
    .container {
        width: 100%;
        padding: 0 2rem;
    }
}
```

## Layout Types

### Float Layout

Old way of building layouts using the `float` property. Still used but getting outdated.

**Pros:** Wide browser support  
**Cons:** Requires clearfix, can be tricky

### Flexbox

Modern way of laying out elements in a **1-dimensional row** without floats.

**Perfect for:** Component layouts  
**Browser support:** Excellent (IE11+)

### CSS Grid

For laying out elements in a fully-fledged **2-dimensional grid**.

**Perfect for:** Page layouts and complex components  
**Browser support:** Excellent (IE11+ with prefixes)

## Float Layout System

A complete float-based grid system with SASS.

### HTML Structure

```html
<section class="grid-test">
    <div class="row">
        <div class="col-1-of-2">Column 1 of 2</div>
        <div class="col-1-of-2">Column 2 of 2</div>
    </div>
    
    <div class="row">
        <div class="col-1-of-3">Column 1 of 3</div>
        <div class="col-1-of-3">Column 2 of 3</div>
        <div class="col-1-of-3">Column 3 of 3</div>
    </div>
    
    <div class="row">
        <div class="col-1-of-4">Column 1 of 4</div>
        <div class="col-1-of-4">Column 2 of 4</div>
        <div class="col-1-of-4">Column 3 of 4</div>
        <div class="col-1-of-4">Column 4 of 4</div>
    </div>
</section>
```

### SASS Grid System

```scss
// Grid variables
$grid-width: 114rem;
$gutter-vertical: 8rem;
$gutter-horizontal: 2rem;

// Clearfix mixin
@mixin clearfix {
    &::after {
        content: '';
        display: table;
        clear: both;
    }
}

.row {
    max-width: $grid-width;
    margin: 0 auto;
    
    // All rows except last row
    &:not(:last-child) {
        margin-bottom: $gutter-vertical; 
    }

    @include clearfix;

    // Attribute selector: all classes that start with "col"
    [class^="col"] {
        float: left;

        &:not(:last-child) {
            margin-right: $gutter-horizontal;
        }
    }

    // Column widths (wrap variables in #{})
    .col-1-of-2 {
        width: calc((100% - #{$gutter-horizontal}) / 2);
    }

    .col-1-of-3 {
        width: calc((100% - (2 * #{$gutter-horizontal})) / 3);    
    }

    .col-2-of-3 {
        width: calc(#{$gutter-horizontal} + (2 * ((100% - (2 * #{$gutter-horizontal})) / 3)));    
    }

    .col-1-of-4 {
        width: calc((100% - (3 * #{$gutter-horizontal})) / 4);
    }

    .col-2-of-4 {
        width: calc((#{$gutter-horizontal} + (2 * (100% - (3 * #{$gutter-horizontal})) / 4))); 
    }

    .col-3-of-4 {
        width: calc((2 * #{$gutter-horizontal}) + (3 * ((100% - (3 * #{$gutter-horizontal})) / 4)));  
    }
}
```

## Media Queries and Breakpoints

### Standard Breakpoints

1. **0 - 600px:** Phone
2. **600 - 900px:** Tablet portrait
3. **900 - 1200px:** Tablet landscape
4. **1200 - 1800px:** Normal desktop styles (default)
5. **1800px+:** Big desktop

### SASS Mixin for Breakpoints

```scss
// 1em = 16px

@mixin respond($breakpoint) {
    @if $breakpoint == phone {
        @media only screen and (max-width: 37.5em) { @content };    // 600px
    }
    @if $breakpoint == tab-port {
        @media only screen and (max-width: 56.25em) { @content };   // 900px
    }
    @if $breakpoint == tab-land {
        @media only screen and (max-width: 75em) { @content };      // 1200px
    }
    @if $breakpoint == big-desktop {
        @media only screen and (min-width: 112.5em) { @content };   // 1800px
    }
}
```

### Implementation Order

When implementing responsive design for a desktop-first approach:

**ORDER:** Base + typography → general layout + grid → page layout → components

### Base Responsive Styles

```scss
*,
*::after,
*::before {
    margin: 0;
    padding: 0;
    box-sizing: inherit;
}

html {
    font-size: 62.5%; // 1rem = 10px

    @include respond(tab-land) { // width < 1200px
        font-size: 56.25%; // 1rem = 9px
    }

    @include respond(tab-port) { // width < 900px
        font-size: 50%; // 1rem = 8px
    }

    @include respond(big-desktop) { // width > 1800px
        font-size: 75%; // 1rem = 12px
    }
}

body {
    box-sizing: border-box;
    padding: 3rem;

    @include respond(tab-port) {
        padding: 0;
    }
}
```

### Component Example

```scss
.section-book {
    padding: 15rem 0;
    background-image: linear-gradient(
        to right bottom, 
        $color-primary-light, 
        $color-primary-dark
    );

    @include respond(tab-port) {
        padding: 10rem 0;
    }
}
```

## Responsive Images

Send larger images to desktop and smaller images to mobile for better performance.

### Three Approaches

1. **Resolution switching** - Different image quality based on screen size
2. **Density switching** - High-res screens (2x) vs low-res screens (1x)
3. **Art direction** - Different images for different screen sizes

### Density Switching (HTML)

Serve larger images to high-resolution screens (Retina displays).

**Image files:**
- `logo-green-1x.png` - 150px × 120px (21KB)
- `logo-green-2x.png` - 300px × 238px (56KB)

```html
<img srcset="img/logo-green-1x.png 1x, img/logo-green-2x.png 2x" 
     alt="Full logo" 
     class="footer__logo">
```

The browser automatically chooses 1x for low-res screens and 2x for high-res screens.

### Art Direction (HTML)

Serve different images for different viewport widths.

```html
<picture class="footer__logo">
    <source srcset="img/logo-green-small-1x.png 1x, img/logo-green-small-2x.png 2x" 
            media="(max-width: 37.5em)">
    
    <img srcset="img/logo-green-1x.png 1x, img/logo-green-2x.png 2x" 
         alt="Full logo" 
         src="img/logo-green-2x.png">
</picture>
```

### Resolution Switching (HTML)

Let the browser choose the best image based on viewport width.

**Image files:**
- `nat-1.jpg` - 300px × 200px (36.8KB)
- `nat-1-large.jpg` - 1000px × 667px (369KB)

```html
<img srcset="img/nat-1.jpg 300w, img/nat-1-large.jpg 1000w"
     sizes="(max-width: 56.25em) 20vw, (max-width: 37.5em) 30vw, 300px"
     alt="Photo 1"
     class="composition__photo"
     src="img/nat-1-large.jpg">
```

**How it works:**

1. **srcset** - Tell browser the width of each image (300w, 1000w)
2. **sizes** - Tell browser approximate image width at different viewports
   - At 900px (56.25em): image is 20% of viewport width (20vw)
   - At 600px (37.5em): image is 30% of viewport width (30vw)
   - Default: 300px
3. **src** - Fallback for browsers that don't support srcset

### CSS Background Image Resolution Switching

**Image files:**
- `background-small.jpg` - 1200px × 719px (267KB)
- `background-large.jpg` - 2000px × 1200px (600KB)

```scss
.header {
    height: 85vh;
    background-image: linear-gradient(
        to right bottom,
        rgba($color-primary-light, 0.8),
        rgba($color-primary-dark, 0.8)),
    url(../img/background-small.jpg);
    background-size: cover;
    background-position: top;

    // High-resolution screens
    @media only screen and (min-resolution: 192dpi) and (min-width: 37.5em),
           only screen and (-webkit-min-device-pixel-ratio: 2) and (min-width: 37.5em),
           only screen and (min-width: 125em) {
        background-image: linear-gradient(
            to right bottom,
            rgba($color-primary-light, 0.8),
            rgba($color-primary-dark, 0.8)),
        url(../img/background-large.jpg);
    }
}
```

**Media query conditions:**
1. Screens with 192dpi (high-res) AND viewport > 600px
2. Screens with 2x pixel ratio AND viewport > 600px
3. Viewport > 2000px (very large screens)

## Best Practices

1. **Always include viewport meta tag**
2. **Use relative units** (rem, em, %) instead of px
3. **Mobile-first or desktop-first** - be consistent
4. **Test on real devices** - not just browser dev tools
5. **Optimize images** - use appropriate formats and sizes
6. **Use srcset and sizes** for responsive images
7. **Consider touch targets** - minimum 44×44px for mobile
8. **Test with slow connections** - optimize performance

---

**Related Guides:**
- [CSS Fundamentals](./css-fundamentals.md)
- [Flexbox Guide](./flexbox-guide.md)
- [CSS Grid Guide](./css-grid-guide.md)
