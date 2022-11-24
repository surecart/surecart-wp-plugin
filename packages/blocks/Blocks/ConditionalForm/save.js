/**
 * WordPress dependencies.
 */
import { InnerBlocks } from '@wordpress/block-editor';

export default function save( props ) {
	// debugger;
  console.log( props );

  // let rules = JSON.stringify( props.attributes );
  return (
    <div className='sc-conditional-from'>
      <InnerBlocks.Content />
    </div>
  )
}
