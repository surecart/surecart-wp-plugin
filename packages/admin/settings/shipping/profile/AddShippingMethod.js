/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import {
	ScBlockUi,
	ScButton,
	ScDialog,
	ScFlex,
	ScForm,
	ScInput,
	ScPriceInput,
	ScRadio,
	ScRadioGroup,
} from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import Error from '../../../components/Error';

const rate_types = {
	ITEM_WEIGHT: 'weight',
	ORDER_PRICE: 'amount',
};

export default ({ open, onRequestClose, shippingZoneId }) => {
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);
	const [methodName, setMethodName] = useState('');
	const [shippingRate, setShippingRate] = useState({
		amount: 0,
		rate_type: rate_types.ITEM_WEIGHT,
		shipping_method_id: '',
	});

	const onSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			const shippingMethod = await apiFetch({
				path: 'surecart/v1/shipping_methods',
				data: {
					name: methodName,
				},
				method: 'POST',
			});

			if (!shippingMethod.id)
				throw new Error(
					__('Failed to create shipping method', 'surecart')
				);

			await apiFetch({
				path: 'surecart/v1/shipping_rates',
				data: {
					...shippingRate,
					shipping_zone_id: shippingZoneId,
					shipping_method_id: shippingMethod.id,
				},
				method: 'POST',
			});

			onRequestClose();
		} catch (error) {
			console.error(error);
			setError(error);
		} finally {
			setLoading(false);
		}
	};

	const renderMaxMinInputs = () => {
		if (shippingRate.rate_type === rate_types.ORDER_PRICE) {
			return (
				<ScFlex>
					<ScPriceInput
						label={__('Minimum Price', 'surecart')}
						currencyCode={scData?.currency}
						value={shippingRate.min_amount || null}
						onScInput={(e) => {
							updateShippingRate('min_amount', e.target.value);
						}}
						css={css`
							min-width: 0;
						`}
					/>
					<ScPriceInput
						label={__('Maximum Price', 'surecart')}
						currencyCode={scData?.currency}
						value={shippingRate.max_amount || null}
						placeholder="No limit"
						onScInput={(e) => {
							updateShippingRate('max_amount', e.target.value);
						}}
						css={css`
							min-width: 0;
						`}
					/>
				</ScFlex>
			);
		} else if (shippingRate.rate_type === rate_types.ITEM_WEIGHT) {
			return (
				<ScFlex>
					<ScInput
						label={__('Minimum weight', 'surecart')}
						value={shippingRate.min_amount}
						onScInput={(e) => {
							updateShippingRate('min_amount', e.target.value);
						}}
						css={css`
							min-width: 0;
						`}
					/>
					<ScInput
						label={__('Minimum weight', 'surecart')}
						value={shippingRate.max_amount}
						placeholder="No limit"
						onScInput={(e) => {
							updateShippingRate('max_amount', e.target.value);
						}}
						css={css`
							min-width: 0;
						`}
					/>
				</ScFlex>
			);
		}

		return <></>;
	};

	const updateShippingRate = (key, value) => {
		setShippingRate({
			...shippingRate,
			[key]: value,
		});
	};

	return (
		<ScDialog
			open={open}
			label={__('Add New Shipping Rate')}
			onScRequestClose={onRequestClose}
		>
			<Error error={error} setError={setError} />
			<ScForm onScFormSubmit={onSubmit}>
				<ScFlex
					flexDirection="column"
					css={css`
						gap: var(--sc-spacing-medium);
					`}
				>
					<ScInput
						required
						label={__('Name', 'surecart')}
						onScInput={(e) => setMethodName(e.target.value)}
						name="method-name"
						value={methodName}
					/>

					<ScPriceInput
						label={__('Price', 'surecart')}
						className="rate-price"
						currencyCode={scData?.currency}
						value={shippingRate.amount || null}
						onScInput={(e) => {
							updateShippingRate('amount', e.target.value);
						}}
					/>
					<ScRadioGroup
						onScChange={(e) =>
							updateShippingRate('rate_type', e.target.value)
						}
						value={shippingRate.rate_type}
					>
						<ScRadio
							value={rate_types.ITEM_WEIGHT}
							checked={
								shippingRate.rate_type ===
								rate_types.ITEM_WEIGHT
							}
						>
							{__('Based on item weight', 'surecart')}
						</ScRadio>
						<ScRadio
							value={rate_types.ORDER_PRICE}
							checked={
								shippingRate.rate_type ===
								rate_types.ORDER_PRICE
							}
						>
							{__('Based on order price', 'surecart')}
						</ScRadio>
					</ScRadioGroup>
					<div>{renderMaxMinInputs()}</div>
				</ScFlex>
				<ScFlex justifyContent="flex-start">
					<ScButton type="primary" disabled={loading} submit={true}>
						{__('Add Rate', 'surecart')}
					</ScButton>{' '}
					<ScButton
						type="text"
						onClick={onRequestClose}
						disabled={loading}
					>
						{__('Cancel', 'surecart')}
					</ScButton>
				</ScFlex>
			</ScForm>
			{loading && (
				<ScBlockUi
					style={{ '--sc-block-ui-opacity': '0.75' }}
					spinner
				/>
			)}
		</ScDialog>
	);
};
