import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import { useDispatch, useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import {
	ScAlert,
	ScButton,
	ScForm,
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
const zoneName = {
	au: __('Country', 'surecart'),
	eu: __('Country', 'surecart'),
	uk: __('Country', 'surecart'),
	ca: __('Province', 'surecart'),
	us: __('State', 'surecart'),
};

export default ({ region, registration, onSubmitted, onDeleted }) => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [type, setType] = useState('other');
	const [additionalErrors, setAdditionalErrors] = useState([]);
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
				'tax_zone',
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
				'tax_registration',
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
			setError(e?.message || __('Something went wrong.', 'surecart'));
			if (e?.additional_errors) {
				setAdditionalErrors(e.additional_errors);
			}
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
				'tax_registration',
				registration?.id,
				{},
				{ throwOnError: true }
			);
			onDeleted();
		} catch (e) {
			console.error(e);
			setError(e?.message || __('Something went wrong.', 'surecart'));
			if (e?.additional_errors) {
				setAdditionalErrors(e.additional_errors);
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<ScForm
			onScSubmit={onSubmit}
			style={{ '--sc-form-row-spacing': 'var(--sc-spacing-large)' }}
		>
			<Error error={error} setError={setError} />
			<ScSelect
				search
				loading={fetching}
				disabled={registration?.id}
				value={data?.tax_zone}
				unselect={false}
				label={zoneName[region] || __('Region', 'surecart')}
				onScChange={(e) => updateData({ tax_zone: e.target.value })}
				choices={(zones || [])
					.reverse()
					.map(({ state_name, country_name, id }) => {
						return {
							label: state_name || country_name,
							value: id,
						};
					})}
				required
			/>

			{region !== 'other' && (
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

			{(region === 'other' || taxType === 'manual') && (
				<ScInput
					type="number"
					min="0"
					max="100"
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
					{__('Collect Tax', 'surecart')}
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
