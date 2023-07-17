import {
	ScButton,
	ScDialog,
    ScPaymentMethod,
    ScRadioGroup,
    ScRadio,
    ScBlockUi,
    ScFormatNumber
} from '@surecart/components-react';
import { __, sprintf } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import { store as noticesStore } from '@wordpress/notices';
import { store as coreStore } from '@wordpress/core-data';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import { useDispatch, select, useSelect } from '@wordpress/data';
import expand from '../query';
import DataTable from '../../components/DataTable';

export default ({ checkout, setPaymentID, paymentID, paymentMethod, setPaymentMethod }) => {
	const [open, setOpen] = useState(false);
	const [busy, setBusy] = useState(false);

    const { paymentMethods, loading } = useSelect(
        (select) => {
            const queryArgs = [
                'surecart',
                'payment_method',
                {
                    expand: [
                        'card',
                        'customer',
                        'billing_agreement',
                        'paypal_account',
                        'payment_instrument',
                        'bank_account',
                    ],
                    customer_ids: [checkout?.customer_id],
                },
            ];
            return {
                paymentMethods: select(coreStore).getEntityRecords(
                    ...queryArgs
                ),
                loading: select(coreStore).isResolving(
                    'getEntityRecords',
                    queryArgs
                ),
                loadError: select(coreStore)?.getResolutionError?.(
                    'getEntityRecords',
                    ...queryArgs
                ),
            };
        },
        [checkout?.customer_id]
    );
    
    useEffect(() => {
		setPaymentMethod(paymentMethods?.find((item) => item?.id === paymentID));
	}, [paymentID]);

    useEffect(() => {
		if (paymentMethods?.length) {
			setPaymentID(paymentMethods[0]?.id);
		} else {
            setPaymentID(false);
        }
	}, [paymentMethods, checkout?.customer_id]);

    const onPaymentSelected = () => {
        setBusy(false);
        setOpen(false);
    }

	return (
		<>
			<ScButton type="primary" onClick={() => setOpen(true)}>
				{__('Collect Payment', 'surecart')}
			</ScButton>
			<ScDialog
				noHeader
				open={open}
				style={{ 
                    '--dialog-body-overflow': 'visible',
                    '--width': '36rem'
                }}
				onScRequestClose={() => setOpen(false)}
			>
                <DataTable
                    title={__('Choose a payment method', 'surecart')}
                    empty={__('None found.', 'surecart')}
                    loading={loading}
                    columns={{
                        action: {
                            width: '50px',
                        },
                        method: {
                            label: __('Method', 'surecart'),
                            width: '300px',
                        },
                        exp: {
                            width: '100px',
                        },
                    }}
                    items={paymentMethods?.map((item) => {
                        return {
                            action: (
                                <ScRadioGroup
                                    onScChange={(e) => {
                                       setPaymentID(e.target.value);
                                    }}
                                >
                                    <ScRadio
                                        checked={paymentID === item?.id}
                                        key={item?.id}
                                        value={item?.id}
                                    />
                                </ScRadioGroup>
                            ),
                            method: <ScPaymentMethod paymentMethod={item} />,
                            exp: (
                                <div>
                                    {!!item?.card?.exp_month && (
                                        <span>
                                            {__('Exp.', 'surecart')}
                                            {item?.card?.exp_month}/
                                            {item?.card?.exp_year}
                                        </span>
                                    )}
                                    {!!item?.paypal_account?.email &&
                                        item?.paypal_account?.email}
                                </div>
                            ),
                            
                        };
                    })}
                />
                {
                    !!paymentMethods?.length && (
                        <ScButton 
                            type="primary" 
                            onClick={() => onPaymentSelected()}
                            style={{
                                marginTop: 'var(--body-spacing)',
                                float: 'right',
                            }}
                        >
                            <span>{__('Add Payment Method', 'surecart')}</span>
                        </ScButton>
                    )
                }
                {!!busy && <ScBlockUi spinner />}
			</ScDialog>
		</>
	);
};
