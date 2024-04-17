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
	InspectorControls,
} from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import HeadingLevelDropdown from '../../components/HeadingLebelDropdown';
import { PanelBody, TextControl, ToggleControl } from '@wordpress/components';

export default ({
	attributes: { level, textAlign, isLink, rel, linkTarget },
	setAttributes,
}) => {
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
					onChange={(level) => setAttributes({ level })}
				/>
				<AlignmentControl
					value={textAlign}
					onChange={(nextAlign) => {
						setAttributes({ textAlign: nextAlign });
					}}
				/>
			</BlockControls>

			<InspectorControls>
				<PanelBody title={__('Settings', 'surecart')}>
					<ToggleControl
						__nextHasNoMarginBottom
						label={__('Make title a link')}
						onChange={(isLink) => setAttributes({ isLink })}
						checked={isLink}
					/>

					{isLink && (
						<>
							<ToggleControl
								__nextHasNoMarginBottom
								label={__('Open in new tab')}
								onChange={(value) =>
									setAttributes({
										linkTarget: value ? '_blank' : '_self',
									})
								}
								checked={linkTarget === '_blank'}
							/>
							<TextControl
								__nextHasNoMarginBottom
								label={__('Link rel')}
								value={rel}
								onChange={(rel) => setAttributes({ rel })}
							/>
						</>
					)}
				</PanelBody>
			</InspectorControls>

			<TagName {...blockProps}>{__('Product Title', 'surecart')}</TagName>
		</>
	);
};
