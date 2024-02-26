/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies.
 */
import {
	ScButton,
	ScCard,
	ScDropdown,
	ScEmpty,
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
import PrevNextButtons from '../../ui/PrevNextButtons';
import usePagination from '../../hooks/usePagination';
import { TAX_OVERRIDE_PER_PAGE } from './useTaxOverrides';

export default ({
	region,
	type,
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

				{!taxOverrides?.length && !fetching ? (
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
						<ScButton onClick={() => setModal('new')}>
							<ScIcon name="plus" slot="prefix" />
							{__('Add Override', 'surecart')}
						</ScButton>
					</ScEmpty>
				) : (
					<ScCard noPadding loading={fetching}>
						<ScStackedList>
							{taxOverrides.map((taxOverride) => {
								if (!taxOverride) return null;
								return (
									<>
										{/* Add a product collection name, if it's for product collection */}
										{taxOverride?.product_collection
											?.id && (
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
															onRemove(
																taxOverride
															)
														}
													>
														<ScIcon
															slot="prefix"
															name="trash"
														/>
														{__(
															'Delete',
															'surecart'
														)}
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
							loading={fetching}
						/>
					</div>
				)}
			</ScCard>

			<TaxOverrideModal
				region={region}
				modal={modal !== 'delete' ? modal : false}
				type={type}
				taxOverrides={taxOverrides}
				taxOverride={selectedTaxOverride}
				registrations={registrations}
				onRequestClose={onRequestClose}
			/>

			<TaxOverrideDeleteModal
				type={type}
				open={modal === 'delete'}
				taxOverride={selectedTaxOverride}
				onRequestClose={onRequestClose}
			/>

			{fetching && <sc-block-ui spinner></sc-block-ui>}
		</>
	);
};
