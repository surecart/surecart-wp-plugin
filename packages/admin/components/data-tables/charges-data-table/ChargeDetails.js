/** @jsx jsx */
/**
 * External dependencies.
 */
import { css, jsx } from '@emotion/react';
import { __ } from '@wordpress/i18n';
import {
	ScDrawer,
	ScFormatNumber,
	ScLineItem,
	ScPaymentMethod,
	ScTag,
} from '@surecart/components-react';
import { getProcessorName } from '../../../util/translations';

export default ({ charge, onRequestClose }) => {
	const { amount, currency, created_at_date } = charge;

	const renderStatusTag = () => {
		if (charge?.fully_refunded) {
			return (
				<ScTag slot="price" type="danger">
					{__('Refunded', 'surecart')}
				</ScTag>
			);
		}

		if (charge?.refunded_amount && charge?.refunded_amount) {
			return (
				<ScTag slot="price" type="warning">
					{__('Partially Refunded', 'surecart')}{' '}
				</ScTag>
			);
		}

		return (
			<ScTag slot="price" type="success">
				{__('Paid', 'surecart')}
			</ScTag>
		);
	};

	return (
		<ScDrawer
			label={__('Charge Details', 'surecart')}
			open={true}
			onScAfterHide={onRequestClose}
			css={css`
				width: 500px !important;
				.components-modal__content {
					overflow: visible !important;
				}

				@media (max-width: 782px) {
					width: 100% !important;

					.components-modal__content {
						overflow: visible !important;
					}
				}
			`}
		>
			<div
				css={css`
					display: grid;
					gap: 1.5em;
					padding: var(--sc-spacing-x-large);
				`}
			>
				<ScLineItem>
					<span slot="description">{__('Amount', 'surecart')}</span>
					<ScFormatNumber
						slot="price"
						type="currency"
						currency={currency}
						value={amount}
					></ScFormatNumber>
				</ScLineItem>
				<ScLineItem>
					<span slot="description">{__('Date', 'surecart')}</span>
					<span slot="price">{created_at_date}</span>
				</ScLineItem>
				<ScLineItem>
					<span slot="description">
						{__('Payment Method', 'surecart')}
					</span>
					<ScPaymentMethod
						slot="price"
						paymentMethod={charge?.payment_method}
						externalLink={charge?.external_charge_link}
						externalLinkTooltipText={`${__(
							'View charge on ',
							'surecart'
						)} ${getProcessorName(
							charge?.payment_method?.processor_type || ''
						)}`}
					/>
				</ScLineItem>
				<ScLineItem>
					<span slot="description">{__('Status', 'surecart')}</span>
					{renderStatusTag()}
				</ScLineItem>
			</div>
		</ScDrawer>
	);
};
