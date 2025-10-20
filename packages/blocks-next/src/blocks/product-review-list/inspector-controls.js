/**
 * WordPress dependencies
 */
import { InspectorControls } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { PanelBody } from '@wordpress/components';
import { RangeControl } from '@wordpress/components';
import { useViewportMatch } from '@wordpress/compose';

/**
 * Product List Inspector Controls
 */
export default function ProductReviewListInspectorControls({
	onUpdateQuery,
	setAttributes,
	attributes: {
		type,
		query,
		query: { perPage, offset, taxQuery, order, orderBy },
	},
}) {
	const isMobile = useViewportMatch('medium', '<');
	return (
		<InspectorControls>
			<PanelBody title={__('Attributes', 'surecart')}>
				<RangeControl
					label={__('Products Review Per Page', 'surecart')}
					value={perPage}
					onChange={(perPage) => onUpdateQuery({ perPage })}
					step={1}
					min={1}
					max={40}
				/>

				<RangeControl
					label={__('Offset', 'surecart')}
					value={offset}
					onChange={(offset) => onUpdateQuery({ offset })}
					step={1}
					min={0}
					max={100}
				/>
			</PanelBody>
		</InspectorControls>
	);
}
