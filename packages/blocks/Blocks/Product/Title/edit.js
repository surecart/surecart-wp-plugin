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
import { ScProductText } from '@surecart/components-react';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import HeadingLevelDropdown from './heading-level-dropdown';

export default ({ attributes: { level, textAlign }, setAttributes }) => {
	const TagName = 0 === level ? 'p' : 'h' + level;

	const blockProps = useBlockProps({
		className: classnames({
			[`has-text-align-${textAlign}`]: textAlign,
		}),
	});

	return (
		<>
			<BlockControls group="block">
				<HeadingLevelDropdown
					selectedLevel={level}
					onChange={(newLevel) => setAttributes({ level: newLevel })}
				/>
				<AlignmentControl
					value={textAlign}
					onChange={(nextAlign) => {
						setAttributes({ textAlign: nextAlign });
					}}
				/>
			</BlockControls>

			<TagName {...blockProps}>
				<ScProductText text="name">
					{__('Basic Tee 6-Pack', 'surecart')}
				</ScProductText>
			</TagName>
		</>
	);
};
