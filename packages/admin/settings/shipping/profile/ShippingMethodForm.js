/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import {
	ScBlockUi,
	ScButton,
	ScDialog,
	ScDropdown,
	ScFlex,
	ScForm,
	ScFormControl,
	ScIcon,
	ScInput,
	ScMenu,
	ScMenuDivider,
	ScMenuItem,
	ScPriceInput,
	ScRadio,
	ScRadioGroup,
} from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';
import Error from '../../../components/Error';
import ModelSelector from '../../../components/ModelSelector';
import { useDispatch } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { store as noticeStore} from '@wordpress/notices'

const rate_types = {
	ITEM_WEIGHT: 'weight',
	ORDER_PRICE: 'amount',
	FLAT_RATE: 'flat',
};

const WEIGHT_UNIT_TYPES = [
	__('lb', 'surecart'),
	__('kg', 'surecart'),
	__('oz', 'surecart'),
	__('g', 'surecart'),
];

export default ({
	onRequestClose,
	shippingZoneId,
	isEdit,
	selectedShippingRate,
}) => {
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);
	const [methodName, setMethodName] = useState('');
	const [shippingRate, setShippingRate] = useState({
		amount: 0,
		rate_type: rate_types.FLAT_RATE,
		shipping_method_id: '',
		weight_unit: WEIGHT_UNIT_TYPES[0],
	});
	const [showAddNew, setShowAddNew] = useState(false);
	const { saveEntityRecord, invalidateResolutionForStore } =
		useDispatch(coreStore);
    const {createSuccessNotice} = useDispatch(noticeStore)

	useEffect(() => {
		return () => {
			setShippingRate({
				amount: 0,
				rate_type: rate_types.FLAT_RATE,
				shipping_method_id: '',
				weight_unit: WEIGHT_UNIT_TYPES[0],
			});
			setShowAddNew(false);
			setError();
		};
	}, []);

	useEffect(() => {
		if (isEdit && selectedShippingRate?.id) {
			setShippingRate({
				amount: selectedShippingRate.amount,
				rate_type: selectedShippingRate.rate_type,
				shipping_method_id: selectedShippingRate.shipping_method?.id,
				weight_unit: selectedShippingRate.weight_unit,
				max_amount: selectedShippingRate.max_amount,
				min_amount: selectedShippingRate.min_amount,
				max_weight: selectedShippingRate.max_weight,
				min_weight: selectedShippingRate.min_weight,
			});
		}
	}, [selectedShippingRate, isEdit]);

	const addShippingRate = async (rate) => {
		await saveEntityRecord(
			'surecart',
			'shipping-rate',
			{
				...rate,
				shipping_zone_id: shippingZoneId,
			},
			{ throwOnError: true }
		);
	};

	const editShippingRate = async (rate) => {
		await saveEntityRecord(
			'surecart',
			'shipping-rate',
			{
				...rate,
				id: selectedShippingRate.id,
				shipping_zone_id: shippingZoneId,
			},
			{ throwOnError: true }
		);
	};

	const onSubmit = async () => {
		setLoading(true);
		try {
			if (!showAddNew && !shippingRate.shipping_method_id) {
				setError(__('Please select a shipping method', 'surecart'));
				return;
			}

			if (!shippingRate.shipping_method_id) {
				const shippingMethod = await saveEntityRecord(
					'surecart',
					'shipping-method',
					{
						name: methodName,
					}
				);

				shippingRate.shipping_method_id = shippingMethod?.id;
			}

			if (!shippingRate.shipping_method_id) {
				setError(__('Failed to create shipping method', 'surecart'));
				return;
			}

			if (isEdit) {
				await editShippingRate(shippingRate);
				createSuccessNotice(__('Shipping rate updated', 'surecart'), {
					type: 'snackbar',
				});
			} else {
				await addShippingRate(shippingRate);
				createSuccessNotice(__('Shipping rate added', 'surecart'), {
					type: 'snackbar',
				});
			}

			await invalidateResolutionForStore();

			onRequestClose();
		} catch (error) {
			console.error(error);
			setError(error);
		} finally {
			setLoading(false);
		}
	};

	const renderWeightDropdown = (shippingRate) => {
		return (
			<ScDropdown slot="suffix" placement="bottom-end">
				<ScButton type="text" slot="trigger" circle>
					{shippingRate.weight_unit} <ScIcon name="chevron-down" />
				</ScButton>
				<ScMenu>
					{WEIGHT_UNIT_TYPES.map((unit) => (
						<ScMenuItem
							onClick={() =>
								updateShippingRate('weight_unit', unit)
							}
							key={unit}
						>
							{unit}
						</ScMenuItem>
					))}
				</ScMenu>
			</ScDropdown>
		);
	};

	const getSubmitText = () => {
		if (isEdit) {
			return __('Update', 'surecart');
		} else if (showAddNew) {
			return __('Add Rate', 'surecart');
		}
		return __('Add', 'surecart');
	};

	const renderMaxMinInputs = () => {
		if (shippingRate.rate_type === rate_types.ORDER_PRICE) {
			return (
				<ScFlex>
					<ScPriceInput
						label={__('Minimum Price', 'surecart')}
						currencyCode={
							shippingRate?.currency || scData?.currency
						}
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
						currencyCode={
							shippingRate?.currency || scData?.currency
						}
						value={shippingRate.max_amount || null}
						required
						placeholder={__('No limit', 'surecart')}
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
						value={shippingRate.min_weight}
						onScInput={(e) => {
							updateShippingRate('min_weight', e.target.value);
						}}
						css={css`
							min-width: 0;
						`}
					>
						{renderWeightDropdown(shippingRate)}
					</ScInput>
					<ScInput
						label={__('Maximum weight', 'surecart')}
						value={shippingRate.max_weight}
						placeholder="No limit"
						onScInput={(e) => {
							updateShippingRate('max_weight', e.target.value);
						}}
						css={css`
							min-width: 0;
						`}
					>
						{renderWeightDropdown(shippingRate)}
					</ScInput>
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
			open={true}
			label={
				isEdit
					? __('Edit Shipping Rate', 'surecart')
					: __('Add New Shipping Rate', 'surecart')
			}
			onScRequestClose={onRequestClose}
			style={{ '--dialog-body-overflow': 'visible' }}
		>
			<Error error={error} setError={setError} />
			<ScForm
				onScSubmit={(e) => {
					e.preventDefault();
					e.stopImmediatePropagation();
					onSubmit();
				}}
				onScFormSubmit={(e) => {
					e.preventDefault();
					e.stopImmediatePropagation();
				}}
			>
				<ScFlex
					flexDirection="column"
					css={css`
						gap: var(--sc-spacing-medium);
					`}
				>
					{showAddNew ? (
						<ScInput
							required
							label={__('Name', 'surecart')}
							onScInput={(e) => setMethodName(e.target.value)}
							name="method-name"
							value={methodName}
						/>
					) : (
						<ScFormControl
							label={__('Shipping Method', 'surecart')}
						>
							<ModelSelector
								name="shipping-method"
								placeholder={__('Select', 'surecart')}
								value={shippingRate.shipping_method_id}
								fetchOnLoad={isEdit}
								prefix={
									<div slot="prefix">
										<ScMenuItem
											onClick={() => {
												setShowAddNew(true);
												updateShippingRate(
													'shipping_method_id',
													null
												);
											}}
										>
											<ScIcon slot="prefix" name="plus" />
											{__('Add New', 'surecart')}
										</ScMenuItem>
										<ScMenuDivider />
									</div>
								}
								display={(shippingMethod) => {
									return shippingMethod.name;
								}}
								onSelect={(shippingMethodId) =>
									updateShippingRate(
										'shipping_method_id',
										shippingMethodId
									)
								}
							/>
						</ScFormControl>
					)}

					<ScPriceInput
						label={__('Price', 'surecart')}
						className="rate-price"
						currencyCode={shippingRate.currency || scData?.currency}
						value={shippingRate.amount || null}
						onScInput={(e) => {
							updateShippingRate('amount', e.target.value);
						}}
						required
					/>
					<ScRadioGroup
						onScChange={(e) => {
							if (
								isEdit &&
								shippingRate.shipping_method_id !==
									selectedShippingRate.shipping_method?.id
							) {
								return;
							}
							updateShippingRate('rate_type', e.target.value);
						}}
						value={shippingRate.rate_type}
					>
						<ScRadio
							value={rate_types.FLAT_RATE}
							checked={
								shippingRate.rate_type === rate_types.FLAT_RATE
							}
						>
							{__('Flat Rate', 'surecart')}
						</ScRadio>
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
						{getSubmitText()}
					</ScButton>{' '}
					{showAddNew ? (
						<ScFlex justifyContent="flex-start">
							<ScButton
								type="text"
								onClick={() => {
									setShowAddNew(false);
									updateShippingRate(
										'shipping_method_id',
										null
									);
								}}
								disabled={loading}
							>
								{__('Back', 'surecart')}
							</ScButton>
						</ScFlex>
					) : (
						<ScFlex justifyContent="flex-start">
							<ScButton
								type="text"
								onClick={onRequestClose}
								disabled={loading}
							>
								{__('Cancel', 'surecart')}
							</ScButton>
						</ScFlex>
					)}
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
