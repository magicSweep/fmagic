import { intersection } from "lodash";

// PHOTO
export const aspectRatio = (width: number, height: number) => {
  return Math.round((width / height) * 10) / 10;
};

// OBJECT
export const isEmptyObj = (obj: Object) => Object.keys(obj).length === 0;

// FROM TYPE TO TYPE
export const strToDate = (str: string) => new Date(str);

// CHECK TYPES
export const isString = (val: any) => {
  return typeof val === "string";
};

export const isStringOrArray = (val: string | any[]) =>
  !isString(val) && !Array.isArray(val);

export const isStringOrArrayThrown = (val: string | any[]) => {
  if (!isStringOrArray(val))
    throw new Error(`Value must be of type string or array`);
};

export const isStringThrown = (val: any) => {
  if (!isString(val)) throw new Error(`Value must be of type string`);
};

// VALIDATION
export const isFileInputEmpty = (fileList?: FileList) => {
  return (
    fileList === undefined ||
    fileList instanceof FileList !== true ||
    fileList.length < 1
  );
};

export const isDateValid = (val: any) => {
  const date = new Date(val);
  return date.toString() !== "Invalid Date";
};

export const isDateValidThrown = (val: any) => {
  if (!isDateValid(val)) throw new Error("Not valid date format...");
};

export const minDate = (min: Date, val: Date) => {
  return val >= min;
};

export const maxDate = (max: Date, val: Date) => {
  return val <= max;
};

export const minLen = (len: number, val: string | any[]) => {
  return val.length >= len;
};

export const maxLen = (len: number, val: string | any[]) => {
  return val.length <= len;
};

// max - file size in MB, value - file size in bytes
export const maxFileSizeMB = (max: number, val: number) =>
  fromBytesToMB(val) <= max;

// @type - MIME type like image/jpeg or application/json
export const isValidFileFormat = (formats: string[], type: string) => {
  const format = type.split("/")[1];

  return formats.includes(format);
};

export const withMsg = (res: boolean, msg: string) => {
  return res === true ? "" : msg;
};

export const required = (val: any) => Boolean(val);

export const regex = (options: { pattern: RegExp }, value: string) => {
  if (options.pattern === undefined) throw new Error("No pattern...");

  const match = value.match(options.pattern);

  if (match === null || match[0] !== value) {
    return false;
  }

  return true;
};

export const isFileInputEmptyMsg = (msg: string, fileList?: FileList) =>
  withMsg(isFileInputEmpty(fileList), msg);

export const minDateMsg = (min: Date, msg: string, val: Date) =>
  withMsg(minDate(min, val), msg);

export const maxDateMsg = (max: Date, msg: string, val: Date) =>
  withMsg(maxDate(max, val), msg);

export const minLenMsg = (len: number, msg: string, val: any) =>
  withMsg(minLen(len, val), msg);

export const maxLenMsg = (len: number, msg: string, val: any) =>
  withMsg(maxLen(len, val), msg);

export const maxFileSizeMBmsg = (max: number, msg: string, val: number) =>
  withMsg(maxFileSizeMB(max, val), msg);

export const isValidFileFormatMsg = (
  formats: string[],
  msg: string,
  val: string
) => withMsg(isValidFileFormat(formats, val), msg);

export const requiredMsg = (msg: string) => (val: any) =>
  withMsg(required(val), msg);

export const regexMsg = (
  options: { pattern: RegExp },
  msg: string,
  value: string
) => withMsg(regex(options, value), msg);

// FUNCTIONAL PROGRAMMING

export const compose = (...fns: any[]) => (x: any) =>
  fns.reduce((y, f) => f(y), x); // fns.reduceRight((y, f) => f(y), x);

export const trace = (label: string) => (value: any) => {
  console.log(`${label}: ${JSON.stringify(value)}`);
  return value;
};

// OTHER

export const fromBytesToMB = (bytes: number) => {
  if (bytes === 0) return 0;

  return bytes / (1024 * 1024);
};

export const setStrOrArrResult = (
  results: string[],
  result: string | string[]
) => {
  if (result) {
    if (typeof result === "string") results.push(result);
    else if (Array.isArray(result)) return results.concat(result);
    else throw new Error(`No implementation for type | ${typeof result}`);
  }

  return results;
};

// return obj with same fields, but all values equal empty string
export const keyStringArr = (obj: {
  [key: string]: any;
}): { [key: string]: string[] } => {
  let res: { [key: string]: string[] } = {};
  for (let key in obj) {
    res[key] = [];
  }

  return res;
};

// check if object has not empty fields
export const hasValues = (obj: {
  [key: string]: string | string[];
}): boolean => {
  for (let key in obj) {
    let val = obj[key];

    if (Array.isArray(val)) {
      if (val.length > 0) return true;
    } else {
      if (Boolean(val) === true) return true;
    }
  }

  return false;
};

// check if object has just one key with value === true
export const hasTrueValue = (obj: { [key: string]: boolean }): boolean => {
  for (let key in obj) {
    if (obj[key] === true) return true;
  }

  return false;
};

// Return object keys that equals true
export const trueKeys = (obj: { [key: string]: any }) => {
  const result: string[] = [];
  for (let key in obj) {
    if (obj[key] === true) result.push(key);
  }
  return result;
};

// make from object [{a: "h", b: 13, c: "3"}, {a: "v", b: 11, c: "23"}] => {h: 13, v: 11}
// return { [obj[key]]: obj[value]}
export const makeCollection = (objs: any[], key: string, value: string) => {
  let res: any = {};
  objs.forEach((val) => {
    //console.log("---------makeCollection", val, key, value);
    res[val[key]] = val[value];
  });

  return res;
};

// ARRAY

export const isSameArrayValues = (arr1: string[], arr2: string[]) => {
  const resIntersection = intersection(arr1, arr2);
  if (
    resIntersection.length !== arr1.length ||
    resIntersection.length !== arr2.length
  ) {
    return false;
  }

  return true;
};
