---
title: "SASS/SCSS Complete Guide"
description: "Comprehensive guide to SASS and SCSS including features, syntax, variables, mixins, functions, extends, installation, and build process configuration"
tags:
  - sass
  - scss
  - css-preprocessor
  - mixins
  - variables
  - build-process
  - npm-scripts
date: 2024-11-03
lastUpdated: 2024-11-03
---

# SASS/SCSS Complete Guide

SASS is a CSS preprocessor that adds power and elegance to the base language. It requires a precompiler to convert SASS/SCSS to standard CSS.

## Table of Contents

- [Features](#features)
- [SASS vs SCSS Syntax](#sass-vs-scss-syntax)
- [Variables](#variables)
- [Nesting](#nesting)
- [Mixins](#mixins)
- [Functions](#functions)
- [Extends](#extends)
- [Installing SASS](#installing-sass)
- [Build Process](#build-process)
- [BEM in SASS](#bem-in-sass)

## Features

1. **Variables** - Store reusable values
2. **Nesting** - Nest selectors inside each other
3. **Math Operators** - Perform calculations
4. **Partials and imports** - Split code into multiple files
5. **Mixins** - Reusable blocks of code
6. **Functions** - Return values based on logic
7. **Extends** - Share styles between selectors
8. **Control directives** - Conditional logic and loops

## SASS vs SCSS Syntax

SASS has two commonly used syntaxes:

### SASS Syntax (Indentation Sensitive)

No curly braces or semicolons - uses indentation like Python.

```sass
.navigation
    list-style: none
    float: left

    & li
        display: inline-block
        margin-left: 30px
```

### SCSS Syntax (Sassy CSS)

Uses curly braces and semicolons like regular CSS - most popular syntax.

```scss
// This is a comment

.navigation {
    list-style: none;
    float: left;

    & li {
        display: inline-block;
        margin-left: 30px;
    }
}

// Compiles to: .navigation li {}
```

## Variables

Declared at the beginning of your SASS file. Variables start with `$`.

```scss
$color-primary: #333;
$color-secondary: #777;
$font-stack: 'Lato', sans-serif;

body {
    font-family: $font-stack;
    color: $color-primary;
}
```

## Nesting

Nest selectors inside each other to match HTML structure.

```scss
.navigation {
    list-style: none;
    float: left;

    & li {
        display: inline-block;
        margin-left: 30px;
        
        &:hover {
            color: blue;
        }
    }
}
```

The `&` refers to the parent selector.

## Mixins

A code block that is reused and performs a function. Mixins can accept arguments.

### Basic Mixin Example

If an element is taller than the element containing it and it is floated, it will overflow outside of its container. To fix this problem, use clearfix as a mixin:

```scss
// The modern clearfix mixin
@mixin clearfix {
    &::after {
        content: '';
        clear: both;
        display: table;
    }
}

// Using the mixin
nav {
    margin: 30px;
    background-color: $primary;
    @include clearfix;
}
```

### Mixin with Arguments

```scss
@mixin border-radius($radius) {
    -webkit-border-radius: $radius;
    -moz-border-radius: $radius;
    border-radius: $radius;
}

.box {
    @include border-radius(10px);
}
```

## Functions

### Built-in Functions

SASS provides many built-in functions:

```scss
background-color: darken($primary, 10%);
color: lighten($primary, 20%);
border-color: rgba($primary, 0.5);
```

### Custom Functions

Create your own functions that return values:

```scss
@function divide($a, $b) {
    @return $a / $b;
}

// Calling it (* 1px converts to pixels)
margin: divide(60, 2) * 1px; // Results in 30px
```

## Extends

Use placeholders (`%`) to depict a part of code that is reused and extended where it's unique.

```scss
%btn-placeholder {
    padding: 2rem;
    display: inline-block;
    border-radius: 10rem;
    width: $btn-width;
}

// Now we use this code but can extend on it
.btn-main {
    &:link {
        @extend %btn-placeholder;
        background-color: $secondary;
    }
}

.btn-secondary {
    &:link {
        @extend %btn-placeholder;
        background-color: $tertiary;
    }
}
```

## Installing SASS

### Install as Dev Dependency

```bash
npm i node-sass -D
```

### Project Setup

1. Create a folder in root called `sass`
2. Store all SASS assets here
3. Create `main.scss` file
4. Copy any CSS to convert to SASS into the main file
5. All CSS code is read by SASS, so conversion is easy

### Basic Compile Script

Add `-w` to start watcher:

```json
{
  "scripts": {
    "compile:sass": "node-sass sass/main.scss css/style.css -w"
  }
}
```

Run it:

```bash
npm run compile:sass
```

### Live Server

Live-server in npm is a good way to develop instead of VS Code's live server:

```bash
npm i live-server -g
```

## Build Process

### Build Steps

1. **Compilation** - Convert SASS to CSS
2. **Concatenation** - Combine multiple CSS files
3. **Prefixing** - Add vendor prefixes for browser compatibility
4. **Compressing** - Minify CSS for production

### Install Dependencies

```bash
npm i concat -D 
npm i postcss-cli -D
npm i postcss -D
npm i autoprefixer -D
npm i npm-run-all -D
```

### Development Scripts

**Watch SASS files:**

```json
"watch:sass": "node-sass sass/main.scss css/style.css -w"
```

**Run dev server:**

```json
"devserver": "live-server"
```

**Run both in parallel:**

```json
"start": "npm-run-all --parallel devserver watch:sass"
```

Run with:

```bash
npm run start
```

### Production Scripts

**1. Compile SASS:**

```json
"compile:sass": "node-sass sass/main.scss css/style.comp.css"
```

**2. Concatenate CSS files:**

Combine `css/icon-font.css` and `css/style.comp.css` into `css/style.concat.css`:

```json
"concat:css": "concat -o css/style.concat.css css/icon-font.css css/style.comp.css"
```

**3. Add vendor prefixes:**

Add prefixes for last 10 browser versions:

```json
"prefix:css": "postcss --use autoprefixer -b 'last 10 versions' css/style.concat.css -o css/style.prefix.css"
```

**4. Compress CSS:**

```json
"compress:css": "node-sass css/style.prefix.css css/style.css --output-style compressed"
```

**5. Run all production scripts:**

```json
"build:css": "npm-run-all compile:sass concat:css prefix:css compress:css"
```

### Complete package.json Scripts

```json
{
  "scripts": {
    "watch:sass": "node-sass sass/main.scss css/style.css -w",
    "devserver": "live-server",
    "start": "npm-run-all --parallel devserver watch:sass",
    
    "compile:sass": "node-sass sass/main.scss css/style.comp.css",
    "concat:css": "concat -o css/style.concat.css css/icon-font.css css/style.comp.css",
    "prefix:css": "postcss --use autoprefixer -b 'last 10 versions' css/style.concat.css -o css/style.prefix.css",
    "compress:css": "node-sass css/style.prefix.css css/style.css --output-style compressed",
    "build:css": "npm-run-all compile:sass concat:css prefix:css compress:css"
  }
}
```

## BEM in SASS

Use BEM components to nest your code cleanly.

### Before (Flat CSS):

```scss
.header {
    height: 95vh;
    background-image: linear-gradient(
        to right, 
        rgba($color-primary-light, 0.8), 
        rgba($color-primary-dark, 0.902)), 
        url(../img/comb1.jpg);
    background-size: cover;
    background-position: top;
    position: relative;
    clip-path: polygon(0% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 100%);
}

.header__logo-box {
    position: absolute;
    top: 5rem;
    left: 5rem;
}

.header__logo {
    height: 12rem;
}
```

### After (Nested with BEM):

```scss
.header {
    height: 95vh;
    background-image: linear-gradient(
        to right, 
        rgba($color-primary-light, 0.8), 
        rgba($color-primary-dark, 0.902)), 
        url(../img/comb1.jpg);
    background-size: cover;
    background-position: top;
    position: relative;
    clip-path: polygon(0% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 100%);

    &__logo-box {
        position: absolute;
        top: 5rem;
        left: 5rem;
    }

    &__logo {
        height: 12rem;
    }

    &__text-box {
        position: absolute;
        top: 40%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
}
```

The `&` symbol references the parent selector, so `&__logo-box` becomes `.header__logo-box`.

## Best Practices

1. **Use variables** for colors, fonts, and repeated values
2. **Keep nesting to 3-4 levels max** to avoid specificity issues
3. **Use mixins** for repeated patterns
4. **Use extends** for shared base styles
5. **Organize with partials** - split code into multiple files
6. **Follow 7-1 pattern** for large projects (see CSS Fundamentals guide)

---

**Related Guides:**
- [CSS Fundamentals](./css-fundamentals.md)
- [CSS Animations](./css-animations.md)
- [Responsive Design Guide](./responsive-design-guide.md)
