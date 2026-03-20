/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { PanelRow, ToggleControl } from '@wordpress/components';
import { addQueryArgs } from '@wordpress/url';

/**
 * Internal dependencies.
 */
import {
	ScButton,
	ScDropdown,
	ScIcon,
	ScMenu,
	ScMenuItem,
} from '@surecart/components-react';
import Box from '../../../ui/Box';
import Type from './Type';

export default ({ loading, product, updateProduct }) => {
	return (
		<Box
			loading={loading}
			title={__('Tax', 'surecart')}
			header_action={
				<ScDropdown placement="bottom-end">
					<ScButton
						circle
						type="text"
						style={{
							'--button-color': 'var(--sc-color-gray-600)',
							margin: '-10px',
						}}
						slot="trigger"
					>
						<ScIcon name="more-horizontal" />
					</ScButton>
					<ScMenu>
						<ScMenuItem
							href={addQueryArgs('admin.php', {
								page: 'sc-settings',
								tab: 'tax_protocol',
							})}
							target="_blank"
						>
							<ScIcon
								slot="prefix"
								name="external-link"
								style={{
									opacity: 0.5,
								}}
							/>
							{__('Global Settings', 'surecart')}
						</ScMenuItem>
					</ScMenu>
				</ScDropdown>
			}
			footer={
				product?.tax_enabled &&
				scData?.tax_protocol?.tax_enabled &&
				scData?.tax_protocol?.tax_behavior === 'inclusive' && (
					<span
						css={css`
							color: rgb(107, 114, 128);
							font-size: 12px;
						`}
					>
						{__('Tax is included in prices', 'surecart')}
					</span>
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
