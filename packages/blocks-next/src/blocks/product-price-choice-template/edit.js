/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	__experimentalUseInnerBlocksProps,
	useInnerBlocksProps as __stableUseInnerBlocksProps,
} from '@wordpress/block-editor';
import ColorInspectorControl from '../../components/ColorInspectorControl';

const TEMPLATE = [
	[
		[
			'core/paragraph',
			{
				content: __('Price Name', 'surecart'),
			},
		],
		[
			'core/paragraph',
			{
				content: __('$10', 'surecart'),
			},
		],
	],
];

export default ({
	__unstableLayoutClassNames,
	attributes,
	setAttributes,
	clientId,
	context,
}) => {
	const { highlight_border } = attributes;
	const isChecked = context['surecart/price']?.checked || false;
	const blockProps = useBlockProps({
		className: `sc-choice ${__unstableLayoutClassNames} ${
			isChecked ? 'sc-choice--selected' : ''
		}`,
		style: {
			borderColor: isChecked ? highlight_border : undefined,
			boxShadow: isChecked ? `0 0 0 1px ${highlight_border}` : undefined,
		},
	});

	const useInnerBlocksProps = __stableUseInnerBlocksProps
		? __stableUseInnerBlocksProps
		: __experimentalUseInnerBlocksProps;

	const innerBlocksProps = useInnerBlocksProps({
		style: {
			width: '100%',
		},
	});

	return (
		<>
			<ColorInspectorControl
				settings={[
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
			<div {...blockProps}>
				<div {...innerBlocksProps}></div>
			</div>
		</>
	);
};
