export function clickOutside(el: HTMLElement | ShadowRoot, callback: () => void) {
  document.addEventListener('click', evt => {
    console.log(evt);
    let targetElement = evt.target as HTMLElement; // clicked element
    do {
      if (targetElement == el) {
        // This is a click inside. Do nothing, just return.
        return;
      }
      targetElement = targetElement.parentNode as HTMLElement; // Go up the DOM
    } while (targetElement);

    // run callback
    callback();
  });
}
