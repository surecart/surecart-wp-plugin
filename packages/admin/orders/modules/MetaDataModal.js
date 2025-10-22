/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { useDispatch, select } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import apiFetch from '@wordpress/api-fetch';

/**
 * Internal dependencies.
 */
import Error from '../../components/Error';
import {
	ScForm,
	ScButton,
	ScInput,
	ScDrawer,
	ScBlockUi,
} from '@surecart/components-react';

export default function MetaDataModal({
	onRequestClose,
	order,
	metadatas,
	open,
}) {
	const [formData, setFormData] = useState({});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const { receiveEntityRecords } = useDispatch(coreStore);

	const { baseURL } = select(coreStore).getEntityConfig(
		'surecart',
		'checkout'
	);

	useEffect(() => {
		if (!!metadatas) {
			setFormData(
				metadatas.reduce((acc, { key, value }) => {
					acc[key] = value;
					return acc;
				}, {})
			);
		}
	}, [metadatas]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			const checkout = await apiFetch({
				path: `${baseURL}/${order?.checkout?.id}`,
				method: 'PATCH',
				data: {
					metadata: formData,
				},
			});

			if (checkout && checkout.id) {
				receiveEntityRecords(
					'surecart',
					'order',
					{
						...order,
						checkout: {
							...order.checkout,
							metadata: checkout?.metadata,
						},
					},
					undefined,
					false,
					{
						checkout: {
							...order.checkout,
							metadata: checkout?.metadata,
						},
					}
				);
				onRequestClose();
			}
		} catch (err) {
			setError(err);
		} finally {
			setLoading(false);
		}
	};

	const handleChange = (key, value) => {
		setFormData((prev) => ({
			...prev,
			[key]: value,
		}));
	};

	return (
		<ScForm onScFormSubmit={handleSubmit}>
			<ScDrawer
				label={__('Edit Additional Order Data', 'surecart')}
				open={open}
				onScAfterHide={onRequestClose}
			>
				<div
					css={css`
						display: grid;
						gap: var(--sc-spacing-medium);
						padding: var(--sc-spacing-x-large);
					`}
				>
					<Error error={error} setError={setError} />

					{metadatas.map(({ key, label }) => (
						<ScInput
							key={key}
							label={label}
							value={formData[key] || ''}
							onScInput={(e) => handleChange(key, e.target.value)}
						/>
					))}
				</div>

				<ScButton
					type="primary"
					disabled={loading}
					submit
					slot="footer"
					busy={loading}
				>
					{__('Save', 'surecart')}
				</ScButton>
				<ScButton
					type="text"
					onClick={onRequestClose}
					disabled={loading}
					slot="footer"
				>
					{__('Cancel', 'surecart')}
				</ScButton>

				{loading && <ScBlockUi spinner></ScBlockUi>}
			</ScDrawer>
		</ScForm>
	);
}
