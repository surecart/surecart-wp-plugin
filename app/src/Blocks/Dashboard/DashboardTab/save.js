import { InnerBlocks } from '@wordpress/block-editor';

export default ( { attributes } ) => {
	const { icon, title } = attributes;
	return (
		<ce-tab>
			<ce-icon
				style={ { 'font-size': '18px' } }
				slot="prefix"
				name={ icon || 'home' }
			></ce-icon>
			{ title }
		</ce-tab>
	);
};
