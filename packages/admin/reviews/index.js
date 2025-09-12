import { __ } from '@wordpress/i18n';
import ReviewsList from './ReviewsList';

window.addEventListener('load', () => {
	const reviewsList = document.querySelector('sc-reviews-list');
	if (reviewsList) {
		wp.element.render(<ReviewsList />, reviewsList);
	}
});