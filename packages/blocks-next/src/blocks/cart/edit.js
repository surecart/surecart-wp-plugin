/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	useBlockProps,
	InnerBlocks,
	useInnerBlocksProps,
	__experimentalUnitControl as UnitControl,
	useSettings,
} from '@wordpress/block-editor';
import {
	__experimentalUseCustomUnits as useCustomUnits,
	PanelBody,
} from '@wordpress/components';

/**
 * Internal dependencies.
 */
import { TEMPLATE } from './template';
import classNames from 'classnames';

export default ({
	attributes: { width },
	setAttributes,
	__unstableLayoutClassNames,
}) => {
	const blockProps = useBlockProps({
		style: {
			fontSize: '16px',
			fontFamily: 'var(--sc-font-sans)',
			maxWidth: `max(400px, ${width})`,
		},
		className: classNames(
			'sc-cart__editor-container',
			__unstableLayoutClassNames
		),
	});

	const innerBlocksProps = useInnerBlocksProps(
		blockProps,
		{
			template: TEMPLATE,
			style: {
				maxWidth: `max(400px, ${width})`,
			},
		},
		{
			renderAppender: InnerBlocks.ButtonBlockAppender,
		}
	);

	const units = useCustomUnits({
		availableUnits: useSettings('spacing.units') || [
			'%',
			'px',
			'em',
			'rem',
			'vw',
		],
	});

	return (
		<>
			<InspectorControls>
				<PanelBody>
					<UnitControl
						label={__('Width', 'surecart')}
						labelPosition="top"
						__unstableInputWidth="80px"
						value={width}
						onChange={(width) => setAttributes({ width })}
						units={units}
					/>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<div {...innerBlocksProps}></div>
			</div>
		</>
	);
};
