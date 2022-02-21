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
