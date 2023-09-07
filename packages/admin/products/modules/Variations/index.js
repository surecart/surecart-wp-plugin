/**
 * External dependencies.
 */
/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { store as noticesStore } from '@wordpress/notices';
import { useDispatch } from '@wordpress/data';

/**
 * Internal dependencies.
 */
import { ScButton, ScIcon, ScTooltip } from '@surecart/components-react';
import Box from '../../../ui/Box';
import VariantOptions from './VariantOptions';
import Variants from './Variants';
import NewVariant from './NewVariant';

export default ({ product, updateProduct, loading }) => {
	const [modal, setModal] = useState(false);
	const { createErrorNotice } = useDispatch(noticesStore);
	const maxVariantOptions = 3;

	const addEmptyVariantOption = () => {
		// if we have reached the max number of variant options, show a notice and return.
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
			change_type: 'option_added',
			variant_options: [
				...product?.variant_options,
				{
					name: '',
					position: product?.variant_options?.length || 0,
					values: [],
					editing: true,
				},
			],
		});
	};

	/**
	 * If variant options has minimum a name and value,
	 * then show add variant button
	 */
	const renderAddNewVariantButton = () => {
		return (
			product?.variant_options?.[0]?.name &&
			product?.variant_options[0]?.values?.[0]?.label &&
			!loading && (
				<div
					css={css`
						margin: -12px 0px;
					`}
				>
					<ScButton
						type="link"
						onClick={() => setModal(true)}
						disabled={loading}
					>
						<ScIcon name="plus" slot="prefix" />
						{__('Add variant', 'surecart')}
					</ScButton>
				</div>
			)
		);
	};

	return (
		<Box
			title={__('Variants', 'surecart')}
			loading={loading}
			css={
				!loading &&
				css`
					* {
						box-sizing: border-box;
					}
					.components-card-body {
						padding: 0;
					}
				`
			}
			header_action={renderAddNewVariantButton()}
		>
			<VariantOptions product={product} updateProduct={updateProduct} />

			{modal && (
				<NewVariant
					product={product}
					updateProduct={updateProduct}
					loading={loading}
					onRequestClose={() => setModal(false)}
				/>
			)}

			<div
				css={css`
					padding: 12px 24px;
				`}
			>
				<ScTooltip
					type="text"
					text={
						(product?.variant_options ?? []).length >=
						maxVariantOptions
							? __(
									'You have reached the maximum number of variant options. Only 3 variant options are allowed.',
									'surecart'
							  )
							: null
					}
				>
					<span>
						<ScButton
							type={
								(product?.variant_options ?? []).length
									? 'link'
									: 'default'
							}
							onClick={addEmptyVariantOption}
							disabled={
								(product?.variant_options ?? []).length >=
								maxVariantOptions
							}
						>
							<ScIcon name="plus" slot="prefix" />
							{!(product?.variant_options ?? []).length
								? __(
										'Add Options Like Size or Color',
										'surecart'
								  )
								: __('Add More Options', 'surecart')}
						</ScButton>
					</span>
				</ScTooltip>
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
