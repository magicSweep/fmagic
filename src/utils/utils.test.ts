import {
  minLen,
  isStringOrArrayThrown,
  isStringThrown,
  compose,
  isFileInputEmpty,
  maxDate,
  minDate,
  isValidFileFormat,
  hasValues,
  makeCollection,
} from "./main";
import { cond, flow, gte, toUpper } from "lodash-es";

//@ts-ignore
global.FileList = class {
  length: number = 0;
  "0": File;

  setLength(length: number) {
    this.length = length;
  }

  setFile(file: File) {
    this[0] = file;
  }
};

//@ts-ignore
global.File = class {
  type: string = "image/png";
  size: number = 0;

  setType(type: string) {
    this.type = type;
  }

  setSize(size: number) {
    this.size = size;
  }
};

describe("", () => {
  test("", () => {
    const f = (...args: any) => {
      return args;
    };

    const res = f(1, 2, 3, 4);

    const argS = res.slice(0, -2);

    const [three, four] = res.slice(-2);

    expect(three).toEqual(3);
    expect(four).toEqual(4);
    expect(argS).toEqual([1, 2]);
    expect(Array.isArray(res)).toEqual(true);
  });

  describe.only("hasValues", () => {
    const possibilities = [
      { obj: { name: "", tags: [] }, expected: false },
      { obj: { name: " ", tags: [] }, expected: true },
      { obj: { name: "", tags: [""] }, expected: true },
      { obj: { name: "", tags: ["hello"] }, expected: true },
    ];

    test.each(possibilities)("", ({ obj, expected }) => {
      expect(hasValues(obj)).toEqual(expected);
    });
  });

  describe("makeCollection", () => {
    const possibilities = [
      {
        arrObj: [
          { name: "one", errors: "e", any: 12 },
          { name: "two", errors: "a", any: 23 },
          { name: "three", errors: "b", any: 34 },
        ],
        expected: { one: "e", two: "a", three: "b" },
      },
    ];

    test.each(possibilities)("", ({ arrObj, expected }) => {
      expect(makeCollection(arrObj, "name", "errors")).toEqual(expected);
    });
  });

  test("minLen", () => {
    expect(minLen(2, "Hello")).toEqual(true);

    expect(minLen(10, "Hello")).toEqual(false);
  });

  test("minDate", () => {
    expect(minDate(new Date(2020, 8, 7), new Date(2020, 8, 8))).toEqual(true);

    expect(minDate(new Date(2020, 8, 7), new Date(2020, 8, 6))).toEqual(false);
  });

  test("maxDate", () => {
    expect(maxDate(new Date(2020, 8, 7), new Date(2021, 8, 6))).toEqual(false);

    expect(maxDate(new Date(2021, 8, 7), new Date(2020, 8, 8))).toEqual(true);
  });

  test("isFileInputEmpty", () => {
    const fileList = new FileList();

    expect(isFileInputEmpty()).toEqual(true);

    expect(isFileInputEmpty("hello" as any)).toEqual(true);

    expect(isFileInputEmpty(fileList as any)).toEqual(true);

    (fileList as any).setLength(1);

    expect(isFileInputEmpty(fileList as any)).toEqual(false);
  });

  test("isValidFileFormat", () => {
    const formats = ["jpeg", "jpg", "png"];

    /* const fileList = new FileList();
    // @ts-ignore
    const file = new File();
    // @ts-ignore
    file.setSize(667776);
    // @ts-ignore
    file.setType("image/png");

    // @ts-ignore
    fileList.setFile(file); */

    expect(isValidFileFormat(formats, "image/png")).toEqual(true);

    // @ts-ignore
    //file.setType("application/json");

    expect(isValidFileFormat(formats, "application/json")).toEqual(false);
  });
});

describe("lodash", () => {
  test("cond", () => {
    const func = cond([
      [(val: string) => val === "hello", (val: string) => `hello - ${val}`],
      [(val: string) => val === "bye", (val: string) => `bye - ${val}`],
    ]);

    expect(func("bye")).toEqual("bye - bye");
  });

  test("gte", () => {
    expect(gte(3, 5)).toEqual(false);
    expect(gte("hello", "hel")).toEqual(true);
    expect(gte("hello", "her")).toEqual(false);
    expect(gte(new Date(), new Date(2020, 10, 23))).toEqual(true);
    expect(gte(new Date(), new Date(2022, 10, 23))).toEqual(false);
  });

  test("flow", () => {
    const res = flow(
      (str) => str + ", hello",
      (str) => toUpper(str)
    );

    expect(res("Jonny")).toEqual("JONNY, HELLO");
  });
});
