/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { useDispatch, useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { ScAlert, ScButton, ScForm, ScInput, ScAddress } from '@surecart/components-react';
import Box from '../ui/Box';
import Prices from './modules/Prices';
import UpdateModel from '../templates/UpdateModel';
import Logo from '../templates/Logo';
import { useState, useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import { store as uiStore } from '../store/ui';
import SelectCustomer from './modules/SelectCustomer';
import Address from './modules/Address';

export default ({ setId }) => {
	const [isSaving, setIsSaving] = useState(false);
	const [canSaveNow, setCanSaveNow] = useState(false);
	const [customerShippingStatus, setCustomerShippingStatus] = useState(false);
	const [error, setError] = useState('');

	const prices = useSelect((select) => select(uiStore).getPricesForCreateOrder())?.pricesForCreateOrder;
	const customer = useSelect((select) => select(uiStore).getCustomerForCreateOrder())?.customerForCreateOrder;
	const { setCustomerForCreateOrder } = useDispatch(uiStore);

    useEffect(() => {

        if ( ! customer || ! prices ) {
            return;
        }

        if ( 0 !== Object.keys(customer)?.length && 0 !== prices?.length ) {
            setCanSaveNow( true );
        }

	}, [ prices, customer ]);

    useEffect(() => {
        
        if ( ! customer || ! customer?.shipping_address ) {
            setCustomerShippingStatus(false);
            return;
        }

        const {
            city,
            country,
            line_1,
            postal_code,
            state
        } = customer?.shipping_address;

        if ( customer?.shipping_address && city && country && line_1 && postal_code && state ) {
            setCustomerShippingStatus(true);
        }

    }, [ customer ]);
	const { saveEntityRecord } = useDispatch(coreStore);
    
    const finalizeCheckout = async ({id, customer_id}) => {
        return await apiFetch({
          method: 'PATCH',
          path: addQueryArgs(
            `surecart/v1/checkouts/${id}/finalize`,
            {
                manual_payment: true,
                skip_spam_check: true,
                customer_id: customer_id
            }
          )
        });
    };

	// create the order.
	const onSubmit = async (e) => {
        const lineItems = prices?.map((price) => {
            const {
                id,
                ad_hoc_min_amount,
                quantity
            } = price;

            return {
                price: id,
                ad_hoc_amount: ad_hoc_min_amount,
                quantity: quantity || 1
            }
            
        });

        const customerData = {
            first_name: customer?.first_name,
            last_name: customer?.last_name,
            name: customer?.name,
            email: customer?.email,
            shipping_address: customer?.shipping_address
        }

		e.preventDefault();
		try {
            
			setIsSaving(true);
			const checkout = await saveEntityRecord(
				'surecart',
				'checkout',
				{
                    ...customerData,
					line_items: lineItems,
				},
				{ throwOnError: true }
			);

			if (!checkout?.id) {
				throw {
					message: __(
						'Could not create checkout. Please try again.',
						'surecart'
					),
				};
			}

            const order = await finalizeCheckout( {
                id: checkout.id,
                customer_id: customer?.id
            } );
			setId(order?.order);
		} catch (e) {
			console.error(e);
			setError(e?.message || __('Something went wrong.', 'surecart'));
			setIsSaving(false);
		}
	};
    
    
    return (
        <>
        <ScAlert open={error?.length} type="danger" closable scrollOnOpen>
            <span slot="title">{error}</span>
        </ScAlert>
        <UpdateModel
			onSubmit={onSubmit}
			title={
				<div
					css={css`
						display: flex;
						align-items: center;
						gap: 1em;
					`}
				>
					<ScButton
						circle
						size="small"
						href="admin.php?page=sc-orders"
					>
						<sc-icon name="arrow-left"></sc-icon>
					</ScButton>
					<sc-breadcrumbs>
						<sc-breadcrumb>
							<Logo display="block" />
						</sc-breadcrumb>
						<sc-breadcrumb href="admin.php?page=sc-orders">
							{__('Orders', 'surecart')}
						</sc-breadcrumb>
						<sc-breadcrumb>
							<sc-flex style={{ gap: '1em' }}>
								{__('Create Order', 'surecart')}
							</sc-flex>
						</sc-breadcrumb>
					</sc-breadcrumbs>
				</div>
			}
            button={
                <ScForm onScSubmit={onSubmit}>
                    <div
                        css={css`display: flex gap: var(--sc-spacing-small);`}
                    >
                        <ScButton type="primary" submit loading={isSaving} disabled={ ! canSaveNow } >
                            {__('Create', 'surecart')}
                        </ScButton>
                        <ScButton
                            href={'admin.php?page=sc-orders'}
                            type="text"
                        >
                            {__('Cancel', 'surecart')}
                        </ScButton>
                    </div>
                </ScForm>
            }
            sidebar={
                <>
                    <Box title={__('Customer', 'surecart')}>
                        <SelectCustomer/>
                    </Box>
                    { customer && customerShippingStatus && (
                        <>
                        
                        <Address
                            address={customer?.shipping_address}
                            label={__('Shipping & Tax Address', 'surecart')}
                        />
                        </>
                    )}
                    {
                        customer && ! customerShippingStatus && (
                            <Box title={__('Update Shipping & Tax Address', 'surecart')}>
                                <ScAddress
                                    required={true}
                                    onScInputAddress={(e) => {
                                        const finalCustomerData = {
                                            ...customer,
                                            shipping_address: {
                                                ...customer?.shipping_address,
                                                id: 'new_customer',
                                                ...e.detail
                                            }
                                        }
                                        setCustomerForCreateOrder(finalCustomerData);
                                        
                                    }}
                                />
                            </Box>
                        )
                    }
                </>
            }
		>
			<Box title={__('Create New Order', 'surecart')}></Box>
            <Prices/>
		</UpdateModel>
        </>
    );
};
