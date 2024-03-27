/** @jsx jsx */

/**
 * WordPress dependencies.
 */
import { useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';

/**
 * Internal dependencies.
 */
import { jsx } from '@emotion/core';
import {
	ScBlockUi,
	ScButton,
	ScDialog,
	ScFlex,
} from '@surecart/components-react';
import Error from '../../components/Error';

export default ({ onRequestClose, open, referralId }) => {
	const [error, setError] = useState(null);
	const [deleting, setDeleting] = useState(false);

	const onDeleteReferral = async () => {
		try {
			setDeleting(true);
			await apiFetch({
				path: `/surecart/v1/referrals/${referralId}`,
				method: 'DELETE',
			});

			window.location.assign(
				addQueryArgs('admin.php', {
					deleted: true,
					page: 'sc-affiliate-referrals',
				})
			);
		} catch (e) {
			setError(e);
		} finally {
			setDeleting(false);
		}
	};

	return (
		<ScDialog label="Are you sure?" open={open}>
			<Error error={error} setError={setError} />
			{__(
				'Are you sure you want to delete this referral? This action cannot be undone.',
				'surecart'
			)}
			<ScFlex justifyContent="flex-end" gap="1em">
				<ScButton type="text" onClick={onRequestClose}>
					{__('Cancel', 'surecart')}
				</ScButton>
				<ScButton type="primary" onClick={onDeleteReferral}>
					{__('Delete', 'surecart')}
				</ScButton>
			</ScFlex>
			{deleting && (
				<ScBlockUi
					style={{ '--sc-block-ui-opacity': '0.75' }}
					zIndex="9"
					spinner
				/>
			)}
		</ScDialog>
	);
};
