const replacements = {
  ą: "a",
  ć: "c",
  ę: "e",
  ł: "l",
  ń: "n",
  ó: "o",
  ś: "s",
  ź: "z",
  ż: "z",
  Ą: "A",
  Ć: "C",
  Ę: "E",
  Ł: "L",
  Ń: "N",
  Ó: "O",
  Ś: "S",
  Ź: "Z",
  Ż: "Z",
};

export const generateSlug = (title: string): string => {
  for (const letter of title) {
    if (replacements?.[letter as keyof typeof replacements]) {
      title = title.replace(
        letter,
        replacements[letter as keyof typeof replacements]
      );
    }
  }
  return title
    .replace(/[A-Z]/g, (match) => match.toLowerCase())
    .replace(/\//g, "-")
    .replace(/\s+/g, "-");
};
