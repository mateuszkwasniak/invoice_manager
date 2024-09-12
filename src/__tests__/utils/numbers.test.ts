import {
  convertNumberToPrice,
  convertPriceStringToNumber,
} from "@/lib/utils/numbers";

const CNTPTestData = [
  [10, "10,00"],
  [10.99, "10,99"],
  [10.9, "10,90"],
];

const CPSTNTestData = [
  ["10,00", 10.0],
  ["10,99", 10.99],
  ["10,90", 10.9],
  [" 10,99 ", 10.99],
  [" 1 0, 9 9 ", 10.99],
  ["10.99", 10.99],
];

//testowanie konwersji numerów na ceny w postaci string
test.each(CNTPTestData)("$input to be $expected", (input, expected) => {
  expect(convertNumberToPrice(input as number)).toBe(expected);
});

// //testowanie konwersji ceny w postaci string na numer
test.each(CPSTNTestData)("$input to be $expected", (input, expected) => {
  expect(convertPriceStringToNumber(input as string)).toBe(expected);
});
