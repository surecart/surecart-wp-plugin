import { useSelect, dispatch } from '@wordpress/data';
import { useEffect } from '@wordpress/element';
import { createBlock } from '@wordpress/blocks';
import { InnerBlocks } from '@wordpress/block-editor';

import { template } from '../template.json';
import findBlock from '../../../utils/find-block';
import withIsPremium from '../../../higher-order/withIsPremium';

export default withIsPremium(
	( { requiredBlocks, isPremium, clientId, isSelected } ) => {
		const innerBlocks = useSelect( ( select ) => {
			return select( 'core/block-editor' ).getBlocksByClientId(
				clientId
			)[ 0 ].innerBlocks;
		} );

		// useEffect( () => {
		// 	if ( ! innerBlocks.length ) {
		// 		return;
		// 	}
		// 	Object.keys( requiredBlocks ).forEach( ( name ) => {
		// 		if ( ! findBlock( innerBlocks, name ) ) {
		// 			dispatch( 'core/block-editor' ).insertBlocks(
		// 				createBlock( name, requiredBlocks[ name ]?.props || {} ),
		// 				requiredBlocks[ name ]?.prority || 0,
		// 				clientId
		// 			);
		// 		}
		// 	} );
		// }, [ innerBlocks ] );

		return (
			<InnerBlocks
				renderAppender={
					isSelected ? InnerBlocks.ButtonBlockAppender : false
				}
				templateLock={ isPremium ? 'insert' : 'all' }
				template={ template }
			/>
		);
	}
);
