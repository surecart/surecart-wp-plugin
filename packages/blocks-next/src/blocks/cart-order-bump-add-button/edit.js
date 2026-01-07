/**
 * External dependencies.
 */
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import ScIcon from '../../components/ScIcon';

export default ({ attributes, setAttributes }) => {
	const blockProps = useBlockProps({
		className: 'sc-cart-order-bump-add-button',
	});

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Settings', 'surecart')}>
					<TextControl
						label={__('Added Label', 'surecart')}
						value={attributes.addedLabel}
						onChange={(addedLabel) => setAttributes({ addedLabel })}
					/>
				</PanelBody>
			</InspectorControls>
			<button {...blockProps} type="button">
				<ScIcon name="plus" />
			</button>
		</>
	);
};
