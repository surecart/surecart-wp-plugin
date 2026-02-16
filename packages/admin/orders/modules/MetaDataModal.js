/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { useDispatch, select } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { store as noticesStore } from '@wordpress/notices';
import apiFetch from '@wordpress/api-fetch';

/**
 * Internal dependencies.
 */
import Error from '../../components/Error';
import CodeEditor from '../../components/CodeEditor';
import {
	ScForm,
	ScButton,
	ScDrawer,
	ScBlockUi,
} from '@surecart/components-react';

export default function MetaDataModal({ onRequestClose, order, open }) {
	const [jsonValue, setJsonValue] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const { receiveEntityRecords } = useDispatch(coreStore);
	const { createSuccessNotice } = useDispatch(noticesStore);

	const { baseURL } = select(coreStore).getEntityConfig(
		'surecart',
		'draft-checkout'
	);

	// Get original metadata object (excluding reserved keys).
	const getOriginalMetadata = () => {
		const {
			wp_created_by,
			page_id,
			page_url,
			buy_page_product_id,
			...metadata
		} = order?.checkout?.metadata || {};
		return metadata;
	};

	useEffect(() => {
		if (open && order) {
			const metadata = getOriginalMetadata();
			setJsonValue(JSON.stringify(metadata, null, 2));
		}
	}, [open, order]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			// Parse the JSON string to an object.
			const parsedMetadata = JSON.parse(jsonValue);

			// Validate it's an object.
			if (
				typeof parsedMetadata !== 'object' ||
				parsedMetadata === null ||
				Array.isArray(parsedMetadata)
			) {
				throw new Error(
					__('Metadata must be a valid JSON object.', 'surecart')
				);
			}

			// Merge with reserved keys to preserve them.
			const originalMetadata = order?.checkout?.metadata || {};
			const { wp_created_by, page_id, page_url, buy_page_product_id } =
				originalMetadata;

			const fullMetadata = {
				...(wp_created_by !== undefined && { wp_created_by }),
				...(page_id !== undefined && { page_id }),
				...(page_url !== undefined && { page_url }),
				...(buy_page_product_id !== undefined && {
					buy_page_product_id,
				}),
				...parsedMetadata,
			};

			const checkout = await apiFetch({
				path: `${baseURL}/${order?.checkout?.id}`,
				method: 'PATCH',
				data: {
					metadata: fullMetadata,
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

				createSuccessNotice(__('Order updated.', 'surecart'), {
					type: 'snackbar',
				});

				onRequestClose();
			}
		} catch (err) {
			setError(err);
		} finally {
			setLoading(false);
		}
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

					<CodeEditor
						value={jsonValue}
						onChange={setJsonValue}
						label={__('Metadata', 'surecart')}
						help={__('Edit the metadata JSON format.', 'surecart')}
						mode="application/json"
						rows={15}
					/>
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
