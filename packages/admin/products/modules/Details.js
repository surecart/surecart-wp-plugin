/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { __ } from '@wordpress/i18n';

import { CeInput, CeSwitch, CeSelect } from '@surecart/components-react';
import Box from '../../ui/Box';

export default ({ product, updateProduct, loading }) => {
	return (
		<Box title={__('Details', 'surecart')} loading={loading}>
			<div
				css={css`
					display: grid;
					gap: var(--ce-spacing-large);
				`}
			>
				<CeInput
					label={__('Name', 'surecart')}
					className="ce-product-name hydrated"
					help={__('A name for your product.', 'surecart')}
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
					{__('Charge tax on this product', 'surecart')}
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
										'surecart'
									),
								},
								{
									value: 'digital',
									label: __('Digital', 'surecart'),
								},
								{
									value: 'saas',
									label: __(
										'Sofware As A Service',
										'surecart'
									),
								},
								{
									value: 'service',
									label: __('Service', 'surecart'),
								},
							]}
						/>
					</div>
				)}
			</div>
		</Box>
	);
};
