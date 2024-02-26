import { __ } from '@wordpress/i18n';

import {
	useBlockProps,
	__experimentalUseBorderProps as useBorderProps,
	__experimentalUseColorProps as useColorProps,
	__experimentalGetSpacingClassesAndStyles as useSpacingProps,
	__experimentalGetShadowClassesAndStyles as useShadowProps,
} from '@wordpress/block-editor';

import classNames from 'classnames';
import { getInlineStyles } from '../../utilities/style';
import BorderInspectorControl from '../../components/BorderInspectorControl';
import ColorInspectorControl from '../../components/ColorInspectorControl';
import LabelInspectorControls from '../../components/LabelInspectorControls';
import { RichText } from '@wordpress/block-editor';

export default ({ attributes, setAttributes, clientId }) => {
	const {
		highlight_background,
		highlight_text,
		label_text,
		highlight_border,
		label,
	} = attributes;
	const borderProps = useBorderProps(attributes);
	const colorProps = useColorProps(attributes);
	const spacingProps = useSpacingProps(attributes);
	const shadowProps = useShadowProps(attributes);
	const blockProps = useBlockProps();

	return (
		<>
			<LabelInspectorControls
				label={__('Highlight Border', 'surecart')}
				value={highlight_border}
				onChange={(highlight_border) =>
					setAttributes({ highlight_border })
				}
				panelId={clientId}
			/>
			{/* Additional border inspector control. */}
			<BorderInspectorControl
				label={__('Highlight Border', 'surecart')}
				value={highlight_border}
				onChange={(highlight_border) =>
					setAttributes({ highlight_border })
				}
				panelId={clientId}
			/>
			{/* Additional color inspector control. */}
			<ColorInspectorControl
				settings={[
					{
						colorValue: label_text,
						label: __('Label Text', 'surecart'),
						onColorChange: (label_text) =>
							setAttributes({ label_text }),
						resetAllFilter: () =>
							setAttributes({
								label_text: undefined,
							}),
					},
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
				]}
				panelId={clientId}
			/>
			<div {...blockProps}>
				<div>
					<label className="sc-form-label">
						{__('Colors', 'surecart')}
					</label>
					<div
						className={classNames(blockProps.className, {
							'sc-pill-option__wrapper': true,
							[`has-custom-font-size`]: blockProps.style.fontSize,
						})}
					>
						<button
							className="sc-pill-option__button sc-pill-option__button--selected"
							role="radio"
							style={{
								...borderProps.style,
								...spacingProps.style,
								...shadowProps.style,
								color: 'white',
							}}
						>
							{__('Red', 'surecart')}
						</button>
						<button
							className="sc-pill-option__button"
							role="radio"
							style={{
								...borderProps.style,
								...spacingProps.style,
								...shadowProps.style,
								...colorProps.style,
								...getInlineStyles(
									attributes?.styles?.elements?.button
								),
							}}
						>
							{__('Green', 'surecart')}
						</button>
						<button
							className="sc-pill-option__button"
							role="radio"
							style={{
								...borderProps.style,
								...spacingProps.style,
								...shadowProps.style,
								...colorProps.style,
							}}
						>
							{__('Blue', 'surecart')}
						</button>
					</div>
				</div>
			</div>
		</>
	);
};
