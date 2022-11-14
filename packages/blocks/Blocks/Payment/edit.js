import { ScPayment } from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
import Inspector from './components/Inspector';
import ManualPaymentMethods from './components/ManualPaymentMethods';
import PayPal from './components/PayPal';
import Stripe from './components/Stripe';

export default ({ attributes, setAttributes, context }) => {
	const { label } = attributes;
	const { 'surecart/form/mode': mode } = context; // get mode context from parent.

	return (
		<>
			<Inspector attributes={attributes} setAttributes={setAttributes} />

			<ScPayment
				label={label}
				mode={mode}
				hideTestModeBadge={mode === 'live'}
			>
				<Stripe attributes={attributes} mode={mode} />
				<PayPal attributes={attributes} mode={mode} />
				<ManualPaymentMethods attributes={attributes} />
			</ScPayment>
		</>
	);
};
