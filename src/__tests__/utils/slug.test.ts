import { generateSlug } from "@/lib/utils/slug";

const testData = [
  ["test", "test"],
  ["TEST", "test"],
  ["te-st", "te-st"],
  ["te/st", "te-st"],
  ["te st", "te-st"],
  ["tęśt", "test"],
];

test.each(testData)("$input to be $expected", (input, expected) => {
  expect(generateSlug(input)).toBe(expected);
});
