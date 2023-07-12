import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import {
	PanelBody,
	PanelRow,
	SelectControl,
	ToggleControl,
} from '@wordpress/components';
import { Fragment } from '@wordpress/element';

/**
 * Component Dependencies
 */
import { ScProductCollectionBadge } from '@surecart/components-react';

export default ({ attributes, setAttributes }) => {
	const { size, type, pill } = attributes;

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
							<option value="success">Secondary</option>
							<option value="info">Danger</option>
						</SelectControl>
					</PanelRow>

					<PanelRow>
						<ToggleControl
							label={__('Pill', 'surecart')}
							checked={pill}
							onChange={(pill) => setAttributes({ pill })}
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>

			<div>
				<h1>Rashon</h1>
				{/* <ScProductCollectionBadge name="Rashon" />
				<ScProductCollectionBadge name="Rashon" />
				<ScProductCollectionBadge name="Rashon" /> */}
			</div>
		</Fragment>
	);
};
