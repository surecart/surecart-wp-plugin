/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { SnackbarList } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';

import { store as noticesStore } from '@wordpress/notices';

/**
 * Wrapper that repositions WP's SnackbarList to bottom-right.
 */
const wrapperStyles = css`
	&.sc-notifications {
		position: fixed;
		bottom: 40px;
		right: 20px;
		z-index: 100000;
	}

	&.sc-notifications .components-snackbar-list {
		position: static;
		left: auto;
	}
`;

export default ({ className }) => {
	const notices = useSelect((select) => select(noticesStore).getNotices());
	const { removeNotice } = useDispatch(noticesStore);
	const snackbarNotices = notices.filter(({ type }) => type === 'snackbar');

	return (
		<div className="sc-notifications" css={wrapperStyles}>
			<SnackbarList
				notices={snackbarNotices}
				className={className}
				onRemove={removeNotice}
			/>
		</div>
	);
};
