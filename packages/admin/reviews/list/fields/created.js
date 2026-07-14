/** @jsx jsx */
import { __, sprintf } from '@wordpress/i18n';
import { css, jsx } from '@emotion/react';

export default () => ({
	id: 'created',
	label: __('Submitted on', 'surecart'),
	enableSorting: true,
	getValue: ({ item }) => item?.created_at || '',
	render: ({ item }) => {
		const submitted = item?.created_at_date_time;
		if (!submitted) return '-';

		const updated = item?.updated_at_date_time;
		const wasEdited =
			updated && item?.updated_at && item?.updated_at !== item?.created_at;

		if (!wasEdited) return submitted;

		return (
			<div>
				<div>{submitted}</div>
				<small
					css={css`
						opacity: 0.65;
					`}
				>
					{sprintf(
						/* translators: %s is the last-updated date and time. */
						__('Updated %s', 'surecart'),
						updated
					)}
				</small>
			</div>
		);
	},
});
