/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, PanelRow, ToggleControl } from '@wordpress/components';

/**
 * Internal dependencies.
 */
import TemplateListEdit from '../../components/TemplateListEdit';
import TEMPLATE from './template';

export default ({
	attributes,
	setAttributes,
	__unstableLayoutClassNames,
	clientId,
}) => {
	const { removable, editable } = attributes;

	const placeholderImageUrl =
		scBlockData?.plugin_url + '/images/placeholder-thumbnail.jpg';

	const blockProps = useBlockProps();

	const lineItems = [
		{
			id: 1,
			quantity: 2,
			removable,
			editable,
			price: {
				name: 'Basic',
				product: {
					name: 'Example Product',
					image_url: placeholderImageUrl,
				},
				display_amount: scData?.currency_symbol + '12.34',
			},
		},
		{
			id: 2,
			quantity: 4,
			removable,
			editable,
			price: {
				name: 'Monthly',
				product: {
					name: 'Example Product',
					image_url: placeholderImageUrl,
				},
				display_amount: scData?.currency_symbol + '123.45',
			},
		},
	];

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Attributes', 'surecart')}>
					<PanelRow>
						<ToggleControl
							label={__('Removable', 'surecart')}
							help={__(
								'Allow line items to be removed.',
								'surecart'
							)}
							checked={removable}
							onChange={(removable) =>
								setAttributes({ removable })
							}
						/>
					</PanelRow>
					<PanelRow>
						<ToggleControl
							label={__('Editable', 'surecart')}
							help={__(
								'Allow line item quantities to be editable.',
								'surecart'
							)}
							checked={editable}
							onChange={(editable) => setAttributes({ editable })}
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>

			<TemplateListEdit
				template={TEMPLATE}
				blockContexts={lineItems}
				clientId={clientId}
				blockProps={blockProps}
				className={__unstableLayoutClassNames}
			/>
		</>
	);
};
