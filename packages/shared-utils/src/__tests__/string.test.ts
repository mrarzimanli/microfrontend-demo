import { describe, it, expect } from "vitest";
import { getInitials } from "../string";

describe("getInitials", () => {
    it("returns the first letter of each word, uppercased", () => {
        expect(getInitials("Fada Arzimanli")).toBe("FA");
    });

    it("returns at most two initials for names with more than two words", () => {
        expect(getInitials("John Michael Scott")).toBe("JM");
    });

    it("handles a single-word name", () => {
        expect(getInitials("Madonna")).toBe("M");
    });

    it("uppercases lowercase first letters", () => {
        expect(getInitials("jane doe")).toBe("JD");
    });

    it("handles a name that is already fully uppercase", () => {
        expect(getInitials("ALICE BOB")).toBe("AB");
    });
});
