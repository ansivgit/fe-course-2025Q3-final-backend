export const getRandomElement = <T>(array: T[]): T => {
  if (!Array.isArray(array) || array.length === 0) {
    throw new Error('Cannot get random element from an empty or invalid array');
  }

  const randomIndex = Math.floor(Math.random() * array.length);
  const item = array[randomIndex];

  if (item === undefined) {
    throw new Error('Failed to retrieve element from array');
  }

  return item;
};
