import { useSelect, useDispatch } from '@wordpress/data';
import { InnerBlocks } from '@wordpress/block-editor';

// import { template } from '../template.json';
import { ALLOWED_BLOCKS } from '../../../blocks';
import withIsPremium from '../../../higher-order/withIsPremium';

export default withIsPremium( ( { clientId } ) => {
	const { removeBlock } = useDispatch( 'core/block-editor' );
	const blockCount = useSelect( ( select ) =>
		select( 'core/block-editor' ).getBlockCount( clientId )
	);
	const previousBlockCount = useRef( blockCount );
	useEffect( () => {
		if ( previousBlockCount.current > 0 && blockCount === 0 ) {
			removeBlock( clientId );
		}
		previousBlockCount.current = blockCount;
	}, [ blockCount, clientId ] );
	// const { replaceInnerBlocks } = useDispatch( 'core/block-editor' );

	// const getBlockList = () =>
	// 	select( 'core/block-editor' ).getBlocksByClientId( clientId )?.[ 0 ]
	// 		?.innerBlocks;

	// let blockList = getBlockList();

	// wp.data.subscribe( () => {
	// 	let newBlockList = getBlockList();

	// 	if ( ! newBlockList || newBlockList.length >= blockList.length ) {
	// 		return;
	// 	}

	// 	/// get just names
	// 	let blockNames = blockList.map( ( block ) => block.name );
	// 	let newBlockNames = newBlockList.map( ( block ) => block.name );

	// 	// get removed names
	// 	const removedRequiredBlocks = blockNames.filter(
	// 		( x ) =>
	// 			! newBlockNames.includes( x ) &&
	// 			requiredBlocks.includes( x )
	// 	);

	// 	if ( removedRequiredBlocks.length ) {
	// 		replaceInnerBlocks( clientId, blockList );
	// 	}
	// } );

	return (
		<InnerBlocks
			renderAppender={ InnerBlocks.ButtonBlockAppender }
			// templateLock={ isPremium ? 'none' : 'insert' }
			allowedBlocks={ ALLOWED_BLOCKS }
		/>
	);
} );
