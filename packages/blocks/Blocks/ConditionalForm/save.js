/**
 * WordPress dependencies.
 */
import { InnerBlocks } from '@wordpress/block-editor';
import { ScConditionalForm } from '@surecart/components-react';



export default function save( props ) {
	// debugger;
  console.log( 'props' );
  console.log( props );
  const { rule_groups } = props.attributes;

  // let rules = JSON.stringify( props.attributes );
  return (
    <ScConditionalForm rule_groups={ JSON.stringify( rule_groups ) } >
      <div className='sc-conditional-from'>
        <InnerBlocks.Content />
      </div>
    </ScConditionalForm>
  )
}
