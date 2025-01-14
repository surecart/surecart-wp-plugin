/** @jsx jsx */
import { __ } from '@wordpress/i18n';
import { css, jsx } from '@emotion/react';
import SettingsTemplate from '../SettingsTemplate';
import { ScIcon } from '@surecart/components-react';
import { DataViews, filterSortAndPaginate } from '@wordpress/dataviews/wp';
import { useEntityRecords, useEntityRecord } from '@wordpress/core-data';
import SettingsBox from '../SettingsBox';
import './style.scss';
import { useMemo, useState } from 'react';

export default function DisplayCurrencySettings() {
	const loading = false;

	const { records: currencies, hasResolved: hasLoadedCurrencies } =
		useEntityRecords('surecart', 'display_currency');

	const { editedRecord: account, hasResolved: hasLoadedAccount } =
		useEntityRecord('surecart', 'store', 'account');

	const defaultLayouts = {
		table: {
			layout: {
				primaryField: 'name',
			},
		},
	};

	const [view, setView] = useState({
		type: 'table',
		perPage: 10,
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

	const fields = [
		{
			id: 'name',
			label: __('Currency', 'presto-player'),
			enableGlobalSearch: true,
			render: ({ item }) => `${item?.name} (${item?.currency_symbol})`,
		},
		{
			id: 'label',
			label: __('Label', 'presto-player'),
			render: ({ item }) => item?.currency?.toUpperCase?.(),
		},
		{
			id: 'rate',
			label: __('Exchange Rate', 'surecart'),
			render: ({ item }) => item?.current_exchange_rate,
		},
		{
			id: 'preview',
			label: __('Preview', 'surecart'),
			render: ({ item }) => item?.display_example,
		},
	];

	// "processedData" and "paginationInfo" definition
	const { data: processedData, paginationInfo } = useMemo(() => {
		return filterSortAndPaginate(currencies, view, fields);
	}, [currencies, view]);

	return (
		<SettingsTemplate
			title={__('Currencies', 'surecart')}
			icon={<ScIcon name="dollar-sign" />}
			loading={!hasLoadedCurrencies || !hasLoadedAccount}
			noButton
		>
			<SettingsBox
				title={__('Display Currencies', 'surecart')}
				loading={loading}
				wrapperTag="div"
				noButton
			>
				<div
					css={css`
						background: white;
					`}
				>
					<DataViews
						data={processedData}
						fields={fields}
						view={view}
						hasBulkActions={true}
						onChangeView={setView}
						supportedLayouts={['table']}
						defaultLayouts={defaultLayouts}
						paginationInfo={paginationInfo}
						actions={[
							{
								id: 'delete',
								label: 'Delete',
								isDestructive: true,
								supportsBulk: true,
								isEligible: (item) => !item.is_default_currency,
								RenderModal: ({
									items,
									closeModal,
									onActionPerformed,
								}) => (
									<div>
										<p>
											Are you sure you want to delete{' '}
											{items.length} item(s)?
										</p>
										<Button
											variant="primary"
											onClick={() => {
												console.log(
													'Deleting items:',
													items
												);
												// onActionPerformed();
												closeModal();
											}}
										>
											Confirm Delete
										</Button>
									</div>
								),
							},
						]}
					/>
				</div>
			</SettingsBox>
		</SettingsTemplate>
	);
}
