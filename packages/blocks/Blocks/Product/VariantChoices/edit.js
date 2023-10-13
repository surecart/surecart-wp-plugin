import {
	useBlockProps,
	__experimentalUseBorderProps as useBorderProps,
	__experimentalUseColorProps as useColorProps,
	__experimentalGetSpacingClassesAndStyles as useSpacingProps,
	getTypographyClassesAndStyles as useTypographyProps,
} from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { ScFormControl, ScPillOption } from '@surecart/components-react';

import classNames from 'classnames';

export default ({ attributes }) => {
	const blockProps = useBlockProps();
	const colorProps = useColorProps(attributes);
	const spacingProps = useSpacingProps(attributes);
	const borderProps = useBorderProps(attributes);
	const typographyProps = useTypographyProps(attributes);

	const fontStyles = {
		fontFamily: blockProps?.style?.fontFamily,
		fontWeight: blockProps?.style?.fontWeight,
		fontStyle: blockProps?.style?.fontStyle,
	};

	const styleAttributes = {
		className: classNames(
			spacingProps.className,
			borderProps.className,
			typographyProps.className
		),
		style: {
			...fontStyles,
			'--sc-pill-option-text-color': colorProps?.style?.color,
			'--sc-pill-option-background-color':
				colorProps?.style?.backgroundColor,
			'--sc-pill-option-border-color': borderProps?.style?.borderColor,
			'--sc-pill-option-border-width': borderProps?.style?.borderWidth,
			'--sc-pill-option-border-style': borderProps?.style?.borderStyle,
			'--sc-pill-option-border-radius': borderProps?.style?.borderRadius,
			'--sc-pill-option-padding-left': spacingProps?.style?.paddingLeft,
			'--sc-pill-option-padding-right': spacingProps?.style?.paddingRight,
			'--sc-pill-option-padding-top': spacingProps?.style?.paddingTop,
			'--sc-pill-option-padding-bottom':
				spacingProps?.style?.paddingBottom,
			...typographyProps.style,
			borderStyle: 'none',
			display: 'flex',
			flexWrap: 'wrap',
			gap: 'var(--sc-spacing-x-small)',
		},
	};

	return (
		<div {...blockProps}>
			<ScFormControl label={__('Color', 'surecart')}>
				<div {...styleAttributes}>
					<ScPillOption isSelected>
						{__('Green', 'surecart')}
					</ScPillOption>
					<ScPillOption>{__('White', 'surecart')}</ScPillOption>
					<ScPillOption>{__('Black', 'surecart')}</ScPillOption>
				</div>
			</ScFormControl>
		</div>
	);
};
