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
	ScDivider,
} from '@surecart/components-react';
import { getProcessorName } from '../../../util/translations';

export default ({ charge, onRequestClose }) => {
	const { amount, currency, created_at_date, payment_intent } = charge;

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
				{payment_intent?.platform_fee && (
					<>
						<ScDivider style={{ '--spacing': '1em' }} />
						<h3
							css={css`
								font-size: 13px;
								margin: 0;
							`}
						>
							{__('Platform Fee', 'surecart')}
						</h3>
						<ScLineItem>
							<span slot="description">
								{__('Base Amount', 'surecart')}
							</span>
							<ScFormatNumber
								slot="price"
								type="currency"
								currency={currency}
								value={
									payment_intent?.platform_fee?.base_amount
								}
							/>
							<span slot="price-description">
								{`(${payment_intent.platform_fee.base_rate}%)`}
							</span>
						</ScLineItem>
						<ScLineItem>
							<span slot="description">
								{__('Features', 'surecart')}
							</span>
						</ScLineItem>
						{payment_intent?.platform_fee?.features_breakdown &&
							Object.entries(
								payment_intent.platform_fee.features_breakdown
							).map(([key, feature]) => {
								return (
									<ScLineItem
										key={key}
										style={{
											'margin-left': '1em',
										}}
									>
										<span slot="description">
											{key.charAt(0).toUpperCase() +
												key.slice(1).toLowerCase()}
										</span>
										<ScFormatNumber
											slot="price"
											type="currency"
											currency={currency}
											value={feature?.amount}
										/>
										<span slot="price-description">
											{`(${feature?.effective_rate}%)`}
										</span>
									</ScLineItem>
								);
							})}
						<ScDivider style={{ '--spacing': '0.5em' }} />
						<ScLineItem>
							<span
								slot="description"
								style={{
									'font-weight':
										'var(--sc-font-weight-semibold)',
									color: 'var(--sc-color-gray-800)',
								}}
							>
								{__('Total Amount', 'surecart')}
							</span>
							<ScFormatNumber
								slot="price"
								type="currency"
								currency={currency}
								value={payment_intent?.platform_fee?.amount}
								style={{
									'font-weight':
										'var(--sc-font-weight-semibold)',
									color: 'var(--sc-color-gray-800)',
								}}
							/>
						</ScLineItem>
					</>
				)}
				{payment_intent?.service_fee && (
					<>
						<ScDivider style={{ '--spacing': '1em' }} />
						<h3
							css={css`
								font-size: 13px;
								margin: 0;
							`}
						>
							{__('Service Fee', 'surecart')}
						</h3>
						<ScLineItem>
							<span
								slot="description"
								style={{
									'font-weight':
										'var(--sc-font-weight-semibold)',
									color: 'var(--sc-color-gray-800)',
								}}
							>
								{__('Total Amount', 'surecart')}
							</span>
							<ScFormatNumber
								slot="price"
								type="currency"
								currency={currency}
								value={payment_intent?.service_fee?.amount}
								style={{
									'font-weight':
										'var(--sc-font-weight-semibold)',
									color: 'var(--sc-color-gray-800)',
								}}
							/>
							<span slot="price-description">
								{`(${payment_intent?.service_fee?.rate}%)`}
							</span>
						</ScLineItem>
					</>
				)}
			</div>
		</ScDrawer>
	);
};
