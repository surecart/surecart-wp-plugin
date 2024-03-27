/**
 * WordPress dependencies.
 */
import { useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { __ } from '@wordpress/i18n';
import { store as coreStore } from '@wordpress/core-data';
import { addQueryArgs } from '@wordpress/url';
import { __experimentalConfirmDialog as ConfirmDialog } from '@wordpress/components';

/**
 * Internal dependencies.
 */
import { ScBlockUi } from '@surecart/components-react';
import Error from '../../components/Error';
import { select } from '@wordpress/data';

export default ({ onRequestClose, open, referralId }) => {
	const [error, setError] = useState(null);
	const [deleting, setDeleting] = useState(false);

	const onDeleteReferral = async () => {
		try {
			setDeleting(true);

			const { baseURL } = select(coreStore).getEntityConfig(
				'surecart',
				'referral'
			);

			await apiFetch({
				path: `${baseURL}/${referralId}`,
				method: 'DELETE',
			});

			window.location.assign(
				addQueryArgs('admin.php', {
					deleted: true,
					page: 'sc-affiliate-referrals',
				})
			);
		} catch (e) {
			setDeleting(false);
			setError(e);
		}
	};

	return (
		<ConfirmDialog
			isOpen={open}
			onConfirm={() => {
				onDeleteReferral();
			}}
			onCancel={onRequestClose}
		>
			<Error error={error} />
			{__('Are you sure? This action cannot be undone.', 'surecart')}
			{deleting && (
				<ScBlockUi
					style={{ '--sc-block-ui-opacity': '0.75' }}
					zIndex="9"
					spinner
				/>
			)}
		</ConfirmDialog>
	);
};
