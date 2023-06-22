/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { useDispatch, useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { ScAlert, ScButton, ScForm, ScInput } from '@surecart/components-react';
import Box from '../ui/Box';
import Prices from './modules/Prices';
import UpdateModel from '../templates/UpdateModel';
import Logo from '../templates/Logo';
import { useState } from '@wordpress/element';
// import { finalizeCheckout } from '../../components/src/services/session/index';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
// import { state as checkoutState } from '@store/checkout';
import { store as uiStore } from '../store/ui';

export default ({ id, setId }) => {
	const [isSaving, setIsSaving] = useState(false);
	const [canSaveNow, setCanSaveNow] = useState(true);
	const [error, setError] = useState('');

	const prices = useSelect((select) => select(uiStore).getPricesForCreateOrder());

	const { saveEntityRecord } = useDispatch(coreStore);
    
    const finalizeCheckout = async ({id}) => {
        return await apiFetch({
          method: 'PATCH',
          path: addQueryArgs(
            `surecart/v1/checkouts/${id}/finalize`,
            {manual_payment: true}
          )
        });
    };

	// create the order.
	const onSubmit = async (e) => {
        const lineItems = prices?.pricesForCreateOrder?.map((price) => {
            const {
                id,
                ad_hoc_min_amount
            } = price;

            return {
                price: id,
                ad_hoc_amount: ad_hoc_min_amount,
            }
            
        });
		e.preventDefault();
		try {
            
			setIsSaving(true);
			const checkout = await saveEntityRecord(
				'surecart',
				'checkout',
				{
					line_items: lineItems,
				},
				{ throwOnError: true }
			);

			if (!checkout?.id) {
				throw {
					message: __(
						'Could not create checkout. Please try again.',
						'sureacrt'
					),
				};
			}

            const session = await finalizeCheckout({id: checkout.id});

            console.log(session);
			// setId(order.id);
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
		>
			<Box title={__('Create New Order', 'surecart')}></Box>
            <Prices/>
            
            {
                canSaveNow && (
                    <ScForm onScSubmit={onSubmit}>
                        <div
                            css={css`
                                display: grid;
                                text-align: center;
                                background: #ffffff;
                                padding: 24px 32px;
                                gap: var(--sc-spacing-large);
                            `}
                        >
                            <div
                                css={css`display: flex gap: var(--sc-spacing-small);`}
                            >
                                <ScButton type="primary" submit loading={isSaving}>
                                    {__('Create', 'surecart')}
                                </ScButton>
                                <ScButton
                                    href={'admin.php?page=sc-orders'}
                                    type="text"
                                >
                                    {__('Cancel', 'surecart')}
                                </ScButton>
                            </div>
                        </div>
                    </ScForm>
                )
            }
		</UpdateModel>
        </>
    );
};
