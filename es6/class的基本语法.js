class Point {
  constructor() {
    // ...
  }

  toString() {
    // ...
  }

  toValue() {
    // ...
  }
}

// 上面的写法等同于下面

Point.prototype = {
  constructor() {},
  toString() {},
  toValue() {},
};

//一个类必须有constructor()方法，如果没有显式定义，一个空的constructor()方法会被默认添加。
class Point {
}

// 等同于
class Point {
  constructor() {}
}

// es6类必须使用new调用，否则会报错
class Point {
  // ...
}

// 报错
var point = Point(2, 3);

// 正确
var point = new Point(2, 3);

// 如果在一个方法前，加上static关键字，就表示该方法不会被实例继承，而是直接通过类来调用，这就称为“静态方法”。
class Foo {
  static classMethod() {
    return 'hello';
  }
}

Foo.classMethod() // 'hello'

var foo = new Foo();
foo.classMethod()
// TypeError: foo.classMethod is not a function

// 如果静态方法包含this关键字，这个this指的是类，而不是实例。
//静态方法可以与非静态方法重名。
class Foo {
  static bar() {
    this.baz();
  }
  static baz() {
    console.log('hello');
  }
  baz() {
    console.log('world');
  }
}

Foo.bar() // hello


//父类的静态方法，可以被子类继承。
class Foo {
  static classMethod() {
    return 'hello';
  }
}

class Bar extends Foo {
}

Bar.classMethod() // 'hello'

class Foo {
  static classMethod() {
    return 'hello';
  }
}

class Bar extends Foo {
  static classMethod() {
    return super.classMethod() + ', too';
  }
}

Bar.classMethod() // "hello, too"

// new.target 属性
//如果构造函数不是通过new命令或Reflect.construct()调用的，new.target会返回undefined，因此这个属性可以用来确定构造函数是怎么调用的。

function Person(name) {
  if (new.target !== undefined) {
    this.name = name;
  } else {
    throw new Error('必须使用 new 命令生成实例');
  }
}

// 另一种写法
function Person(name) {
  if (new.target === Person) {
    this.name = name;
  } else {
    throw new Error('必须使用 new 命令生成实例');
  }
}

var person = new Person('张三'); // 正确
var notAPerson = Person.call(person, '张三');  // 报错

// Class 的继承
//在子类的构造函数中，只有调用super之后，才可以使用this关键字，否则会报错。
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class ColorPoint extends Point {
  constructor(x, y, color) {
    this.color = color; // ReferenceError
    super(x, y);
    this.color = color; // 正确
  }
}

//父类的静态方法，也会被子类继承。
class A {
  static hello() {
    console.log('hello world');
  }
}

class B extends A {
}

B.hello()  // hello world

//super虽然代表了父类A的构造函数，但是返回的是子类B的实例，
//即super内部的this指的是B的实例，因此super()在这里相当于A.prototype.constructor.call(this)。
class A {
  constructor() {
    console.log(new.target.name);
  }
}
class B extends A {
  constructor() {
    super();
  }
}
new A() // A
new B() // B

//super作为对象时，在普通方法中，指向父类的原型对象；在静态方法中，指向父类。
class A {
  p() {
    return 2;
  }
}

class B extends A {
  constructor() {
    super();
    console.log(super.p()); // 2
  }
}

let b = new B();

//在子类普通方法中通过super调用父类的方法时，方法内部的this指向当前的子类实例。
class A {
  constructor() {
    this.x = 1;
  }
  print() {
    console.log(this.x);
  }
}

class B extends A {
  constructor() {
    super();
    this.x = 2;
  }
  m() {
    super.print();
  }
}

let b = new B();
b.m() // 2

// 如果super作为对象，用在静态方法之中，这时super将指向父类，而不是父类的原型对象。
class Parent {
  static myMethod(msg) {
    console.log('static', msg);
  }

  myMethod(msg) {
    console.log('instance', msg);
  }
}

class Child extends Parent {
  static myMethod(msg) {
    super.myMethod(msg);
  }

  myMethod(msg) {
    super.myMethod(msg);
  }
}

Child.myMethod(1); // static 1

var child = new Child();
child.myMethod(2); // instance 2

//Class 作为构造函数的语法糖，同时有prototype属性和__proto__属性，因此同时存在两条继承链
//（1）子类的__proto__属性，表示构造函数的继承，总是指向父类。
//（2）子类prototype属性的__proto__属性，表示方法的继承，总是指向父类的prototype属性。
class A {
}

class B extends A {
}

B.__proto__ === A // true
B.prototype.__proto__ === A.prototype // true
