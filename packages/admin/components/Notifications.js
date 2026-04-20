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
 * anchored to the right. The nested SnackbarList is reset to `position: static`
 * so it inherits the wrapper's containing block rather than the viewport.
 *
 * The `.sc-notifications` wrapper class raises specificity enough that no
 * `!important` flags are required to beat WP's CSS-in-JS output.
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

export default ( { className } ) => {
	const notices = useSelect( ( select ) => select( noticesStore ).getNotices() );
	const { removeNotice } = useDispatch( noticesStore );
	const snackbarNotices = notices.filter( ( { type } ) => type === 'snackbar' );

	return (
		<div className="sc-notifications" css={ wrapperStyles }>
			<SnackbarList
				notices={ snackbarNotices }
				className={ className }
				onRemove={ removeNotice }
			/>
		</div>
	);
};
