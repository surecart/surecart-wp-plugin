/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	__experimentalUseBorderProps as useBorderProps,
	__experimentalGetBorderClassesAndStyles as getBorderClassesAndStyles,
} from '@wordpress/block-editor';
import { Fragment } from '@wordpress/element';

/**
 * Internal dependencies
 */
import ColorInspectorControl from '../../components/ColorInspectorControl';

export default ({
	context: {
		'surecart/productVariantPill/name': name,
		'surecart/productVariantPill/selected': selected,
	},
	__unstableLayoutClassNames,
	clientId,
	attributes,
	setAttributes,
}) => {
	const { highlight_background, highlight_text, highlight_border } =
		attributes;

	const blockProps = useBlockProps({
		className: classnames({
			'sc-pill-option__button': true,
			[__unstableLayoutClassNames]: true,
		}),
		...(selected
			? {
					style: {
						backgroundColor: highlight_background || '#000000',
						color: highlight_text || '#ffffff',
						borderTopColor: highlight_border || '#000000',
						borderBottomColor: highlight_border || '#000000',
						borderLeftColor: highlight_border || '#000000',
						borderRightColor: highlight_border || '#000000',
					},
			  }
			: {}),
	});

	return (
		<Fragment>
			{/* Additional color inspector control. */}
			<ColorInspectorControl
				settings={[
					{
						colorValue: highlight_text,
						label: __('Highlight Text', 'surecart'),
						onColorChange: (highlight_text) =>
							setAttributes({ highlight_text }),
						resetAllFilter: () =>
							setAttributes({ highlight_text: undefined }),
					},
					{
						colorValue: highlight_background,
						label: __('Highlight Background', 'surecart'),
						onColorChange: (highlight_background) =>
							setAttributes({ highlight_background }),
						resetAllFilter: () =>
							setAttributes({
								highlight_background: undefined,
							}),
					},
					{
						colorValue: highlight_border,
						label: __('Highlight Border', 'surecart'),
						onColorChange: (highlight_border) =>
							setAttributes({ highlight_border }),
						resetAllFilter: () =>
							setAttributes({
								highlight_border: undefined,
							}),
					},
				]}
				panelId={clientId}
			/>
			<button
				{...blockProps}
				className={
					selected
						? blockProps.className.replace(
								/has-[\w-]*-color|has-[\w-]*-background/g,
								''
						  )
						: blockProps.className
				}
			>
				{name}
			</button>
		</Fragment>
	);
};
