/**
 * WordPress dependencies
 */
import {
	useBlockProps,
	PlainText,
	InspectorControls,
} from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import ScIcon from '../../components/ScIcon';
import { getSpacingPresetCssVar } from '../../../../blocks/util';

/**
 * Inspector controls
 */
import Design from './design';
import Settings from './settings';

export default ({ attributes, setAttributes }) => {
	const { icon, quick_view_button_type, label, style, width, iconPosition } =
		attributes;

	const blockProps = useBlockProps({
		style: {
			gap: getSpacingPresetCssVar(style?.spacing?.blockGap),
			justifyContent: style?.typography?.textAlign,
		},
	});

	const renderButton = () => {
		const showIcon =
			quick_view_button_type === 'icon' ||
			quick_view_button_type === 'both';
		const showText =
			quick_view_button_type === 'text' ||
			quick_view_button_type === 'both';

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
				<Design attributes={attributes} setAttributes={setAttributes} />
				<Settings
					attributes={attributes}
					setAttributes={setAttributes}
				/>
			</InspectorControls>

			<div className="wp-block-buttons">
				<div
					className={classnames({
						'wp-block-button': true,
						[`has-custom-width wp-block-button__width-${width}`]:
							width,
						[`has-custom-width sc-block-button__width-${width}`]:
							width,
					})}
				>
					<div
						{...blockProps}
						className={classnames(blockProps.className, {
							'wp-block-button__link': true,
						})}
					>
						{renderButton()}
					</div>
				</div>
			</div>
		</>
	);
};
