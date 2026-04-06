import { useHistory } from '.';
import { addQueryArgs } from '@wordpress/url';
import { __ } from '@wordpress/i18n';
import { select } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';

export const useLink = (params) => {
	const history = useHistory();

	const href = addQueryArgs(window.location.pathname, params);

	const onClick = (event) => {
		event.preventDefault();

		// Check for unsaved changes before navigating.
		const dirtyRecords =
			select(coreStore).__experimentalGetDirtyEntityRecords();

		if (dirtyRecords.length > 0) {
			// eslint-disable-next-line no-alert
			if (
				!window.confirm(
					__(
						'You have unsaved changes. Are you sure you want to leave this page?',
						'surecart'
					)
				)
			) {
				return;
			}
		}

		history.push(params);
		window.scrollTo(0, 0);
	};

	return { href, onClick };
};
