/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import QuickLink from './QuickLink';
import { __ } from '@wordpress/i18n';

const QuickLinks = () => {
	return (
		<div
			css={css`
				display: grid;
				grid-template-columns: 1fr;
				gap: var(--sc-spacing-large);
				margin-bottom: var(--sc-spacing-x-large);

				@media (min-width: 640px) {
					grid-template-columns: repeat(2, 1fr);
				}

				@media (min-width: 1024px) {
					grid-template-columns: repeat(4, 1fr);
				}
			`}
		>
			<QuickLink
				icon="list-view"
				text={__('Guided setup', 'surecart')}
				href="https://surecart.com/docs/getting-started/"
				target="_blank"
			/>
			<QuickLink
				icon="life-buoy"
				text={__('Help center', 'surecart')}
				href="https://surecart.com/contact-us/"
				target="_blank"
			/>
			<QuickLink
				icon="users"
				text={__('Join our community', 'surecart')}
				href="https://www.facebook.com/groups/surecrafted"
				target="_blank"
			/>
			<QuickLink
				icon="star"
				text={__('Leave us a review', 'surecart')}
				href="https://wordpress.org/support/plugin/surecart/reviews/#new-post"
				target="_blank"
			/>
		</div>
	);
};

export default QuickLinks;
