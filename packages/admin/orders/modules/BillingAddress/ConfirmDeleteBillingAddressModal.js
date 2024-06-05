/** @jsx jsx */
import { jsx } from '@emotion/core';
import {
	ScBlockUi,
	ScButton,
	ScDialog,
	ScFlex,
} from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
import Error from '../../../components/Error';
import { useState } from '@wordpress/element';
import { store as coreStore } from '@wordpress/core-data';
import { store as noticesStore } from '@wordpress/notices';
import apiFetch from '@wordpress/api-fetch';
import { useDispatch } from '@wordpress/data';
import { addQueryArgs } from '@wordpress/url';

export default ({ checkoutId, open, onRequestClose }) => {
	const [error, setError] = useState(false);
	const [busy, setBusy] = useState(false);
	const { receiveEntityRecords } = useDispatch(coreStore);
	const { createSuccessNotice } = useDispatch(noticesStore);

	const onEditAddress = async () => {
		try {
			setBusy(true);
			const checkout = await apiFetch({
				path: addQueryArgs(`/surecart/v1/checkouts/${checkoutId}`, {
					expand: [
						'order',
						'order.checkout',
						'checkout.charge',
						'checkout.customer',
						'checkout.tax_identifier',
						'checkout.payment_failures',
						'checkout.shipping_address',
						'checkout.billing_address',
						'checkout.discount',
						'checkout.line_items',
						'checkout.selected_shipping_choice',
						'shipping_choice.shipping_method',
						'discount.promotion',
						'line_item.price',
						'line_item.fees',
						'line_item.variant',
						'customer.balances',
						'price.product',
						'product.featured_product_media',
						'product_media.media',
						'variant.image',
					],
				}),
				method: 'PATCH',
				data: {
					billing_matches_shipping: false,
					billing_address: {},
				},
			});
			receiveEntityRecords('surecart', 'order', checkout.order);
			createSuccessNotice(__('Billing address deleted', 'surecart'), {
				type: 'snackbar',
			});
			onRequestClose();
		} catch (e) {
			setError(e);
		} finally {
			setBusy(false);
		}
	};

	return (
		<ScDialog
			label={__('Delete Billing Address', 'surecart')}
			open={open}
			onScRequestClose={onRequestClose}
			style={{
				'--dialog-body-overflow': 'visible',
			}}
		>
			<ScFlex flexDirection="column" style={{ gap: '1em' }}>
				<Error error={error} setError={setError} />
				{__(
					'Are you sure you want to delete address? This action cannot be undone.',
					'surecart'
				)}
			</ScFlex>
			<ScButton
				type="text"
				onClick={onRequestClose}
				disabled={busy}
				slot="footer"
			>
				{__('Cancel', 'surecart')}
			</ScButton>
			<ScButton
				type="primary"
				disabled={busy}
				onClick={onEditAddress}
				slot="footer"
			>
				{__('Delete', 'surecart')}
			</ScButton>
			{busy && (
				<ScBlockUi
					style={{ '--sc-block-ui-opacity': '0.75' }}
					zIndex="9"
					spinner
				/>
			)}
		</ScDialog>
	);
};
