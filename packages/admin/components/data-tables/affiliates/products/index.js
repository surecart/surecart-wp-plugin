/** @jsx jsx   */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
/**
 * Internal dependencies.
 */
import DataTable from '../../../DataTable';
import {
	ScButton,
	ScDropdown,
	ScIcon,
	ScMenu,
	ScMenuItem,
	ScText,
} from '@surecart/components-react';
import Product from './Product';

export default ({
	data,
	isLoading,
	title,
	error,
	isFetching,
	page,
	setPage,
	pagination,
	columns,
	footer,
	headerAction,
	empty,
	setAffiliationProduct,
	onDelete,
	...props
}) => {
	return (
		<DataTable
			title={title || __('Products', 'surecart')}
			columns={columns}
			empty={empty || __('None found.', 'surecart')}
			items={(data || [])
				.sort((a, b) => b.created_at - a.created_at)
				.map((affiliationProduct) => {
					const { product, commission_structure } =
						affiliationProduct;

					return {
						product: <Product product={product} />,

						discount_amount: (
							<ScText>
								{commission_structure?.discount_amount}
							</ScText>
						),

						subscription_commission: (
							<ScText>
								{commission_structure?.subscription_commission ||
									'-'}
							</ScText>
						),

						lifetime_commission: (
							<ScText>
								{commission_structure?.lifetime_commission ||
									'-'}
							</ScText>
						),

						action: (
							<ScDropdown position="bottom-right">
								<ScButton type="text" slot="trigger" circle>
									<ScIcon name="more-horizontal" />
								</ScButton>
								<ScMenu>
									<ScMenuItem
										onClick={() =>
											setAffiliationProduct(
												affiliationProduct
											)
										}
									>
										{__('Edit', 'surecart')}
									</ScMenuItem>
									<ScMenuItem
										onClick={() =>
											onDelete(affiliationProduct?.id)
										}
									>
										{__('Delete', 'surecart')}
									</ScMenuItem>
								</ScMenu>
							</ScDropdown>
						),
					};
				})}
			loading={isLoading}
			updating={isFetching}
			headerAction={headerAction}
			footer={!!footer && footer}
			{...props}
		/>
	);
};
