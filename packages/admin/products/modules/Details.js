/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { __ } from '@wordpress/i18n';

import {
	CeInput,
	CeSwitch,
	CeSelect,
	CeChoices,
	CeChoice,
} from '@checkout-engine/components-react';
import Box from '../../ui/Box';

import useProductData from '../hooks/useProductData';
import useValidationErrors from '../../hooks/useValidationErrors';

export default () => {
	const { product, updateProduct, loading, isCreated } = useProductData();
	const { errors, getValidation } = useValidationErrors('products');

	return (
		<Box title={__('Details', 'checkout_engine')} loading={loading}>
			<div
				css={css`
					display: grid;
					gap: var(--ce-spacing-large);
				`}
			>
				<CeInput
					label={__('Name', 'checkout_engine')}
					className="ce-product-name hydrated"
					help={__('A name for your product.', 'checkout_engine')}
					value={product?.name}
					onCeChange={(e) => {
						updateProduct({ name: e.target.value });
					}}
					errorMessage={getValidation('name')}
					name="name"
					required
				/>
				{/* <CeInput
					label={__('Description', 'checkout_engine')}
					className="ce-product-description"
					help={__(
						'An optional description for your product.',
						'checkout_engine'
					)}
					value={product?.description}
					errorMessage={getValidation('description')}
					name="description"
					onCeChange={(e) =>
						updateProduct({ description: e.target.value })
					}
				/> */}
				{!isCreated && (
					<CeChoices
						required
						label={__('Product Type', 'checkout_engine')}
						style={{ '--columns': 2 }}
					>
						<div>
							<CeChoice
								checked={!product?.recurring}
								value="single"
								onCeChange={(e) => {
									if (!e.target.checked) return;
									updateProduct({ recurring: false });
								}}
							>
								{__('Single Payment', 'checkout_engine')}
								<span slot="description">
									{__(
										'Charge a one-time fee.',
										'checkout_engine'
									)}
								</span>
							</CeChoice>
							<CeChoice
								checked={product?.recurring}
								value="subscription"
								onCeChange={(e) => {
									if (!e.target.checked) return;
									updateProduct({
										recurring: true,
									});
								}}
							>
								{__('Subscription', 'checkout_engine')}
								<span slot="description">
									{__(
										'Charge an ongoing fee.',
										'checkout_engine'
									)}
								</span>
							</CeChoice>
						</div>
					</CeChoices>
				)}
				<CeSwitch
					css={css`
						margin: var(--ce-spacing-small) 0;
					`}
					checked={product?.tax_enabled}
					onCeChange={() =>
						updateProduct({
							tax_enabled: !product?.tax_enabled,
						})
					}
				>
					{__('Charge tax on this product', 'checkout_engine')}
				</CeSwitch>
				{product?.tax_enabled && (
					<div>
						<CeSelect
							value={product?.tax_category || 'tangible'}
							required
							onCeChange={(e) => {
								updateProduct({
									tax_category: e.target.value,
								});
							}}
							choices={[
								{
									value: 'tangible',
									label: __(
										'General/Tangible Goods',
										'checkout_engine'
									),
								},
								{
									value: 'digital',
									label: __('Digital', 'checkout_engine'),
								},
								{
									value: 'saas',
									label: __(
										'Sofware As A Service',
										'checkout_engine'
									),
								},
								{
									value: 'service',
									label: __('Service', 'checkout_engine'),
								},
							]}
						/>
					</div>
				)}
			</div>
		</Box>
	);
};
