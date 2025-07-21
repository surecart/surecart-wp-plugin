import {
	useBlockProps,
	PlainText,
	InspectorControls,
} from '@wordpress/block-editor';
import {
	PanelBody,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components';

import { __, _x, isRTL } from '@wordpress/i18n';
import Icon from '../../components/Icon';

const ICONS = {
	arrow: isRTL() ? 'arrow-left' : 'arrow-right',
	chevron: isRTL() ? 'chevron-left' : 'chevron-right',
	x: 'x',
};

export default ({ attributes: { label, showLabel, icon }, setAttributes }) => {
	const displayIcon = ICONS[icon];

	const blockProps = useBlockProps({
		className: 'has-arrow-type-' + icon,
	});

	return (
		<>
			<InspectorControls>
				<PanelBody>
					<ToggleGroupControl
						__nextHasNoMarginBottom
						label={__('Arrow')}
						value={icon}
						onChange={(icon) => setAttributes({ icon })}
						help={__(
							'A decorative arrow appended to the next and previous page link.'
						)}
						isBlock
					>
						<ToggleGroupControlOption
							value="arrow"
							label={_x(
								'Arrow',
								'Arrow option for Query Pagination Next/Previous blocks'
							)}
						/>
						<ToggleGroupControlOption
							value="chevron"
							label={_x(
								'Chevron',
								'Arrow option for Query Pagination Next/Previous blocks'
							)}
						/>
						<ToggleGroupControlOption
							value="x"
							label={_x(
								'Close',
								'Arrow option for Query Pagination Next/Previous blocks'
							)}
						/>
					</ToggleGroupControl>
				</PanelBody>
			</InspectorControls>
			<div
				role="button"
				tabIndex="0"
				aria-label={__('Close cart', 'surecart')}
				onClick={(e) => e.preventDefault()}
				{...blockProps}
			>
				{showLabel && (
					<PlainText
						__experimentalVersion={2}
						tagName="span"
						aria-label={__('Next page link')}
						placeholder={__('Next')}
						value={label}
						onChange={(newLabel) =>
							setAttributes({ label: newLabel })
						}
					/>
				)}

				{!!displayIcon && (
					<Icon
						name={displayIcon}
						className={'wp-block-surecart-cart-close-button__icon'}
						aria-hidden={true}
					/>
				)}
			</div>
		</>
	);
};
