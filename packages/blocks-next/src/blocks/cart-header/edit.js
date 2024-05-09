/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

import {
	RichText,
	InspectorControls,
	useBlockProps,
} from '@wordpress/block-editor';

/**
 * Component Dependencies
 */
// import CartInspectorControls from '../../../../blocks/components/CartInspectorControls';
import useCartStyles from '../../../../blocks/hooks/useCartStyles';

export default ({ attributes, setAttributes }) => {
	const { text } = attributes;

	const blockProps = useBlockProps({
		style: useCartStyles({ attributes }),
	});

	return (
		<>
			<InspectorControls>
				{/* <CartInspectorControls
					attributes={attributes}
					setAttributes={setAttributes}
				/> */}
			</InspectorControls>

			<div {...blockProps}>
				<RichText
					aria-label={__('Header Text')}
					placeholder={__('Add a title…')}
					value={text}
					onChange={(text) => setAttributes({ text })}
					withoutInteractiveFormatting
					allowedFormats={['core/bold', 'core/italic']}
				/>
			</div>
		</>
	);
};
