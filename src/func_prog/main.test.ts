import { cond, compose } from "./main";

describe("compose", () => {
  test("", () => {
    const first = jest.fn((name: string) => name.trim());
    const second = jest.fn((name: string) => `Hello, ${name}`);
    const third = jest.fn((str: string) => str.toUpperCase());

    const run = compose(first, second, third);

    const res = run("  Johny  ");

    expect(first).toHaveBeenCalledTimes(1);
    expect(first).toHaveBeenNthCalledWith(1, "  Johny  ");

    expect(second).toHaveBeenCalledTimes(1);
    expect(second).toHaveBeenNthCalledWith(1, "Johny");

    expect(third).toHaveBeenCalledTimes(1);
    expect(third).toHaveBeenNthCalledWith(1, "Hello, Johny");

    expect(res).toEqual("HELLO, JOHNY");
  });
});

describe("cond", () => {
  test("", () => {
    const firstIf = jest.fn((name) => name === "Fred");
    const secondIf = jest.fn((name) => name === "Anna");
    const thirdIf = jest.fn((name) => name === "Brut");

    const first = jest.fn((name) => `Hello, admin Fred`);
    const second = jest.fn((name) => `Hello, wife Anna`);
    const third = jest.fn((name) => `Hello, fucking Freak`);

    const run = cond([
      [firstIf, first],
      [secondIf, second],
      [thirdIf, third],
    ]);

    const res = run("Anna");

    expect(firstIf).toHaveBeenCalledTimes(1);
    expect(firstIf).toHaveBeenNthCalledWith(1, "Anna");

    expect(first).toHaveBeenCalledTimes(0);

    expect(secondIf).toHaveBeenCalledTimes(1);
    expect(secondIf).toHaveBeenNthCalledWith(1, "Anna");

    expect(second).toHaveBeenCalledTimes(1);
    expect(second).toHaveBeenNthCalledWith(1, "Anna");

    expect(thirdIf).toHaveBeenCalledTimes(0);
    expect(third).toHaveBeenCalledTimes(0);

    expect(res).toEqual("Hello, wife Anna");
  });
});

/*const start = cond([
    [(name) => name === "Fred", (name) => `Hello, admin Fred`],
    [(name) => name === "Anna", (name) => `Hello, wife Anna`],
    [(name) => name === "Brut", (name) => `Hello, fucking Freak`],
  ]);
  
  console.log(start("Anna"));
  
   const run = compose(
    (name) => name.trim(),
    (name) => `Hello,${name}`
  );
  
  console.log(run("     Jonny    ")); */
