/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { Fragment, useEffect, useState } from '@wordpress/element';
import {
	PanelBody,
	PanelRow,
	TextControl,
	RadioControl,
} from '@wordpress/components';

/**
 * Component Dependencies
 */
import { ScPayment } from '@surecart/components-react';

export default ({ className, attributes, setAttributes, context }) => {
	const [activeProcessors, setActiveProcessors] = useState([]);
	const { label, secure_notice, default_processor } = attributes;
	const { 'surecart/form/mode': mode } = context; // get mode context from parent.

	const processorOptions = () => {
		return (
			(scBlockData?.processors || [])
				.map((processor) => {
					if (processor.processor_type === 'stripe') {
						return {
							label: __('Stripe', 'surecart'),
							value: 'stripe',
						};
					}
					if (processor.processor_type === 'paypal') {
						return {
							label: __('PayPal', 'surecart'),
							value: 'paypal',
						};
					}
					return {
						label: processor?.processor_type.toUpperCase(),
						value: processor?.processor_type,
					};
				})
				// remove duplicates.
				.filter(
					(v, i, a) => a.findIndex((v2) => v2.value === v.value) === i
				)
		);
	};

	useEffect(() => {
		setActiveProcessors(
			(scBlockData?.processors || [])
				// find only processors for this mode.
				.filter(
					(processor) => processor?.live_mode === (mode === 'live')
				)
				// turn them to test so they show up.
				.map((processor) => {
					return {
						...processor,
						live_mode: false,
					};
				})
		);
	}, [mode]);

	const options = processorOptions();

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody title={__('Attributes', 'surecart')}>
					<PanelRow>
						<TextControl
							label={__('Label', 'surecart')}
							value={label}
							onChange={(label) => setAttributes({ label })}
						/>
					</PanelRow>
					{options?.length > 1 && (
						<PanelRow>
							<RadioControl
								selected={default_processor || 'stripe'}
								label={__('Default Processor', 'surecart')}
								options={processorOptions()}
								onChange={(default_processor) =>
									setAttributes({ default_processor })
								}
							/>
						</PanelRow>
					)}
				</PanelBody>
			</InspectorControls>

			{!activeProcessors?.length ? (
				<sc-form-control label={label}>
					<sc-alert type="warning" open>
						<span slot="title">{__('Admin Notice')}</span>
						{sprintf(
							__(
								'There is no payment method for %1s payments. You will need to connect and verify your account with at least one processor in order to process %2s payments.',
								'surecart'
							),
							mode,
							mode
						)}
					</sc-alert>
				</sc-form-control>
			) : (
				<ScPayment
					className={className}
					label={label}
					debug={true}
					hideTestModeBadge={mode === 'live'}
					defaultProcessor={default_processor}
					secureNotice={secure_notice}
				></ScPayment>
			)}
		</Fragment>
	);
};
