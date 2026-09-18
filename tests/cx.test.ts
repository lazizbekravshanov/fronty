import { describe, expect, it } from "vitest";
import { cx } from "../src/utils/cx";

describe("cx", () => {
  it("joins strings and skips falsy values", () => {
    expect(cx("a", false, null, undefined, "", "b")).toBe("a b");
  });

  it("adds keys from objects when their value is true", () => {
    expect(cx("btn", { active: true, disabled: false })).toBe("btn active");
  });
});
