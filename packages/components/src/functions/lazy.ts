/** Do something the first time the element is visible */
export const onFirstVisible = (el, callback) => {
  const intersectionObserver = new IntersectionObserver((entries, observer) => {
    if (entries[0].intersectionRatio > 0) {
      callback();
      observer.unobserve(entries[0].target);
    }
  });
  intersectionObserver.observe(el);
};
