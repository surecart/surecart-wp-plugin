/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	useInnerBlocksProps,
	__experimentalUseInnerBlocksProps,
} from '@wordpress/block-editor';
import { Fragment } from '@wordpress/element';
import {
	PanelBody,
	PanelRow,
	TextControl,
	ToggleControl,
} from '@wordpress/components';

/**
 * Component Dependencies
 */
import { ScRadioGroup } from '@surecart/components-react';
import { useBlockProps } from '@wordpress/block-editor';

export default ({ attributes, setAttributes }) => {
	const { label, required } = attributes;

	const blockProps = useBlockProps();

	const innerBlocksProps = useInnerBlocksProps(blockProps, {
		className: 'sc-radio',
		allowedBlocks: ['surecart/radio'],
	});

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody title={__('Attributes', 'surecart')}>
					<PanelRow>
						<TextControl
							label={__('Label Name', 'surecart')}
							value={label}
							onChange={(label) => setAttributes({ label })}
						/>
					</PanelRow>
					<PanelRow>
						<ToggleControl
							label={__('Required', 'surecart')}
							checked={required}
							onChange={(required) => setAttributes({ required })}
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>

			<ScRadioGroup
				label={label}
				required={required}
				{...innerBlocksProps}
			></ScRadioGroup>
		</Fragment>
	);
};
