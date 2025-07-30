import {
	useBlockProps,
	RichText,
	InspectorControls,
} from '@wordpress/block-editor';
import {
	PanelBody,
	ToggleControl,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components';
import { __, _x } from '@wordpress/i18n';

export default ({
	attributes,
	setAttributes,
	context: { removable = true },
}) => {
	const { show_label, label, icon } = attributes;

	const blockProps = useBlockProps();

	if (!removable) {
		return null;
	}

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Settings', 'surecart')}>
					<ToggleGroupControl
						__nextHasNoMarginBottom
						label={__('Icon', 'surecart')}
						value={icon}
						onChange={(icon) => setAttributes({ icon })}
						help={__(
							'Choose an icon for the remove button.',
							'surecart'
						)}
						isBlock
					>
						<ToggleGroupControlOption
							value="none"
							label={_x(
								'None',
								'Icon option for Cart Line Item Remove block',
								'surecart'
							)}
						/>
						<ToggleGroupControlOption
							value="trash-2"
							label={_x(
								'Trash',
								'Icon option for Cart Line Item Remove block',
								'surecart'
							)}
						/>
						<ToggleGroupControlOption
							value="x"
							label={_x(
								'Close',
								'Icon option for Cart Line Item Remove block',
								'surecart'
							)}
						/>
					</ToggleGroupControl>
					<ToggleControl
						__nextHasNoMarginBottom
						label={__('Show label text', 'surecart')}
						help={__(
							'Toggle off to hide the label text, e.g. "Remove".',
							'surecart'
						)}
						onChange={(show_label) => setAttributes({ show_label })}
						checked={show_label === true}
					/>
				</PanelBody>
			</InspectorControls>
			<div {...blockProps}>
				{icon !== 'none' && <sc-icon name={icon} />}
				{show_label && (
					<RichText
						aria-label={__('Label text', 'surecart')}
						withoutInteractiveFormatting
						allowedFormats={['core/bold', 'core/italic']}
						value={label}
						onChange={(label) => setAttributes({ label })}
						placeholder={__('Remove', 'surecart')}
					/>
				)}
			</div>
		</>
	);
};
