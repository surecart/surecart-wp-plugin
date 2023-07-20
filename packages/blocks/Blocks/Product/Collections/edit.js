import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
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
import { ScFlex, ScProductCollectionBadge } from '@surecart/components-react';

export default ({ attributes, setAttributes }) => {
	const { size, type, pill, collectionCount } = attributes;

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

			<ScFlex gap="1em" justifyContent="flex-start">
				<ScProductCollectionBadge
					name="Male"
					pill={pill}
					size={size}
					type={type}
				/>
				<ScProductCollectionBadge
					name="Female"
					pill={pill}
					size={size}
					type={type}
				/>
				<ScProductCollectionBadge
					name="Unisex"
					pill={pill}
					size={size}
					type={type}
				/>
			</ScFlex>
		</Fragment>
	);
};
