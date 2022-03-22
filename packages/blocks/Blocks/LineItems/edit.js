/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import { InspectorControls } from '@wordpress/block-editor';
import {
	PanelBody,
	PanelRow,
	ToggleControl,
	Disabled,
} from '@wordpress/components';

export default ({ attributes, setAttributes }) => {
	const { removable, editable } = attributes;

	return (
		<Fragment>
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

			<Disabled>
				<sc-line-items
					removable={removable}
					editable={editable}
				></sc-line-items>
			</Disabled>
		</Fragment>
	);
};
