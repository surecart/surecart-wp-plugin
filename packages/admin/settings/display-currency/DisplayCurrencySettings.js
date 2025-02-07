/** @jsx jsx */
import { __, _n, sprintf } from '@wordpress/i18n';
import { css, jsx, Global } from '@emotion/react';
import SettingsTemplate from '../SettingsTemplate';
import SettingsBox from '../SettingsBox';
import {
	ScButton,
	ScIcon,
	ScSelect,
	ScSwitch,
	ScTag,
} from '@surecart/components-react';
import { trash } from '@wordpress/icons';
import { DataViews, filterSortAndPaginate } from '@wordpress/dataviews/wp';
import {
	useEntityRecords,
	useEntityRecord,
	useEntityProp,
	store as coreStore,
} from '@wordpress/core-data';
import { useDispatch } from '@wordpress/data';
import { addQueryArgs } from '@wordpress/url';
import './style.scss';
import { useMemo, useState } from 'react';
import {
	Button,
	__experimentalText as Text,
	__experimentalVStack as VStack,
	__experimentalHStack as HStack,
	Icon,
} from '@wordpress/components';
import useSave from '../UseSave';
import { store as noticesStore } from '@wordpress/notices';
import Error from '../../components/Error';

export default function DisplayCurrencySettings() {
	const [error, setError] = useState(null);
	const { saveEntityRecord, deleteEntityRecord } = useDispatch(coreStore);
	const { createErrorNotice, createSuccessNotice } =
		useDispatch(noticesStore);
	const { record: account } = useEntityRecord('surecart', 'store', 'account');
	const { save } = useSave();

	// honeypot.
	const [currencyGeolocationEnabled, setCurrencyGeolocationEnabled] =
		useEntityProp('root', 'site', 'surecart_currency_geolocation_enabled');

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

	const defaultLayouts = {
		table: {
			layout: {
				primaryField: 'name',
			},
		},
	};

	const [view, setView] = useState({
		type: 'table',
		per_page: 10,
		page: 1,
		sort: {
			field: 'name',
			direction: 'asc',
		},
		search: '',
		filters: [],
		layout: defaultLayouts?.table?.layout,
		fields: ['name', 'label', 'rate', 'preview'],
	});

	const queryArgs = useMemo(() => {
		return {
			per_page: view.per_page,
			page: view.page,
			sort: `${view.sort?.field}:${view.sort?.direction}`,
			orderby_hierarchy: !!view.showLevels,
			search: view.search,
		};
	}, [view]);

	const {
		records: currencies,
		hasResolved,
		totalItems,
		totalPages,
	} = useEntityRecords('surecart', 'display_currency', queryArgs);

	const paginationInfo = useMemo(
		() => ({
			totalItems,
			totalPages,
		}),
		[totalItems, totalPages]
	);

	const fields = [
		{
			id: 'name',
			label: __('Currency', 'presto-player'),
			enableGlobalSearch: true,
			render: ({ item }) => (
				<div
					css={css`
						display: flex;
						align-items: center;
						gap: 10px;
					`}
				>
					<img
						src={item?.flag}
						alt={item?.name}
						width={20}
						height={15}
					/>
					<strong>{item?.name}</strong> ({item?.currency_symbol}){' '}
					{item?.is_default_currency && (
						<ScTag>{__('Default', 'surecart')}</ScTag>
					)}
				</div>
			),
		},
		{
			id: 'label',
			label: __('Label', 'presto-player'),
			enableSorting: false,
			render: ({ item }) => (
				<ScTag type="success">{item?.currency?.toUpperCase?.()}</ScTag>
			),
		},
		{
			id: 'rate',
			enableSorting: false,
			label: __('Exchange Rate', 'surecart'),
			render: ({ item }) => {
				if (item?.is_default_currency) {
					return '-';
				}
				return (
					<ScTag>
						1 {account?.currency?.toUpperCase?.()} ={' '}
						{item?.current_exchange_rate}{' '}
						{item?.currency?.toUpperCase?.()}
					</ScTag>
				);
			},
		},
		{
			id: 'preview',
			enableSorting: false,
			label: __('Preview', 'surecart'),
			render: ({ item }) => item?.display_example,
		},
	];

	const { data } = useMemo(() => {
		return filterSortAndPaginate(currencies, view, fields);
	}, [currencies, view]);

	const onAddNewCurrency = async (e) => {
		try {
			const currency = e.target.value;
			if (!currency) return;

			const savedCurrency = await saveEntityRecord(
				'surecart',
				'display_currency',
				{
					currency,
				},
				{
					throwOnError: true,
				}
			);

			createSuccessNotice(
				sprintf(
					/* translators: %s: currency name */
					__('%s added successfully.', 'surecart'),
					savedCurrency?.name || currency
				),
				{
					type: 'snackbar',
				}
			);
		} catch (error) {
			console.error('Error adding currency:', error);
		}
	};

	const handleDelete = async (items) => {
		try {
			// Delete all items concurrently
			await Promise.all(
				items.map((item) =>
					deleteEntityRecord(
						'surecart',
						'display_currency',
						item.id,
						{
							throwOnError: true,
						}
					)
				)
			);

			createSuccessNotice(
				sprintf(
					_n(
						'Successfully deleted %d currency.',
						'Successfully deleted %d currencies.',
						items.length,
						'surecart'
					),
					items.length
				),
				{
					type: 'snackbar',
				}
			);
		} catch (error) {
			createErrorNotice(
				error?.message ||
					__('Failed to delete currencies.', 'surecart'),
				{
					type: 'snackbar',
				}
			);
		}
	};

	return (
		<>
			<Global
				styles={css`
					.sc-content {
						--sc-settings-content-width: 1000px;
					}
				`}
			/>
			<SettingsTemplate
				title={__('Currency Settings', 'surecart')}
				icon={<ScIcon name="dollar-sign" />}
				css={css`
					margin-bottom: 60px;
				`}
				onSubmit={onSubmit}
			>
				<Error error={error} setError={setError} margin="80px" />
				<SettingsBox
					title={__('Currency DisplaySettings', 'surecart')}
					description={__(
						'Set the currency display settings for your site.',
						'surecart'
					)}
					noButton
				>
					<ScSwitch
						checked={currencyGeolocationEnabled}
						name="currency_geolocation_enabled"
						onScChange={(e) =>
							setCurrencyGeolocationEnabled(e.target.checked)
						}
					>
						{__('Geolocation', 'surecart')}
						<span slot="description" style={{ lineHeight: '1.4' }}>
							{__(
								"Use the user's location to determine which currency to display by default. NOTE: This may not work if the user is using a VPN, proxy, or you are caching your site pages.",
								'surecart'
							)}
						</span>
					</ScSwitch>
				</SettingsBox>

				<SettingsBox
					title={__('Display Currencies', 'surecart')}
					description={__(
						'Set the currencies you want to display on your site.',
						'surecart'
					)}
					wrapperTag="div"
					end={
						<ScSelect
							search
							onScChange={onAddNewCurrency}
							choices={(scData?.supported_currencies || []).map(
								({
									name,
									symbol,
									currency: value,
									flag: icon,
								}) => ({
									label: `${name} (${symbol})`,
									value,
									icon,
								})
							)}
							value={null}
							placement="bottom-end"
							css={css`
								min-width: 350px;
								text-align: right;
							`}
						>
							<ScButton
								type="primary"
								slot="trigger"
								busy={!hasResolved}
							>
								<ScIcon name="plus" slot="prefix" />
								{__('Add New', 'surecart')}
							</ScButton>
						</ScSelect>
					}
					noButton
				>
					<div
						css={css`
							background: var(
								--sc-card-background-color,
								var(--sc-color-white)
							);
							border: 1px solid
								var(
									--sc-card-border-color,
									var(--sc-color-gray-300)
								);
							border-radius: var(--sc-input-border-radius-medium);
							box-shadow: var(--sc-shadow-small);
						`}
					>
						<DataViews
							data={data}
							fields={fields}
							view={view}
							hasBulkActions={true}
							onChangeView={setView}
							supportedLayouts={['table']}
							defaultLayouts={defaultLayouts}
							paginationInfo={paginationInfo}
							isLoading={!hasResolved}
							actions={[
								{
									id: 'edit',
									label: 'Edit',
									isEligible: (item) =>
										item.is_default_currency,
									callback: () => {
										window.location.assign(
											addQueryArgs('admin.php', {
												page: 'sc-settings',
											})
										);
									},
								},
								{
									id: 'delete',
									icon: <Icon icon={trash} />,
									label: __('Delete', 'surecart'),
									isDestructive: true,
									supportsBulk: true,
									isEligible: (item) =>
										!item.is_default_currency,
									hideModalHeader: true,
									RenderModal: ({ items, closeModal }) => (
										<VStack>
											<Text>
												{sprintf(
													_n(
														'Are you sure you want to delete %d currency?',
														'Are you sure you want to delete %d currencies?',
														items.length,
														'surecart'
													),
													items.length
												)}
											</Text>

											<HStack justify="end">
												<Button
													variant="tertiary"
													onClick={() => {
														closeModal();
													}}
												>
													{__('Cancel', 'surecart')}
												</Button>
												<Button
													variant="primary"
													onClick={() => {
														handleDelete(items);
														closeModal();
													}}
												>
													{__(
														'Confirm Delete',
														'surecart'
													)}
												</Button>
											</HStack>
										</VStack>
									),
								},
							]}
						/>
					</div>
				</SettingsBox>
			</SettingsTemplate>
		</>
	);
}
