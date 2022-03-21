/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { __ } from '@wordpress/i18n';

import { ScInput, ScSwitch, ScSelect } from '@surecart/components-react';
import Box from '../../ui/Box';

export default ({ product, updateProduct, loading }) => {
	return (
		<Box title={__('Details', 'surecart')} loading={loading}>
			<div
				css={css`
					display: grid;
					gap: var(--sc-spacing-large);
				`}
			>
				<ScInput
					label={__('Name', 'surecart')}
					className="sc-product-name hydrated"
					help={__('A name for your product.', 'surecart')}
					value={product?.name}
					onScChange={(e) => {
						updateProduct({ name: e.target.value });
					}}
					name="name"
					required
				/>

				<ScSwitch
					css={css`
						margin: var(--sc-spacing-small) 0;
					`}
					checked={product?.tax_enabled}
					onScChange={() =>
						updateProduct({
							tax_enabled: !product?.tax_enabled,
						})
					}
				>
					{__('Charge tax on this product', 'surecart')}
				</ScSwitch>
				{product?.tax_enabled && (
					<div>
						<ScSelect
							value={product?.tax_category || 'tangible'}
							required
							onScChange={(e) => {
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
