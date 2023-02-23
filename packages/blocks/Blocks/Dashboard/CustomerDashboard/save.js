import { InnerBlocks } from '@wordpress/block-editor';

export default () => {
	return (
		<div
			style={{
				'font-size': '16px',
				'font-family': 'var(--sc-font-sans)',
			}}
		>
			<InnerBlocks.Content />
		</div>
	);
};
