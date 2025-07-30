const observe = jest.fn();
const unobserve = jest.fn();

// you can also pass the mock implementation
// to jest.fn as an argument
window.IntersectionObserver = jest.fn(() => ({
  observe,
  unobserve,
}));

// you can also pass the mock implementation
// to jest.fn as an argument
global.MutationObserver = class {
  constructor(callback) {}
  disconnect() {}
  observe(element, initObject) {}
};

global.DOMParser = class {
  constructor() {}
  parseFromString(file, type) {}
};

// Mock window.wp for WordPress dependencies.
// global.wp = {
//   i18n: {
//     __: jest.fn((text) => text),
//     _n: jest.fn((single, plural, number) => number === 1 ? single : plural),
//     sprintf: jest.fn((...args) => args[0]),
//   },
//   a11y: {
//     speak: jest.fn(),
//   },
// };
