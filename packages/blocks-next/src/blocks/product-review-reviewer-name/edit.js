/**
 * WordPress dependencies.
 */
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, SelectControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export default ({ attributes, setAttributes, context }) => {
	const blockProps = useBlockProps();
	const { review } = context;
	const { format } = attributes;

	// Get name based on format
	const getFormattedName = () => {
		if (!review?.customer) {
			return __('Reviewer Name', 'surecart');
		}

		const customer = review?.customer;

		switch (format) {
			case 'first_name':
				return customer?.first_name || customer?.name || '';
			case 'last_name':
				return customer?.last_name || customer?.name || '';
			case 'first_last':
				const firstName = customer?.first_name || '';
				const lastName = customer?.last_name || '';
				if (firstName && lastName) {
					return `${firstName} ${lastName}`;
				}
				return customer?.name || '';
			case 'display_name':
			default:
				return customer?.name || '';
		}
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Settings', 'surecart')}>
					<SelectControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						label={__('Name Format', 'surecart')}
						value={format}
						options={[
							{
								label: __('Display Name', 'surecart'),
								value: 'display_name',
							},
							{
								label: __('First Name', 'surecart'),
								value: 'first_name',
							},
							{
								label: __('Last Name', 'surecart'),
								value: 'last_name',
							},
							{
								label: __('First Name Last Name', 'surecart'),
								value: 'first_last',
							},
						]}
						onChange={(nextFormat) =>
							setAttributes({ format: nextFormat })
						}
					/>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>{getFormattedName()}</div>
		</>
	);
};
