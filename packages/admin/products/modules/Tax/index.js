/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { ScButton, ScIcon } from '@surecart/components-react';
import { PanelRow, ToggleControl } from '@wordpress/components';

import Box from '../../../ui/Box';
import Type from './Type';

export default ({ loading, product, updateProduct }) => {
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
			<div>
				<PanelRow>
					<span>{__('Charge tax on this product', 'surecart')}</span>
					<ToggleControl
						__nextHasNoMarginBottom={true}
						checked={
							product?.tax_enabled &&
							scData?.tax_protocol?.tax_enabled
						}
						disabled={!scData?.tax_protocol?.tax_enabled}
						onChange={() =>
							updateProduct({
								tax_enabled: !product?.tax_enabled,
							})
						}
					/>
				</PanelRow>
				{product?.tax_enabled && scData?.tax_protocol?.tax_enabled && (
					<>
						<Type product={product} updateProduct={updateProduct} />
					</>
				)}
			</div>
		</Box>
	);
};
