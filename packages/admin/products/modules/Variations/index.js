/**
 * External dependencies.
 */
/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { store as noticesStore } from '@wordpress/notices';
import { useDispatch } from '@wordpress/data';

/**
 * Internal dependencies.
 */
import { ScButton, ScIcon } from '@surecart/components-react';
import Box from '../../../ui/Box';
import VariantOptions from './VariantOptions';
import Variants from './Variants';

export default ({ product, updateProduct, loading }) => {
	const { createErrorNotice } = useDispatch(noticesStore);
	const maxVariantOptions = 3;

	const addEmptyVariantOption = () => {
		// if we have reached the max number of variant options, show a toast and return.
		if ((product?.variant_options ?? []).length >= maxVariantOptions) {
			createErrorNotice(
				__(
					'You have reached the maximum number of variant options. Only 3 variant options are allowed.',
					'surecart'
				)
			);
			return;
		}

		updateProduct({
			variant_options: [
				...product?.variant_options,
				{ name: '', position: 0, values: [] },
			],
		});
	};

	return (
		<Box title={__('Variants', 'surecart')} loading={loading}>
			<div>
				<VariantOptions
					onRequestClose={() => setModal(false)}
					product={product}
					updateProduct={updateProduct}
				/>
			</div>

			<div>
				<ScButton
					type={
						(product?.variant_options ?? []).length
							? 'text'
							: 'default'
					}
					onClick={addEmptyVariantOption}
				>
					<ScIcon name="plus" slot="prefix" />
					{!(product?.variant_options ?? []).length
						? __('Add Options Like Size or Color', 'surecart')
						: __('Add More Options', 'surecart')}
				</ScButton>
			</div>

			{!!product?.variants && (
				<Variants
					product={product}
					updateProduct={updateProduct}
					loading={loading}
				/>
			)}
		</Box>
	);
};
