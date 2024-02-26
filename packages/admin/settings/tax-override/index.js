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
import SettingsBox from '../SettingsBox';
import TaxOverrideList from './TaxOverrideList';
import useTaxOverrides from './useTaxOverrides';

export default ({ region, registrations, hasLoadedItem }) => {
	const [shippingOverrideCurrentPage, setShippingOverrideCurrentPage] =
		useState(1);
	const {
		taxOverrides: shippingOverrides,
		fetching: shippingOverridesFetching,
	} = useTaxOverrides('shipping', region, shippingOverrideCurrentPage);

	const [productOverrideCurrentPage, setProductOverrideCurrentPage] =
		useState(1);
	const {
		taxOverrides: productOverrides,
		fetching: productOverridesFetching,
	} = useTaxOverrides('product', region, productOverrideCurrentPage);

	return (
		<>
			<SettingsBox
				title={__('Tax Rates and Exemptions', 'surecart')}
				description={__(
					'You can specify unique tax rates for a collection of products or on shipping charges.',
					'surecart'
				)}
				noButton
				loading={!hasLoadedItem}
				wrapperTag="div"
			>
				<TaxOverrideList
					type="shipping"
					region={region}
					registrations={registrations}
					taxOverrides={shippingOverrides}
					fetching={shippingOverridesFetching}
					currentPage={shippingOverrideCurrentPage}
					setCurrentPage={setShippingOverrideCurrentPage}
				/>

				<div
					css={css`
						margin-top: var(--sc-spacing-large);
					`}
				>
					<TaxOverrideList
						type="product"
						region={region}
						registrations={registrations}
						taxOverrides={productOverrides}
						fetching={productOverridesFetching}
						currentPage={productOverrideCurrentPage}
						setCurrentPage={setProductOverrideCurrentPage}
					/>
				</div>
			</SettingsBox>
		</>
	);
};
