---
title: "CSS Animations and Transitions"
description: "Complete guide to CSS animations, transitions, keyframes, pseudo-classes, and pseudo-elements with practical examples"
tags:
  - css
  - animations
  - transitions
  - keyframes
  - pseudo-classes
  - pseudo-elements
date: 2024-11-03
lastUpdated: 2024-11-03
---

# CSS Animations and Transitions

Complete guide to creating smooth animations and transitions in CSS using keyframes, pseudo-classes, and pseudo-elements.

## Table of Contents

- [Transitions](#transitions)
- [Keyframe Animations](#keyframe-animations)
- [Pseudo-classes](#pseudo-classes)
- [Pseudo-elements](#pseudo-elements)
- [Complete Button Animation Example](#complete-button-animation-example)

## Transitions

The `transition` property is shorthand for four CSS properties:
- `transition-property`
- `transition-duration`
- `transition-timing-function`
- `transition-delay`

### Basic Transition Example

```css
.btn {
    background-color: blue;
    transition: all 0.2s;
}

.btn:hover {
    background-color: red;
    transform: translateY(-3px);
}
```

## Keyframe Animations

Keyframes allow you to define animation steps. Triggered by `:focus`, `:hover`, `:active`, or applied directly to elements.

### Animation Properties

```css
.element {
    animation-name: moveInLeft;
    animation-duration: 1.5s;
    animation-delay: 0.5s;
    animation-iteration-count: 3;
    animation-timing-function: ease-out;
    animation-fill-mode: backwards;
}

/* Shorthand */
.element {
    animation: moveInLeft 1.5s ease-out 0.5s;
}
```

### Creating Keyframes

```css
@keyframes moveInLeft {
    0% {
        opacity: 0;
        transform: translateX(-150px);
    }
    80% {
        transform: translateX(10px);
    }
    100% {
        opacity: 1;
        transform: translate(0);
    }
}
```

### Common Animation Examples

**Move in from left:**

```css
@keyframes moveInLeft {
    0% {
        opacity: 0;
        transform: translateX(-150px);
    }
    80% {
        transform: translateX(10px);
    }
    100% {
        opacity: 1;
        transform: translate(0);
    }
}
```

**Move in from right:**

```css
@keyframes moveInRight {
    0% {
        opacity: 0;
        transform: translateX(150px);
    }
    80% {
        transform: translateX(-10px);
    }
    100% {
        opacity: 1;
        transform: translate(0);
    }
}
```

**Move in from bottom:**

```css
@keyframes moveInBottom {
    0% {
        opacity: 0;
        transform: translateY(30px);
    }
    80% {
        transform: translateY(-10px);
    }
    100% {
        opacity: 1;
        transform: translate(0);
    }
}
```

### Preventing Animation Shake

Use `backface-visibility: hidden` to stop shaking during animations:

```css
.heading-primary {
    backface-visibility: hidden;
}
```

## Pseudo-classes

Pseudo-classes select elements based on their state.

### Common Pseudo-classes

**Link states:**

```css
.btn:link {
    /* Unvisited link */
}

.btn:visited {
    /* Visited link */
}

.btn:hover {
    /* Mouse over */
}

.btn:active {
    /* Being clicked */
}

.btn:focus {
    /* Has focus */
}
```

**Form states:**

```css
:hover          /* Element is hovered */
:enabled        /* Element is enabled */
:disabled       /* Element is disabled */
:checked        /* Checkbox/radio is checked */
:valid          /* Form input is valid */
:invalid        /* Form input is invalid */
:required       /* Form input is required */
:optional       /* Form input is optional */
:in-range       /* Input value is in range */
:out-of-range   /* Input value is out of range */
:read-only      /* Input is read-only */
:read-write     /* Input is editable */
```

### Form Validation Example

```html
<input type="number" min="5" max="7" required aria-required="true"/>
<input type="number" min="0" step="0.1" max="10"/>
```

```css
input:valid { 
    border: 1px solid green;
}

input:invalid { 
    border: 1px solid red;
}

input:required,
input[aria-required="true"] {
    border-width: 5px;
}

input:optional {
    border-width: 10px;
}

input:out-of-range { 
    background-color: pink;
}

input:in-range { 
    background-color: lightgreen;
}
```

### Structural Selectors

Target elements based on their relationships to other elements in the DOM.

```css
E:nth-child()           /* Nth child of parent */
E:nth-last-child()      /* Nth child from end */
E:nth-of-type()         /* Nth element of type */
E:nth-last-of-type()    /* Nth element of type from end */
E:first-child           /* First child */
E:last-child            /* Last child */
E:first-of-type         /* First element of type */
E:last-of-type          /* Last element of type */
E:only-child            /* Only child */
E:only-of-type          /* Only element of type */
E:root                  /* Root element (html) */
E:empty                 /* Element with no children */
E:not(:empty)           /* Element with children */
```

**Examples:**

```css
:nth-of-type(even)      /* Even elements (2n) */
:nth-of-type(odd)       /* Odd elements (2n + 1) */
:nth-of-type(3n-1)      /* Every 3rd element minus 1 */
```

**Note:** For `An + B`, to find which element gets styled first, set n = 0. For `3n+12`, the 12th element will be first.

### Negation Pseudo-class

```css
div:not(.excludeMe)         /* All divs without class .excludeMe */
div:not([title])            /* All divs without title attribute */
div:not(:nth-of-type(3))    /* All divs except the 3rd one */
div:not(#id)                /* All divs without id of 'id' */
```

### Empty Selector

```css
p:empty         /* All empty p elements */
div:empty       /* All empty divs */
```

**Resources:**
- [Selectors Guide](http://estelle.github.io/selectors/#slide24)
- [Selectors Playground](http://estelle.github.io/selectors/#slide25)

## Pseudo-elements

Pseudo-elements create "faux" elements you can style.

```css
::first-line        /* First line of text */
::first-letter      /* First letter */
::before            /* Insert content before element */
::after             /* Insert content after element */
::selection         /* Selected text */
```

**Note:** Use single colon (`:`) for IE compatibility.

### Pseudo-element Examples

**First letter styling:**

```css
p::first-letter {
    font-size: 2em;
    font-weight: bold;
    color: red;
}
```

**Selection styling:**

```css
::selection {
    background-color: yellow;
    color: black;
}
```

## Complete Button Animation Example

A fully animated button with hover effects and pseudo-elements:

```css
/* Button base styles */
.btn:link, 
.btn:visited {
    text-transform: uppercase;
    text-decoration: none;
    padding: 15px 40px;
    display: inline-block;
    border-radius: 100px;
    transition: all 0.2s;
    position: relative;
}

/* Hover state */
.btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.2);
}

/* Active (clicked) state */
.btn:active {
    transform: translateY(-1px);
    box-shadow: 0 5px 10px rgba(0,0,0,0.2);
}

/* Button color variant */
.btn-white {
    background-color: #fff;
    color: #777;
}

/* Pseudo-element for animation effect */
.btn::after {
    content: "";
    display: inline-block;
    height: 100%;
    width: 100%;
    border-radius: 100px;
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
    transition: all .4s;
}

.btn-white::after {
    background-color: #fff;
}

/* Hover effect on pseudo-element */
.btn:hover::after {
    transform: scaleX(1.5) scaleY(1.6);
    opacity: 0;
}

/* Animated entrance */
.btn-animated {
    animation: moveInBottom 1.5s ease-out 0.5s;
    animation-fill-mode: backwards;
}
```

### Complete Page Example

```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: "Lato", sans-serif;
    font-weight: 400;
    font-size: 16px;
    line-height: 1.7;
    color: #777;
    padding: 30px;
}

.header {
    height: 95vh;
    background-image: linear-gradient(
        to right, 
        rgba(242, 227, 110, 0.8), 
        rgba(159, 110, 61, 0.9)), 
        url(../img/comb.jpg);
    background-size: cover;
    background-position: top;
    position: relative;
    clip-path: polygon(0% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 100%);
}

.text-box {
    position: absolute;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
}

.heading-primary {
    color: #fff;
    text-transform: uppercase;
    backface-visibility: hidden;
    margin-bottom: 60px;
}

.heading-primary-main {
    display: block;
    font-size: 45px;
    font-weight: 600;
    letter-spacing: 3px;
    animation: moveInLeft 1.5s ease-out;
}

.heading-primary-sub {
    display: block;
    font-size: 25px;
    font-weight: 700;
    letter-spacing: 18px;
    animation: moveInRight 1.5s ease-out;
}
```

## Animation Best Practices

1. **Use `transform` and `opacity`** for best performance
2. **Add `backface-visibility: hidden`** to prevent animation shake
3. **Use `animation-fill-mode: backwards`** to hide elements before animation starts
4. **Keep animations subtle** - 0.2s to 1.5s is usually good
5. **Use `ease-out` for entering** animations
6. **Use `ease-in` for exiting** animations
7. **Test on different devices** - animations can be slow on mobile

---

**Related Guides:**
- [CSS Fundamentals](./css-fundamentals.md)
- [SASS/SCSS Guide](./sass-scss-guide.md)
- [Responsive Design Guide](./responsive-design-guide.md)
