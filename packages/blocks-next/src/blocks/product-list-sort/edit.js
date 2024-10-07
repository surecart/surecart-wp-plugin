import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl } from '@wordpress/components';

export default ({ attributes: { sort_default }, setAttributes }) => {
	const blockProps = useBlockProps({
		className: 'sc-dropdown',
	});
	const sortingOptions = [
		{
			label: __('Latest', 'surecart'),
			value: 'date:desc',
		},
		{
			label: __('Oldest', 'surecart'),
			value: 'date:asc',
		},
		{
			label: __('Price, low to high', 'surecart'),
			value: 'price:asc',
		},
		{
			label: __('Price, high to low', 'surecart'),
			value: 'price:desc',
		},
	];

	return (
		<div {...blockProps} role="menu" tabIndex="-1">
			<InspectorControls>
				<PanelBody title={__('Settings')}>
					<SelectControl
						__nextHasNoMarginBottom
						__next40pxDefaultSize
						label={__('Default Sorting', 'surecart')}
						options={sortingOptions}
						value={sort_default}
						onChange={(selectSort) =>
							setAttributes({
								sort_default: selectSort,
							})
						}
					/>
				</PanelBody>
			</InspectorControls>
			<button className="sc-dropdown__trigger sc-button sc-button--standard sc-button--medium sc-button--caret sc-button--has-label sc-button--text">
				<span className="sc-button__label">
					{__('Sort', 'surecart')}
				</span>
				<span className="sc-button__caret">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<polyline points="6 9 12 15 18 9" />
					</svg>
				</span>
			</button>
		</div>
	);
};
