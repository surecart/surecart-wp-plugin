/**
 * External dependencies.
 */
import {
	InnerBlocks,
	useBlockProps,
	InspectorControls,
} from '@wordpress/block-editor';
import { PanelBody, SelectControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export default ({ attributes, setAttributes }) => {
	const blockProps = useBlockProps({
		className: 'sc-cart-order-bump-pagination',
	});

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Settings', 'surecart')}>
					<SelectControl
						label={__('Arrow Style', 'surecart')}
						value={attributes.paginationArrow}
						options={[
							{ label: 'Chevron', value: 'chevron' },
							{ label: 'Arrow', value: 'arrow' },
						]}
						onChange={(paginationArrow) =>
							setAttributes({ paginationArrow })
						}
					/>
				</PanelBody>
			</InspectorControls>
			<nav {...blockProps}>
				<InnerBlocks />
			</nav>
		</>
	);
};
