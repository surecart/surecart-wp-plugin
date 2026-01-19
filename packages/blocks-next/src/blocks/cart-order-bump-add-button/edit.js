/**
 * External dependencies.
 */
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';

/**
 * Internal dependencies.
 */
import ScIcon from '../../components/ScIcon';
import Label from './label';

export default ({ attributes, setAttributes }) => {
	const blockProps = useBlockProps({
		className: 'sc-cart-order-bump-add-button',
	});

	return (
		<>
			<InspectorControls>
				<Label attributes={attributes} setAttributes={setAttributes} />
			</InspectorControls>

			<div {...blockProps} role="button" tabindex="0">
				<ScIcon name="plus" />
			</div>
		</>
	);
};
