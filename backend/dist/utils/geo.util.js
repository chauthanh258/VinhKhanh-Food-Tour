"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRandomCoords = exports.getRandom = void 0;
/**
 * Generates a random number between min and max
 */
const getRandom = (min, max) => {
    return Math.random() * (max - min) + min;
};
exports.getRandom = getRandom;
/**
 * Generates random coordinates within a relative bounding box around HCMC
 */
const getRandomCoords = () => {
    // Ho Chi Minh City approximate bounds
    const latMin = 10.7000;
    const latMax = 10.8500;
    const lngMin = 106.6000;
    const lngMax = 106.7500;
    return {
        lat: (0, exports.getRandom)(latMin, latMax),
        lng: (0, exports.getRandom)(lngMin, lngMax)
    };
};
exports.getRandomCoords = getRandomCoords;
//# sourceMappingURL=geo.util.js.map