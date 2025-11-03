---
title: "CSS Fundamentals"
description: "Core CSS concepts including HTML elements, box model, positioning, cascading, specificity, inheritance, and CSS architecture patterns like BEM"
tags:
  - css
  - fundamentals
  - box-model
  - positioning
  - cascading
  - specificity
  - bem
  - css-architecture
date: 2024-11-03
lastUpdated: 2024-11-03
---

# CSS Fundamentals

Core CSS concepts covering HTML elements, box model, positioning schemes, cascading, specificity, inheritance, and architecture patterns.

## Table of Contents

- [HTML Block and Inline Elements](#html-block-and-inline-elements)
- [Modern CSS Setup](#modern-css-setup)
- [CSS Behind the Scenes](#css-behind-the-scenes)
- [Cascading and Specificity](#cascading-and-specificity)
- [Inheritance](#inheritance)
- [Global Font Size](#global-font-size)
- [Box Model](#box-model)
- [Positioning Schemes](#positioning-schemes)
- [CSS Architecture](#css-architecture)

## HTML Block and Inline Elements

### Inline Elements

Take as much space as they need and add contents without line breaks - one next to the other! These elements although written on separate lines will all be INLINE!

```html
<strong>My inline strong element</strong>
<img src="pp.jpg">
<a href="https://thewondersofHTML.com"></a>
```

### Block Elements

Takes the **full width** available and then adds a line break.

```html
<p>This is a paragraph and is block element</p>
<h1>Can be coded on the same line but will move to its own line</h1>
<div>Block level container</div>
```

- `display: none;` - element will not be displayed
- `display: block;` - element is displayed as a block-level element (like paragraphs and headers)

## Modern CSS Setup

No longer need to reset but good to normalize the page and setup margins and padding. The `*` universal selector is used to specify all elements. The box sizing default behavior is averted.

```css
*,
*::after,
*::before {
    margin: 0;
    padding: 0;
    box-sizing: inherit;
}

html {
    /* This defines what 1rem is */
    font-size: 62.5%; /* 1 rem = 10px; 10px/16px = 62.5% */
}

body {
    box-sizing: border-box;
    padding: 3rem;
}

/* Changing how selected text looks on the site */
::selection {
    background-color: $color-primary;
    color: $color-white;
}
```

### HTML Template

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        
        <link href="https://fonts.googleapis.com/css?family=Lato:100,300,400,700,900" rel="stylesheet">
        <link rel="stylesheet" href="css/icon-font.css">
        <link rel="stylesheet" href="css/style.css">
        <link rel="shortcut icon" type="image/png" href="img/favicon.png">
        
        <title>Your Page Title</title>
    </head>
    <body>
        <div class="header">
            Some content...
        </div>
    </body>
</html>
```

### Clip Path

Using x and y coordinates we can determine the clipped part of page.

**Resources:**
- [MDN: basic-shape](https://developer.mozilla.org/en-US/docs/Web/CSS/basic-shape)
- [Clippy Tool](https://bennettfeely.com/clippy/)

## Three Pillars of Good HTML and CSS

### 1. Responsive Design

- Fluid layouts
- Media queries
- Responsive images
- Correct units
- Desktop first vs mobile first

### 2. Maintainable and Scalable Code

- Clean
- Easy to understand
- Reusable
- How to organize files, name classes and structure HTML

### 3. Web Performance

- Faster is better: Less HTTP requests
- Less code
- Compress code
- Use a CSS preprocessor
- Less images
- Compress images

## CSS Behind the Scenes

### How CSS is Processed

```
Load HTML -----> Parse HTML -----> Document Object Model
                      |
                      |
                  Load CSS ----> Parse CSS  

Parse CSS -------> Resolve conflicting CSS dependencies 
           |
           |
           Process final CSS

Finally: CSS Object Model ----> Render tree then site
```

### A CSS Rule

```css
.my-class {
    color: blue;
    text-align: center;
    font-size: 20px;
}

/* Components: */
.my-class           /* SELECTOR */
{ ..... }           /* DECLARATION BLOCK */
font-size: 20px;    /* DECLARATION */
font-size:          /* PROPERTY */
20px;               /* DECLARED VALUE */
```

## Cascading and Specificity

### Importance (Priority Order)

1. **Highest priority:** `!important` (use as last resort only!)
2. **2nd:** Inline styles
3. **3rd:** ID selectors
4. **4th:** `*` has no specificity
5. **5th:** Class selectors (more important than element selectors)
6. **6th:** Order matters with third-party stylesheets - **ALWAYS PUT YOURS LAST**

### When a Pseudo Selector Not Working

Check specificity. If one selector has an ID and two classes, and a pseudo selector has only a class, the specificity of the pseudo class must match the highest to work.

**Example HTML:**

```html
<nav id="nav">
    <div class="pull-right">
        <a class="button button-danger" href="link.html">Don't click here!</a>
    </div>
</nav>
```

**Problem:**

```css
a {
    background-color: purple;
}

#nav div.pull-right a.button {
    background-color: orangered;
}

#nav a.button:hover {
    background-color: yellow;
}
```

The link will be orangered and the hover pseudo selector will NOT work because it has lower specificity. The hover has only one class and the orangered selector has two classes.

**Solution:** Give the pseudo selector another class to match specificity:

```css
a {
    background-color: purple;
}

#nav div.pull-right a.button {
    background-color: orangered;
}

#nav div.pull-right a.button:hover {
    background-color: yellow;
}
```

## Inheritance

Inheritance passes values for some specific properties from parents to children.

- Properties related to **TEXT** are inherited: `font-size`, `color`, etc.
- Margins and paddings are **NOT** inherited
- The **`inherit` keyword** forces inheritance on a property
- The **`initial` keyword** resets a property to its initial value

## Global Font Size

This selector is very important when we use `rem` as it relates to this value. If we declare a global font size and utilize `rem` instead of `em` and pixels, we only have to edit our code in one place to change the sizing all over.

### Why Use 10px Base?

It's easier to calculate: 10 × 1.5 or 50% of 10 than using 15px!

```
1rem = 10px
2rem = 20px
150% = 15px
50% = 5px
```

### The Problem with Fixed Pixel Values

Setting `font-size: 10px` prevents users from changing font size in their browser, which is **NOT GOOD** for accessibility.

### BEST PRACTICE Solution

The default font size in all browsers is 16px. To allow people to change the font size in their browsers, we set the HTML font-size as a percentage of 16px.

For 10px: 10/16 = 0.625 = 62.5%

```css
/* BEST PRACTICE */
html {
    font-size: 62.5%; /* 10px/16px = 62.5% */
}
```

This also makes the setting more granular with smaller increments and finer tuning.

### Box Sizing Change

The `box-sizing` property is not inherited, BUT we force inheritance by setting the parent to `inherit` then the body to `box-sizing: border-box`. Makes it easier to change properties in the future.

We also change the `*` selector to include all `::after` and `::before` pseudo-elements in the global reset.

**STANDARD SETUP:**

```css
*,
*::after,
*::before {
    margin: 0;
    padding: 0;
    box-sizing: inherit;
}

html {
    font-size: 62.5%;
}

body {
    font-family: "Lato", sans-serif;
    font-weight: 400;
    font-size: 16px;
    line-height: 1.7;
    color: #777;
    padding: 3rem;
    box-sizing: border-box;
}
```

## Box Model

1. **Content box** - has width and height
2. **Padding** - transparent area around the content, inside of the box
3. **Margin** - goes around the padding and content (BETWEEN BOXES/outside of box!)
4. **Fill area** - is the content box and the padding area (not margin)

### Setting box-sizing to "border-box"

**Only applies to block-level boxes**

Border-box allows us to set the total box size which includes the padding.

**Without border-box:**
```
total width = right border + right padding + specified width + left padding + left border
```

**With border-box:**
```
total width = specified width (includes padding and borders)
```

### Block Level Boxes

Formatted visually as blocks:

1. 100% of parent's width
2. Vertically one after the other

Block level types include:

```css
display: flex;
display: list-item;
display: table;
display: block;
```

### Inline Boxes

1. Content distributed in lines
2. Occupies only content's space
3. No line breaks
4. No heights and widths
5. Paddings and margins only horizontal

```css
display: inline;
```

### Inline-block Boxes

Mix of both:

1. Occupies only content's space
2. No line breaks
3. Box model applies as normal

```css
display: inline-block;
```

## Positioning Schemes

### 1. Normal Flow (Default)

1. Laid out according to source order
2. What happens if we don't apply any positioning
3. **NOT** floated and **NOT** absolutely positioned

```css
position: relative;
```

### 2. Floats

1. Element is removed from the normal flow
2. Text and inline elements wrap around the floated element
3. Container will **NOT** adjust its height to the element (use clearfix to fix this)

```css
float: left;
float: right;
```

### 3. Absolute Positioning

1. Element is removed from the normal flow
2. No impact on surrounding content or elements (can overlap)
3. Use `top`, `bottom`, `left`, `right` to offset from relatively positioned container

```css
position: absolute;
position: fixed;
```

### Stacking Contexts

Layers in depth defined by `z-index`. Higher z-index is at the top (visible), lower z-index is at the bottom.

## CSS Architecture

### BEM (Block Element Modifier)

Stand-alone component that is meaningful on its own.

```css
.block {}
.block__element {}
.block__element--modifier {}
```

**SCSS Nesting:**

```scss
.block {
    color: xxx;
    &__element {
        color: xxxx;
        &--modifier {
            color: green;
        }
    }
}
```

### 7-1 Pattern

1. **7 different folders** for organizing CSS
2. **1 main SASS file** to import all other files into a compiled CSS stylesheet

#### The 7 Folders

1. `base/` - Basic project styles
2. `components/` - Reusable components
3. `layout/` - Layout-related styles
4. `pages/` - Page-specific styles
5. `themes/` - Theme variations
6. `abstracts/` - Variables, mixins, functions
7. `vendors/` - Third-party CSS

---

**Related Guides:**
- [SASS/SCSS Guide](./sass-scss-guide.md)
- [CSS Animations](./css-animations.md)
- [Responsive Design Guide](./responsive-design-guide.md)
