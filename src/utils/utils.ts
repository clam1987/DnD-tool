export const createMap = (
  length: number,
  width: number,
  fillVal: string | number
) => {
  return Array.from({ length }, () =>
    Array.from({ length: width }, () => fillVal)
  );
};

export const camelCase = (str: string) =>
  str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (letter, index: number) =>
      index === 0 ? letter.toLowerCase() : letter.toUpperCase()
    )
    .replace(/\s+/g, "");
