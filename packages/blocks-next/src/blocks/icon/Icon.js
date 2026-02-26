import { useState, useRef, useEffect } from '@wordpress/element';
import ScIcon from '../../components/ScIcon';

// Find the nearest scrollable ancestor element
const findScrollableAncestor = (element) => {
	if (!element || element === document.body) {
		return null;
	}

	const parent = element.parentElement;
	if (!parent) {
		return null;
	}

	const overflowY = window.getComputedStyle(parent).overflowY;
	const isScrollable = overflowY !== 'visible' && overflowY !== 'hidden';

	if (isScrollable && parent.scrollHeight > parent.clientHeight) {
		return parent;
	}

	return findScrollableAncestor(parent);
};

/**
 * This component is used to display an icon in the icon picker.
 * It uses an IntersectionObserver to load the icon when it enters the viewport.
 */
export default function Icon({ name, selected, ...props }) {
	const [iconName, setIconName] = useState(undefined);
	const iconRef = useRef(null);

	useEffect(() => {
		// Find the nearest scrollable container or use viewport
		const scrollContainer = iconRef.current
			? findScrollableAncestor(iconRef.current)
			: null;

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						// Set the icon name when it enters the viewport
						setIconName(name);
						// Stop observing once loaded
						observer.disconnect();
					}
				});
			},
			{
				root: scrollContainer, // observes the scrollable container or viewport
				rootMargin: '50px', // triggers 50px before the element is fully visible
				threshold: 0.01,
			}
		);

		if (iconRef.current) {
			observer.observe(iconRef.current);
		}

		return () => {
			if (observer) {
				observer.disconnect();
			}
		};
	}, [name]);

	return (
		<button
			ref={iconRef}
			className={`surecart-icon-picker__item ${
				selected ? 'is-selected' : ''
			}`}
			aria-label={name}
			{...props}
		>
			{!!iconName && <ScIcon name={iconName} />}
		</button>
	);
}
