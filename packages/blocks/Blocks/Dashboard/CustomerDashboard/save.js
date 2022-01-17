import { InnerBlocks } from '@wordpress/block-editor';

export default () => {
	return (
		<ce-tab-group
			style={{
				'font-size': '16px',
				'font-family': 'var(--ce-font-sans)',
			}}
		>
			<InnerBlocks.Content />
		</ce-tab-group>
	);
};
