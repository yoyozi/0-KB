// console.log("first")
// console.log("Why is it so fantastic")

//x = 2 == 2; // true
//x = 2 === 2;  // true

//x = 2 == '2'; // true as it doesn't test the TYPE just the value
//x = 2 === "2"; // false as this is a string vs number

//x = 2 != 2  // false
//x = 2 !== 2 // false

//x = 10 > 5; // true
//x = 10 < 5; // false
//x = 10 <= 5  // false
//console.log(x)

//const airline = 'TAP Air Portugal';
//console.log(airline.lastIndexOf(' ')) // number of letters in last word
//console.log(airline.slice(0, airline.indexOf(' ')));  // We get TAP
//console.log(airline.slice(0, airline.lastIndexOf(' ')));  // We get ' Portugal'
//console.log(airline.slice(0, airline.lastIndexOf(' '))) + 1;  // We get 'Portugal'
//console.log(airline.slice(-2)); //We get 'al'
//console.log(airline.slice(1, -1)); //We get 'AP Air Portugal'

//const s = new String('Hello world');
// v = typeof s;
// console.log(s.__proto__); // see all properties

// console.log(s.length); // 12

// x = console(s.toUpperCase);
// x = console(s.toLowerCase);

// x = s.charAt(0); // get H
// x = s[0] // Same as above
// x = s.indexOf('l')  // get 2
// x = s.indexOf('d')  // get 10
// x = s.substring(0, 4) // get Hell (print from 0 - 4)
// x = s.substring(1, 4) // get ell (print from 1 - 4)

//const s = new String('   Hello world');
//x = s.trim().replace('world', 'Jon') // get Hello Jon
//x = s.split(' ') // get array of 5 items "['', '', '', 'Hello', 'world']"
//x = s.split('') // get [' ', ' ', ' ', 'H', 'e', 'l', 'l', 'o', ' ', 'w', 'o', 'r', 'l', 'd']

// const myString = 'developer';
// let myNewSting;

// // Solution 1
// //myNewSting = myString.charAt(0).toUpperCase() + myString.slice(1);

// // solution 2
// //myNewSting = myString[0].toUpperCase() + myString.substring(1)

// // solution 3
// myNewSting = `${myString[0].toUpperCase()}${myString.slice(0)}`

// console.log(myNewSting); 


// const num = new Number(5.990766);
// x = num.toString()

// x = num.toPrecision(4) // get 5.991
// x = num.toLocaleString('en-ZA') // same



// Math Object
// give us the properties and then methods that can be used

//console.log(Math);

//let x;
// x = 9;
// x = Math.sqrt(x) // 3

//x = 98.9
// x = Math.abs(x)
//x = Math.round(x)

// Rounding up "ciel" rounding down "floor"
//x = Math.ceil(x) 
//x = Math.floor(x)

// Powers (x to power of 3)
//x = Math.pow(x, 3)

// Max and Min
// x = Math.min(4, 3, 7) // get 3
// x = Math.max(4, 3, 7) // get 3

// Random numbers
// x = Math.random() // get 0.3454 a random fraction

// x = Math.floor(Math.random() * 11); // Random between 1 and 10

// Random number between 0 and 100 (inclusive)
// x = Math.floor(Math.random() * 101);

// let x, y, operand, Output;

// x = Math.floor(Math.random() * 11)
// y = Math.floor(Math.random() * 101)

// operand = "Sum"
// Output = x + y

// console.log("X=",x , "Y=",y)
// console.log("Operand:", operand, "Output: ", Output)

// console.log(new Date(2037, 0, 15, 23, 5, 44))
// console.log(new Date('2024-01-5'))
// console.log(new Date('5/1/2023'))

// let d;
// d = new Date();
// d = `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`
// console.log(d)

// const now = new Date();
// const options = {
//     //hour: 'numeric',
//     //minute: 'numeric',
//     day: 'numeric',
//     month: 'long',
//     //month: 'numeric',
//     //month: '2-digit',
//     year: 'numeric',
//     weekday: 'long'
// };

// // To set to browser setting
// // const locale = navigator.language
// // console.log(locale);

// d = new Intl.DateTimeFormat('en-ZA', options).format(now)
// e = new Intl.DateTimeFormat('en-ZA').format(now)
// f = new Intl.DateTimeFormat('default').format(now)

// console.log(d)
// console.log(e)
// console.log(f)

// // Shorter way

// g = now.toLocaleDateString('default');

// let x;
// const fruits = ['apple', 'orange', 'pear']
// const berries = ['strawberry', 'blueberry', 'raspberry' ]


