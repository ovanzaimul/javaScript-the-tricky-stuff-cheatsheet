//1. Global
"use strict"
console.log(this); //In the wild(not inside of an object) - the value still window object() because not inside of a function(strict mode)

console.log("==================================================================================");
function whatIsThis() {
  return this; //undefined when in strict mode
}
whatIsThis(); //undefined when in strict mode

function variablesInThis() {
  //since the value of this is the window object
  //all we're doing here is creating a global variable
  // this.person = "ovan"; //when use strict mode, this will cause error(can't set property person of undefined), because 'this' is undefined
  // person = "ovan"; //when we call the function this will be error too if we in strict mode
  // var person = "ovan"; //we can't acces person outside of this function even if we not in strict mode 
}
// variablesInThis();

//2. Implcit/Object

//Strict mode does not make a difference here
var person = {
  firstName: "ovan",
  sayHi: function () {
    return "Hi " + this.firstName;
  },
  determineContext: function () {
    return this === person; //true
  },
  dog: {
    // firstName: "rusty",
    sayhello: function () {
      return "hello " + this.firstName; //"hello undefined"
    },
    determineContext: function () {
      return this === person; //false
    }
  }
}


//=====================

var myObject = {
  name: "ovan",
  age: 22,
  isHandsome: true,
  myName: function () {
    return this.name; //when using arrow function, keyword 'this' return differnt
  }
}


// 3. Explcit Binding

//a) Call
//FIXING OUR PREVIOUS ISSUE
//fixing up with call
var orang = {
  firstName: "ovan",
  sayHi: function () {
    return "Hi " + this.firstName;
  },
  determineContext: function () {
    return this === person; //true
  },
  dog: {
    // firstName: "rusty",
    sayhello: function () {
      return "hello " + this.firstName; //"hello undefined"
    },
    determineContext: function () {
      return this === person; //false
    }
  }
}

orang.dog.sayhello.call(person); //"hello ovan"
orang.dog.determineContext.call(person); //true
// One important thing to note is that we are not invoking the sayHello or determineContext method, we just attach call onto it. So there are no parentheses after sayHello and determineContext.


// very commonly call is used to avoid code application like this example below.
// Here we have two objects "rezky" and "darwin" which both have a firstName property and they sayHi method
// While this code works totally fine we're repeating ourselves quite a bit inside of the "darwin" object
// the sayhi method inside of the "darwin" object is identical to the same method inside of the "rezky" object.
var rezky = {
  firstName: "rezky",
  sayHi: function () {
    return "Hi " + this.firstName;
  }
}

// var darwin = {
//   firstName: "darwing",
//   //look at all this duplication
//   sayHi: function () {
//     return "Hi " + this.firstName;
//   }
// }

// How can we refactor our code and get rid of the sayHi method inside of the darwin object.
// What we really like to do is use the sayHi method from the rezky object, But instead of the keyword 'this' referring to rezky we want to explcitly set it to be the darwin object

//How can we refactor using call?

//How can we "borrow" the sayHi function from rezky
//ad set the value of 'this' to be darwin

//SOLUTION:
var darwin = {
  firstName: "darwing",
}
rezky.sayHi(); //"Hi rezky"
rezky.sayHi.call(darwin); //"Hi darwing"
//  we are using call to set the value of the keyword "this" to be darwin when the sayHi method is being invoked


// b) Apply

// Remember that the only difference between these two(call and apply) is when we have arguments to the function that we're using call or apply on
// in the previous example with the sayHi method, It didn't matter if we use call or apply We only start to see a difference when we start adding arguments

var nukma = {
  firstName: "nukma",
  sayHi: function () {
    return "Hi " + this.firstName;
  },
  addNumbers: function (a, b, c, d) {
    return this.firstName + " just calculated " + (a + b + c + d);
  }
}
var silva = {
  firstName: "silva"
}

nukma.sayHi(); //"Hi nukma"
nukma.sayHi.apply(silva); //"Hi silva"
//well this seems the same....but what happens when we start adding arguments
nukma.addNumbers(1, 2, 3, 4);//"nukma just calculated 10" | This function behaves like we want it to, Since the keyword this refers to the nukma object

// if we want to "borrow" the addNumbers function from nukma and set the keyword 'this' to refer to the silva object, we can use call or apply

//in order to pass arguments to the function using call, We separate them with a comma.
nukma.addNumbers.call(silva, 1, 2, 3, 4); //"silva just calculated 10"
//In the case of apply we pass all of the arguments as values in an array.
// So it looks very similar to call but in stead of comma separated values arguments we put them all inside of one array.
nukma.addNumbers.apply(silva, [1, 2, 3, 4]);//"silva just calculated 10"


// We'll see in a later video why this might be valuable in the next video.
// We're going to talk a bit more about bind and see just how helpful it can be when working with asynchronous code.


// 3) Bind
// Bind works just like call but instead of calling the function right away it returns a function definition with a keyword this set to the value of thisArg.
// So when is bind useful? one common use case is when we do not know all of the arguments that will be passed to a function.  which means we don't want to invoke the function right away. We just want to return a new function with some of the parameters set. We call this "partial application".
var silvaCalc = nukma.addNumbers.bind(silva, 1, 2, 3, 4);//function(){}...
silvaCalc();//"silva just calculated 10"
var silvaCalc2 = nukma.addNumbers.bind(silva, 1, 2);//function(){}...
silvaCalc2(3, 4);//"silva just calculated 10"
// What's neat about bind is that we do not need to know all the parameters to the function when we bind it. we only need to know what we want the value of the keyword this to be.

// Another very common use case of BIND is to set the context of the keyword this for a function that will be called at a later point in time.
// Very commonly This happens when dealing with asynchronous code or code that doesn't run line by line

// the asynchronous set timeout method.
// setTimeout is a method on the window object that's used to execute a function once after a specified amount of time.
// Remember!!! that said timeout is the method on the window object.

//for example, we make set timeOut function to console.log "hello world" after 20 seconds
// The first parameter to set timeout is a function to be executed.
// And the second parameter is the amount of time in milliseconds to wait before executing the function

// Now that we've called this(called the setTimeout functon) we can actually do other things like define new variables or continue running codes. This is what we mean by asynchronous(asinkron/tidak sinkron:D)