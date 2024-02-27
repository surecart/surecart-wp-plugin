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

	const isRegionTaxCollected = () =>
		registrations.some((r) => r.tax_zone?.region === region);

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

				{!isRegionTaxCollected() ? (
					<ScAlert type="primary" open>
						{__(
							'Please enable tax collection to add tax overrides.',
							'surecart'
						)}
					</ScAlert>
				) : (
					<>
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
								<ScButton onClick={() => setModal('edit')}>
									<ScIcon name="plus" slot="prefix" />
									{__('Add Override', 'surecart')}
								</ScButton>
							</ScEmpty>
						) : (
							<ScCard noPadding loading={fetching}>
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
							loading={fetching}
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
