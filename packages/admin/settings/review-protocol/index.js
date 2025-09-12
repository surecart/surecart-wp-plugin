/** @jsx jsx */
import { jsx } from '@emotion/react';
import ReviewProtocolSettings from './ReviewProtocolSettings';

window.addEventListener('load', () => {
	const reviewProtocolSettings = document.querySelector('#review-protocol-settings');
	if (reviewProtocolSettings) {
		wp.element.render(<ReviewProtocolSettings />, reviewProtocolSettings);
	}
});