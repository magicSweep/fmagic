//import { isFunction } from "lodash-es";

// NOT IMMUTABLE
export class NI_Box<T> {
  _value: T;

  get value() {
    return this._value;
  }

  constructor(val: T) {
    this._value = val;
  }

  static of = <T>(value: T) => new Next(value);

  map = (f: (val: T) => any): NI_Box<T> => {
    this._value = f(this._value);
    return this;
  };

  chain = (f: (val: T) => any) => f(this._value);

  flat = (f: (val: T) => any) => f(this._value);
}

/* export class Validation {
  _value: any; // validate function (key, val) => Fail | Success

  get run() {
    return this._value;
  }

  constructor(value: any) {
    this._value = value;
  }

  static of = (value: any) => new Validation(value);

  contramap = (f: any) =>
    Validation.of((key: any, x: any) => this._value(key, f(x)));

  // other - Validation
  concat = (other: any) =>
    Validation.of((key: any, x: any) => {
      const res = this._value(key, x);

      //console.log("FUNCTOR CONCAT", res.isDone, key, x, res.value);

      if (res.isDone) return res;

      return res.concat(other._value(key, x));
    });
} */

export class NI_Next<T> {
  _value: T;
  _res: any;

  __IS_DONE = false;

  get value() {
    return this._value;
  }

  constructor(val: T) {
    this._value = val;
  }

  static of = <T>(value: T) => new Next(value);

  //map = (f: any): any => Next.of(f(this._value));
  map = (f: (val: T) => any): NI_Box<T> => {
    this._value = f(this._value);
    return this;
  };

  /* export const tap = (f: any) => (data: any) => {
  f(data);
  return data;
}; */

  tap = (f: any) => {
    f(this._value);
    return this;
  };

  chain = (f: any) => f(this._value);

  flat = (f: any) => f(this._value);

  fold = (done: any, next: any) => next(this._value);

  concat = (other: any) =>
    other.__IS_DONE === true
      ? other
      : Next.of((this._value as any).concat(other.value));
}

export class Next<T> {
  _value: T;
  _res: any;

  __IS_DONE = false;

  get value() {
    return this._value;
  }

  constructor(val: T) {
    this._value = val;
  }

  static of = <T>(value: T) => new Next(value);

  map = (f: any): any => Next.of(f(this._value));

  tap = (f: any) => {
    f(this._value);
    return this;
  };

  chain = (f: any) => f(this._value);

  flat = (f: any) => f(this._value);

  fold = (done: any, next: any) => next(this._value);

  concat = (other: any) =>
    other.__IS_DONE === true
      ? other
      : Next.of((this._value as any).concat(other.value));
}

export class DoneWithError {
  _value: any;

  __IS_DONE = true;

  get value(): any {
    return (this as Done)._value;
  }

  constructor(val: any) {
    (this as Done)._value = val;
  }

  static of = (value: any) => {
    if (typeof value === "string") console.error(value);
    return new Done(value);
  };

  map = (...args: any): Done => this;

  tap = (...args: any): Done => this;

  chain = (...args: any): Done => this;

  //then = (...args: any): Done => this;

  //catch = (...args: any): Done => this;

  //finally = (...args: any): Done => this;

  flat = (f: any): Done => f(this._value);

  concat = (...args: any): Done => this;

  fold = (done: any, next: any) => done(this._value);
}

export class Done {
  _value: any;

  __IS_DONE = true;

  get value() {
    return (this as Done)._value;
  }

  constructor(val: any) {
    (this as Done)._value = val;
  }

  static of = (value: any) => new Done(value);

  map = (...args: any): Done => this;

  tap = (...args: any): Done => this;

  chain = (...args: any): Done => this;

  //then = (...args: any): Done => this;

  //catch = (...args: any): Done => this;

  flat = (f: any): Done => f(this._value);

  fold = (done: any, next: any) => done(this._value);

  concat = (...args: any): Done => this;
}

export class IO {
  effect: any;

  constructor(effect: any) {
    if (typeof effect !== "function") {
      throw "IO Usage: function required";
    }
    this.effect = effect;
  }

  static of = (a: any) => {
    return new IO(() => a);
  };

  static from = (fn: any) => {
    return new IO(fn);
  };

  map = (fn: any) => {
    return new IO(() => fn(this.effect()));
  };

  chain = (fn: any) => {
    return fn(this.effect());
  };

  run = () => {
    return this.effect();
  };
}
