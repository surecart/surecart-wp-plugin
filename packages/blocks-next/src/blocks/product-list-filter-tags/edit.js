import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	__experimentalGetGapCSSValue as getGapCSSValue,
} from '@wordpress/block-editor';

export default ({ attributes: { style } }) => {
	const blockProps = useBlockProps({
		style: {
			display: 'flex',
			flexWrap: 'wrap',
			flexDirection: 'row',
			gap: getGapCSSValue(style?.spacing?.blockGap) || '0.75em',
		},
	});
	return (
		<div {...blockProps}>
			<button key="filter-1" className="sc-tag sc-tag--primary tag--clearable">
				<span className="tag__content">
					{__('Filter 1', 'surecart')}
				</span>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					fill="currentColor"
					className="bi bi-x"
					viewBox="0 0 16 16"
				>
					<path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"></path>
				</svg>
			</button>
			<button key="filter-2" className="sc-tag sc-tag--primary tag--clearable">
				<span className="tag__content">
					{__('Filter 2', 'surecart')}
				</span>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					fill="currentColor"
					className="bi bi-x"
					viewBox="0 0 16 16"
				>
					<path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"></path>
				</svg>
			</button>
			<button key="filter-3" className="sc-tag sc-tag--primary tag--clearable">
				<span className="tag__content">
					{__('Filter 3', 'surecart')}
				</span>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					fill="currentColor"
					className="bi bi-x"
					viewBox="0 0 16 16"
				>
					<path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"></path>
				</svg>
			</button>
		</div>
	);
};
