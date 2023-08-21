import { ScAlert, ScFormControl } from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
import Inspector from './components/Inspector';

export default ({ attributes, setAttributes, context }) => {
	const { label } = attributes;
	const { 'surecart/form/mode': mode } = context; // get mode context from parent.

	const processors = (scBlockData?.processors || [])
		.filter(
			(p) => p?.live_mode === (mode === 'live') // match mode.
		)
		.filter(
			(p) => p?.enabled // only enabled processors.
		)
		.filter((processor, _, filtered) =>
			filtered.some((p) => p.processor_type === 'mollie')
				? processor.processor_type === 'mollie'
				: true
		); // only allow mollie if preset.

	return (
		<>
			<Inspector
				attributes={attributes}
				setAttributes={setAttributes}
				context={context}
			/>

			<ScFormControl label={label}>
				{mode === 'test' && (
					<sc-tag slot="label-end" type="warning" size="small">
						{__('Test Mode', 'surecart')}
					</sc-tag>
				)}

				{processors.length === 0 ? (
					<ScAlert type="warning" open>
						{__(
							'No payment processors are enabled for this mode.',
							'surecart'
						)}
					</ScAlert>
				) : (
					<ScAlert type="info" open>
						{__(
							'Please preview your form on the front-end to view processors.',
							'surecart'
						)}
					</ScAlert>
				)}
			</ScFormControl>
		</>
	);
};
