import { InnerBlocks } from '@wordpress/block-editor';

/**
 * Component Dependencies
 */
import { PrestoCheckout } from '@presto-pay/react/dist/index';

import { allowed, template } from './template.json';
import withIsPremium from '../../higher-order/withIsPremium';

export default withIsPremium( ( { className, isPremium } ) => {
	return (
		<div className={ className } style={ { padding: '20px' } }>
			<PrestoCheckout>
				<InnerBlocks
					renderAppender={ InnerBlocks.ButtonBlockAppender }
					template={ template }
					templateLock={ isPremium ? false : 'insert' }
					allowedBlocks={ allowed }
				/>
			</PrestoCheckout>
		</div>
	);
} );
