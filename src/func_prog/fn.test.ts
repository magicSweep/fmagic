import {
  curry,
  identity,
  isFunction,
  partial,
  startCase,
  flow,
} from "lodash-es";

const pipe =
  (...fns: any[]) =>
  (x: any) =>
    fns.reduce((v, f) => f(v), x);

const compose =
  (...fns: any[]) =>
  (x: any) =>
    fns.reduceRight((y, f) => f(y), x);

const trace = (label: string) => (value: any) => {
  console.log(`${label}: ${value}`);
  return value;
};

describe("Functor", () => {
  test("", () => {
    //const wrappedValue = wrap("Hello");

    class Wrapper {
      private _value: any;

      constructor(value: any) {
        this._value = value;
      }

      map(f: any) {
        return f(this._value);
      }

      fmap(f: any) {
        return new Wrapper(f(this._value));
      }

      toString() {
        return `Wrapper ${this._value}`;
      }
    }

    const wrap = (val: any) => new Wrapper(val);

    const wrappedNull = wrap(null);

    const plus = curry((a: number, b: number) => a + b);

    const plus3 = plus(3);

    const two = wrap(2);

    const five = two.fmap(plus3);

    expect(five.map(identity)).toEqual(5);

    expect(two.map(identity)).toEqual(2);

    expect(two.map(plus3)).toEqual(5);

    expect(two.fmap(plus3).fmap(plus3).map(identity)).toEqual(8);
  });
});

