import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	__experimentalUseBorderProps as useBorderProps,
	__experimentalUseColorProps as useColorProps,
	__experimentalGetSpacingClassesAndStyles as useSpacingProps,
	__experimentalGetShadowClassesAndStyles as useShadowProps,
} from '@wordpress/block-editor';
import classNames from 'classnames';

export default ({ attributes, setAttributes }) => {
	const borderProps = useBorderProps(attributes);
	const {
		style: { backgroundColor, color },
	} = useColorProps(attributes);
	const spacingProps = useSpacingProps(attributes);
	const shadowProps = useShadowProps(attributes);

	const blockProps = useBlockProps();

	return (
		<div {...blockProps}>
			<div>
				<label className="sc-form-label">
					{__('Color', 'surecart')}
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
							backgroundColor,
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
							color,
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
							color,
						}}
					>
						{__('Blue', 'surecart')}
					</button>
				</div>
			</div>
		</div>
	);
};
