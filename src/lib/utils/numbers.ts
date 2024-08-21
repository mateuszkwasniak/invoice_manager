export const convertNumberToPrice = (price: number) => {
  return Intl.NumberFormat("pl", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
};

export const convertPriceStringToNumber = (input: string) => {
  return Number(input.replaceAll(",", ".").replace(/\s/g, "").trim());
};
