import { ScAlert, ScCard, ScPayment } from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
import Inspector from './components/Inspector';

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
				<ScAlert open type="info" slot="stripe">
					{__(
						'Please preview the form on the front-end to load the Stripe payment fields.',
						'surecart'
					)}
				</ScAlert>
			</ScPayment>
		</>
	);
};
