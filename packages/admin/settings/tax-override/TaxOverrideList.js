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
	ScBlockUi,
	ScButton,
	ScCard,
	ScDropdown,
	ScFlex,
	ScIcon,
	ScMenu,
	ScMenuItem,
	ScStackedList,
	ScStackedListRow,
	ScText,
} from '@surecart/components-react';
import TaxOverrideModal from './TaxOverrideModal';
import TaxOverrideDeleteModal from './TaxOverrideDeleteModal';

export default ({ region, type, registrations }) => {
	const [modal, setModal] = useState(false);
	const [selectedTaxOverride, setSelectedTaxOverride] = useState(null);

	// Get all tax overrides for the region.
	const { shippingOverrides, productOverrides, fetching } = useSelect(
		(select) => {
			const queryArgs = [
				'surecart',
				'tax_override',
				{
					context: 'edit',
					per_page: 100,
					tax_region: [region],
				},
			];
			const taxOverrides = select(coreStore).getEntityRecords(
				...queryArgs
			);
			return {
				shippingOverrides: (taxOverrides || []).filter(
					(taxOverride) => taxOverride?.shipping
				),
				productOverrides: (taxOverrides || []).filter(
					(taxOverride) => taxOverride?.product_collection
				),
				fetching: select(coreStore).isResolving(
					'getEntityRecords',
					queryArgs
				),
			};
		},
		[]
	);

	const onEdit = (taxOverride) => {
		setModal('edit');
		setSelectedTaxOverride(taxOverride);
	};

	const onRemove = (taxOverride) => {
		setModal('delete');
		setSelectedTaxOverride(taxOverride);
	};

	const taxOverridesData =
		type === 'shipping' ? shippingOverrides : productOverrides;

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

				<ScCard noPadding loading={fetching}>
					<ScStackedList>
						{taxOverridesData.length === 0 && !fetching && (
							<ScAlert
								type="warning"
								open
								title={__(
									'No tax overrides found for this zone.',
									'surecart'
								)}
								css={css`
									padding: var(--sc-spacing-large);
								`}
							>
								{__(
									'Customers will be charged the standard tax rate for this zone.',
									'surecart'
								)}
							</ScAlert>
						)}
						{taxOverridesData.map((taxOverride) => {
							if (!taxOverride) return null;
							return (
								<>
									{/* Add a product collection name, if it's for product collection */}
									{taxOverride?.product_collection?.id && (
										<ScStackedListRow
											css={css`
												--sc-list-row-background-color: var(
													--sc-color-gray-50
												);
											`}
										>
											<ScFlex flexDirection="column">
												<ScText
													css={css`
														color: var(
															--sc-color-primary-500
														);
														--font-weight: bold;
													`}
												>
													{
														taxOverride
															?.product_collection
															.name
													}
												</ScText>
											</ScFlex>
										</ScStackedListRow>
									)}

									<ScStackedListRow>
										<ScFlex flexDirection="column">
											<ScText>
												{
													taxOverride?.tax_zone
														?.country_name
												}
											</ScText>
											<ScText>
												{taxOverride?.rate ||
													taxOverride?.tax_zone
														?.default_rate}
												%
											</ScText>
										</ScFlex>

										<ScDropdown
											slot="suffix"
											placement="bottom-end"
										>
											<ScButton
												type="text"
												slot="trigger"
												circle
											>
												<ScIcon name="more-horizontal" />
											</ScButton>
											<ScMenu>
												<ScMenuItem
													onClick={() =>
														onEdit(taxOverride)
													}
												>
													<ScIcon
														slot="prefix"
														name="edit"
													/>
													{__('Edit', 'surecart')}
												</ScMenuItem>
												<ScMenuItem
													onClick={() =>
														onRemove(taxOverride)
													}
												>
													<ScIcon
														slot="prefix"
														name="trash"
													/>
													{__('Delete', 'surecart')}
												</ScMenuItem>
											</ScMenu>
										</ScDropdown>
									</ScStackedListRow>
								</>
							);
						})}
						<ScStackedListRow>
							<ScButton
								type="default"
								onClick={() => setModal('new')}
							>
								<ScIcon name="plus" slot="prefix" />
								{__('Add Override', 'surecart')}
							</ScButton>
						</ScStackedListRow>
					</ScStackedList>
				</ScCard>
			</ScCard>

			<TaxOverrideModal
				region={region}
				modal={modal !== 'delete' ? modal : false}
				type={type}
				taxOverride={selectedTaxOverride}
				onDelete={() => {
					setModal(null);
					setSelectedTaxOverride(null);
				}}
				registration={registrations?.[0] || {}}
				onRequestClose={() => setModal(null)}
			/>

			<TaxOverrideDeleteModal
				type={type}
				open={modal === 'delete'}
				taxOverride={selectedTaxOverride}
				onRequestClose={() => setModal(null)}
			/>

			{fetching && <sc-block-ui spinner></sc-block-ui>}
		</>
	);
};
