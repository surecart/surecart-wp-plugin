/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import { ScButton } from '@surecart/components-react';

/**
 * Internal dependencies.
 */
import ProductLineItem from '../../../ui/ProductLineItem';

export default (license) => {
	const {
		purchase: { id, variant, price, product },
	} = license;

	return {
		item: (
			<ProductLineItem
				key={id}
				lineItem={{
					price: {
						...price,
						product,
					},
					variant,
					variant_options: [
						variant?.option_1,
						variant?.option_2,
						variant?.option_3,
					],
				}}
			/>
		),
		actions: (
			<ScButton
				onClick={() =>
					window.location.assign(
						addQueryArgs('admin.php', {
							page: 'sc-licenses',
							action: 'edit',
							id: license?.id,
						})
					)
				}
				size="small"
			>
				{__('View', 'surecart')}
			</ScButton>
		),
	};
};
