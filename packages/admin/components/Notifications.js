/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { SnackbarList } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';

import { store as noticesStore } from '@wordpress/notices';

/**
 * Wrapper that repositions WP's SnackbarList to bottom-right.
 *
 * WP's SnackbarList applies `position: fixed; left: -20px; bottom: …` via its
 * own Emotion CSS-in-JS. Because `left: auto/unset/initial` all resolve to the
 * element's natural offset (-20px in WP admin), we cannot "remove" left.
 *
 * Solution: wrap in a fixed container that's only as wide as the content and
 * anchored to the right. The SnackbarList inherits its containing block from
 * the wrapper rather than the viewport.
 */
const wrapperStyles = css`
	position: fixed !important;
	bottom: 40px !important;
	right: 20px !important;
	z-index: 100000 !important;

	.components-snackbar-list {
		position: static !important;
		left: auto !important;
	}
`;

export default ( { className } ) => {
	const notices = useSelect( ( select ) => select( noticesStore ).getNotices() );
	const { removeNotice } = useDispatch( noticesStore );
	const snackbarNotices = notices.filter( ( { type } ) => type === 'snackbar' );

	return (
		<div css={ wrapperStyles }>
			<SnackbarList
				notices={ snackbarNotices }
				className={ className }
				onRemove={ removeNotice }
			/>
		</div>
	);
};
