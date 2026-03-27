/** @jsx jsx */
import { jsx, css } from '@emotion/core';

/**
 * External dependencies.
 */
import { __, sprintf } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import { useDispatch, useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';

/**
 * Internal dependencies.
 */
import {
	ScAlert,
	ScButton,
	ScForm,
	ScIcon,
	ScInput,
	ScSelect,
	ScTaxIdInput,
} from '@surecart/components-react';
import Error from '../../components/Error';

const types = {
	au: 'au_abn',
	ca: 'ca_gst',
	eu: 'eu_vat',
	uk: 'gb_vat',
};
export const zoneName = {
	au: __('Country', 'surecart'),
	eu: __('Country', 'surecart'),
	uk: __('Country', 'surecart'),
	ca: __('Province', 'surecart'),
	us: __('State', 'surecart'),
};

export default ({
	region,
	registration,
	registrations,
	onSubmitted,
	onDeleted,
}) => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [type, setType] = useState('other');
	const { saveEntityRecord, deleteEntityRecord } = useDispatch(coreStore);
	const [taxType, setTaxType] = useState(
		registration?.manual_rate ? 'manual' : 'automatic'
	);

	const { tax_zone, tax_identifier, ...registrationData } = registration;
	const [data, setData] = useState({
		tax_zone: tax_zone?.id,
		tax_identifier,
		...registrationData,
	});
	const updateData = (updated) => setData({ ...data, ...updated });

	useEffect(() => {
		if (data?.tax_identifier?.number_type) {
			return setType(data?.tax_identifier?.number_type);
		}
		setType(types[region] || 'other');
	}, [region]);

	const { zones, fetching } = useSelect(
		(select) => {
			const queryArgs = [
				'surecart',
				'tax-zone',
				{ context: 'edit', regions: [region], per_page: 100 },
			];
			return {
				zones: select(coreStore).getEntityRecords(...queryArgs),
				fetching: select(coreStore).isResolving(
					'getEntityRecords',
					queryArgs
				),
			};
		},
		[region]
	);

	useEffect(() => {
		if (!zones) return;
		if (region === 'au') {
			const tax_zone = zones.find((z) => z.country === 'AU')?.id;
			if (tax_zone) {
				setData({ ...data, tax_zone });
			}
		}
		if (region === 'uk') {
			const tax_zone = zones.find((z) => z.country === 'GB')?.id;
			if (tax_zone) {
				setData({ ...data, tax_zone });
			}
		}
	}, [zones]);

	useEffect(() => {
		if (taxType === 'automatic') {
			setData({ ...data, ...{ manual_rate: null } });
		}
	}, [taxType]);

	const onSubmit = async (e) => {
		e.preventDefault();
		try {
			setLoading(true);
			await saveEntityRecord(
				'surecart',
				'tax-registration',
				{
					...(registration?.id ? { id: registration?.id } : {}),
					...data,
				},
				{
					throwOnError: true,
				}
			);
			onSubmitted();
		} catch (e) {
			console.error(e);
			setError(e);
		} finally {
			setLoading(false);
		}
	};

	const onDelete = async (e) => {
		e.preventDefault();
		try {
			setLoading(true);
			await deleteEntityRecord(
				'surecart',
				'tax-registration',
				registration?.id,
				{},
				{ throwOnError: true }
			);
			onDeleted();
		} catch (e) {
			console.error(e);
			setError(e);
		} finally {
			setLoading(false);
		}
	};

	const isZoneRegistered = (zone) =>
		(registrations || []).some((r) => r.tax_zone?.id === zone.id);

	const availableZones = (zones || []).filter(
		(zone) => !isZoneRegistered(zone)
	);

	const selectedZone = availableZones.find((z) => z.id === data?.tax_zone);

	const defaultTaxLabel = (availableZones || []).find(
		(z) => z.id === data?.tax_zone
	)?.default_label;

	const requiresManualTaxOverride =
		selectedZone?.default_rate === 0 ||
		(region === 'ca' &&
			['QC', 'SK', 'MB', 'BC'].includes(
				selectedZone?.state || registration?.tax_zone?.state
			));

	// Set taxType to 'manual' if requiresManualTaxOverride is true.
	useEffect(() => {
		setTaxType(
			requiresManualTaxOverride || registration?.manual_rate
				? 'manual'
				: 'automatic'
		);
	}, [requiresManualTaxOverride]);

	return (
		<ScForm
			onScSubmit={onSubmit}
			style={{ '--sc-form-row-spacing': 'var(--sc-spacing-large)' }}
		>
			<Error error={error} setError={setError} />
			{!registration?.id && (
				<ScSelect
					search
					loading={fetching}
					disabled={registration?.id}
					value={data?.tax_zone}
					unselect={false}
					label={zoneName[region] || __('Region', 'surecart')}
					onScChange={(e) => updateData({ tax_zone: e.target.value })}
					choices={(availableZones || [])
						.reverse()
						.map(({ state_name, country_name, id }) => {
							return {
								label: state_name || country_name,
								value: id,
							};
						})}
					required
				/>
			)}

			{region !== 'other' && (
				<>
					{requiresManualTaxOverride ? (
						<div
							css={css`
								color: var(--sc-input-help-text-color);
								display: flex;
							`}
						>
							<ScIcon name="info" />
							<span
								css={css`
									margin-left: var(--sc-spacing-small);
								`}
							>
								{sprintf(
									/* translators: %s: state/region name */
									__(
										'Please specify a tax rate for %s, as it requires manual entry',
										'surecart'
									),
									selectedZone?.state_name ||
										selectedZone?.country_name,
									selectedZone?.state_name ||
										selectedZone?.country_name
								)}
							</span>
						</div>
					) : (
						<ScSelect
							label={__('Tax Calculation', 'surecart')}
							value={taxType}
							onScChange={(e) => setTaxType(e.target.value)}
							choices={[
								{
									value: 'manual',
									label: __('Manual', 'surecart'),
								},
								{
									value: 'automatic',
									label: __('Automatic', 'surecart'),
								},
							]}
						/>
					)}
				</>
			)}

			{(region === 'other' || taxType === 'manual') && (
				<ScInput
					type="number"
					min="0"
					max="100"
					step="0.0001"
					required
					label={__('Tax Rate', 'surecart')}
					value={data?.manual_rate}
					onScInput={(e) =>
						updateData({
							manual_rate: e.target.value,
						})
					}
				>
					<span slot="suffix">%</span>
				</ScInput>
			)}

			<ScInput
				type="text"
				label={__('Tax Label', 'surecart')}
				value={data?.label}
				help={__(
					'The name of the tax that is displayed to customers during checkout and on invoices and receipts.',
					'surecart'
				)}
				placeholder={
					defaultTaxLabel ||
					tax_zone?.default_label ||
					__('Tax', 'surecart')
				}
				onScInput={(e) => updateData({ label: e.target.value })}
			></ScInput>

			{region !== 'us' && (
				<ScTaxIdInput
					type={type}
					number={data?.tax_identifier?.number}
					help={__(
						"In applicable tax jurisdictions, your tax ID will show on invoices. If you don't have your tax ID number yet, you can enter it later.",
						'surecart'
					)}
					onScInput={(e) => {
						const tax_identifier = e.detail;
						let props;
						if (registration?.tax_identifier?.id) {
							const { id, ...rest } =
								registration?.tax_identifier;
							props = rest;
						} else {
							props = registration?.tax_identifier;
						}
						updateData({
							tax_identifier: {
								...props,
								...tax_identifier,
							},
						});
					}}
				/>
			)}

			<ScAlert type="info" open>
				{region === 'other' || taxType === 'manual'
					? __(
							'Make sure you’re registered with the appropriate tax jurisdictions before enabling tax collection.',
							'surecart'
					  )
					: __(
							'Tax is automatically calculated and applied to orders. Make sure you’re registered with the appropriate tax jurisdictions before enabling tax collection.',
							'surecart'
					  )}
			</ScAlert>

			<sc-flex justify-content="space-between">
				<div>
					{registration?.id && (
						<ScButton onClick={onDelete}>
							{__('Delete', 'surecart')}
						</ScButton>
					)}
				</div>
				<ScButton type="primary" submit>
					{registration?.id
						? __('Save Changes', 'surecart')
						: __('Collect Tax', 'surecart')}
				</ScButton>
			</sc-flex>

			{(loading || fetching) && (
				<sc-block-ui
					spinner
					style={{
						zIndex: 9,
						'--sc-block-ui-opacity': '0.5',
						inset: 0,
					}}
				></sc-block-ui>
			)}
		</ScForm>
	);
};
