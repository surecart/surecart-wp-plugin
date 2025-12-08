/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import {
	ScButton,
	ScDropdown,
	ScFormControl,
	ScIcon,
	ScMenu,
	ScMenuItem,
} from '@surecart/components-react';
import Box from '../../ui/Box';
import AddressDisplay from '../AddressDisplay';

export default ({
	title,
	onEditAddress,
	onDeleteAddress,
	billingAddress,
	shippingAddress,
	billingMatchesShipping,
	loading,
}) => {
	const hasAddress = !!shippingAddress?.id || !!billingAddress?.id;

	return (
		<Box
			title={title}
			loading={loading}
			header_action={
				hasAddress && (
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
							<ScMenuItem onClick={onEditAddress}>
								<ScIcon
									slot="prefix"
									name="edit"
									style={{
										opacity: 0.5,
									}}
								/>
								{__('Edit', 'surecart')}
							</ScMenuItem>
							<ScMenuItem onClick={onDeleteAddress}>
								<ScIcon
									slot="prefix"
									name="trash"
									style={{
										opacity: 0.5,
									}}
								/>
								{__('Clear', 'surecart')}
							</ScMenuItem>
						</ScMenu>
					</ScDropdown>
				)
			}
			footer={
				!loading &&
				!hasAddress && (
					<ScButton onClick={onEditAddress}>
						<ScIcon name="plus" slot="prefix" />
						{__('Add Address', 'surecart')}
					</ScButton>
				)
			}
		>
			{hasAddress && (
				<div
					css={css`
						display: flex;
						flex-direction: column;
						gap: var(--sc-spacing-medium);
						--sc-input-label-font-weight: var(
							--sc-font-weight-bold
						);
					`}
				>
					{shippingAddress?.country && (
						<div
							css={css`
								padding: var(
									--sc-card-padding,
									var(--sc-spacing-large)
								);
								background: var(
									--sc-card-background-color,
									var(--sc-color-white)
								);
								border: 1px solid
									var(
										--sc-card-border-color,
										var(--sc-color-gray-300)
									);
								border-radius: var(
									--sc-input-border-radius-medium
								);
							`}
						>
							<ScFormControl
								label={__('Shipping Address', 'surecart')}
							>
								<AddressDisplay
									address={shippingAddress?.formatted_string}
								/>
							</ScFormControl>
						</div>
					)}

					{(billingAddress?.country || billingMatchesShipping) && (
						<div
							css={css`
								padding: var(
									--sc-card-padding,
									var(--sc-spacing-large)
								);
								background: var(
									--sc-card-background-color,
									var(--sc-color-white)
								);
								border: 1px solid
									var(
										--sc-card-border-color,
										var(--sc-color-gray-300)
									);
								border-radius: var(
									--sc-input-border-radius-medium
								);
							`}
						>
							<ScFormControl
								label={__('Billing Address', 'surecart')}
							>
								<AddressDisplay
									address={
										billingMatchesShipping
											? shippingAddress?.formatted_string
											: billingAddress?.formatted_string
									}
								/>
							</ScFormControl>
						</div>
					)}
				</div>
			)}
		</Box>
	);
};
