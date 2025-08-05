/**
 * WordPress dependencies
 */
import {
	useBlockProps,
	useInnerBlocksProps,
	InspectorControls,
} from '@wordpress/block-editor';
import {
	AlignmentMatrixControl,
	PanelBody,
	PanelRow,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export default ({ attributes, setAttributes }) => {
	const { alignment } = attributes;
	const blockProps = useBlockProps({
		className: `position-${alignment.replace(' ', '-')}`,
	});
	const innerBlocksProps = useInnerBlocksProps(blockProps);

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Alignment', 'surecart')}>
					<PanelRow>
						<AlignmentMatrixControl
							value={alignment}
							onChange={(alignment) => {
								setAttributes({ alignment });
							}}
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>
			<div {...innerBlocksProps}></div>;
		</>
	);
};
