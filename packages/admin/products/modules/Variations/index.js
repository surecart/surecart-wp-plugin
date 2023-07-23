/**
 * External dependencies.
 */
/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { store as noticesStore } from '@wordpress/notices';
import { store as coreStore } from '@wordpress/core-data';
import { useDispatch } from '@wordpress/data';
import { useState, useEffect } from '@wordpress/element';

/**
 * Internal dependencies.
 */
import { ScButton, ScIcon } from '@surecart/components-react';
import Box from '../../../ui/Box';
import VariantOptions from './VariantOptions';
import Variants from './Variants';

export default ({ product, updateProduct, loading }) => {
	const [modal, setModal] = useState(false);
	const { receiveEntityRecords } = useDispatch(coreStore);
	const { createErrorNotice } = useDispatch(noticesStore);
	const maxVariantOptions = 3;

	// this transforms the response we get from the server to the format we need to send back.
	useEffect(() => {
		if (!product?.variant_options?.data) return;
		receiveEntityRecords('surecart', 'product', [
			{
				...product,
				variant_options: {
					...product?.variant_options,
					data: (product?.variant_options?.data ?? []).map(
						({ id, name, position }) => {
							return {
								id,
								name,
								position,
							};
						}
					),
				},
			},
		]);
	}, [product?.variant_options?.data]);

	// function to update product?.variant_options based on the index.
	const updateVariantOption = (action) => {
		updateProduct({
			...product,
			variant_options: (product?.variant_options?.data ?? []).map(
				(item, index) => {
					if (index !== action.index) {
						return item;
					}
					return {
						...item,
						...action.item,
					};
				}
			),
		});
	};

	const addEmptyVariantOption = () => {
		// if we have reached the max number of variant options, show a toast and return.
		if (
			(product?.variant_options?.data ?? []).length >= maxVariantOptions
		) {
			createErrorNotice(
				__(
					'You have reached the maximum number of variant options. Only 3 variant options are allowed.',
					'surecart'
				)
			);
			return;
		}

		updateProduct({
			variant_options: {
				...product?.variant_options,
				data: [
					...(product?.variant_options?.data ?? []),
					{ name: '', position: 0, values: [] },
				],
			},
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
