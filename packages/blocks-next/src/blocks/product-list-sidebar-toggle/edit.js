import { __, _x } from '@wordpress/i18n';
import {
	RichText,
	useBlockProps,
	__experimentalGetElementClassName,
	__experimentalUseBorderProps as useBorderProps,
	__experimentalUseColorProps as useColorProps,
	__experimentalGetSpacingClassesAndStyles as useSpacingProps,
	__experimentalGetShadowClassesAndStyles as useShadowProps,
	InspectorControls,
} from '@wordpress/block-editor';
import {
	PanelBody,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components';
import Icon from '../../components/Icon';
import classNames from 'classnames';

export default ({
	attributes,
	setAttributes,
	__unstableLayoutClassNames: layoutClassNames,
}) => {
	const { label, icon } = attributes;

	// Use internal state instead of a ref to make sure that the component
	// re-renders when the popover's anchor updates.
	const borderProps = useBorderProps(attributes);
	const colorProps = useColorProps(attributes);
	const spacingProps = useSpacingProps(attributes);
	const shadowProps = useShadowProps(attributes);

	const blockProps = useBlockProps({
		className: classNames(
			layoutClassNames,
			colorProps.className,
			borderProps.className,
			spacingProps.className,
			shadowProps.className
		),
		style: {
			...borderProps.style,
			...spacingProps.style,
			...shadowProps.style,
			...colorProps.style,
		},
	});

	return (
		<>
			<InspectorControls>
				<PanelBody>
					<ToggleGroupControl
						__nextHasNoMarginBottom
						label={__('Icon', 'surecart')}
						value={icon}
						onChange={(icon) => setAttributes({ icon })}
						help={__(
							'A decorative arrow appended to the next and previous page link.'
						)}
						isBlock
					>
						<ToggleGroupControlOption
							value="none"
							label={_x(
								'None',
								'Arrow option for Product List Sidebar Toggle blocks'
							)}
						/>
						<ToggleGroupControlOption
							value="sliders"
							label={_x(
								'Sliders',
								'Arrow option for Product List Sidebar Toggle blocks'
							)}
						/>
						<ToggleGroupControlOption
							value="menu"
							label={_x(
								'Menu',
								'Arrow option for Product List Sidebar Toggle blocks'
							)}
						/>
					</ToggleGroupControl>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				{icon !== 'none' && (
					<Icon name={icon} className="sc-sidebar-toggle__icon" />
				)}
				<RichText
					tagName="span"
					aria-label={__('Label text', 'surecart')}
					placeholder={__('Add label…', 'surecart')}
					value={label}
					onChange={(label) => setAttributes({ label })}
					withoutInteractiveFormatting
					allowedFormats={['core/bold', 'core/italic']}
				/>
			</div>
		</>
	);
};
