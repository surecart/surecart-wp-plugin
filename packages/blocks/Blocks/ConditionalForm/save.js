/**
 * WordPress dependencies.
 */
import { InnerBlocks } from '@wordpress/block-editor';

export default function save( props ) {
  return (
      <div className='sc-conditional-from'>
        <InnerBlocks.Content />
      </div>
  )
}
