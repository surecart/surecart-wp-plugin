import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	useBlockProps,
	__experimentalUseColorProps as useColorProps,
} from '@wordpress/block-editor';
import {
	PanelBody,
	PanelRow,
	SelectControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import { Fragment } from '@wordpress/element';

/**
 * Component Dependencies
 */
import {
	ScFlex,
	ScProductCollectionBadge,
	ScTag,
} from '@surecart/components-react';

export default ({ attributes, setAttributes }) => {
	const { size, type, pill, collectionCount } = attributes;
	const blockProps = useBlockProps({});
	const colorProps = useColorProps(attributes);
	const style = {
		'--sc-tag-primary-color': colorProps.style.backgroundColor,
		'--sc-tag-primary-background-color': colorProps.style.color,
	};

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody title={__('Attributes', 'surecart')}>
					<PanelRow>
						<SelectControl
							label={__('Size', 'surecart')}
							value={size}
							onChange={(size) => setAttributes({ size })}
						>
							<option value="small">Small</option>
							<option value="medium">Medium</option>
							<option value="large">Large</option>
						</SelectControl>
					</PanelRow>

					<PanelRow>
						<SelectControl
							type={type}
							label={__('Type', 'surecart')}
							onChange={(type) => setAttributes({ type })}
						>
							<option value="primary">Primary</option>
							<option value="success">Success</option>
							<option value="info">Info</option>
						</SelectControl>
					</PanelRow>

					<PanelRow>
						<ToggleControl
							label={__('Pill', 'surecart')}
							checked={pill}
							onChange={(pill) => setAttributes({ pill })}
						/>
					</PanelRow>
					<PanelRow>
						<TextControl
							label={__('Label', 'surecart')}
							value={collectionCount}
							onChange={(collectionCount) =>
								setAttributes({ collectionCount })
							}
							type="number"
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<ScFlex gap="1em" justifyContent="flex-start">
					<ScTag pill={pill} size={size} style={style}>
						Male
					</ScTag>
					<ScTag pill={pill} size={size} style={style}>
						Female
					</ScTag>
					<ScTag pill={pill} size={size} style={style}>
						Unisex
					</ScTag>
				</ScFlex>
			</div>
		</Fragment>
	);
};
