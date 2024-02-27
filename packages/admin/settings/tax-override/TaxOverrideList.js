/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';

/**
 * Internal dependencies.
 */
import {
	ScAlert,
	ScButton,
	ScCard,
	ScEmpty,
	ScIcon,
	ScStackedList,
	ScStackedListRow,
	ScText,
} from '@surecart/components-react';
import TaxOverrideModal from './TaxOverrideModal';
import TaxOverrideDeleteModal from './TaxOverrideDeleteModal';
import TaxOverrideRows from './TaxOverrideRows';
import PrevNextButtons from '../../ui/PrevNextButtons';
import usePagination from '../../hooks/usePagination';
import { TAX_OVERRIDE_PER_PAGE } from './useTaxOverrides';

export default ({
	region,
	type,
	taxProtocol,
	registrations,
	taxOverrides,
	fetching,
	currentPage,
	setCurrentPage,
}) => {
	const [modal, setModal] = useState(false);
	const [selectedTaxOverride, setSelectedTaxOverride] = useState(null);

	const onEdit = (taxOverride) => {
		setModal('edit');
		setSelectedTaxOverride(taxOverride);
	};

	const onRemove = (taxOverride) => {
		setModal('delete');
		setSelectedTaxOverride(taxOverride);
	};

	const onRequestClose = () => {
		setModal(null);
		setSelectedTaxOverride(null);
	};

	const { hasPagination } = usePagination({
		data: taxOverrides,
		page: currentPage,
		perPage: TAX_OVERRIDE_PER_PAGE,
	});

	const { zones, zonesLoading } = useSelect(
		(select) => {
			// If the region is not 'eu' or 'ca', we want to use registrations instead.
			if (!['eu', 'ca'].includes(region)) {
				return [];
			}
			// If the region is 'eu' and the taxProtocol does not have the eu_tax_enabled property, we want to use registrations instead.
			if (region === 'eu' && !taxProtocol?.eu_tax_enabled) {
				return [];
			}
			// If the region is 'ca' and the taxProtocol does not have the ca_tax_enabled property, we want to use registrations instead.
			if (region === 'ca' && !taxProtocol?.ca_tax_enabled) {
				return [];
			}

			const queryArgs = [
				'surecart',
				'tax-zone',
				{
					tax_region: [region],
					per_page: 100,
				},
			];
			return {
				zones: select(coreStore).getEntityRecords(...queryArgs) || [],
				zonesLoading: select(coreStore).isResolving(
					'getEntityRecords',
					queryArgs
				),
			};
		},
		[region, taxProtocol]
	);

	// get the available zones based on the registrations and taxOverrides
	const loading = fetching || zonesLoading;

	// get the available zones based on the registrations and taxOverrides
	const availableZones = zones?.length
		? zones.reverse()
		: (registrations || []).map(({ tax_zone }) => tax_zone);

	return (
		<>
			<ScCard style={{ position: 'relative' }}>
				<ScText
					style={{
						'--font-weight': 'var(--sc-font-weight-bold)',
						'--font-size': 'var(--sc-font-size-medium)',
					}}
				>
					{type === 'shipping'
						? __('Shipping Overrides', 'surecart')
						: __('Product Overrides', 'surecart')}
				</ScText>

				{!availableZones?.length && !loading ? (
					<ScAlert type="primary" open>
						{__(
							'Please enable tax collection to add tax overrides.',
							'surecart'
						)}
					</ScAlert>
				) : (
					<>
						{!taxOverrides?.length && !loading ? (
							<ScEmpty icon="percent">
								{type === 'shipping'
									? __(
											'Specify a unique tax rate for shipping charges.',
											'surecart'
									  )
									: __(
											'Specify a unique tax rate for a collection of products.',
											'surecart'
									  )}
								<ScButton onClick={() => setModal('edit')}>
									<ScIcon name="plus" slot="prefix" />
									{__('Add Override', 'surecart')}
								</ScButton>
							</ScEmpty>
						) : (
							<ScCard noPadding loading={loading}>
								<ScStackedList>
									<TaxOverrideRows
										type={type}
										taxOverrides={taxOverrides}
										onEdit={onEdit}
										onRemove={onRemove}
									/>

									<ScStackedListRow>
										<ScButton
											type="default"
											onClick={() => setModal('edit')}
										>
											<ScIcon name="plus" slot="prefix" />
											{__('Add Override', 'surecart')}
										</ScButton>
									</ScStackedListRow>
								</ScStackedList>
							</ScCard>
						)}
					</>
				)}

				{hasPagination && (
					<div
						css={css`
							padding: var(--sc-spacing-x-large);
							border-top: 1px solid var(--sc-color-brand-stroke);
							margin: 0;
						`}
					>
						<PrevNextButtons
							data={taxOverrides}
							page={currentPage}
							setPage={setCurrentPage}
							perPage={TAX_OVERRIDE_PER_PAGE}
							loading={loading}
						/>
					</div>
				)}
			</ScCard>

			<TaxOverrideModal
				region={region}
				taxProtocol={taxProtocol}
				open={modal === 'edit'}
				type={type}
				taxOverrides={taxOverrides}
				taxOverride={selectedTaxOverride}
				zones={availableZones}
				onRequestClose={onRequestClose}
			/>

			<TaxOverrideDeleteModal
				type={type}
				open={modal === 'delete'}
				taxOverride={selectedTaxOverride}
				onRequestClose={onRequestClose}
			/>

			{loading && <sc-block-ui spinner></sc-block-ui>}
		</>
	);
};
