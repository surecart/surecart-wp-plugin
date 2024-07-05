/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { PanelBody, TextControl } from '@wordpress/components';
import {
	RichText,
	InspectorControls,
	useBlockProps,
} from '@wordpress/block-editor';

/**
 * Internal dependencies.
 */
import useCartStyles from '../../../../blocks/hooks/useCartStyles';
import ScIcon from '../../components/ScIcon';
import CartInspectorControls from '../../components/CartInspectorControls';

export default ({ attributes, setAttributes }) => {
	const { text } = attributes;

	const blockProps = useBlockProps({
		style: useCartStyles({ attributes }),
	});

	return (
		<>
			<InspectorControls>
				<CartInspectorControls
					attributes={attributes}
					setAttributes={setAttributes}
				/>

				<PanelBody>
					<TextControl
						label={__('Header Text')}
						value={text}
						onChange={(text) => setAttributes({ text })}
					/>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<ScIcon
					name="arrow-right"
					class="wp-block-surecart-slide-out-cart-header__close"
				/>
				<RichText
					aria-label={__('Header Text')}
					placeholder={__('Add a title…')}
					value={text}
					onChange={(text) => setAttributes({ text })}
					withoutInteractiveFormatting
					allowedFormats={['core/bold', 'core/italic']}
				/>
				<div class="sc-tag sc-tag--default">0</div>
			</div>
		</>
	);
};