// fruits.push(berries);
// console.log(fruits)

// If we want to see the nested array: 3rd index in fruits
// x = fruits[3]

// If we want to get raspberry:
// x = fruits[3][2]
// console.log(x)

// const allFruits = [fruits, berries]

//x = allFruits[1][0]
// gets the first element [0] in the second array [1]

// Take all items from one array and add it to another "concat"

//x = fruits.concat(berries)
//x = [...fruits, ...berries]

//We get : ['apple', 'orange', 'pear', 'strawberry', 'blueberry', 'raspberry']

//const arr = [1, 2, [3, 4], 5, [6, 7], 8]
// x = arr.flat();

// Static methods on the array object

// Check if is Array
// const arr = [1, 2, [3, 4], 5, [6, 7], 8]
// x = Array.isArray(arr)

// // console.log(x)

// // Create an array using "from"
// x = Array.from('12345')
// console.log(x)

// We get - ['1', '2', '3', '4', '5']

// Create an array from variables "of"

// const a = 1;
// const b = 2;
// const c = 3;

// x = Array.of(a, b, c)
// console.log(x)


// We get [1, 2, 3]

// // Challenge

// //Create an array: const arr = [1, 2, 3, 4, 5];
// // Turn it into [6, 5, 4, 3, 2, 1, 6]

// x = Array.from('123456');
// console.log(x)

// y = x.reverse();
// x = [...y, '6']
// console.log(x)

// const toDos = [
//     { id: 1, name: 'Buy milk' },
//     { id: 2, name: 'Sweep yard'},
//     { id: 3, name: 'Burn leaves'}
// ];

// x = toDos;
// let y;

// // Accessing parts of the array of Objects
// // console.log(x[0]);
// // console.log(x[0].name);

// const toDo = new Object();

// toDo.id = 1
// toDo.name = 'Buy motor';
// toDo.completed = false;

// // Getting the keys
// x = Object.keys(toDo);
// console.log(x)


// const post = {
//     id: 1,
//     title: "The title",
//     body: "The body"
// }

// const str = JSON.stringify(post) // To JOSN strings
// const obj = JSON.parse(str)    // Back to object

// console.log(typeof(str))
// console.log(str)
// console.log(typeof(obj))
// console.log(obj)



// // function Declaration (HOISTED)
// function calcAge1(birthYeah){
//     return 2037 - birthYeah
// }


// // Now expression (anon)
// const calcAge2 = function(birthYeah){
//     return 2037 - birthYeah
// }

// const age2 = calcAge2(1967)
// console.log("age2 after expression/anon")
// console.log(age2)


// // arrow function from function expression
// console.log("age3 arrow")
// const calcAge3 = birthYeah => 2037 - birthYeah;


// // Called before declared hence can be 'hoisted'
// const age1  = calcAge1(1967);
// console.log("declared function: age1")
// console.log(age1)


// function sum(...numbers) {
//     let total = 0;

//     for(const num of numbers) {
//         total += num
//     }

//     return total
// }

// console.log(sum(1, 2, 3))


// Example Scope

// const x = 100;

// console.log(x, "in GLOBAL SCOPE")

// function run() {
//     console.log(window.innerHeight);
//     console.log(x, "In FUNCTION SCOPE")
// };

// run();

// if (true) {
//     console.log(x, "BLOCK SCOPE")
// }

// function add() {
//     const y = 50;
//     console.log(x + y)
// }

// add();


// let x = 100;
// let y = 50;
// function getSum(n1, n2) {
//     let sum = n1 + n2;
//     return sum
// }
// let sum1 = getSum(x, y);
// let sum2 = getSum(10, 5);

// console.log(sum1, sum2)


// Check for empty array

// const arr = [];


// // This wont work as array [] is true
// if (arr) {
//     console.log("Yes array has values")
// } else {
//     console.log("Array is empty")
// }

// // So we need to:

// if (arr.length > 0) {
//     console.log(user.length)
// } else {
//     console.log("Array is empty")
// }

// const user = {}

// // This wont work
// if (user) {
//     console.log(user)
// } else {
//     console.log("No user exists")
// }

// // We console.log user.length - "undefined" so we check like this
// console.log(user.length) // we get: undefined
// console.log(user, typeof user); // we get: {} 'object'
// console.log(Object.keys(user)) // we get [] an empty array SO...
// console.log(Object.keys(user).length) // we get 0 SO...
// console.log(Object.keys(user).length > 0) // YES we get 'false'

