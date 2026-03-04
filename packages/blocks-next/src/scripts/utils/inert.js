/**
 * Holds all elements that are made inert when a drawer is open; used to
 * remove inert attribute of only those elements explicitly made inert.
 *
 * @type {Array}
 */
let inertElements = [];

/**
 * Check if an element is or contains a11y speak regions
 * @param {Element} element Element to check
 * @return {boolean} True if element is or contains a11y speak regions
 */
function isA11ySpeakElement(element) {
	return (
		element.classList.contains('a11y-speak-region') ||
		element.classList.contains('a11y-speak-intro-text') ||
		element.querySelector(
			'#a11y-speak-assertive, #a11y-speak-polite, #a11y-speak-intro-text'
		)
	);
}

/**
 * Walk up from the given element to <body>, making all siblings inert
 * at each level. This ensures the element remains interactive while
 * everything else on the page is inert.
 *
 * @param {Element} element The element to keep interactive.
 */
export function inertEverythingExcept(element) {
	inertElements = [];
	let current = element;

	while (current && current !== document.body) {
		const parent = current.parentElement;
		if (!parent) break;

		Array.from(parent.children).forEach((sibling) => {
			if (
				sibling !== current &&
				!sibling.hasAttribute('inert') &&
				!isA11ySpeakElement(sibling)
			) {
				sibling.setAttribute('inert', '');
				inertElements.push(sibling);
			}
		});

		current = parent;
	}
}

/**
 * Remove inert from all elements that were previously made inert.
 */
export function removeInert() {
	inertElements.forEach((el) => {
		el.removeAttribute('inert');
	});
	inertElements = [];
}
