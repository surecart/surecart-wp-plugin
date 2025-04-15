/**
 * WordPress dependencies
 */
import {
	useBlockProps,
	PlainText,
	InspectorControls,
} from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import WidthSettingsPanel from './width-settings-panel';
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import ScIcon from '../../components/ScIcon';
import { ProductQuickViewButtonControls } from './product-quick-view-button-controls';
import { getSpacingPresetCssVar } from '../../../../blocks/util';

export default ({
	attributes: { icon, quickViewButtonType, label, style, width },
	setAttributes,
}) => {
	const blockProps = useBlockProps({
		style: {
			gap: getSpacingPresetCssVar(style?.spacing?.blockGap),
			justifyContent: style?.typography?.textAlign,
		},
	});

	const renderButton = () => {
		const showIcon =
			quickViewButtonType === 'icon' || quickViewButtonType === 'both';
		const showText =
			quickViewButtonType === 'text' || quickViewButtonType === 'both';

		return (
			<>
				{showText && (
					<PlainText
						__experimentalVersion={2}
						tagName="span"
						aria-label={__('Quick view button')}
						placeholder={__('Quick View')}
						value={label}
						onChange={(newLabel) =>
							setAttributes({ label: newLabel })
						}
					/>
				)}
				{showIcon && <ScIcon name={icon} />}
			</>
		);
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Settings')}>
					<ProductQuickViewButtonControls
						value={quickViewButtonType}
						onChange={(value) => {
							setAttributes({ quickViewButtonType: value });
						}}
					/>
				</PanelBody>
				<WidthSettingsPanel
					selectedWidth={width}
					setAttributes={setAttributes}
				/>
			</InspectorControls>
			<div
				{...blockProps}
				className={classnames(blockProps.className, {
					'wp-block-button__link': true,
					'wp-block-button': true,
					[`has-custom-width wp-block-button__width-${width}`]: width,
					[`has-custom-width sc-block-button__width-${width}`]: width,
				})}
			>
				{renderButton()}
			</div>
		</>
	);
};
