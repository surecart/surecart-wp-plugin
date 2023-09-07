/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import {
	AlignmentControl,
	BlockControls,
	useBlockProps,
} from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

export default ({
	attributes: { textAlign },
	setAttributes,
	__unstableLayoutClassNames: layoutClassNames,
}) => {
	const blockProps = useBlockProps({
		className: classnames({
			[`${layoutClassNames}`]: true,
			[`has-text-align-${textAlign}`]: textAlign,
		}),
	});

	return (
		<>
			<BlockControls group="block">
				<AlignmentControl
					value={textAlign}
					onChange={(nextAlign) => {
						setAttributes({ textAlign: nextAlign });
					}}
				/>
			</BlockControls>

			<div {...blockProps}>
				<p>
					{__(
						'Explore our curated selection of premium, eco-friendly kitchenware designed to elevate your cooking experience.',
						'surecart'
					)}
				</p>
			</div>
		</>
	);
};
