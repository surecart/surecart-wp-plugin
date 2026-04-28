import { InnerBlocks } from '@wordpress/block-editor';

const v1 = {
	attributes: {
		currentStep: { type: 'number', default: 0 },
		align: { type: 'string', default: 'wide' },
	},
	save() {
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
	},
};
export default [v1];
