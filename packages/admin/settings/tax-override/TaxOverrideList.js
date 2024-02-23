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

export default ({ region, type, registrations }) => {
	const [modal, setModal] = useState(null);
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
					<ScStackedList
						style={{
							'--columns': '2',
						}}
					>
						{taxOverridesData.map((taxOverride) => {
							if (!taxOverride) return null;
							return (
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
							);
						})}
						<ScStackedListRow
							css={css`
								cursor: pointer;
							`}
							onClick={() => setModal('new')}
						>
							<ScFlex justifyContent="flex-start">
								<div>+</div>
								<div>{__('Override', 'surecart')}</div>
							</ScFlex>
						</ScStackedListRow>
					</ScStackedList>
				</ScCard>
			</ScCard>

			<TaxOverrideModal
				region={region}
				modal={modal}
				type={type}
				taxOverride={selectedTaxOverride}
				onDelete={() => {
					setModal(null);
					setSelectedTaxOverride(null);
				}}
				registration={registrations?.[0] || {}}
				onRequestClose={() => setModal(null)}
			/>
		</>
	);
};
