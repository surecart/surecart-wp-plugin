/**
 * External dependencies.
 */
/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

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
	const maxVariantOptions = 3;

	const addEmptyVariantOption = () => {
		updateProduct({
			variant_options: [
				...product?.variant_options,
				{
					name: '',
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
			product?.variant_options[0]?.values?.[0] &&
			!loading &&
			product?.variants?.length < 99 && (
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

	const hasOptions = !!(product?.variant_options ?? []).length;
	const hasMaxOptions =
		(product?.variant_options ?? []).length >= maxVariantOptions;

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
			footer={
				!hasOptions && (
					<ScButton type="default" onClick={addEmptyVariantOption}>
						<ScIcon name="plus" slot="prefix" />
						{__('Add Options Like Size or Color', 'surecart')}
					</ScButton>
				)
			}
		>
			<VariantOptions product={product} updateProduct={updateProduct} />

			{modal && (
				<NewVariant
					product={product}
					updateProduct={updateProduct}
					onRequestClose={() => setModal(false)}
				/>
			)}

			{hasOptions && (
				<div
					css={css`
						padding: 12px 24px;
					`}
				>
					<ScTooltip
						type="text"
						text={
							hasMaxOptions
								? __(
										'You have reached the maximum number of variant options.',
										'surecart'
								  )
								: null
						}
					>
						<span>
							<ScButton
								type="link"
								onClick={addEmptyVariantOption}
								disabled={hasMaxOptions}
							>
								<ScIcon name="plus" slot="prefix" />
								{__('Add More Options', 'surecart')}
							</ScButton>
						</span>
					</ScTooltip>
				</div>
			)}

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
