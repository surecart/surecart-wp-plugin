import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';

export default () => {
	const blockProps = useBlockProps({
		className: 'sc-dropdown',
	});

	return (
		<div {...blockProps} role="menu" tabIndex="-1">
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
