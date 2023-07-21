import {
	ScButton,
	ScDialog,
	ScPaymentMethod,
	ScRadioGroup,
	ScRadio,
	ScBlockUi,
} from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import DataTable from '../../components/DataTable';

export default ({
	checkout,
	setPaymentID,
	paymentID,
	paymentMethod,
	setPaymentMethod,
}) => {
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
		if (paymentID) {
			setPaymentMethod(
				paymentMethods?.find((item) => item?.id === paymentID)
			);
		}
	}, [paymentID]);

	useEffect(() => {
		if (!paymentMethods?.length) {
			setPaymentID(false);
		}
	}, [paymentMethods, checkout?.customer_id]);

	const onPaymentSelected = () => {
		setBusy(false);
		setOpen(false);
	};

	return (
		<>
			<ScButton type="primary" onClick={() => setOpen(true)}>
				{__('Add Payment Method', 'surecart')}
			</ScButton>
			<ScDialog
				label={__('Choose a payment method', 'surecart')}
				open={open}
				style={{
					'--dialog-body-overflow': 'visible',
					'--width': '36rem',
				}}
				onScRequestClose={() => setOpen(false)}
			>
				<DataTable
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
				{!!paymentMethods?.length && (
					<ScButton
						type="primary"
						onClick={() => onPaymentSelected()}
						style={{
							marginTop: 'var(--body-spacing)',
							float: 'right',
						}}
					>
						<span>{__('Add Method', 'surecart')}</span>
					</ScButton>
				)}
				{!!busy && <ScBlockUi spinner />}
			</ScDialog>
		</>
	);
};
