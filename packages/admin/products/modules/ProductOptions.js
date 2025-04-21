/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import usePageBuilderLinks from '../hooks/usePageBuilderLinks';

export default ({ post, onNavigate }) => {
	// Get page builder info and links
	const { editorLink } = usePageBuilderLinks(post);

	return (
		<div
			css={css`
				display: flex;
				gap: 1em;
				background-color: #e7e9ee;
				padding: var(--sc-spacing-x-large);
				border-radius: 7px;
				color: #494d58;
				justify-content: space-between;
			`}
		>
			<div>
				{__('Looking for additional product options?', 'surecart')}
			</div>

			<a
				href={editorLink}
				onClick={(e) => {
					e.preventDefault();
					onNavigate(editorLink);
				}}
				css={css`
					text-decoration: none;
					display: inline-flex;
					align-items: center;
					color: var(--sc-color-primary-500);
					gap: var(--sc-spacing-xx-small);
				`}
			>
				{__('Open Content Designer', 'surecart')}
				<sc-icon name="arrow-right"></sc-icon>
			</a>
		</div>
	);
};
