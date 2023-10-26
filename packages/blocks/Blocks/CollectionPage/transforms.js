/**
 * WordPress dependencies
 */
import { createBlock } from '@wordpress/blocks';

const transforms = {
	from: [
		{
			type: 'block',
			blocks: [ 'core/navigation-link' ],
			transform: () => {
				return createBlock( 'surecart/collection-page' );
			},
		},
	]
};

export default transforms;
