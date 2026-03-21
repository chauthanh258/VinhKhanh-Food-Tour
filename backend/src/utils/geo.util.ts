/**
 * Generates a random number between min and max
 */
export const getRandom = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};

/**
 * Generates random coordinates within a relative bounding box around HCMC
 */
export const getRandomCoords = () => {
  // Ho Chi Minh City approximate bounds
  const latMin = 10.7000;
  const latMax = 10.8500;
  const lngMin = 106.6000;
  const lngMax = 106.7500;

  return {
    lat: getRandom(latMin, latMax),
    lng: getRandom(lngMin, lngMax)
  };
};
