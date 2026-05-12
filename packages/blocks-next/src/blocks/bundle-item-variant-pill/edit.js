/**
 * External dependencies.
 */
import classnames from 'classnames';

/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import { Fragment } from '@wordpress/element';

/**
 * Internal dependencies.
 */
import ColorInspectorControl from '../../components/ColorInspectorControl';

export default ({
	context: {
		'surecart/bundleItemVariantPill/value': value,
		'surecart/bundleItemVariantPill/name': name,
		'surecart/bundleItemVariantPill/selected': selected,
	},
	__unstableLayoutClassNames,
	clientId,
	attributes,
	setAttributes,
}) => {
	const { highlight_background, highlight_text, highlight_border } =
		attributes;

	const activeBackground = highlight_background || '#000000';
	const activeText = highlight_text || '#ffffff';
	const activeBorder = highlight_border || '#000000';

	const blockProps = useBlockProps({
		className: classnames({
			'sc-pill-option__button': true,
			[__unstableLayoutClassNames]: !!__unstableLayoutClassNames,
		}),
		...(selected
			? {
					style: {
						backgroundColor: activeBackground,
						color: activeText,
						borderColor: activeBorder,
					},
			  }
			: {}),
	});

	const colorSettings = [
		{
			attribute: 'highlight_text',
			label: __('Highlight Text', 'surecart'),
		},
		{
			attribute: 'highlight_background',
			label: __('Highlight Background', 'surecart'),
		},
		{
			attribute: 'highlight_border',
			label: __('Highlight Border', 'surecart'),
		},
	].map(({ attribute, label }) => ({
		label,
		colorValue: attributes[attribute],
		onColorChange: (color) => setAttributes({ [attribute]: color }),
		resetAllFilter: () => setAttributes({ [attribute]: undefined }),
	}));

	return (
		<Fragment>
			<ColorInspectorControl
				settings={colorSettings}
				panelId={clientId}
			/>
			<div {...blockProps}>
				{value || name || __('Option', 'surecart')}
			</div>
		</Fragment>
	);
};
