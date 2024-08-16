/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { ScIcon, ScSpinner } from '@surecart/components-react';
import { useState } from '@wordpress/element';
import { useDispatch, select } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { store as noticesStore } from '@wordpress/notices';
import apiFetch from '@wordpress/api-fetch';
import { createErrorString } from '../../../util';
import { __ } from '@wordpress/i18n';
import { Tooltip } from '@wordpress/components';

export default ({ className, media, onDownloaded }) => {
	const [loading, setLoading] = useState(false);
	const { createErrorNotice, createSuccessNotice } =
		useDispatch(noticesStore);

	const onDownloadImage = async () => {
		if (loading) {
			return;
		}

		try {
			setLoading(true);

			const { baseURL } = select(coreStore).getEntityConfig(
				'surecart',
				'product-media'
			);

			const newId = await apiFetch({
				path: `${baseURL}/${media?.id}/download`,
				method: 'POST',
			});

			createSuccessNotice(
				__('Image added to media library.', 'surecart'),
				{ type: 'snackbar' }
			);
			onDownloaded(newId);
		} catch (e) {
			console.error(e);
			createErrorNotice(createErrorString(e), { type: 'snackbar' });
		} finally {
			setLoading(false);
		}
	};

	return (
		<Tooltip
			text={__('Migrate image to server', 'surecart')}
			placement="top"
		>
			<div
				className={className}
				css={css`
					z-index: 10;
					cursor: pointer;
					padding: var(--sc-spacing-small);
					font-size: var(--sc-font-size-small);
					border-radius: var(--sc-border-radius-small);
					color: var(--sc-color-gray-800);
					font-weight: var(--sc-font-weight-semibold);
					background-color: var(--sc-color-white);
					border-radius: var(--sc-border-radius-small);
				`}
				onClick={onDownloadImage}
			>
				{loading ? (
					<ScSpinner />
				) : (
					<ScIcon className="download-icon" name="download-cloud" />
				)}
			</div>
		</Tooltip>
	);
};
