import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';

export default ({ attributes: { placeholder } }) => {
	const blockProps = useBlockProps({
		className: 'sc-input-group sc-input-group-sm',
	});
	return (
		<div {...blockProps}>
			<span className="sc-input-group-text">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<circle cx="11" cy="11" r="8" />
					<line x1="21" y1="21" x2="16.65" y2="16.65" />
				</svg>
			</span>
			<input
				className="sc-form-control"
				type="search"
				placeholder={__('Search', 'surecart')}
			/>
		</div>
	);
};
