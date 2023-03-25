import { InnerBlocks } from '@wordpress/block-editor';

export default () => {
	return (
		<sc-tab-group
			style={{
				'font-size': '16px',
				'font-family': 'var(--sc-font-sans)',
			}}
		>
			<InnerBlocks.Content />
		</sc-tab-group>
	);
};
