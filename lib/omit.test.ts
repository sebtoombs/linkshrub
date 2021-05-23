import omit from "./omit";

describe("lib/Omit", () => {
  it("omits requested keys", async () => {
    const testObject = {
      foo: "bar",
      baz: "boo",
      alpha: "beta",
    };

    const omittedObject = omit(testObject, ["foo", "baz"]);

    expect(omittedObject).toEqual(
      expect.objectContaining({
        alpha: "beta",
      })
    );
  });

  it("ignores missing keys in object", () => {
    const testObject = {
      foo: "bar",
      baz: "boo",
      alpha: "beta",
    };

    const omittedObject = omit(testObject, ["foo", "baz", "boo"]);

    expect(omittedObject).toEqual(
      expect.objectContaining({
        alpha: "beta",
      })
    );
  });
});
