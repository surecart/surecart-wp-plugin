/**
 * Handles the keyboard events for enter and space key for role button.
 */
function handleButtonKeyboardEvent(event) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    event.currentTarget.click();
  }
}

/**
 * Add event listener for keyboard events on clickable elements.
 */
function addKeyboardEventListener() {
  // query a tag that has role="button" or role="radio" and tabindex="0" and add keyboard event listener
  const buttons = document.querySelectorAll('[role="button"][tabindex="0"], [role="radio"][tabindex="0"]');
  Array.from(buttons)?.forEach((button) => {
    button.addEventListener('keydown', handleButtonKeyboardEvent);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  addKeyboardEventListener();
});