describe("Monada", () => {
  class Wrapper {
    private _value: any;

    constructor(value: any) {
      this._value = value;
    }

    // единичная функция
    static of(a: any) {
      return new Wrapper(a);
    }

    // функция связывания - функтор
    map(f: any) {
      return Wrapper.of(f(this._value));
    }

    // функция сведения вложенных уровней
    join(): Wrapper {
      if (!(this._value instanceof Wrapper)) {
        return this;
      }
      return this._value.join();
    }

    get() {
      return this._value;
    }

    toString() {
      return `Wrapper ${this._value}`;
    }
  }

  describe("Maybe", () => {
    class Maybe {
      static just(a: any) {
        return new Just(a);
      }

      static nothing() {
        return new Nothing();
      }

      static fromNullable(a: any) {
        return a !== null ? Maybe.just(a) : Maybe.nothing();
      }

      static of(a: any) {
        return this.just(a);
      }

      get isNothing() {
        return false;
      }

      get isJust() {
        return true;
      }
    }

    class Just extends Maybe {
      private _value: any;

      constructor(value: any) {
        super();
        this._value = value;
      }

      get value() {
        return this._value;
      }

      map(f: any): any {
        return Maybe.fromNullable(f(this._value));
      }

      getOrElse() {
        return this._value;
      }

      filter(f: any) {
        Maybe.fromNullable(f(this._value)) ? this._value : null;
      }

      chain(f: any) {
        return f(this._value);
      }

      toString() {
        return `Maybe.Just(${this._value})`;
      }
    }

    class Nothing extends Maybe {
      _value: any = undefined;

      map(f: any) {
        return this;
      }

      get value() {
        throw new TypeError("Can't extract the value of a Nothing.");
      }

      getOrElse(other: any) {
        return other;
      }

      filter() {
        return this._value;
      }

      chain(f: any) {
        return f(this._value);
      }

      toString() {
        return "Maybe.Nothing";
      }
    }

    test("", () => {});
  });

  describe("Either", () => {
    class Either {
      _value: any;

      constructor(value: any) {
        this._value = value;
      }

      get value() {
        return this._value;
      }

      static left(a: any) {
        return new Left(a);
      }

      static right(a: any) {
        return new Right(a);
      }

      static fromNullable(val: any) {
        return val !== null && val !== undefined
          ? Either.right(val)
          : Either.left(val);
      }

      static of(a: any) {
        return Either.right(a);
      }
    }

    class Right extends Either {
      map(f: any): any {
        return Either.of(f(this._value));
      }

      getOrElse() {
        return this._value;
      }

      orElse() {
        return this;
      }

      chain(f: any) {
        return f(this._value);
      }

      getOrElseThrow() {
        return this.value;
      }

      filter(f: any) {
        return Either.fromNullable(f(this._value)) ? this._value : null;
      }

      toString() {
        return `Either.Right(${this._value})`;
      }
    }

    class Left extends Either {
      map(f: any) {
        return this;
      }

      get value() {
        throw new TypeError("Can't extract the value of a Left(a).");
      }

      getOrElse(other: any) {
        return other;
      }

      orElse(f: any) {
        return f(this._value);
      }

      chain(f: any) {
        return this;
      }

      getOrElseThrow(a: any) {
        throw new Error(a);
      }

      filter(f: any) {
        return this._value;
      }

      toString() {
        return `Either.Left(${this._value})`;
      }
    }

    test("", () => {});
  });

  describe("IO", () => {
    class IO {
      effect: any;

      constructor(effect: any) {
        if (!isFunction(effect)) {
          throw "IO Usage: function required";
        }
        this.effect = effect;
      }

      static of(a: any) {
        return new IO(() => a);
      }

      static from(fn: any) {
        return new IO(fn);
      }

      map(fn: any) {
        let self = this;
        return new IO(() => fn(self.effect()));
      }

      chain(fn: any) {
        return fn(this.effect());
      }

      run() {
        return this.effect();
      }
    }

    const read = (document: any, selector: any) => {
      return () => {
        console.log("------READ------");
        return "kostia shniperson";
      };
    };

    const write = (document: any, selector: any) => {
      return (val: string) => {
        console.log("--------WRITE------");
        return val;
      };
    };

    const readDom = partial(read, "document");
    const writeDom = partial(write, "document");

    test("Chain with IO", () => {
      // readDom("#student-name") - return function, not value
      const changeToStartCase = IO.from(readDom("#student-name"))
        .map(startCase)
        .map(writeDom("#student-name"));

      //changeToStartCase.run();

      expect(changeToStartCase.run()).toEqual("Kostia Shniperson");
    });

    test.only("Compose with IO", () => {
      const liftIO = function (val: any) {
        //return IO.of(val);
        return IO.from(val);
      };

      const map = curry((f: any, container: any) => {
        return container.map(f);
      });

      const chain = curry((f: any, container: any) => {
        return container.chain(f);
      });

      const changeToStartCase = flow(
        liftIO,
        map(startCase),
        map(writeDom("#student-name"))
      );

      // readDom("#student-name") - return function, not value
      /*  changeToStartCase = IO.from(readDom("#student-name"))
        .map(startCase)
        .map(writeDom("#student-name")); */

      //changeToStartCase.run();

      expect(changeToStartCase(readDom("#student-name")).run()).toEqual(
        "Kostia Shniperson"
      );
    });

    const factorial: any = (n: number) => (n === 0 ? 1 : n * factorial(n - 1));

    const factorialOptimezed: any = (n: number, current = 1) =>
      n === 1 ? current : factorialOptimezed(n - 1, n * current);

    /*  const map = R.curry((f, container) => {
      return container.map(f);
    })

    const chain = R.curry((f, container) => {
      return container.chain(f);
    })

    const liftIO = function(val) {
      return IO.of(val);
    }

    const showStudent = R.compose(
      R.tap(trace("Student added to Html page")),
      map(append("#student-info")),
      liftIO,
      map(csv),
      chain(findStudent),
      chain(chekcLengthSsn),
      lift(cleanInput)
    )

    showStudent(studentId).run(); */
  });
});

/* describe("lodash", () => {
  test("", () => {
    const t = (one: any, two: any) => one + two;

    const plusOne = curry(t);

    expect(plusOne(4)(1)).toEqual(5);

    // flow, chain, partial
  });
}); */
