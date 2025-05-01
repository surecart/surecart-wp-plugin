/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __, sprintf } from '@wordpress/i18n';
import { useDispatch } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { useEffect, useState } from '@wordpress/element';

/**
 * Internal dependencies.
 */
import {
	ScAlert,
	ScButton,
	ScDialog,
	ScForm,
	ScIcon,
	ScInput,
	ScSelect,
	ScText,
} from '@surecart/components-react';
import ModelSelector from '../../components/ModelSelector';
import { zoneName } from '../tax-region/RegistrationForm';
import Error from '../../components/Error';

export default ({
	type,
	region,
	open,
	taxOverride,
	taxOverrides,
	onRequestClose,
	zones,
}) => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const { saveEntityRecord } = useDispatch(coreStore);
	const [data, setData] = useState();
	const updateData = (updated) => setData({ ...data, ...updated });

	// set default data when opened.
	useEffect(() => {
		if (!open) {
			setData({});
		} else {
			setData({
				rate: taxOverride?.rate || '',
				...(taxOverride?.id ? { id: taxOverride.id } : {}),
				...(taxOverride?.tax_zone
					? { tax_zone: taxOverride.tax_zone.id }
					: { tax_zone: defaultZone }),
				...(type === 'shipping' ? { shipping: true } : {}),
				...(type === 'product'
					? {
							product_collection:
								taxOverride?.product_collection?.id,
					  }
					: {}),
			});
		}
	}, [open]);

	// get the available zones based on the registrations and taxOverrides
	const availableZones = (zones || []).filter(
		(zone) =>
			!taxOverrides.some((o) =>
				type === 'product'
					? o.tax_zone?.id === zone.id &&
					  o.product_collection?.id === data?.product_collection
					: o.tax_zone?.id === zone.id
			)
	);

	// get the default zone.
	const defaultZone = availableZones[0]?.id || '';

	// There are no available zones if it is a new override and there are no available zones.
	const hasNoAvailableZones = !availableZones.length && !taxOverride?.id;

	const onSubmit = async (e) => {
		e.preventDefault();
		try {
			setLoading(true);
			await saveEntityRecord('surecart', 'tax-override', data, {
				throwOnError: true,
			});
			onRequestClose();
		} catch (e) {
			console.error(e);
			setError(e);
		} finally {
			setLoading(false);
		}
	};

	const getDialogLabel = () => {
		if (type === 'shipping') {
			return taxOverride?.id
				? sprintf(
						/* translators: %s: tax zone country name */
						__('Edit shipping override for %s', 'surecart'),
						taxOverride?.tax_zone?.country_name || ''
				  )
				: __('Add shipping tax override', 'surecart');
		} else {
			return taxOverride?.id
				? sprintf(
						/* translators: %1$s: product collection name, %2$s: tax zone country name */
						__(
							'Edit override for %1$s collection in %2$s',
							'surecart'
						),
						taxOverride?.product_collection?.name || '',
						taxOverride?.tax_zone?.country_name || ''
				  )
				: __('Add product tax override', 'surecart');
		}
	};

	return (
		<div
			css={css`
				sc-dialog::part(body) {
					overflow: visible;
				}
			`}
		>
			<ScForm onScSubmit={onSubmit}>
				<ScDialog
					label={getDialogLabel()}
					onScRequestClose={onRequestClose}
					open={open}
				>
					<div
						css={css`
							display: grid;
							gap: var(--sc-spacing-medium);
						`}
					>
						{error && <Error error={error} setError={setError} />}

						{hasNoAvailableZones && (
							<ScAlert type="primary" open>
								{__(
									"You've already added an override for each region where you collect sales tax. You can edit or delete an existing override.",
									'surecart'
								)}
							</ScAlert>
						)}

						{!taxOverride?.id && (
							<ScText
								css={css`
									color: var(--sc-color-gray-600);
									opacity: 0.85;
								`}
							>
								{type === 'shipping' ? (
									__(
										'Add a custom tax rate for shipping.',
										'surecart'
									)
								) : (
									<div>
										{__(
											'Add a custom sales tax rate for a collection of products.',
											'surecart'
										)}
										{__(
											'Select an existing collection or ',
											'surecart'
										)}
										<a
											href={`${window.scData?.home_url}/wp-admin/admin.php?page=sc-product-collections&action=edit`}
											target="_blank"
										>
											{__('create a new one', 'surecart')}{' '}
											<ScIcon name="external-link" />
										</a>
									</div>
								)}
							</ScText>
						)}

						{type === 'product' && !taxOverride?.id && (
							<ModelSelector
								label={__('Product Collection', 'surecart')}
								name="product-collection"
								value={data?.product_collection}
								onSelect={(product_collection) =>
									updateData({
										product_collection,
									})
								}
								required
							/>
						)}

						{(type !== 'product' || data?.product_collection) && (
							<>
								{!taxOverride?.id && (
									<ScSelect
										search
										value={data?.tax_zone}
										unselect={false}
										disabled={hasNoAvailableZones}
										label={
											zoneName[region] ||
											__('Region', 'surecart')
										}
										onScChange={(e) =>
											updateData({
												tax_zone: e.target.value,
											})
										}
										choices={(availableZones || []).map(
											({
												state_name,
												country_name,
												id,
											}) => {
												return {
													label:
														state_name ||
														country_name,
													value: id,
												};
											}
										)}
										required
									/>
								)}

								<ScInput
									type="number"
									min="0"
									max="100"
									step="0.0001"
									disabled={hasNoAvailableZones}
									required
									label={__('Tax Rate', 'surecart')}
									value={data?.rate ?? ''}
									onScInput={(e) => {
										updateData({
											rate: e.target.value,
										});
									}}
								>
									<span slot="suffix">%</span>
								</ScInput>
							</>
						)}
					</div>

					<ScButton
						onClick={onRequestClose}
						slot="footer"
						type="text"
					>
						{__('Cancel', 'surecart')}
					</ScButton>
					<ScButton
						type="primary"
						submit
						disabled={loading || hasNoAvailableZones}
						slot="footer"
					>
						{taxOverride?.id
							? __('Save', 'surecart')
							: __('Add Override', 'surecart')}
					</ScButton>

					{loading && (
						<sc-block-ui
							spinner
							style={{
								zIndex: 9,
								'--sc-block-ui-opacity': '0.5',
								inset: 0,
							}}
						></sc-block-ui>
					)}
				</ScDialog>
			</ScForm>
		</div>
	);
};
