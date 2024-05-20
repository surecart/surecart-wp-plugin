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
			title={title || __('Product Commissions', 'surecart')}
			columns={columns}
			empty={empty || __('None found.', 'surecart')}
			items={(data || [])
				.sort((a, b) => b.created_at - a.created_at)
				.map((affiliationProduct) => {
					const { product, commission_structure } =
						affiliationProduct;

					return {
						product: <Product product={product} />,

						commission_amount: (
							<ScText>
								{commission_structure?.commission_amount}
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
							<ScDropdown placement="bottom-end">
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
										<ScIcon
											slot="prefix"
											name="edit-2"
											style={{
												opacity: 0.5,
											}}
										/>
										{__('Edit', 'surecart')}
									</ScMenuItem>
									<ScMenuItem
										onClick={() =>
											onDelete(affiliationProduct?.id)
										}
									>
										<ScIcon
											slot="prefix"
											name="trash"
											style={{
												opacity: 0.5,
											}}
										/>
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
