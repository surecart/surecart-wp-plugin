/** @jsx jsx */
import { __, _n, sprintf } from '@wordpress/i18n';
import { css, jsx, Global } from '@emotion/react';
import SettingsTemplate from '../SettingsTemplate';
import SettingsBox from '../SettingsBox';
import { ScButton, ScIcon, ScSelect, ScTag } from '@surecart/components-react';
import { DataViews, filterSortAndPaginate } from '@wordpress/dataviews/wp';
import {
	useEntityRecords,
	useEntityRecord,
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
import { trash } from '@wordpress/icons';
import { getCurrencySymbol } from '../../util';
import { store as noticesStore } from '@wordpress/notices';

export default function DisplayCurrencySettings() {
	const { saveEntityRecord, deleteEntityRecord } = useDispatch(coreStore);
	const { createErrorNotice, createSuccessNotice } =
		useDispatch(noticesStore);

	const { record: account } = useEntityRecord('surecart', 'store', 'account');

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

	const getCurrencyFlag = (currency) => {
		return scData?.currency_flags[currency] || '';
	};

	const paginationInfo = useMemo(
		() => ({
			totalItems,
			totalPages,
		}),
		[totalItems, totalPages]
	);

	const supportedCurrencyOptions = Object.keys(
		scData?.supported_currencies || {}
	).map((value) => {
		return {
			label: `${scData?.supported_currencies[value]} (${getCurrencySymbol(
				value
			)})`,
			value,
			icon: getCurrencyFlag(value),
			disabled: (currencies || []).some(
				(currency) => currency.currency === value
			),
		};
	});

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
						src={getCurrencyFlag(item?.currency)}
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

			await saveEntityRecord(
				'surecart',
				'display_currency',
				{
					currency,
				},
				{
					throwOnError: true,
				}
			);

			// Get the full currency name from supported currencies
			const currencyName =
				scData?.supported_currencies[currency] || currency;

			createSuccessNotice(
				sprintf(
					/* translators: %s: currency name */
					__('%s added successfully.', 'surecart'),
					currencyName
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
				noButton
				css={css`
					margin-bottom: 60px;
				`}
			>
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
							choices={supportedCurrencyOptions}
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
