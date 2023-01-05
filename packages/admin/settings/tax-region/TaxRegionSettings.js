import { __ } from '@wordpress/i18n';
import { useState, Fragment } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { getQueryArg, removeQueryArgs } from '@wordpress/url';
import {
	ScButton,
	ScCard,
	ScTable,
	ScTableCell,
	ScTableRow,
} from '@surecart/components-react';
import SettingsTemplate from '../SettingsTemplate';
import SettingsBox from '../SettingsBox';
import useEntity from '../../hooks/useEntity';
import Error from '../../components/Error';
import useSave from '../UseSave';
import RegistrationDialog from './RegistrationDialog';
import RegionSettings from './RegionSettings';

const zoneIconName = {
	au: 'australia-flag',
	eu: 'eu-flag',
	uk: 'uk-flag',
	ca: 'canada-flag',
	us: 'us-flag',
};
const zoneName = {
	au: __('Australia', 'surecart'),
	eu: __('European Union', 'surecart'),
	uk: __('United Kingdom', 'surecart'),
	ca: __('Canada', 'surecart'),
	us: __('United States', 'surecart'),
	other: __('Rest Of The World', 'surecart'),
};

const zoneTitles = {
	au: __('GST Registration', 'surecart'),
	ca: __('Canada GST/HST', 'surecart'),
	eu: __('Country-Specific VAT Registrations', 'surecart'),
	uk: __('VAT Registration', 'surecart'),
	us: __('State Sales Tax Registrations', 'surecart'),
};

const zoneDescriptions = {
	au: __(
		'If you do business in Australia, you may be required to collect GST on sales in Australia.',
		'surecart'
	),
	ca: __(
		"If you need to collect provincial tax (British Columbia, Manitoba, Quebec, and Saskatchewan) in addition to GST/HST, then you'll need to setup registrations for each province.",
		'surecart'
	),
	eu: __(
		"If you plan to submit a separate VAT return to each EU country, then you'll need to setup tax registrations for each country.",
		'surecart'
	),
	uk: __(
		'If you do business in the United Kingdom, you may be required to collect Value Added Tax (VAT).',
		'surecart'
	),
	us: __(
		'You’ll need to collect sales tax if you meet certain state requirements, also known as nexus. To start collecting tax, you need to register with the appropriate state tax authority.',
		'surecart'
	),
	other: __(
		'Add custom manual tax rates for specific countries.',
		'surecart'
	),
};

const zoneEmpty = {
	au: __(
		"You're not collecting GST in Australia. Add a tax registration to start collecting tax.",
		'surecart'
	),
	ca: __(
		"You're not collecting any provincial tax in Canada. Add a tax registration to start collecting tax.",
		'surecart'
	),
	eu: __(
		"You don't have any country-specific VAT registrations. If you're registered under one-stop shop then you don't need to create country-specific tax registrations. If you're not, add a tax registration to start collecting tax.",
		'surecart'
	),
	uk: __(
		"You're not collecting VAT in the UK. Add a tax registration to start collecting tax.",
		'surecart'
	),
	us: __(
		"You're not collecting sales tax for any states. Add a tax registration to start collecting tax.",
		'surecart'
	),
};

export default () => {
	const [error, setError] = useState(null);
	const [dialog, setDialog] = useState(null);
	const region = getQueryArg(window.location.href, 'region');
	const { save } = useSave();
	const { item, itemError, editItem, hasLoadedItem } = useEntity(
		'store',
		'tax_protocol'
	);

	const { registrations, fetching } = useSelect((select) => {
		const queryArgs = [
			'surecart',
			'tax_registration',
			{ context: 'edit', per_page: 100 },
		];
		const registrations = select(coreStore).getEntityRecords(...queryArgs);
		return {
			registrations: (registrations || []).filter(
				(registration) => registration?.tax_zone?.region === region
			),
			fetching: select(coreStore).isResolving(
				'getEntityRecords',
				queryArgs
			),
		};
	}, []);

	/**
	 * Form is submitted.
	 */
	const onSubmit = async () => {
		setError(null);
		try {
			await save({
				successMessage: __('Settings Updated.', 'surecart'),
			});
		} catch (e) {
			console.error(e);
			setError(e);
		}
	};

	return (
		<Fragment>
			<SettingsTemplate
				prefix={
					<sc-button
						href={removeQueryArgs(
							window.location.href,
							'type',
							'region'
						)}
						circle
						size="small"
					>
						<sc-icon name="arrow-left"></sc-icon>
					</sc-button>
				}
				title={
					zoneName?.[region]
						? zoneName?.[region]
						: sprintf(
								__('%s Tax Region', 'surecart'),
								region.toUpperCase()
						  )
				}
				icon={
					zoneIconName?.[region] && (
						<sc-icon name={zoneIconName[region]}></sc-icon>
					)
				}
				noButton
				onSubmit={onSubmit}
			>
				<Error
					error={itemError || error}
					setError={setError}
					margin="80px"
				/>

				<RegionSettings
					region={region}
					item={item}
					editItem={editItem}
				/>

				<SettingsBox
					title={
						zoneTitles?.[region]
							? zoneTitles?.[region]
							: __('Tax Registration', 'surecart')
					}
					description={
						!!zoneDescriptions?.[region] &&
						zoneDescriptions?.[region]
					}
					noButton
					end={
						<ScButton
							type="primary"
							onClick={() => setDialog(true)}
						>
							<sc-icon name="plus" slot="prefix"></sc-icon>
							{__('Collect Tax', 'surecart')}
						</ScButton>
					}
					loading={!hasLoadedItem}
					wrapperTag="div"
				>
					<ScCard no-padding style={{ position: 'relative' }}>
						<ScTable>
							<ScTableCell slot="head">
								{__('Country', 'surecart')}
							</ScTableCell>
							{registrations.some(
								(registration) => registration.manual_rate
							) && (
								<ScTableCell
									slot="head"
									style={{ width: '100px' }}
								>
									{__('Tax Rate', 'surecart')}
								</ScTableCell>
							)}
							<ScTableCell
								slot="head"
								style={{ textAlign: 'right' }}
							>
								{__('Updated', 'surecart')}
							</ScTableCell>
							{registrations.map((registration) => {
								const { tax_zone } = registration;
								return (
									<ScTableRow
										href="#"
										onClick={() => setDialog(registration)}
										key={registration.id}
									>
										<ScTableCell>
											{tax_zone?.state_name ||
												tax_zone?.country_name}
										</ScTableCell>
										{registration?.manual_rate && (
											<ScTableCell>
												{registration?.manual_rate}%
											</ScTableCell>
										)}
										<ScTableCell>
											<sc-format-date
												type="timestamp"
												month="short"
												day="numeric"
												year="numeric"
												date={registration?.updated_at}
											></sc-format-date>
										</ScTableCell>
									</ScTableRow>
								);
							})}
						</ScTable>

						{!fetching && !registrations?.length && (
							<sc-empty icon="inbox">
								{zoneEmpty?.[region]
									? zoneEmpty[region]
									: __(
											"You don't have any tax registrations. Add a tax registration to start collecting tax.",
											'surecart'
									  )}
							</sc-empty>
						)}

						{fetching && <sc-block-ui spinner></sc-block-ui>}
					</ScCard>
				</SettingsBox>
			</SettingsTemplate>
			<RegistrationDialog
				region={region}
				open={dialog}
				registration={dialog}
				onRequestClose={() => setDialog(null)}
			/>
		</Fragment>
	);
};
