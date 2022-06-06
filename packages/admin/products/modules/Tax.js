/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { ScSwitch, ScTooltip } from '@surecart/components-react';

import Box from '../../ui/Box';
import Definition from '../../ui/Definition';

export default ({ loading, product, updateProduct }) => {
	const renderTaxInput = () => {
		if (scData?.tax_protocol?.tax_enabled) {
			return (
				<Fragment>
					<Definition
						title={__('Charge tax on this product', 'surecart')}
					>
						<ScSwitch
							checked={product?.tax_enabled}
							onScChange={() =>
								updateProduct({
									tax_enabled: !product?.tax_enabled,
								})
							}
						/>
					</Definition>
					<Definition
						title={__('This is a physical product', 'surecart')}
					>
						<ScSwitch
							checked={product?.tax_category === 'tangible'}
							onScChange={(e) =>
								updateProduct({
									tax_category: e.target.checked
										? 'tangible'
										: 'digital',
								})
							}
						/>
					</Definition>
				</Fragment>
			);
		}

		return (
			<div>
				<ScTooltip
					text={__(
						'To charge tax, please set up your tax information on the settings page.',
						'surecart'
					)}
					type="text"
					css={css`
						display: block;
					`}
				>
					<Definition
						title={__('Charge tax on this product', 'surecart')}
					>
						<ScSwitch disabled />
					</Definition>
				</ScTooltip>
			</div>
		);
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
					{__('Tax and Shipping', 'surecart')}
				</div>
			}
		>
			{renderTaxInput()}
			<Definition
				title={__('This product requires shipping', 'surecart')}
			>
				<ScSwitch
					checked={product?.shipping_enabled}
					onScChange={(e) =>
						updateProduct({
							shipping_enabled: !!e.target.checked,
						})
					}
				/>
			</Definition>
		</Box>
	);
};
