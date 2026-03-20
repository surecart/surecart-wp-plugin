import { __, sprintf } from '@wordpress/i18n';
import {
	ScButton,
	ScDialog,
	ScForm,
	ScAlert,
	ScSelect,
	ScDivider,
} from '@surecart/components-react';
import { addQueryArgs } from '@wordpress/url';
import { useState } from 'react';
import CopyInput from './CopyInput';
import { formatNumber } from '../../../../util';

export default ({ open, price, variants, stockEnabled, onRequestClose }) => {
	const [selectedVariant, setSelectedVariant] = useState(variants?.[0]);
	const canCopy = !variants?.length || selectedVariant?.status === 'active';

	return (
		open && (
			<ScDialog
				open={open}
				label={__('Price Details', 'surecart')}
				onScAfterHide={onRequestClose}
				style={{ '--dialog-body-overflow': 'visible' }}
			>
				<ScForm style={{ '--sc-form-row-spacing': '1.25em' }}>
					{!!variants?.length && (
						<ScSelect
							label={__('Variant', 'surecart')}
							value={selectedVariant?.id}
							onScChange={(e) =>
								setSelectedVariant(
									variants.find(
										(v) => v.id === e.target.value
									)
								)
							}
							choices={(variants || [])
								.filter(
									(variant) => variant?.status === 'active'
								)
								.map((variant) => {
									return {
										label: [
											variant?.option_1,
											variant?.option_2,
											variant?.option_3,
										]
											.filter(Boolean)
											.join(' / '),
										description: stockEnabled
											? sprintf(
													__(
														'%s available',
														'surecart'
													),
													variant?.available_stock
											  )
											: null,
										suffix: formatNumber(
											variant?.amount || price.amount,
											price.currency
										),
										value: variant?.id,
									};
								})}
						/>
					)}
					{canCopy ? (
						<CopyInput
							label={__('Buy Link', 'surecart')}
							text={addQueryArgs(scData?.checkout_page_url, {
								line_items: [
									{
										price_id: price?.id,
										quantity: 1,
										...(selectedVariant?.id
											? { variant_id: selectedVariant.id }
											: {}),
									},
								],
							})}
						/>
					) : (
						<ScAlert type="warning" open>
							{__(
								'Please select an available option.',
								'surecart'
							)}
						</ScAlert>
					)}

					<ScDivider>{__('Shortcodes', 'surecart')}</ScDivider>

					<CopyInput
						label={__('Add To Cart Button Shortcode', 'surecart')}
						text={`[sc_add_to_cart_button price_id=${price?.id}${
							selectedVariant?.id
								? ` variant_id=${selectedVariant.id}`
								: ''
						}]Add To Cart[/sc_add_to_cart_button]`}
					/>
					<CopyInput
						label={__('Buy Button Shortcode', 'surecart')}
						text={`[sc_buy_button]Buy Now [sc_line_item price_id=${
							price?.id
						}${
							selectedVariant?.id
								? ` variant_id=${selectedVariant.id}`
								: ''
						} quantity=1][/sc_buy_button]`}
					/>

					<ScDivider>{__('Miscellaneous', 'surecart')}</ScDivider>

					<CopyInput
						label={__('Price ID', 'surecart')}
						text={price?.id}
					/>

					{selectedVariant?.id && (
						<CopyInput
							label={__('Variant ID', 'surecart')}
							text={selectedVariant.id}
						/>
					)}
				</ScForm>

				<ScButton onClick={onRequestClose} type="primary" slot="footer">
					{__('Done', 'surecart')}
				</ScButton>
			</ScDialog>
		)
	);
};
