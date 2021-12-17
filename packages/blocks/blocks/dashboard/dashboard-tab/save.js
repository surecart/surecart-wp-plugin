import { InnerBlocks } from '@wordpress/block-editor';
import feather from 'feather-icons';

export default ( { attributes } ) => {
	const { panel, icon } = attributes;
	return (
		<ce-tab panel={ panel }>
			<div
				slot="prefix"
				dangerouslySetInnerHTML={ {
					__html: feather.icons[ icon || 'home' ].toSvg( {
						width: 18,
						height: 18,
						fill: 'none',
						style: 'fill: none',
					} ),
				} }
			/>
			<InnerBlocks.Content />
		</ce-tab>
	);
};
