import pick from "./pick";

describe("lib/Pick", () => {
  it("picks requested keys", async () => {
    const testObject = {
      foo: "bar",
      baz: "boo",
      alpha: "beta",
    };

    const pickedObject = pick(testObject, ["foo", "baz"]);

    expect(pickedObject).toEqual(
      expect.objectContaining({
        foo: "bar",
        baz: "boo",
      })
    );
  });

  it("ignores missing keys in object", () => {
    const testObject = {
      foo: "bar",
      baz: "boo",
      alpha: "beta",
    };

    const pickedObject = pick(testObject, ["foo", "baz", "boo"]);

    expect(pickedObject).toEqual(
      expect.objectContaining({
        foo: "bar",
        baz: "boo",
      })
    );
  });
});
