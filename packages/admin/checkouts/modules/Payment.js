import Box from '../../ui/Box';
import { __ } from '@wordpress/i18n';
import {
	ScBlockUi,
	ScCard,
	ScEmpty,
	ScFlex,
	ScStackedList,
	ScStackedListRow,
	ScTable,
	ScTableCell,
	ScTableRow,
	ScFormatNumber,
	ScLineItem,
	ScCouponForm,
    ScDivider
} from '@surecart/components-react';
import { store as coreStore } from '@wordpress/core-data';
import { store as noticesStore } from '@wordpress/notices';
import { useDispatch, select } from '@wordpress/data';
import expand from '../query';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import { useState } from 'react';

export default ({ checkout, loading, busy }) => {
	const [busyPayment, setBusyPayment] = useState(false);
    
    const { createErrorNotice, createSuccessNotice } =
		useDispatch(noticesStore);

	const { deleteEntityRecord, receiveEntityRecords } = useDispatch(coreStore);

    const onCouponChange = async (e) => {
		try {
			setBusyPayment(true);
			// get the line items endpoint.
			const { baseURL } = select(coreStore).getEntityConfig(
				'surecart',
				'checkout'
			);

			const data = await apiFetch({
				method: 'PATCH',
				path: addQueryArgs(`${baseURL}/${checkout?.id}`, {
					expand: [
						// expand the checkout and the checkout's required expands.
						...(expand || []).map((item) => {
							return item.includes('.')
								? item
								: `checkout.${item}`;
						}),
						'checkout',
					],
				}),
				data: {
					discount: {
                        promotion_code: e?.detail
                    }, // update the coupon.
				},
			});
			console.log(data);
			// update the checkout in the redux store.
			receiveEntityRecords(
				'surecart',
				'checkout',
				data,
				undefined,
				false,
				checkout
			);

			createSuccessNotice(__('Quantity updated.', 'surecart'), {
				type: 'snackbar',
			});
		} catch (e) {
			console.error(e);
			createErrorNotice(
				e?.message || __('Something went wrong', 'surecart'),
				{
					type: 'snackbar',
				}
			);
		} finally {
			setBusyPayment(false);
		}
	};
    const renderPaymentDetails = () => {
		return (
			<>
				<ScLineItem>
					<span slot="description">{__('Subtotal', 'surecart')}</span>
					<ScFormatNumber
						slot="price"
						style={{
							fontWeight: 'var(--sc-font-weight-semibold)',
							color: 'var(--sc-color-gray-800)',
						}}
						type="currency"
						currency={checkout?.currency}
						value={checkout?.subtotal_amount}
					></ScFormatNumber>
				</ScLineItem>

				<ScCouponForm
					collapsed={true}
					placeholder={__('Enter Coupon Code', 'surecart')}
					label={__('Add Coupon Code', 'surecart')}
					buttonText={__('Apply', 'surecart')}
					onScApplyCoupon={onCouponChange}
                    discount={checkout?.discount}
                    currency={checkout?.currency}
                    discountAmount={checkout?.discount_amount}    
				/>

                <ScDivider style={{ '--spacing': 'var(--sc-spacing-small)' }} />

                <ScLineItem>
					<span slot="description">{__('Total', 'surecart')}</span>
					<ScFormatNumber
						slot="price"
						style={{
							fontWeight: 'var(--sc-font-weight-semibold)',
							color: 'var(--sc-color-gray-800)',
						}}
						type="currency"
						currency={checkout?.currency}
						value={checkout?.total_amount}
					></ScFormatNumber>
				</ScLineItem>
			</>
		);
	};

	return (
        <Box title={__('Payment', 'surecart')} loading={loading}>
            {renderPaymentDetails()}
            {(!!busy || !!busyPayment) && (
                <ScBlockUi spinner />
            )}
        </Box>
    );
}