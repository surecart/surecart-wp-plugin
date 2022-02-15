/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { __ } from '@wordpress/i18n';

import { CeInput, CeSwitch, CeSelect } from '@checkout-engine/components-react';
import Box from '../../ui/Box';

export default ({ product, updateProduct, loading }) => {
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
					name="name"
					required
				/>

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
