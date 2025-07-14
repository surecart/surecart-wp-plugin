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
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import ScIcon from '../../components/ScIcon';
import { ProductQuickViewButtonControls } from './product-quick-view-button-controls';
import { IconPositionControls } from './icon-position-controls';
import { WidthSettingsPanel } from './width-settings-panel';
import { getSpacingPresetCssVar } from '../../../../blocks/util';

export default ({
	attributes: {
		icon,
		quickViewButtonType,
		label,
		style,
		width,
		iconPosition,
	},
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
				{showIcon && 'before' === iconPosition && (
					<ScIcon
						className="wp-block-surecart-product-quick-view-button__icon"
						name={icon}
					/>
				)}
				{showText && (
					<PlainText
						__experimentalVersion={2}
						tagName="span"
						aria-label={__('Quick add button')}
						placeholder={__('Quick Add')}
						value={label}
						onChange={(newLabel) =>
							setAttributes({ label: newLabel })
						}
					/>
				)}
				{showIcon && 'after' === iconPosition && (
					<ScIcon
						className="wp-block-surecart-product-quick-view-button__icon"
						name={icon}
					/>
				)}
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
					{'both' === quickViewButtonType && (
						<IconPositionControls
							value={iconPosition}
							onChange={(value) => {
								setAttributes({ iconPosition: value });
							}}
						/>
					)}
				</PanelBody>
				<WidthSettingsPanel
					selectedWidth={width}
					setAttributes={setAttributes}
				/>
			</InspectorControls>
			<div className="wp-block-button">
				<div
					{...blockProps}
					className={classnames(blockProps.className, {
						'wp-block-button__link': true,
						[`has-custom-width wp-block-button__width-${width}`]:
							width,
						[`has-custom-width sc-block-button__width-${width}`]:
							width,
					})}
				>
					{renderButton()}
				</div>
			</div>
		</>
	);
};
