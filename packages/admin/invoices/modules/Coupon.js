/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import { ScCouponForm } from '@surecart/components-react';
import { useInvoice } from '../hooks/useInvoice';
import { useState } from 'react';
import Error from '../../components/Error';

export default () => {
	const { checkout, checkoutRequest, busy, setBusy, isDraftInvoice } =
		useInvoice();

	const [error, setError] = useState(null);

	const onCouponChange = async (e) => {
		try {
			setBusy(true);
			setError(null);
			await checkoutRequest({
				method: 'PATCH',
				data: {
					discount: {
						promotion_code: e?.detail,
					},
				},
			});
		} catch (e) {
			console.error(e);
			setError(e);
		} finally {
			setBusy(false);
		}
	};

	return (
		<>
			<Error error={error} setError={setError} />
			<ScCouponForm
				collapsed={true}
				editable={isDraftInvoice}
				placeholder={__('Enter Coupon Code', 'surecart')}
				label={__('Add Coupon Code', 'surecart')}
				buttonText={__('Apply', 'surecart')}
				onScApplyCoupon={onCouponChange}
				discount={checkout?.discount}
				currency={checkout?.currency}
				discountAmount={checkout?.discount_amount}
				busy={busy}
			/>
		</>
	);
};
