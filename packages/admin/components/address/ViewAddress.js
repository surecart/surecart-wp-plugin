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
	ScText,
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
	const renderShippingAddress = () => {
		if (!shippingAddress?.country) {
			return (
				<ScText
					style={{
						marginTop: 'var(--sc-spacing-small)',
					}}
				>
					{__('No shipping address has been set.', 'surecart')}
				</ScText>
			);
		}

		return <AddressDisplay address={shippingAddress} />;
	};

	const renderBillingAddress = () => {
		if (billingMatchesShipping) {
			return <AddressDisplay address={shippingAddress} />;
		}

		if (!billingAddress?.country) {
			return (
				<ScText
					style={{
						marginTop: 'var(--sc-spacing-small)',
					}}
				>
					{__('No billing address has been set.', 'surecart')}
				</ScText>
			);
		}

		return <AddressDisplay address={billingAddress} />;
	};

	return (
		<Box
			title={title}
			loading={loading}
			header_action={
				(!!shippingAddress?.id || !!billingAddress?.id) && (
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
								{__('Delete', 'surecart')}
							</ScMenuItem>
						</ScMenu>
					</ScDropdown>
				)
			}
			footer={
				!loading &&
				!shippingAddress?.id &&
				!billingAddress?.id && (
					<ScButton onClick={onEditAddress}>
						<ScIcon name="plus" slot="prefix" />
						{__('Add Address', 'surecart')}
					</ScButton>
				)
			}
		>
			{(shippingAddress?.country || billingAddress?.country) && (
				<div
					css={css`
						display: flex;
						flex-direction: column;
						gap: var(--sc-spacing-medium);
					`}
				>
					<ScFormControl
						label={__('Shipping Address', 'surecart')}
						css={css`
							height: 100%;
							display: flex;
							padding-bottom: var(--sc-spacing-medium);
							border-bottom: 1px solid var(--sc-color-gray-200);
						`}
					>
						{renderShippingAddress()}
					</ScFormControl>

					<ScFormControl
						label={__('Billing Address', 'surecart')}
						css={css`
							height: 100%;
							display: flex;
							padding-bottom: var(--sc-spacing-medium);
						`}
					>
						{renderBillingAddress()}
					</ScFormControl>
				</div>
			)}
		</Box>
	);
};
