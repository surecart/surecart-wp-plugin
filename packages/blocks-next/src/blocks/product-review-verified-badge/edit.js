/**
 * WordPress dependencies.
 */
import {
	useBlockProps,
	InspectorControls,
	RichText,
} from '@wordpress/block-editor';
import {
	PanelBody,
	ToggleControl,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import ScIcon from '../../components/ScIcon';
import UnitSpacingControl from '../../components/UnitSpacingControl';
import { getSpacingPresetCssVar } from '../../../../blocks/util';

export default ({ attributes, setAttributes, clientId }) => {
	const { show_label, label, icon_size, style } = attributes;
	const blockProps = useBlockProps({
		style: {
			gap: getSpacingPresetCssVar(style?.spacing?.blockGap),
		},
	});

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Badge settings', 'surecart')}>
					<ToggleControl
						__nextHasNoMarginBottom
						label={__('Show label', 'surecart')}
						onChange={(value) =>
							setAttributes({ show_label: value })
						}
						checked={!!show_label}
					/>
				</PanelBody>
			</InspectorControls>
			<InspectorControls group="dimensions">
				<ToolsPanelItem
					hasValue={() => icon_size !== undefined}
					label={__('Icon size', 'surecart')}
					onDeselect={() => setAttributes({ icon_size: undefined })}
					resetAllFilter={() =>
						setAttributes({ icon_size: undefined })
					}
					isShownByDefault
					panelId={clientId}
				>
					<UnitSpacingControl
						label={__('Icon size', 'surecart')}
						value={icon_size}
						onChange={(value) =>
							setAttributes({ icon_size: value })
						}
						min={8}
						max={64}
					/>
				</ToolsPanelItem>
			</InspectorControls>

			<div {...blockProps}>
				{show_label && (
					<RichText
						tagName="span"
						value={label || __('Verified Buyer', 'surecart')}
						onChange={(value) => setAttributes({ label: value })}
						placeholder={__('Verified Buyer', 'surecart')}
					/>
				)}

				<ScIcon
					name="verified"
					width={icon_size || 16}
					height={icon_size || 16}
				/>
			</div>
		</>
	);
};
