/**
 * External dependencies.
 */
import { DateTimePicker } from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import { ScButton, ScDialog } from '@surecart/components-react';

export default ({ open, onRequestClose, item, updateItem }) => {
	const oldAffiliationExpiresAt = item?.affiliation_expires_at;
	const [affiliationExpiresAt, setAffiliationExpiresAt] = useState(
		new Date()
	);

	useEffect(() => {
		if (item?.affiliation_expires_at) {
			setAffiliationExpiresAt(
				new Date(item.affiliation_expires_at * 1000)
			);
		}
	}, [item?.affiliation_expires_at]);

	const cancel = () => {
		setAffiliationExpiresAt(oldAffiliationExpiresAt);
		onRequestClose();
	};

	const isInvalidDate = (date) => {
		return Date.parse(new Date()) > Date.parse(date);
	};

	return (
		<ScDialog
			label={__('Update Commission Expiration', 'surecart')}
			open={open}
			onScRequestClose={cancel}
			style={{
				'--width': '23rem',
				'--body-spacing':
					'var(--sc-spacing-xx-large) var(--sc-spacing-xx-large) 0 var(--sc-spacing-xx-large)',
				'--footer-spacing': 'var(--sc-spacing-xx-large)',
			}}
		>
			<DateTimePicker
				currentDate={affiliationExpiresAt}
				onChange={(date) => setAffiliationExpiresAt(date)}
				isInvalidDate={isInvalidDate}
			/>

			<ScButton type="text" slot="footer" onClick={cancel}>
				{__('Cancel', 'surecart')}
			</ScButton>

			<ScButton
				type="primary"
				slot="footer"
				onClick={() => {
					updateItem({
						affiliation_expires_at:
							Date.parse(affiliationExpiresAt) / 1000,
					});
					onRequestClose();
				}}
			>
				{__('Update', 'surecart')}
			</ScButton>
		</ScDialog>
	);
};
