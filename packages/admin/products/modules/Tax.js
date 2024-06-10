/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import {
	ScButton,
	ScIcon,
	ScSwitch,
	ScTooltip,
} from '@surecart/components-react';

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
			title={__('Tax', 'surecart')}
			footer={
				product?.tax_enabled &&
				scData?.tax_protocol?.tax_enabled &&
				scData?.tax_protocol?.tax_behavior === 'inclusive' && (
					<>
						<span
							css={css`
								color: rgb(107, 114, 128);
								font-size: 12px;
							`}
						>
							{__('Tax is included in prices', 'surecart')}
						</span>
						<ScButton
							size="small"
							type="link"
							target="_blank"
							href="admin.php?page=sc-settings&tab=tax_protocol"
						>
							{__('Edit Settings', 'surecart')}
							<ScIcon name="external-link" slot="suffix" />
						</ScButton>
					</>
				)
			}
		>
			{renderTaxInput()}
		</Box>
	);
};
