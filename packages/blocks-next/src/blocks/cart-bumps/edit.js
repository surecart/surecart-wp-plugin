import { useBlockProps } from '@wordpress/block-editor';
import { Disabled } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const BUMPS = [
	{
		percent_off: 20,
		metadata: {
			description:
				"Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
		},
		price: {
			currency: 'usd',
			amount: 1234,
			recurring_interval_count: 1,
			recurring_interval: 'month',
			product: {
				name: 'Product Name',
				image_url: 'https://source.unsplash.com/daily',
			},
		},
	},
];

export default function Edit() {
	const blockProps = useBlockProps();

	return (
		<div {...blockProps}>
			<div className="wp-block-surecart-cart-bumps">
				{BUMPS.map((bump) => (
					<div
						key={bump.id}
						className="wp-block-surecart-cart-bumps__item"
					>
						<div className="wp-block-surecart-cart-bumps__image">
							{bump?.price?.product?.image_url && (
								<img
									src={bump.price.product.image_url}
									alt={bump.price.product.name}
								/>
							)}
						</div>
						<div className="wp-block-surecart-cart-bumps__content">
							<h4 className="wp-block-surecart-cart-bumps__title">
								{bump?.price?.product?.name}
							</h4>
							<div className="wp-block-surecart-cart-bumps__description">
								{bump?.price?.product?.description}
							</div>
							<div className="wp-block-surecart-cart-bumps__price">
								{bump?.price?.amount_with_tax}
							</div>
							<button className="wp-block-button__link wp-element-button">
								{__('Add to Order', 'surecart')}
							</button>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
