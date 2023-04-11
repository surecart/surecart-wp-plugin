/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { store as coreStore } from '@wordpress/core-data';
import { useDispatch, useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { store as noticesStore } from '@wordpress/notices';

import Box from '../../ui/Box';
import SelectTemplate from '../components/SelectTemplate';
import Status from '../components/Status';
import Availability from '../components/Availability';
import Url from '../components/Url';

export default ({ product, updateProduct, loading }) => {
	const { createSuccessNotice, createErrorNotice } =
		useDispatch(noticesStore);

	const copy = async (text) => {
		try {
			await navigator.clipboard.writeText(text);
			createSuccessNotice(__('Copied to clipboard.', 'surecart'), {
				type: 'snackbar',
			});
		} catch (err) {
			console.error(err);
			createErrorNotice(__('Error copying to clipboard.', 'surecart'), {
				type: 'snackbar',
			});
		}
	};

	return (
		<Box
			loading={loading}
			title={
				<div
					css={css`
						display: flex;
						align-items: center;
						justify-content: space-between;
					`}
				>
					{__('Publishing', 'surecart')}
				</div>
			}
		>
			<div>
				<Status product={product} updateProduct={updateProduct} />
				<Availability product={product} updateProduct={updateProduct} />
				<SelectTemplate
					product={product}
					updateProduct={updateProduct}
				/>
				<Url product={product} updateProduct={updateProduct} />
			</div>
		</Box>
	);
};
