/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { RichText, useBlockProps } from '@wordpress/block-editor';

/**
 * Component Dependencies
 */
import { ScButton } from '@surecart/components-react';

import {
	__experimentalUseBorderProps as useBorderProps,
	__experimentalUseColorProps as useColorProps,
} from '@wordpress/block-editor';
import classNames from 'classnames';

export default ({ attributes, setAttributes, className }) => {
	const { type, text, full, size } = attributes;
	const { style: borderStyle } = useBorderProps(attributes);
	const colorProps = useColorProps(attributes);

	const blockProps = useBlockProps({
		type,
		full,
		size,
		className: classNames(className),
		style: {
			...(colorProps?.style?.backgroundColor
				? { '--primary-background': colorProps?.style.backgroundColor }
				: {}),
			...(colorProps?.style?.background
				? { '--primary-background': colorProps?.style.background }
				: {}),
			...(colorProps?.style?.color
				? { '--primary-color': colorProps?.style.color }
				: {}),
			...(borderStyle?.borderRadius
				? { '--button-border-radius': borderStyle.borderRadius }
				: {}),
		},
	});

	return (
		<div {...blockProps}>
			<ScButton
				type={type}
				full={full}
				size={size}
				className={classNames(className)}
				style={{
					...(colorProps?.style?.backgroundColor
						? {
								'--primary-background':
									colorProps?.style.backgroundColor,
						  }
						: {}),
					...(colorProps?.style?.background
						? {
								'--primary-background':
									colorProps?.style.background,
						  }
						: {}),
					...(colorProps?.style?.color
						? { '--primary-color': colorProps?.style.color }
						: {}),
					...(borderStyle?.borderRadius
						? { '--button-border-radius': borderStyle.borderRadius }
						: {}),
				}}
			>
				<RichText
					aria-label={__('Button text')}
					placeholder={__('Add text…')}
					value={text}
					onChange={(text) => setAttributes({ text })}
					withoutInteractiveFormatting
					allowedFormats={['core/bold', 'core/italic']}
				/>
			</ScButton>
		</div>
	);
};
