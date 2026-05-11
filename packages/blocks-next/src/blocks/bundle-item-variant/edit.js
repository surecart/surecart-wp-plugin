/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';

/**
 * Internal dependencies
 */
import ColorInspectorControl from '../../components/ColorInspectorControl';

const PREVIEW_VALUES = [
	__('Small', 'surecart'),
	__('Medium', 'surecart'),
	__('Large', 'surecart'),
];

const HIGHLIGHT_FIELDS = [
	{ attribute: 'highlight_text', label: __('Highlight Text', 'surecart') },
	{
		attribute: 'highlight_background',
		label: __('Highlight Background', 'surecart'),
	},
	{
		attribute: 'highlight_border',
		label: __('Highlight Border', 'surecart'),
	},
];

export default ({
	context: { 'surecart/bundleItem': bundleItem },
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
		className: 'sc-pill-option__wrapper',
		style: {
			'--sc-pill-option-active-background-color': activeBackground,
			'--sc-pill-option-active-text-color': activeText,
			'--sc-pill-option-active-border-color': activeBorder,
			border: 0,
			padding: 0,
		},
	});

	const component = bundleItem?.component_product || bundleItem?.product;
	const realOptions = component?.variant_options?.data;

	if (realOptions && realOptions.length === 0) {
		return null;
	}

	const values = realOptions?.[0]?.values?.length
		? realOptions[0].values
		: PREVIEW_VALUES;

	const colorSettings = HIGHLIGHT_FIELDS.map(({ attribute, label }) => ({
		label,
		colorValue: attributes[attribute],
		onColorChange: (value) => setAttributes({ [attribute]: value }),
		resetAllFilter: () => setAttributes({ [attribute]: undefined }),
	}));

	return (
		<Fragment>
			<ColorInspectorControl
				settings={colorSettings}
				panelId={clientId}
			/>

			<div {...blockProps} role="radiogroup">
				{values.map((value, index) => {
					const selected = index === 0;
					return (
						<div
							key={value}
							className={classnames('sc-pill-option__button', {
								'sc-pill-option__button--selected': selected,
							})}
							style={
								selected
									? {
											backgroundColor: activeBackground,
											color: activeText,
											borderColor: activeBorder,
									  }
									: undefined
							}
						>
							{value}
						</div>
					);
				})}
			</div>
		</Fragment>
	);
};
