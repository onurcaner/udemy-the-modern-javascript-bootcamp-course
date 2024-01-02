export const create2dNullArray = (rows: number, columns: number): null[][] => {
  return Array.from({ length: rows }, (_row) =>
    Array.from({ length: columns }, (_cell) => null)
  );
};
/**
 * Generate random int including max and min
 */
export const generateRandomInt = (max: number, min = 0): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
