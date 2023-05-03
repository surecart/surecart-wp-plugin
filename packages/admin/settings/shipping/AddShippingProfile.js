/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import {
	ScBlockUi,
	ScButton,
	ScDialog,
	ScForm,
	ScInput,
} from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

export default ({ show, onRequestClose }) => {
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);
	const [profileName, setProfileName] = useState('');

	const onSubmit = async (e) => {
		setLoading(true);
		try {
			await apiFetch({
				path: 'surecart/v1/shipping_profiles',
				data: {
					name: profileName,
				},
				method: 'POST',
			});
			onRequestClose();
		} catch (error) {
			console.error(error);
			if (error?.additional_errors?.[0]?.message) {
				setError(error?.additional_errors?.[0]?.message);
			} else {
				setError(
					e?.message ||
						__('Failed to add shipping profile.', 'surecart')
				);
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<ScDialog
			show={show}
			onRequestClose={onRequestClose}
			title={__('Add Shipping Profile', 'surecart')}
		>
			<Error error={error} setError={setError} />
			<ScForm onSubmit={onSubmit}>
				<ScInput
					required
					label={__('Name', 'surecart')}
					help={__(
						'A name for this bump that will be visible to customers.',
						'surecart'
					)}
					onScInput={(e) => setProfileName(e.target.value)}
					name="name"
				/>
				<div slot="footer">
					<ScButton
						type="primary"
						onClick={onAddProfile}
						disabled={loading}
						submit
					>
						{__('Add', 'surecart')}
					</ScButton>{' '}
					<ScButton
						type="text"
						onClick={onRequestClose}
						disabled={loading}
					>
						{__('Cancel', 'surecart')}
					</ScButton>
				</div>
			</ScForm>
			{loading && (
				<ScBlockUi
					style={{ '--sc-block-ui-opacity': '0.75' }}
					spinner
				/>
			)}
		</ScDialog>
	);
};