// if (Object.keys(user).length > 0) {
//     console.log(user)
// } else {
//     console.log("No users exist!")
// }

// // Loose equality Rather test with === as it tests type as well
// console.log(false == 0); // we get true
// console.log('' == 0);  // we get true
// console.log(null == undefined)  // we get true


// console.log(false === 0); // we get false
// console.log('' === 0);  // we get false
// console.log(null === undefined)  // we get false

// // ||
// console.log(10 < 20 || 30 > 15 || 10 > 1)  // true, true true hence true as all true
// console.log(10 < 2 || 30 > 15 || 10 > 1)  // false, true, true hence true as two are true

// // &&
// console.log(10 < 20 && 30 > 15 && 10 > 1)  // true, true, true hence true as all true
// console.log(10 < 2 && 30 > 15 && 10 > 1)  // false, true, true hence as one is false

// // || returns the first true value of the last even if true or false
// let b;

// b = 10 || 20 // we get 10
// b = 0 || 20 // we get 20 as 0 is false
// b = 0 || NaN || 20 // we get 20
// b = 0 || NaN || 0 // we get 0 as its last and all false
// console.log(b)

// //  && Returns the first false value or the last value even if true
// let c;

// c = 10 && 20 // we get 20 the last as there are no falsey values
// c = 1 && NaN && 3 // we get NaN
// c = 1 && undefined // we get undefined
// c = 1 && undefined && 0 // we get undefined as its the first false valse
// c = 1 && 0 && 20 // we get 0 as its the first false valse
// c = 2 && 3 && true && 1000 // we get 1000 as its the last value even if its true

// console.log(c)

// // && Example of the above we use a lot in React

// const posts = ['post one', 'post two']
// posts.length > 0 && console.log(posts[0]) // we get 'post one' as its the last value true or false


// const mposts = []
// mposts.length > 0 && console.log(mposts[0]) // we get NOTHING as the first value is false but prints nothing

// Nullish coalescence

// const rest1 = {
//     name: 'Capri',
//     numGuests: 20,
// };

// const rest2 = {
//     name: 'La Piazza',
//     owner: 'Giovani Rossi'
// };

// Lets set the default number of guests if they dont have this property set.

// rest1.numGuests = rest2.numGuests || 10
// console.log(rest1.numGuests)

// let c;

// c = 10 ?? 20 // returns 10 as left hand side is not null or undefined
// c = null ?? 20 // returns 20 as left hand side is null
// c = undefined ?? 30 // returns 30 as left hand side is undefined

// console.log(c)

// let c = null;

// // if (c === null || c === undefined) {
// //     c = 20
// // }

// // same as 

// c ??= 20

// console.log(c)




// for(var v = 0; v < 11; v++) {
//     console.log("v is: ", v)
// }
// console.log("Loop is finished and we can get v as var not block scoped: ", v)

// const names = ["Joe", "Jack", "Bob", "Craig", "Tim", "Juli"]
// for(let n = 0; n < names.length; n++) {
    //     if (names[n] === "Craig") {
        //         console.log("Craig is the BEST")
//     } else {
//         console.log(`${names[n]} is the worst!`)
//     }
// }


// Fizz Buzz

// for(var i = 1; i <= 100; i++) {
//     if (i % 3 === 0 && i % 5 === 0)  {
//         console.log("FizzBuzz")
//     } else if (i % 5 == 0) {
//         console.log("Buzz")
//     } else if (i % 3 === 0) {
//         console.log("Fizz")
//     } else {
//         console.log(i)
//     }
// }
// console.log("Loop is finished and we can get i:", i-1)


// const colors = {
//     color1: "red",
//     color2: "green",
//     color3: "yellow",
//     color4: "blue",
//     color5: "black",
//     color6: "orange"  
// }


// for (color in colors) {
//     console.log(color)
// }

// const a = Math.floor(Math.random() * 10).toString();
// const b = Math.floor(Math.random() * 10).toString();
// const c = Math.floor(Math.random() * 10).toString();
// const d = Math.floor(Math.random() * 10).toString();
// const e = Math.floor(Math.random() * 10).toString();
// const f = Math.floor(Math.random() * 10).toString();
const y = (Math.floor(Math.random() * 10).toString() + 
    Math.floor(Math.random() * 10).toString() + 
    Math.floor(Math.random() * 10).toString() + 
    Math.floor(Math.random() * 10).toString() + 
    Math.floor(Math.random() * 10).toString() + 
    Math.floor(Math.random() * 10).toString())
console.log(y)



































































