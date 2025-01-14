/** @jsx jsx */
import { __, _n, sprintf } from '@wordpress/i18n';
import { css, jsx, Global } from '@emotion/react';
import SettingsTemplate from '../SettingsTemplate';
import SettingsBox from '../SettingsBox';
import { ScButton, ScIcon, ScSelect, ScTag } from '@surecart/components-react';
import { DataViews, filterSortAndPaginate } from '@wordpress/dataviews/wp';
import { useEntityRecords, store as coreStore } from '@wordpress/core-data';
import { useDispatch } from '@wordpress/data';
import { addQueryArgs } from '@wordpress/url';
import './style.scss';
import { useMemo, useState } from 'react';
import {
	Button,
	__experimentalText as Text,
	__experimentalVStack as VStack,
	__experimentalHStack as HStack,
} from '@wordpress/components';
import { getCurrencySymbol } from '../../util';

export default function DisplayCurrencySettings() {
	const { saveEntityRecord } = useDispatch(coreStore);

	const defaultLayouts = {
		table: {
			layout: {
				primaryField: 'name',
			},
		},
	};

	const [view, setView] = useState({
		type: 'table',
		per_page: 100,
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
		hasStarted,
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

	const defaultCurrency = (currencies || []).find(
		(currency) => currency.is_default_currency
	);

	const supportedCurrencyOptions = Object.keys(
		scData?.supported_currencies || {}
	).map((value) => {
		return {
			label: `${scData?.supported_currencies[value]} (${getCurrencySymbol(
				value
			)})`,
			value,
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
				<>
					<strong>{item?.name}</strong> ({item?.currency_symbol}){' '}
					{item?.is_default_currency && (
						<ScTag>{__('Default', 'surecart')}</ScTag>
					)}
				</>
			),
		},
		{
			id: 'label',
			label: __('Label', 'presto-player'),
			enableSorting: false,
			render: ({ item }) => item?.currency?.toUpperCase?.(),
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
					<>
						1 {defaultCurrency?.currency?.toUpperCase?.()}={' '}
						{item?.current_exchange_rate}{' '}
						{item?.currency?.toUpperCase?.()}
					</>
				);
			},
		},
		{
			id: 'preview',
			enableSorting: false,
			label: __('Preview', 'surecart'),
			render: ({ item }) => <ScTag>{item?.display_example}</ScTag>,
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
		} catch (error) {
			console.error('Error adding currency:', error);
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
				loading={!hasStarted}
				noButton
			>
				<SettingsBox
					title={__('Display Currencies', 'surecart')}
					description={__(
						'Set the currencies you want to display on your site using the language of your site.',
						'surecart'
					)}
					loading={!hasStarted}
					wrapperTag="div"
					end={
						<ScSelect
							search
							onScChange={onAddNewCurrency}
							choices={supportedCurrencyOptions}
							placement="bottom-end"
							css={css`
								min-width: 300px;
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
									label: __('Delete', 'surecart'),
									isDestructive: true,
									supportsBulk: true,
									isEligible: (item) =>
										!item.is_default_currency,
									callback: () => {
										console.log('delete');
									},
									hideModalHeader: true,
									RenderModal: ({ items, closeModal }) => (
										<VStack>
											<Text>
												{sprintf(
													_n(
														'Are you sure you want to delete %d item?',
														'Are you sure you want to delete %d items?',
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
														console.log(
															'Deleting items:',
															items
														);
														onActionPerformed();
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
