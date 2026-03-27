/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import {
	ScBlockUi,
	ScButton,
	ScDialog,
	ScInput,
	ScFlex,
} from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
import { useState, useEffect, useRef } from '@wordpress/element';
import { addQueryArgs } from '@wordpress/url';
import { store as coreStore } from '@wordpress/core-data';
import { useDispatch } from '@wordpress/data';
import Error from '../../../components/Error';

export default ({ open, onRequestClose }) => {
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);
	const [profileName, setProfileName] = useState('');
	const { saveEntityRecord } = useDispatch(coreStore);
	const input = useRef(null);

	// focus on name when opening.
	useEffect(() => {
		if (open) {
			setTimeout(() => {
				input.current.triggerFocus();
			}, 100);
		}
	}, [open]);

	const onSubmit = async (e) => {
		if (!profileName) {
			setError({
				message: __('The profile name is required.', 'surecart'),
			});
			return;
		}

		setLoading(true);
		try {
			const response = await saveEntityRecord(
				'surecart',
				'shipping-profile',
				{
					name: profileName,
				},
				{
					throwOnError: true,
				}
			);

			if (!!response?.id) {
				onRequestClose();
				window.location.assign(
					addQueryArgs(window.location.href, {
						type: 'shipping_profile',
						profile: response.id,
					})
				);
			}
		} catch (error) {
			console.error(error);
			setError(error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<ScDialog
			open={open}
			onScRequestClose={onRequestClose}
			label={__('Add Shipping Profile', 'surecart')}
		>
			<Error
				error={error}
				setError={setError}
				css={css`
					margin-bottom: var(--sc-spacing-small);
				`}
			/>

			<ScInput
				ref={input}
				required
				label={__('Name', 'surecart')}
				help={__(
					'Add a unique name. Customers won’t see this.',
					'surecart'
				)}
				onScInput={(e) => setProfileName(e.target.value)}
				name="name"
			/>
			<ScButton
				slot="footer"
				type="primary"
				disabled={loading}
				onClick={onSubmit}
			>
				{__('Add New', 'surecart')}
			</ScButton>
			<ScButton
				slot="footer"
				type="text"
				onClick={onRequestClose}
				disabled={loading}
			>
				{__('Cancel', 'surecart')}
			</ScButton>
			{loading && (
				<ScBlockUi
					style={{ '--sc-block-ui-opacity': '0.75' }}
					spinner
				/>
			)}
		</ScDialog>
	);
};
