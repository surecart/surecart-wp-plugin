import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { ToggleControl } from '@wordpress/components';
import { PanelBody } from '@wordpress/components';

export default ({
	attributes: { isLink },
	setAttributes,
	context: { 'surecart/productCollectionTag/name': name },
	__unstableLayoutClassNames,
}) => {
	const blockProps = useBlockProps({
		className: `sc-tag sc-tag--default sc-tag--medium ${__unstableLayoutClassNames}`,
		role: 'button',
	});
	return (
		<>
			<InspectorControls>
				<PanelBody>
					<ToggleControl
						__nextHasNoMarginBottom
						label={__('Link to collection page', 'surecart')}
						onChange={() => setAttributes({ isLink: !isLink })}
						checked={isLink}
					/>
				</PanelBody>
			</InspectorControls>
			<span {...blockProps}>{name}</span>
		</>
	);
};
