import { cond, compose, map, then, chain, thenDoneFold, _catch } from "./main";
import wait from "waait";
import { NI_Next, Done } from "./functor";

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

describe.only("async", () => {
  const double = async (val: number) => {
    await wait(100);

    if (val === 5) throw new Error("I HATE FIVE....");

    return val * 2;
  };

  test("", async () => {
    const f = compose(
      (val: number) => (val === 9 ? Done.of("WE GOT NINE") : NI_Next.of(val)),
      chain(
        compose(
          double,
          then(NI_Next.of),
          _catch((err: any) => Done.of(err.message))
        )
      ),
      then(
        chain((val: any) =>
          val > 10 ? Done.of("More then ten") : NI_Next.of(val)
        )
      ),
      then(map((val: any) => val + 1)),
      thenDoneFold(
        (val: any) => `DONE WITH VALUE | ${val}`,
        (val: any) => `NEXT RESULT | ${val}`
      )
    );

    expect(await f(9)).toEqual("DONE WITH VALUE | WE GOT NINE");

    expect(await f(12)).toEqual("DONE WITH VALUE | More then ten");

    expect(await f(5)).toEqual("DONE WITH VALUE | I HATE FIVE....");

    expect(await f(2)).toEqual("NEXT RESULT | 5");
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
