import { Done } from "./functor";

export const compose =
  <T, U>(...funcs: any[]) =>
  (val?: T): U =>
    funcs.reduce((acc, f) => {
      return f(acc);
    }, val);

export const cond =
  <T, U>(conditions: any[]) =>
  (val?: T): U | undefined => {
    for (let i = 0; i < conditions.length; i++) {
      if (conditions[i][0](val) === true) {
        return conditions[i][1](val);
      }
    }
  };

export const elif =
  <T, U>(
    condFunc: (val: T) => boolean,
    ifFunc: (val: T) => U,
    elseFunc: (val: T) => U
  ) =>
  (val: T): U => {
    if (condFunc(val) === true) {
      return ifFunc(val);
    } else {
      return elseFunc(val);
    }
  };

export const justReturn = <T>(param: T) => param;

export const push = (val: any) => (arr: any[]) => [...arr, val];

export const set = (prop: string, val: any) => (obj: any) => {
  if (typeof val === "function") {
    obj[prop] = val(obj);
  } else {
    obj[prop] = val;
  }

  //obj[prop] = val;

  return obj;
};

export const map =
  <T extends { map: any }>(f: any) =>
  (container: T) => {
    return container.map(f);
  };

export const tap = (f: any) => (data: any) => {
  f(data);
  return data;
};

export const chain = (f: any) => (container: any) => {
  return container.chain(f);
};

export const fold = (done: any, next: any) => (container: any) => {
  return container.fold(done, next);
};

export const flat = (f: any) => (container: any) => {
  return container.flat(f);
};

export const log = (tag: string) => (value: any) => {
  console.log(tag, value);
  return value;
};

export const mappedLog = (tag: string) => (value: any) => {
  console.log(tag, value.value);
  return value;
};

export const then = (f: any) => (thenable: any) => {
  //console.log("THENABLE-------", thenable);
  if (thenable instanceof Done === true) return thenable;

  return thenable.then(f);
};

export const thenDoneFlat = (f: any) => (thenable: any) => {
  //console.log("THENABLE-------", thenable);
  if (thenable instanceof Done === true) return f(thenable);

  return thenable.then(f);
};

export const thenDoneFold = (done: any, next: any) => (thenable: any) => {
  //console.log("THENABLE-------", thenable);
  if (thenable instanceof Done === true) return thenable.fold(done, next);

  return thenable.then((container: any) => container.fold(done, next));
};

export const _catch = (f: any) => (thenable: any) => {
  //console.log("THENABLE-------", thenable);
  if (thenable instanceof Done === true) return thenable;

  return thenable.catch(f);
};

export const _finally = (f: any) => (thenable: any) => thenable.finally(f);

//export const _catch = (f: any) => (catchable: any) => catchable.catch(f);

export const tryCatch = (_try: any, _catch: any) => (val?: any) => {
  try {
    return _try(val);
  } catch (err) {
    return _catch(err);
  }
};

export const tryCatchAsync = (_try: any, _catch: any) => async (val?: any) => {
  try {
    return await _try(val);
  } catch (err) {
    return _catch(err);
  }
};
